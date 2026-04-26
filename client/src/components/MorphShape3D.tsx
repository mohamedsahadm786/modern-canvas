/**
 * MorphShape3D — Phase 4: 3D Morphing Shapes
 *
 * Dedicated R3F canvas in the Hero right panel.  Auto-cycles through 4
 * point-cloud shapes every 5 seconds with smooth morphing transitions:
 *
 *   0 → Wireframe Cube   (cyan)
 *   1 → Data Sphere      (purple)
 *   2 → Neural Graph     (green)
 *   3 → Data Avatar      (orange)
 *
 * Each transition:
 *   - CPU-side Float32Array lerp (smootherstep-eased, 1.2 s)
 *   - 1 200 InstancedMesh spheres with MeshPhysicalMaterial clearcoat:1
 *   - 80-particle burst at transition start
 *   - DOM label updated via shared ref (no re-render)
 *
 * Pauses automatically when the Hero section is not visible.
 */

import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { scrollSync } from '@/lib/scrollSync';

/* ── Constants ────────────────────────────────────────────────────────────── */
const N              = 1200;
const SHAPE_DURATION = 5.0;   // seconds per shape before auto-advance
const TRANS_DURATION = 1.2;   // seconds for position lerp
const BURST_COUNT    = 80;
const BURST_LIFETIME = 0.75;  // seconds burst particles survive

const SHAPE_LABELS = ['WIREFRAME CUBE', 'DATA SPHERE', 'NEURAL GRAPH', 'DATA AVATAR'] as const;

const COLOURS = [
  new THREE.Color('#00d4ff'),  // cube     — cyan
  new THREE.Color('#7c3aed'),  // sphere   — purple
  new THREE.Color('#22c55e'),  // neural   — green
  new THREE.Color('#f97316'),  // humanoid — orange
];

/* ── Seeded LCG (deterministic shapes across reloads) ─────────────────────── */
function lcg(seed: number) {
  let s = (seed + 1) | 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    return (s >>> 0) / 0xffffffff;
  };
}

/* ── Smootherstep easing ──────────────────────────────────────────────────── */
function ss(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

/* ══════════════════════════════════════════════════════════════════════════
   Shape generators — each returns Float32Array(N * 3)
══════════════════════════════════════════════════════════════════════════ */

/** 12 cube edges × 100 points = 1 200 */
function genCube(): Float32Array {
  const arr = new Float32Array(N * 3);
  const S = 1.5;
  const corners: [number, number, number][] = [
    [-S,-S,-S],[S,-S,-S],[S,S,-S],[-S,S,-S],
    [-S,-S, S],[S,-S, S],[S,S, S],[-S,S, S],
  ];
  const edges: [number, number][] = [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
  ];
  let idx = 0;
  for (const [a, b] of edges) {
    const ca = corners[a], cb = corners[b];
    for (let i = 0; i < 100; i++) {
      const t = i / 99;
      arr[idx++] = ca[0] + (cb[0] - ca[0]) * t;
      arr[idx++] = ca[1] + (cb[1] - ca[1]) * t;
      arr[idx++] = ca[2] + (cb[2] - ca[2]) * t;
    }
  }
  return arr;
}

/** Fibonacci-lattice sphere surface */
function genSphere(): Float32Array {
  const arr = new Float32Array(N * 3);
  const R   = 1.75;
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y  = 1 - (i / (N - 1)) * 2;
    const r  = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    arr[i * 3]     = Math.cos(th) * r * R;
    arr[i * 3 + 1] = y * R;
    arr[i * 3 + 2] = Math.sin(th) * r * R;
  }
  return arr;
}

