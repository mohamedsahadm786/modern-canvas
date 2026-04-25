/**
 * Scene3D — persistent full-screen React Three Fiber canvas behind all sections.
 * Phase 1: Starfield + morphing orbs + binary field + mouse parallax + bloom
 * Phase 3: Scroll-driven camera path + NodeGlobe (About) + NeuralNetViz (Skills)
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import MatrixRain3D from './MatrixRain3D';
import RightBinaryRain from './RightBinaryRain';
import { scrollSync } from '../lib/scrollSync';

/* ── Inline compact simplex-3D noise for GLSL ────────────────────────────── */
const SIMPLEX = /* glsl */`
vec3 m289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 m289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return m289(((x*34.)+10.)*x);}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.x;
  vec3 x2=x0-i2+C.y;
  vec3 x3=x0-.5;
  i=m289(i);
  vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  vec4 j=p-49.*floor(p*(1./7.)*(1./7.));
  vec4 x_=floor(j*(1./7.));
  vec4 y_=floor(j-7.*x_);
  vec4 xv=x_*(1./7.)+.5/7.-1.;
  vec4 yv=y_*(1./7.)+.5/7.-1.;
  vec4 h=1.-abs(xv)-abs(yv);
  vec4 b0=vec4(xv.xy,yv.xy);
  vec4 b1=vec4(xv.zw,yv.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=1.79284291-.85373472*vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 mm=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  mm*=mm;
  return 42.*dot(mm*mm,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

/* ── Vertex shader for morphing blob ─────────────────────────────────────── */
const VERT = /* glsl */`
  ${SIMPLEX}
  uniform float uTime;
  uniform float uMorphAmp;
  varying vec3 vNormal;
  varying vec3 vPos;

  void main(){
    vNormal = normal;
    vec3 pos = position;

    // Layer two octaves of noise for organic feel
    float n1 = snoise(pos * 1.4 + uTime * 0.22);
    float n2 = snoise(pos * 2.8 - uTime * 0.35) * 0.4;
    float n  = (n1 + n2) * uMorphAmp;

    pos += normal * n;
    vPos = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

/* ── Fragment shader — iridescent edge glow ─────────────────────────────── */
const FRAG = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vPos;
  uniform float uTime;
  uniform vec3  uColorA;
  uniform vec3  uColorB;

  void main(){
    // View-space normal approximation for fresnel
    vec3 viewDir = normalize(cameraPosition - vPos);
    float fresnel = pow(1.0 - clamp(dot(viewDir, normalize(vNormal)), 0.0, 1.0), 2.5);

    // Shift hue along vertical axis + time
    float t = sin(vPos.y * 2.0 + uTime * 0.4) * 0.5 + 0.5;
    vec3 col = mix(uColorA, uColorB, t);

    gl_FragColor = vec4(col, fresnel * 0.85 + 0.05);
  }
`;

/* ── Starfield ───────────────────────────────────────────────────────────── */
function Stars() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const a = new Float32Array(4000 * 3);
    for (let i = 0; i < a.length; i++) a[i] = (Math.random() - 0.5) * 28;
    return a;
  }, []);

  useFrame((_, dt) => {
    ref.current.rotation.x += dt * 0.015;
    ref.current.rotation.y += dt * 0.018;
  });

  return (
    <group rotation={[0, 0, Math.PI / 5]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent color="#00d4ff"
          size={0.018} sizeAttenuation
          depthWrite={false} opacity={0.55}
        />
      </Points>
    </group>
  );
}

/* ── Single morphing orb ─────────────────────────────────────────────────── */
function Orb({
  position,
  scale = 1,
  ampMultiplier = 1,
  colorA = '#00d4ff',
  colorB = '#7c3aed',
  rotSpeed = [0.003, 0.002, 0],
  phaseShift = [0, 0, 0],
  roamX = 0.5,
  roamY = 0.5,
  roamZ = 0.6,
  roamSpeed = 0.35,
}: {
  position: [number, number, number];
  scale?: number;
  ampMultiplier?: number;
  colorA?: string;
  colorB?: string;
  rotSpeed?: [number, number, number];
  phaseShift?: [number, number, number];
  roamX?: number;
  roamY?: number;
  roamZ?: number;
  roamSpeed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uMorphAmp:{ value: 0.32 * ampMultiplier },
    uColorA:  { value: new THREE.Color(colorA) },
    uColorB:  { value: new THREE.Color(colorB) },
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    const x =
      position[0] +
      Math.sin(t * roamSpeed + phaseShift[0]) * roamX +
      Math.sin(t * roamSpeed * 0.53 + phaseShift[1]) * roamX * 0.38;
    const y =
      position[1] +
      Math.cos(t * roamSpeed * 0.84 + phaseShift[1]) * roamY +
      Math.sin(t * roamSpeed * 0.46 + phaseShift[2]) * roamY * 0.24;
    const z =
      position[2] +
      Math.sin(t * roamSpeed * 0.68 + phaseShift[2]) * roamZ +
      Math.cos(t * roamSpeed * 0.31 + phaseShift[0]) * roamZ * 0.34;
    const clampedX = THREE.MathUtils.clamp(x, -6.15, -0.75);
    const depthScale = THREE.MathUtils.clamp(1 + (-z - 2.6) * -0.13, 0.72, 1.34);

    groupRef.current.position.set(clampedX, y, z);
    groupRef.current.rotation.y = Math.sin(t * 0.41 + phaseShift[0]) * 0.38;
    groupRef.current.rotation.x = Math.cos(t * 0.29 + phaseShift[1]) * 0.17;
    groupRef.current.rotation.z = Math.sin(t * 0.23 + phaseShift[2]) * 0.12;
    meshRef.current.scale.setScalar(scale * depthScale);
    meshRef.current.rotation.x += rotSpeed[0];
    meshRef.current.rotation.y += rotSpeed[1];
    meshRef.current.rotation.z += rotSpeed[2];
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef} scale={scale}>
        <icosahedronGeometry args={[1, 20]} />
        <shaderMaterial
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
}

function JellyCluster() {
  return (
    <>
      <Orb
        position={[-5.35, 2.35, -4.6]}
        scale={0.24}
        ampMultiplier={0.54}
        colorA="#00ff41"
        colorB="#00d4ff"
        rotSpeed={[0.0042, 0.0028, 0.0014]}
        phaseShift={[2.8, 1.1, 2.2]}
        roamX={1.1}
        roamY={1.25}
        roamZ={1.35}
        roamSpeed={0.58}
      />
      <Orb
        position={[-5.65, -1.85, -4.9]}
        scale={0.22}
        ampMultiplier={0.5}
        colorA="#7c3aed"
        colorB="#ff00aa"
        rotSpeed={[0.0038, 0.005, 0.0011]}
        phaseShift={[3.4, 2.9, 1.4]}
        roamX={1.2}
        roamY={1.35}
        roamZ={1.45}
        roamSpeed={0.66}
      />
      <Orb
        position={[-3.55, 0.05, -2.6]}
        scale={0.82}
        ampMultiplier={0.9}
        colorA="#00d4ff"
        colorB="#7c3aed"
        rotSpeed={[0.0022, 0.0032, 0.0008]}
        phaseShift={[0.2, 0.6, 0.1]}
        roamX={2.35}
        roamY={1.55}
        roamZ={1.55}
        roamSpeed={0.34}
      />
      <Orb
        position={[-4.45, 1.8, -3.8]}
        scale={0.42}
        ampMultiplier={0.72}
        colorA="#00ff41"
        colorB="#00d4ff"
        rotSpeed={[0.0048, 0.0026, 0.0018]}
        phaseShift={[1.3, 0.8, 1.7]}
        roamX={1.75}
        roamY={1.2}
        roamZ={1.35}
        roamSpeed={0.51}
      />
      <Orb
        position={[-3.2, -2.1, -4.25]}
        scale={0.28}
        ampMultiplier={0.58}
        colorA="#7c3aed"
        colorB="#ff00aa"
        rotSpeed={[0.0035, 0.0056, 0.0012]}
        phaseShift={[2.1, 2.6, 0.9]}
        roamX={2.05}
        roamY={1.45}
        roamZ={1.5}
        roamSpeed={0.62}
      />
    </>
  );
}

/* ── Grid of floating binary digits (instanced boxes) ───────────────────── */
function BinaryField() {
  const COUNT = 80;
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  const data = useMemo(() => {
    const positions: [number, number, number, number, number][] = [];
    for (let i = 0; i < COUNT; i++) {
      positions.push([
        (Math.random() - 0.5) * 22,   // x
        (Math.random() - 0.5) * 14,   // y
        (Math.random() - 0.5) * 10,   // z
        Math.random() * Math.PI * 2,  // rotation
        Math.random() * Math.PI * 2,  // phase
      ]);
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mat = new THREE.Matrix4();
    const rot = new THREE.Euler();
    for (let i = 0; i < COUNT; i++) {
      const [x, y, z, r, phase] = data[i];
      const dy = ((y + 7 + (t * 0.25 + phase) * 1.5) % 14) - 7;
      rot.set(0, 0, r + t * 0.1);
      mat.makeRotationFromEuler(rot);
      mat.setPosition(x, dy, z);
      meshRef.current.setMatrixAt(i, mat);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <planeGeometry args={[0.08, 0.12]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.18} depthWrite={false} />
    </instancedMesh>
  );
}

/* ── Phase 3: Node Globe — appears over About section ───────────────────── */
function NodeGlobe() {
  const opacityRef = useRef(0);

  const { positions, linePositions } = useMemo(() => {
    const N = 130;
    const R = 2.1;
    const positions = new Float32Array(N * 3);

    // Golden-angle spiral distribution (even spread on sphere)
    for (let i = 0; i < N; i++) {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      positions[i * 3]     = Math.sin(phi) * Math.cos(theta) * R;
      positions[i * 3 + 1] = Math.cos(phi) * R;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * R;
    }

    // Connect nearby nodes with edges
    const lineVerts: number[] = [];
    const THRESHOLD = 1.05;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = positions[i * 3]     - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < THRESHOLD) {
          lineVerts.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
          );
        }
      }
    }
    return { positions, linePositions: new Float32Array(lineVerts) };
  }, []);

  // Create Three.js objects once — mutate material in useFrame
  const pointsMesh = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x00d4ff, size: 0.055, transparent: true,
      opacity: 0, sizeAttenuation: true, depthWrite: false,
    });
    return new THREE.Points(geo, mat);
  }, [positions]);

  const linesMesh = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0x00d4ff, transparent: true, opacity: 0, depthWrite: false,
    });
    return new THREE.LineSegments(geo, mat);
  }, [linePositions]);

  useFrame(({ clock }) => {
    // Normalize: even 10% viewport intersection → start fading in
    const rawRatio  = scrollSync.sections['about'] ?? 0;
    const targetOp  = Math.min(rawRatio / 0.12, 1);
    opacityRef.current += (targetOp - opacityRef.current) * 0.04;
    const op = opacityRef.current;

    const t = clock.getElapsedTime() * 0.13;
    pointsMesh.rotation.y = t;
    linesMesh.rotation.y  = t;

    (pointsMesh.material as THREE.PointsMaterial).opacity    = Math.min(op * 0.85, 0.85);
    (linesMesh.material  as THREE.LineBasicMaterial).opacity = Math.min(op * 0.22, 0.22);
  });

  return (
    <group position={[1.8, 0.0, -5.2]}>
      <primitive object={pointsMesh} />
      <primitive object={linesMesh}  />
    </group>
  );
}

/* ── Phase 3: Neural-net graph — appears over Skills section ─────────────── */
function NeuralNetViz() {
  const opacityRef = useRef(0);

  const { nodePositions, edgePositions } = useMemo(() => {
    // 4 layers of nodes: [4, 5, 5, 3]
    const layers = [4, 5, 5, 3];
    const layerSpacingX = 1.3;
    const nodeSpacingY  = 0.85;

    const nodePts: number[] = [];
    const layerCoords: [number, number][][] = [];

    layers.forEach((count, li) => {
      const x = (li - (layers.length - 1) / 2) * layerSpacingX;
      const coords: [number, number][] = [];
      for (let ni = 0; ni < count; ni++) {
        const y = (ni - (count - 1) / 2) * nodeSpacingY;
        nodePts.push(x, y, 0);
        coords.push([x, y]);
      }
      layerCoords.push(coords);
    });

    // Fully-connected edges between adjacent layers
    const edgePts: number[] = [];
    for (let li = 0; li < layers.length - 1; li++) {
      layerCoords[li].forEach(([fx, fy]) => {
        layerCoords[li + 1].forEach(([tx, ty]) => {
          edgePts.push(fx, fy, 0, tx, ty, 0);
        });
      });
    }

    return {
      nodePositions: new Float32Array(nodePts),
      edgePositions: new Float32Array(edgePts),
    };
  }, []);

  const nodesMesh = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x7c3aed, size: 0.10, transparent: true,
      opacity: 0, sizeAttenuation: true, depthWrite: false,
    });
    return new THREE.Points(geo, mat);
  }, [nodePositions]);

  const edgesMesh = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0x00d4ff, transparent: true, opacity: 0, depthWrite: false,
    });
    return new THREE.LineSegments(geo, mat);
  }, [edgePositions]);

  useFrame(({ clock }) => {
    const rawRatio  = scrollSync.sections['skills'] ?? 0;
    const targetOp  = Math.min(rawRatio / 0.12, 1);
    opacityRef.current += (targetOp - opacityRef.current) * 0.04;
    const op = opacityRef.current;

    // Pulsing glow
    const pulse = Math.sin(clock.getElapsedTime() * 1.6) * 0.12 + 0.88;

    (nodesMesh.material as THREE.PointsMaterial).opacity    = Math.min(op * pulse * 0.92, 0.92);
    (edgesMesh.material as THREE.LineBasicMaterial).opacity = Math.min(op * pulse * 0.28, 0.32);

    // Gentle bob
    const bob = Math.sin(clock.getElapsedTime() * 0.35) * 0.18;
    nodesMesh.position.y = bob;
    edgesMesh.position.y = bob;
  });

  return (
    <group position={[4.0, 0.0, -4.2]}>
      <primitive object={nodesMesh} />
      <primitive object={edgesMesh} />
    </group>
  );
}

/* ── Phase 3: Scroll-driven camera (mouse parallax + section drift) ──────── */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 0.8;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener('mousemove', h, { passive: true });
    return () => window.removeEventListener('mousemove', h);
  }, []);

  useFrame(() => {
    const p = scrollSync.progress;

    // Cinematic camera drift per scroll region:
    //   0.00–0.12  → Hero:       center
    //   0.12–0.30  → About:      drift right (+1.2) and slightly forward (-0.6)
    //   0.30–0.52  → Skills:     drift left (-1.0), up (+0.4)
    //   0.52–0.72  → Projects/Exp: return to center
    //   0.72–1.00  → Contact:    settle at origin
    let scrollX = 0;
    let scrollY = 0;
    let scrollZ = 0;

    if (p < 0.12) {
      scrollX = 0; scrollY = 0; scrollZ = 0;
    } else if (p < 0.30) {
      const t = (p - 0.12) / 0.18;
      scrollX =  t * 1.2;
      scrollZ = -t * 0.5;
    } else if (p < 0.52) {
      const t = (p - 0.30) / 0.22;
      scrollX = 1.2 - t * 2.2;
      scrollY = t * 0.4;
      scrollZ = -0.5 + t * 0.3;
    } else if (p < 0.72) {
      const t = (p - 0.52) / 0.20;
      scrollX = -1.0 + t * 1.0;
      scrollY =  0.4 - t * 0.4;
      scrollZ = -0.2 + t * 0.2;
    }
    // p >= 0.72 → all scroll offsets ease back to zero naturally via lerp

    const targetX = mouse.current.x + scrollX;
    const targetY = mouse.current.y + scrollY;
    const targetZ = 7.0            + scrollZ;

    camera.position.x += (targetX - camera.position.x) * 0.035;
    camera.position.y += (targetY - camera.position.y) * 0.035;
    camera.position.z += (targetZ - camera.position.z) * 0.022;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── Exported component ──────────────────────────────────────────────────── */
export default function Scene3D() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        zIndex: 0, pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        {/* Phase 2: 3D instanced matrix rain (currently return null — disabled by Codex) */}
        <MatrixRain3D />

        <Stars />
        <BinaryField />
        <JellyCluster />

        {/* Phase 3: scroll-driven scene elements */}
        <NodeGlobe />
        <NeuralNetViz />

        <CameraRig />

        <EffectComposer>
          <Bloom
            intensity={1.8}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <RightBinaryRain />
      </div>
    </div>
  );
}
