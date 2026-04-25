/**
 * MatrixRain3D — Debug-stable rewrite.
 *
 * Root cause analysis after three failed attempts:
 *  1. AdditiveBlending on alpha:true canvas → near-zero composite alpha (fixed)
 *  2. GLSL const float CAMERA_Z = 7  → integer literal in float const = type error
 *     in strict GLSL ES 1.00 implementations (fixed)
 *  3. Y range not depth-aware → near chars outside frustum (fixed)
 *  4. CanvasTexture 640×64 px (non-power-of-2 width) + default mipmap filtering
 *     → broken texture on some WebGL implementations (fixed)
 *  5. Complex custom vertex shader for positioning via InstancedBufferAttribute
 *     → unknown Three.js r184 / driver-specific behaviour
 *
 * This version eliminates #5 entirely:
 *  • Positions updated on CPU via setMatrixAt (Three.js–guaranteed API)
 *  • Vertex shader is trivial: instanceMatrix * position + UV pass-through
 *  • Fragment shader does atlas UV lookup + colour (minimal custom GLSL)
 *  • Per-instance character cycling still works via InstancedBufferAttribute
 *    (only two floats per instance: aCharSeed, aCharSpeed)
 *
 * If you still see nothing: open browser DevTools → Console and look for
 * WebGL shader compile errors or JavaScript exceptions.
 */
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Character groups ────────────────────────────────────────────────────── */
const CHAR_GROUPS = [
  ['def', 'class', 'async', 'torch', 'import', 'return', 'fit()', 'log', 'RAG', 'yield'],
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ['Σ', '∫', '∇', 'σ', 'μ', 'λ', 'π', 'δ', 'ε', 'θ'],
  ['O(n)', 'DFS', 'BFS', 'SORT', 'MAP', 'argmax', 'grad', 'loss', 'LLM', 'ETL'],
] as const;

const CHARS_PER_GROUP = 10;
const INSTANCE_COUNT  = 1200;
const COL_COUNT       = 60;
const PHASE_DURATION  = 4;
const BLEND_DURATION  = 1;
/* Canvas cell — use 512/10 = 51.2 → round to 51; total width ≈ 512 (power-of-2) */
const CELL_W  = 51;
const CELL_H  = 64;
/* Camera constants (must match Scene3D canvas settings) */
const CAM_Z       = 7.0;
const TAN_HALF    = 0.5206;   /* tan(27.5°)  for fov = 55 */
const Z_SPREAD    = 3.5;

/* ── Build atlas texture (one horizontal strip per group) ───────────────── */
function buildAtlasTexture(chars: readonly string[]): THREE.CanvasTexture {
  const W = CHARS_PER_GROUP * CELL_W;   /* 510 */
  const H = CELL_H;                      /* 64  */
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, W, H);
  /* Use monospace (always available) so text renders even before web fonts load */
  ctx.font         = `bold ${Math.floor(CELL_H * 0.50)}px monospace`;
  ctx.fillStyle    = '#ffffff';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  chars.forEach((ch, i) => {
    ctx.fillText(String(ch), i * CELL_W + CELL_W / 2, CELL_H / 2);
  });

  const tex = new THREE.CanvasTexture(canvas);
  /* Disable mipmaps to avoid NPOT (non-power-of-2) texture issues */
  tex.minFilter     = THREE.LinearFilter;
  tex.magFilter     = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate   = true;
  return tex;
}

/* ── Minimal vertex shader — instanceMatrix handles all positioning ──────── */
const VERT = /* glsl */`
  /* Three.js injects: projectionMatrix, modelViewMatrix, instanceMatrix,
     position (vec3), uv (vec2) automatically for ShaderMaterial.       */

  attribute float aCharSeed;
  attribute float aCharSpeed;
  attribute float aDepth;

  uniform float uTime;

  varying vec2  vUv;
  varying float vCharUvStart;
  varying float vNearness;
  varying float vAlpha;

  void main() {
    vUv = uv;

    float nearness   = (aDepth + 1.0) * 0.5;
    float charIdx    = mod(floor(uTime * aCharSpeed + aCharSeed * 7.391), 10.0);
    vCharUvStart     = charIdx / 10.0;
    vNearness        = nearness;
    vAlpha           = 0.70 + nearness * 0.30;   /* 0.70–1.00 */

    /* instanceMatrix carries scale + translation set by setMatrixAt each frame */
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;

/* ── Fragment shader — atlas UV lookup ──────────────────────────────────── */
const FRAG = /* glsl */`
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float     uBlend;

  varying vec2  vUv;
  varying float vCharUvStart;
  varying float vNearness;
  varying float vAlpha;

  void main() {
    float u     = vCharUvStart + vUv.x / 10.0;
    vec2  uvS   = vec2(u, vUv.y);
    float aA    = texture2D(uTexA, uvS).a;
    float aB    = texture2D(uTexB, uvS).a;
    float alpha = mix(aA, aB, uBlend);

    if (alpha < 0.03) discard;

    vec3 cyan  = vec3(0.00, 1.00, 0.95);
    vec3 green = vec3(0.04, 0.85, 0.30);
    vec3 col   = mix(green, cyan, vNearness);

    gl_FragColor = vec4(col, alpha * vAlpha);
  }