/** 5-layer neural graph — node clusters + sampled edge lines */
function genNeural(): Float32Array {
  const arr  = new Float32Array(N * 3);
  const rand = lcg(42);
  const S    = 0.88;

  const layers  = [4, 6, 8, 6, 4];
  const layerXs = [-2.0, -1.0, 0, 1.0, 2.0];

  const neurons: [number, number, number][] = [];
  for (let li = 0; li < layers.length; li++) {
    const cnt = layers[li];
    for (let ni = 0; ni < cnt; ni++) {
      const y = (ni - (cnt - 1) / 2) * (3.0 / cnt) * S;
      neurons.push([layerXs[li] * S, y, (rand() - 0.5) * 0.3]);
    }
  }

  const conns: [[number,number,number],[number,number,number]][] = [];
  let off = 0;
  for (let li = 0; li < layers.length - 1; li++) {
    for (let ai = 0; ai < layers[li]; ai++) {
      for (let bi = 0; bi < layers[li + 1]; bi++) {
        conns.push([neurons[off + ai], neurons[off + layers[li] + bi]]);
      }
    }
    off += layers[li];
  }

  let idx = 0;

  // 200 node-cluster points
  for (let i = 0; i < 200; i++) {
    const n = neurons[i % neurons.length];
    const phi2 = Math.acos(2 * rand() - 1);
    const th   = rand() * Math.PI * 2;
    arr[idx++] = n[0] + 0.1 * Math.sin(phi2) * Math.cos(th);
    arr[idx++] = n[1] + 0.1 * Math.sin(phi2) * Math.sin(th);
    arr[idx++] = n[2] + 0.1 * Math.cos(phi2);
  }

  // 1 000 edge-sampled points
  const ppe = Math.floor(1000 / conns.length);
  for (const [a, b] of conns) {
    for (let i = 0; i < ppe && idx / 3 < N; i++) {
      const t = (i + 0.5) / ppe;
      arr[idx++] = a[0] + (b[0] - a[0]) * t;
      arr[idx++] = a[1] + (b[1] - a[1]) * t;
      arr[idx++] = a[2] + (b[2] - a[2]) * t;
    }
  }

  // Fill remainder round-robin on neurons
  while (idx / 3 < N) {
    const n = neurons[(idx / 3) % neurons.length];
    arr[idx++] = n[0]; arr[idx++] = n[1]; arr[idx++] = n[2];
  }
  return arr;
}

/** Humanoid body point cloud — head + torso + arms + legs */
function genHumanoid(): Float32Array {
  const arr  = new Float32Array(N * 3);
  const rand = lcg(99);
  let idx    = 0;
  const S    = 1.0;

  const ellipsoid = (
    cx: number, cy: number, cz: number,
    rx: number, ry: number, rz: number,
    count: number,
  ) => {
    let placed = 0;
    while (placed < count && idx / 3 < N) {
      const x = (rand() * 2 - 1) * rx;
      const y = (rand() * 2 - 1) * ry;
      const z = (rand() * 2 - 1) * rz;
      if ((x/rx)**2 + (y/ry)**2 + (z/rz)**2 <= 1) {
        arr[idx++] = cx + x;
        arr[idx++] = cy + y;
        arr[idx++] = cz + z;
        placed++;
      }
    }
  };

  const cyl = (
    x1: number, y1: number, z1: number,
    x2: number, y2: number, z2: number,
    r: number, count: number,
  ) => {
    for (let i = 0; i < count && idx / 3 < N; i++) {
      const t = rand(), angle = rand() * Math.PI * 2, rr = Math.sqrt(rand()) * r;
      arr[idx++] = x1 + (x2-x1)*t + Math.cos(angle)*rr;
      arr[idx++] = y1 + (y2-y1)*t;
      arr[idx++] = z1 + (z2-z1)*t + Math.sin(angle)*rr;
    }
  };

  //  head:150  neck:30  torso:210  arms:160  legs:340  = 890 → fill 310 more
  ellipsoid(0,   1.65*S, 0, 0.26*S, 0.30*S, 0.26*S, 150);
  cyl(0, 1.30*S, 0, 0, 1.10*S, 0, 0.09*S, 30);
  ellipsoid(0,   0.60*S, 0, 0.36*S, 0.54*S, 0.22*S, 210);
  cyl(-0.52*S, 1.05*S, 0, -0.80*S,  0.38*S, 0,      0.10*S, 90);
  cyl(-0.80*S, 0.38*S, 0, -0.90*S, -0.28*S, 0.04*S, 0.09*S, 70);
  cyl( 0.52*S, 1.05*S, 0,  0.80*S,  0.38*S, 0,      0.10*S, 90);
  cyl( 0.80*S, 0.38*S, 0,  0.90*S, -0.28*S, 0.04*S, 0.09*S, 70);
  cyl(-0.20*S, 0.04*S, 0, -0.25*S, -0.70*S, 0,      0.13*S, 90);
  cyl(-0.25*S,-0.70*S, 0, -0.22*S, -1.45*S, 0.05*S, 0.10*S, 80);
  cyl( 0.20*S, 0.04*S, 0,  0.25*S, -0.70*S, 0,      0.13*S, 90);
  cyl( 0.25*S,-0.70*S, 0,  0.22*S, -1.45*S, 0.05*S, 0.10*S, 80);

  // Fill remaining with body-surface scatter
  while (idx / 3 < N) {
    arr[idx++] = (rand()-0.5)*1.6*S;
    arr[idx++] = (rand()-0.5)*3.2*S;
    arr[idx++] = (rand()-0.5)*0.4*S;
  }
  return arr;
}

