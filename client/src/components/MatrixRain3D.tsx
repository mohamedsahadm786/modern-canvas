/**
 * MatrixRain3D — 1 200 instanced sprite rain in the Scene3D canvas.
 *
 * Design choices that avoid past bugs:
 *  • Mesh created imperatively in useMemo → returned as <primitive> (no R3F
 *    reconciler attribute-attachment timing issues)
 *  • NormalBlending + alpha 0.65–1.0 (AdditiveBlending on alpha:true canvas
 *    produced near-invisible chars after canvas→page composite)
 *  • Y / X ranges are depth-proportional so near-camera sprites never fall
 *    outside the frustum
 *  • All uniforms live in a stable useRef; never recreated on resize
 */
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Character groups (phase cycle) ─────────────────────────────────────── */
const CHAR_GROUPS = [
  ['def', 'class', 'async', 'yield', 'torch', 'import', 'return', 'fit()', 'log', 'RAG'],
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ['Σ', '∫', '∇', 'σ', 'μ', 'λ', 'π', 'δ', 'ε', 'θ'],
  ['O(n)', 'DFS', 'BFS', 'SORT', 'MAP', 'argmax', 'grad', 'loss', 'LLM', 'ETL'],
] as const;

const CHARS_PER_GROUP = 10;
const INSTANCE_COUNT  = 1200;
const COL_COUNT       = 60;
const PHASE_DURATION  = 4;    // seconds per phase
const BLEND_DURATION  = 1;    // cross-fade at end of each phase
const CELL_SIZE       = 64;   // canvas px per character cell

/* Camera constants matching Scene3D canvas: fov=55, camera z=7 */
const CAMERA_Z      = 7.0;
const TAN_HALF_FOV  = 0.5206;   // tan(27.5°)

