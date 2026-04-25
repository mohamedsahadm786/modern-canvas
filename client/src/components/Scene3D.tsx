/**
 * Scene3D — persistent full-screen React Three Fiber canvas behind all sections.
 * Contains:
 *   • 4 000-point starfield orbiting slowly
 *   • Central morphing icosahedron (simplex-noise vertex displacement + bloom)
 *   • Two secondary smaller orbs for depth
 *   • Mouse-parallax camera rig
 *   • Bloom + chromatic aberration post-processing
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import MatrixRain3D from './MatrixRain3D';

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
}: {
  position: [number, number, number];
  scale?: number;
  ampMultiplier?: number;
  colorA?: string;
  colorB?: string;
  rotSpeed?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uMorphAmp:{ value: 0.32 * ampMultiplier },
    uColorA:  { value: new THREE.Color(colorA) },
    uColorB:  { value: new THREE.Color(colorB) },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    meshRef.current.rotation.x += rotSpeed[0];
    meshRef.current.rotation.y += rotSpeed[1];
    meshRef.current.rotation.z += rotSpeed[2];
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
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
  );
}

/* ── Grid of floating binary digits (instanced boxes) ───────────────────── */
function BinaryField() {
  const COUNT = 80;
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  const data = useMemo(() => {
    const mat = new THREE.Matrix4();
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

/* ── Camera parallax ─────────────────────────────────────────────────────── */
function CameraRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth  - 0.5) * 0.8;
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener('mousemove', h, { passive: true });
    return () => window.removeEventListener('mousemove', h);
  }, []);

  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.04;
    camera.position.y += (target.current.y - camera.position.y) * 0.04;
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
        {/* 3-D instanced matrix rain — Phase 2 */}
        <MatrixRain3D />

        <Stars />
        <BinaryField />

        {/* Main large central orb */}
        <Orb
          position={[1.5, 0.2, -1]}
          scale={1.35}
          colorA="#00d4ff" colorB="#7c3aed"
          rotSpeed={[0.003, 0.004, 0.001]}
        />
        {/* Secondary orb — top right */}
        <Orb
          position={[-3.5, 2.5, -3]}
          scale={0.65}
          ampMultiplier={0.7}
          colorA="#00ff41" colorB="#00d4ff"
          rotSpeed={[0.005, 0.003, 0.002]}
        />
        {/* Tertiary orb — bottom left */}
        <Orb
          position={[3.8, -2.8, -4]}
          scale={0.45}
          ampMultiplier={0.6}
          colorA="#7c3aed" colorB="#ff00aa"
          rotSpeed={[0.004, 0.006, 0.001]}
        />

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
    </div>
  );
}