/* ══════════════════════════════════════════════════════════════════════════
   Inner R3F scene — receives a labelRef to update the DOM without re-render
══════════════════════════════════════════════════════════════════════════ */
interface MorphSceneProps {
  labelRef: React.RefObject<HTMLDivElement | null>;
}

function MorphScene({ labelRef }: MorphSceneProps) {
  const shapes  = useMemo(() => [genCube(), genSphere(), genNeural(), genHumanoid()], []);

  const meshRef      = useRef<THREE.InstancedMesh>(null!);
  const burstGeoRef  = useRef<THREE.BufferGeometry>(null!);
  const burstPosArr  = useRef(new Float32Array(BURST_COUNT * 3));
  const burstVelArr  = useRef(new Float32Array(BURST_COUNT * 3));
  const burstLifeArr = useRef(new Float32Array(BURST_COUNT));

  const tmpPos = useMemo(() => new Float32Array(N * 3), []);
  const m4     = useMemo(() => new THREE.Matrix4(), []);

  const morphState = useRef({
    from:      0,
    to:        0,
    progress:  1.0,
    idleTimer: SHAPE_DURATION,
  });

  /* ── Burst trigger ────────────────────────────────────────────────────── */
  const triggerBurst = useCallback((fromPos: Float32Array) => {
    for (let i = 0; i < BURST_COUNT; i++) {
      const si = Math.floor(Math.random() * N);
      burstPosArr.current[i*3]   = fromPos[si*3];
      burstPosArr.current[i*3+1] = fromPos[si*3+1];
      burstPosArr.current[i*3+2] = fromPos[si*3+2];
      const speed = 2.0 + Math.random() * 2.5;
      const phi   = Math.acos(2 * Math.random() - 1);
      const th    = Math.random() * Math.PI * 2;
      burstVelArr.current[i*3]   = Math.sin(phi) * Math.cos(th) * speed;
      burstVelArr.current[i*3+1] = Math.sin(phi) * Math.sin(th) * speed;
      burstVelArr.current[i*3+2] = Math.cos(phi) * speed;
      burstLifeArr.current[i]    = 1.0;
    }
  }, []);

  /* ── First-frame init ─────────────────────────────────────────────────── */
  const ready = useRef(false);

  useFrame((_, dt) => {
    if (!meshRef.current) return;

    /* Place all instances at cube on first frame */
    if (!ready.current) {
      ready.current = true;
      for (let i = 0; i < N; i++) {
        m4.setPosition(shapes[0][i*3], shapes[0][i*3+1], shapes[0][i*3+2]);
        meshRef.current.setMatrixAt(i, m4);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      return;
    }

    /* Pause while Hero is fully off-screen */
    if (scrollSync.sections.hero !== undefined && scrollSync.sections.hero < 0.01) return;

    const st = morphState.current;

    /* ── Auto-cycle ──────────────────────────────────────────────────── */
    if (st.progress >= 1.0) {
      st.idleTimer -= dt;
      if (st.idleTimer <= 0) {
        st.from      = st.to;
        st.to        = (st.to + 1) % 4;
        st.progress  = 0.0;
        st.idleTimer = SHAPE_DURATION + TRANS_DURATION;
        triggerBurst(shapes[st.from]);
        if (labelRef.current) labelRef.current.textContent = SHAPE_LABELS[st.to];
      }
    } else {
      st.progress = Math.min(1.0, st.progress + dt / TRANS_DURATION);
    }

    /* ── Lerp positions ──────────────────────────────────────────────── */
    const p    = ss(st.progress);
    const from = shapes[st.from];
    const to   = shapes[st.to];
    for (let i = 0; i < N * 3; i++) tmpPos[i] = from[i] + (to[i] - from[i]) * p;

    /* ── Colour blend ────────────────────────────────────────────────── */
    const col = COLOURS[st.from].clone().lerp(COLOURS[st.to], p);
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    mat.color.copy(col);
    mat.emissive.copy(col).multiplyScalar(0.22);

    /* ── Write to InstancedMesh ──────────────────────────────────────── */
    for (let i = 0; i < N; i++) {
      m4.setPosition(tmpPos[i*3], tmpPos[i*3+1], tmpPos[i*3+2]);
      meshRef.current.setMatrixAt(i, m4);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    /* ── Animate burst ───────────────────────────────────────────────── */
    if (burstGeoRef.current) {
      const attr = burstGeoRef.current.getAttribute('position') as THREE.BufferAttribute | null;
      if (!attr) return;
      const bArr = attr.array as Float32Array;
      let dirty = false;

      for (let i = 0; i < BURST_COUNT; i++) {
        if (burstLifeArr.current[i] > 0) {
          dirty = true;
          burstLifeArr.current[i] -= dt / BURST_LIFETIME;
          const elapsed = (1 - Math.max(0, burstLifeArr.current[i])) * BURST_LIFETIME;
          bArr[i*3]   = burstPosArr.current[i*3]   + burstVelArr.current[i*3]   * elapsed;
          bArr[i*3+1] = burstPosArr.current[i*3+1] + burstVelArr.current[i*3+1] * elapsed;
          bArr[i*3+2] = burstPosArr.current[i*3+2] + burstVelArr.current[i*3+2] * elapsed;
        } else if (bArr[i*3] < 900) {
          // Park dead particle off-screen (one-time flush)
          dirty = true;
          bArr[i*3] = 999; bArr[i*3+1] = 999; bArr[i*3+2] = 999;
        }
      }
      if (dirty) attr.needsUpdate = true;
    }
  });

  /* ── Init burst geometry ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!burstGeoRef.current) return;
    const init = new Float32Array(BURST_COUNT * 3).fill(999);
    burstGeoRef.current.setAttribute('position', new THREE.BufferAttribute(init, 3));
  }, []);

  return (
    <>
      {/* PBR lights — needed for clearcoat glass-metal shading */}
      <ambientLight intensity={0.3} />
      <pointLight position={[ 3,  3,  4]} intensity={4.0} color="#00d4ff" />
      <pointLight position={[-3, -2,  3]} intensity={2.5} color="#7c3aed" />
      <pointLight position={[ 0, -4,  2]} intensity={2.0} color="#22c55e" />

      {/* 1 200 glass-metal instanced spheres */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, N]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshPhysicalMaterial
          color="#00d4ff"
          emissive="#001a33"
          emissiveIntensity={0.3}
          metalness={0.75}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.04}
          transparent
          opacity={0.92}
        />
      </instancedMesh>

      {/* Burst particles (Points with additive blending) */}
      <points>
        <bufferGeometry ref={burstGeoRef} />
        <pointsMaterial
          color="#ffffff"
          size={0.12}
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      <EffectComposer>
        <Bloom
          intensity={2.4}
          luminanceThreshold={0.04}
          luminanceSmoothing={0.92}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Public component — creates the Canvas + DOM label overlay
══════════════════════════════════════════════════════════════════════════ */
export default function MorphShape3D() {
  const labelRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 58 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <MorphScene labelRef={labelRef} />
      </Canvas>

      {/* Shape label — bottom-centre, updated in-place by MorphScene */}
      <div
        ref={labelRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{
          fontFamily:    '"JetBrains Mono", monospace',
          fontSize:      11,
          letterSpacing: '0.18em',
          color:         'rgba(0,212,255,0.5)',
        }}
      >
        {SHAPE_LABELS[0]}
      </div>
    </div>
  );
}