/* ── Build a 640×64 canvas atlas texture for one character group ─────────── */
function buildAtlasTexture(chars: readonly string[]): THREE.CanvasTexture {
  const canvas  = document.createElement('canvas');
  canvas.width  = CHARS_PER_GROUP * CELL_SIZE;
  canvas.height = CELL_SIZE;
  const ctx     = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* Draw glow layer first */
  ctx.shadowColor  = '#00ffcc';
  ctx.shadowBlur   = 10;
  ctx.fillStyle    = '#ccfff8';
  ctx.font         = `bold ${Math.floor(CELL_SIZE * 0.46)}px "JetBrains Mono", monospace`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';

  chars.forEach((ch, i) => {
    ctx.fillText(String(ch), i * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2);
  });

  const tex       = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/* ── Vertex shader ──────────────────────────────────────────────────────── */
const VERT = /* glsl */`
  /* Per-instance attributes */
  attribute float aCol;
  attribute float aStartY;
  attribute float aFallSpeed;
  attribute float aDepth;
  attribute float aCharSeed;
  attribute float aCharSpeed;

  uniform float uTime;
  uniform float uAspect;   /* viewport width / height */

  varying vec2  vUv;
  varying float vCharUvStart;
  varying float vNearness;
  varying float vAlpha;

  const float CAMERA_Z     = ${CAMERA_Z};
  const float TAN_HALF_FOV = ${TAN_HALF_FOV};
  const float COL_COUNT    = ${COL_COUNT}.0;
  const float CHARS        = ${CHARS_PER_GROUP}.0;

  void main() {
    /* Pass geometry UV to fragment (uv is a built-in Three.js attribute) */
    vUv = uv;

    /* ── Depth ── */
    /* aDepth –1 (far) … +1 (near camera).
       zPos = +3.5 is close to camera (camera sits at z=7). */
    float zPos       = aDepth * 3.5;
    float distFromCam = CAMERA_Z - zPos;           /* 3.5 … 10.5 */

    /* ── Screen-filling X / Y (columns & fall range scale with depth) ── */
    float halfH  = TAN_HALF_FOV * distFromCam;
    float halfW  = halfH * uAspect;

    float xPos   = (aCol / COL_COUNT - 0.5) * halfW * 2.0;
    float yNorm  = mod(aStartY + uTime * aFallSpeed, 1.0);
    float yPos   = mix(halfH * 1.15, -halfH * 1.15, yNorm);

    /* ── Char scale: same screen fraction at all depths, bias toward near ── */
    /* nearness: 0 = far edge, 1 = near edge */
    float nearness  = (aDepth + 1.0) * 0.5;
    float screenFrac = 0.032 + nearness * 0.022;       /* 3.2 % … 5.4 % of vh */
    float charScale  = screenFrac * distFromCam * TAN_HALF_FOV * 2.0;

    /* ── Dynamic character cycling ── */
    float charIdx    = mod(floor(uTime * aCharSpeed + aCharSeed * 7.391), CHARS);
    vCharUvStart     = charIdx / CHARS;

    vNearness = nearness;
    vAlpha    = 0.65 + nearness * 0.35;   /* 0.65 – 1.0 */

    vec3 pos    = position * charScale + vec3(xPos, yPos, zPos);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

/* ── Fragment shader ─────────────────────────────────────────────────────── */
const FRAG = /* glsl */`
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float     uBlend;

  varying vec2  vUv;
  varying float vCharUvStart;
  varying float vNearness;
  varying float vAlpha;

  const float CHARS = ${CHARS_PER_GROUP}.0;

  void main() {
    float u      = vCharUvStart + vUv.x / CHARS;
    vec2  uvSamp = vec2(u, vUv.y);

    float aA    = texture2D(uTexA, uvSamp).a;
    float aB    = texture2D(uTexB, uvSamp).a;
    float alpha = mix(aA, aB, uBlend);

    if (alpha < 0.04) discard;

    /* Near = brighter cyan, far = deeper green */
    vec3 cyan  = vec3(0.00, 1.00, 0.95);
    vec3 green = vec3(0.04, 0.85, 0.30);
    vec3 col   = mix(green, cyan, vNearness);

    gl_FragColor = vec4(col, alpha * vAlpha);
  }
`;

/* ── Component ───────────────────────────────────────────────────────────── */
export default function MatrixRain3D() {
  const { viewport } = useThree();
  const phaseRef = useRef({ current: 0, next: 1, timer: 0 });

  /* Atlas textures — four groups, built once */
  const textures = useMemo(() => CHAR_GROUPS.map(buildAtlasTexture), []);

  /* Stable uniform refs — never recreated on resize */
  const uniforms = useRef({
    uTime:   { value: 0 },
    uAspect: { value: 1 },
    uTexA:   { value: textures[0] },
    uTexB:   { value: textures[1] },
    uBlend:  { value: 0 },
  });

  /* ── Build the InstancedMesh once — everything imperative ────────────── */
  const mesh = useMemo(() => {
    /* Per-instance float arrays */
    const col       = new Float32Array(INSTANCE_COUNT);
    const startY    = new Float32Array(INSTANCE_COUNT);
    const fallSpeed = new Float32Array(INSTANCE_COUNT);
    const depth     = new Float32Array(INSTANCE_COUNT);
    const charSeed  = new Float32Array(INSTANCE_COUNT);
    const charSpeed = new Float32Array(INSTANCE_COUNT);

    for (let i = 0; i < INSTANCE_COUNT; i++) {
      col[i]       = i % COL_COUNT;
      startY[i]    = Math.floor(i / COL_COUNT) / 20 + Math.random() * 0.04;
      fallSpeed[i] = 0.05 + Math.random() * 0.11;
      depth[i]     = (Math.random() - 0.5) * 2;      /* –1 … +1 */
      charSeed[i]  = Math.floor(Math.random() * CHARS_PER_GROUP);
      charSpeed[i] = 0.4 + Math.random() * 2.6;
    }

    /* Geometry: PlaneGeometry(1,1) → charScale in vertex shader sets final size */
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.setAttribute('aCol',       new THREE.InstancedBufferAttribute(col,       1));
    geo.setAttribute('aStartY',    new THREE.InstancedBufferAttribute(startY,    1));
    geo.setAttribute('aFallSpeed', new THREE.InstancedBufferAttribute(fallSpeed, 1));
    geo.setAttribute('aDepth',     new THREE.InstancedBufferAttribute(depth,     1));
    geo.setAttribute('aCharSeed',  new THREE.InstancedBufferAttribute(charSeed,  1));
    geo.setAttribute('aCharSpeed', new THREE.InstancedBufferAttribute(charSpeed, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms:       uniforms.current,
      vertexShader:   VERT,
      fragmentShader: FRAG,
      transparent:    true,
      depthWrite:     false,
      side:           THREE.DoubleSide,
    });

    const m = new THREE.InstancedMesh(geo, mat, INSTANCE_COUNT);

    /* Identity matrices — vertex shader handles all positioning */
    const id = new THREE.Matrix4();
    for (let i = 0; i < INSTANCE_COUNT; i++) m.setMatrixAt(i, id);
    m.instanceMatrix.needsUpdate = true;
    m.frustumCulled = false;

    return m;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);   /* textures ref is stable; uniforms.current is mutated in-place */

  /* ── Animate ──────────────────────────────────────────────────────────── */
  useFrame(({ clock }, delta) => {
    const u  = uniforms.current;
    const ph = phaseRef.current;

    u.uTime.value   = clock.getElapsedTime();
    u.uAspect.value = viewport.width / viewport.height;

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
  });

  return <primitive object={mesh} />;
}