`;

/* ── Per-instance data (stable, never changes) ──────────────────────────── */
interface DropData {
  col:       number;  /* 0–59  */
  startY:    number;  /* 0–1   */
  fallSpeed: number;  /* world/sec */
  depth:     number;  /* –1…+1 */
  charSeed:  number;  /* 0–9   */
  charSpeed: number;  /* chars/sec */
}

/* ── Component ───────────────────────────────────────────────────────────── */
export default function MatrixRain3D() {
  const { viewport } = useThree();
  const phaseRef     = useRef({ current: 0, next: 1, timer: 0 });

  /* Atlas textures — four groups */
  const textures = useMemo(() => CHAR_GROUPS.map(buildAtlasTexture), []);

  /* Stable uniform object — mutated in-place each frame */
  const uniforms = useRef({
    uTime:   { value: 0 },
    uTexA:   { value: textures[0] },
    uTexB:   { value: textures[1] },
    uBlend:  { value: 0 },
  });

  /* Per-instance fall data (CPU-side, used in useFrame) */
  const drops = useMemo<DropData[]>(() => {
    const arr: DropData[] = [];
    for (let i = 0; i < INSTANCE_COUNT; i++) {
      arr.push({
        col:       i % COL_COUNT,
        startY:    Math.floor(i / COL_COUNT) / 20 + Math.random() * 0.04,
        fallSpeed: 0.05 + Math.random() * 0.11,
        depth:     (Math.random() - 0.5) * 2,
        charSeed:  Math.floor(Math.random() * CHARS_PER_GROUP),
        charSpeed: 0.4 + Math.random() * 2.6,
      });
    }
    return arr;
  }, []);

  /* Build instanced mesh with minimal custom ShaderMaterial */
  const mesh = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1);

    /* Only two per-instance shader attributes — char selection */
    const charSeedArr  = new Float32Array(drops.map(d => d.charSeed));
    const charSpeedArr = new Float32Array(drops.map(d => d.charSpeed));
    const depthArr     = new Float32Array(drops.map(d => d.depth));
    geo.setAttribute('aCharSeed',  new THREE.InstancedBufferAttribute(charSeedArr,  1));
    geo.setAttribute('aCharSpeed', new THREE.InstancedBufferAttribute(charSpeedArr, 1));
    geo.setAttribute('aDepth',     new THREE.InstancedBufferAttribute(depthArr,     1));

    const mat = new THREE.ShaderMaterial({
      uniforms:       uniforms.current,
      vertexShader:   VERT,
      fragmentShader: FRAG,
      transparent:    true,
      depthWrite:     false,
      side:           THREE.DoubleSide,
    });

    const m = new THREE.InstancedMesh(geo, mat, INSTANCE_COUNT);
    m.frustumCulled = false;
    /* initialise all matrices to identity */
    const id = new THREE.Matrix4();
    for (let i = 0; i < INSTANCE_COUNT; i++) m.setMatrixAt(i, id);
    m.instanceMatrix.needsUpdate = true;
    return m;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Reusable objects to avoid GC pressure each frame */
  const _mat3  = useRef(new THREE.Matrix4());
  const _pos   = useRef(new THREE.Vector3());
  const _scale = useRef(new THREE.Vector3(1, 1, 1));
  const _quat  = useRef(new THREE.Quaternion());

  useFrame(({ clock }, delta) => {
    const u       = uniforms.current;
    const ph      = phaseRef.current;
    const t       = clock.getElapsedTime();
    const aspect  = viewport.width / viewport.height;
    const mat4    = _mat3.current;
    const pos     = _pos.current;
    const scl     = _scale.current;
    const quat    = _quat.current;

    /* Update time uniform */
    u.uTime.value = t;

    /* Phase cycling */
    ph.timer += delta;
    if (ph.timer >= PHASE_DURATION) {
      ph.timer   = 0;
      ph.current = ph.next;
      ph.next    = (ph.next + 1) % CHAR_GROUPS.length;
      u.uTexA.value  = textures[ph.current];
      u.uTexB.value  = textures[ph.next];
      u.uBlend.value = 0;
    } else {
      const rem      = PHASE_DURATION - ph.timer;
      u.uBlend.value = rem < BLEND_DURATION ? 1 - rem / BLEND_DURATION : 0;
    }

    /* Update all instance matrices on CPU */
    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const d = drops[i];

      /* Depth → Z → distance from camera */
      const zPos       = d.depth * Z_SPREAD;
      const distFromCam = CAM_Z - zPos;          /* 3.5 … 10.5 */

      /* Screen-filling X: column maps to –halfW…+halfW at this depth */
      const halfH = TAN_HALF * distFromCam;
      const halfW = halfH * aspect;
      const xPos  = (d.col / COL_COUNT - 0.5) * halfW * 2.0;

      /* Falling Y: wraps top → bottom */
      const yNorm = ((d.startY + t * d.fallSpeed) % 1 + 1) % 1;
      const yPos  = halfH * 1.15 - yNorm * halfH * 2.3;   /* top to bottom */

      /* Character scale: same screen-fraction regardless of depth + nearness bias */
      const nearness   = (d.depth + 1.0) * 0.5;
      const screenFrac = 0.032 + nearness * 0.022;
      const cs         = screenFrac * distFromCam * TAN_HALF * 2.0;

      pos.set(xPos, yPos, zPos);
      scl.set(cs, cs, 1);
      mat4.compose(pos, quat, scl);
      mesh.setMatrixAt(i, mat4);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <primitive object={mesh} />;
}
