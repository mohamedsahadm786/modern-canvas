/**
 * MatrixRain3D — Three.js instanced sprite rain for Scene3D canvas.
 *
 * 1 200 PlaneGeometry instances fall in 3-D:
 *   • 60 columns × 20 drops, Z spread of ±4.5 world units
 *   • Characters cycle within each instance (per-instance rate)
 *   • Phase cycling every 4 s: code → digits → math → pseudocode → …
 *   • GLSL cross-fade (mix) between two atlas textures during each transition
 *   • Depth-based colour: near = cyan, far = green
 *   • AdditiveBlending → bloom makes them glow
 */
import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Character groups (phase cycle, 10 chars each) ──────────────────────── */
const CHAR_GROUPS = [
  // Phase 0 — code keywords
  ['def', 'class', 'async', 'yield', 'torch', 'import', 'return', 'fit()', 'log', 'RAG'],
  // Phase 1 — digits 0–9
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  // Phase 2 — math symbols
  ['Σ', '∫', '∇', 'σ', 'μ', 'λ', 'π', 'δ', 'ε', 'θ'],
  // Phase 3 — algorithm tokens
  ['O(n)', 'DFS', 'BFS', 'SORT', 'MAP', 'argmax', 'grad', 'loss', 'LLM', 'ETL'],
] as const;

const CHARS_PER_GROUP = 10;
const INSTANCE_COUNT  = 1200;
const COL_COUNT       = 60;   // rain columns
const PHASE_DURATION  = 4;    // seconds per phase
const BLEND_DURATION  = 1;    // cross-fade window (last N seconds of each phase)
const CELL_SIZE       = 64;   // canvas px per character cell

/* ── Build a 640×64 canvas texture (10 chars in a horizontal strip) ─────── */
function buildAtlasTexture(chars: readonly string[]): THREE.CanvasTexture {
  const canvas  = document.createElement('canvas');
  canvas.width  = CHARS_PER_GROUP * CELL_SIZE;
  canvas.height = CELL_SIZE;
  const ctx     = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle    = '#ffffff';
  ctx.font         = `bold ${Math.floor(CELL_SIZE * 0.52)}px "JetBrains Mono", monospace`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';

  chars.forEach((ch, i) => {
    ctx.fillText(String(ch), i * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2);
  });

  const tex      = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/* ── Vertex shader ──────────────────────────────────────────────────────── */
const VERT = /* glsl */`
  attribute float aCol;
  attribute float aStartY;
  attribute float aFallSpeed;
  attribute float aDepth;
  attribute float aCharSeed;
  attribute float aCharSpeed;

  uniform float uTime;
  uniform float uViewW;
  uniform float uViewH;

  varying vec2  vUv;
  varying float vCharUvStart;
  varying float vNearness;
  varying float vAlpha;

  void main() {
    vUv = uv;

    /* Column X position */
    float xPos = (aCol / ${COL_COUNT}.0 - 0.5) * uViewW * 1.05;

    /* Falling Y — wraps top-to-bottom */
    float yNorm = mod(aStartY + uTime * aFallSpeed, 1.0);
    float yPos  = mix(uViewH * 0.56, -uViewH * 0.56, yNorm);

    /* Z depth spread */
    float zPos = aDepth * 4.5;

    /* Depth-based scale: near = larger */
    float nearness  = 1.0 - abs(aDepth);
    float charScale = 0.20 + nearness * 0.50;

    /* Dynamic character index cycles over time */
    float charIdx  = mod(floor(uTime * aCharSpeed + aCharSeed * 7.391), ${CHARS_PER_GROUP}.0);
    vCharUvStart   = charIdx / ${CHARS_PER_GROUP}.0;

    /* Pass to fragment */
    vNearness = nearness;
    vAlpha    = 0.07 + nearness * 0.23;   /* 0.07–0.30 — keep additive subtle */

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

  void main() {
    /* UV within this character's atlas cell */
    float u = vCharUvStart + vUv.x / ${CHARS_PER_GROUP}.0;
    vec2  charUV = vec2(u, vUv.y);

    /* Cross-fade between current and next atlas */
    float aA   = texture2D(uTexA, charUV).a;
    float aB   = texture2D(uTexB, charUV).a;
    float alpha = mix(aA, aB, uBlend);

    if (alpha < 0.05) discard;

    /* Depth colour: near = cyan, far = green */
    vec3 cyan  = vec3(0.00, 0.97, 0.92);
    vec3 green = vec3(0.05, 0.90, 0.24);
    vec3 col   = mix(green, cyan, vNearness);

    gl_FragColor = vec4(col, alpha * vAlpha);
  }
`;

/* ── Component ───────────────────────────────────────────────────────────── */
export default function MatrixRain3D() {
  const meshRef   = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const phaseRef  = useRef({ current: 0, next: 1, timer: 0 });

  /* Atlas textures — built once per group */
  const textures = useMemo(
    () => CHAR_GROUPS.map(buildAtlasTexture),
    [],
  );

  /* Per-instance attribute buffers */
  const attrs = useMemo(() => {
    const col       = new Float32Array(INSTANCE_COUNT);
    const startY    = new Float32Array(INSTANCE_COUNT);
    const fallSpeed = new Float32Array(INSTANCE_COUNT);
    const depth     = new Float32Array(INSTANCE_COUNT);
    const charSeed  = new Float32Array(INSTANCE_COUNT);
    const charSpeed = new Float32Array(INSTANCE_COUNT);

    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const colIdx    = i % COL_COUNT;
      const dropIdx   = Math.floor(i / COL_COUNT); // 0–19
      col[i]         = colIdx;
      startY[i]      = dropIdx / 20 + Math.random() * 0.04;
      fallSpeed[i]   = 0.05 + Math.random() * 0.11;
      depth[i]       = (Math.random() - 0.5) * 2;   // –1 … +1
      charSeed[i]    = Math.floor(Math.random() * CHARS_PER_GROUP);
      charSpeed[i]   = 0.4 + Math.random() * 2.6;   // chars/sec
    }
    return { col, startY, fallSpeed, depth, charSeed, charSpeed };
  }, []);

  /* Attach custom per-instance attributes after mount */
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const geo = mesh.geometry;

    geo.setAttribute('aCol',       new THREE.InstancedBufferAttribute(attrs.col,       1));
    geo.setAttribute('aStartY',    new THREE.InstancedBufferAttribute(attrs.startY,    1));
    geo.setAttribute('aFallSpeed', new THREE.InstancedBufferAttribute(attrs.fallSpeed, 1));
    geo.setAttribute('aDepth',     new THREE.InstancedBufferAttribute(attrs.depth,     1));
    geo.setAttribute('aCharSeed',  new THREE.InstancedBufferAttribute(attrs.charSeed,  1));
    geo.setAttribute('aCharSpeed', new THREE.InstancedBufferAttribute(attrs.charSpeed, 1));

    /* Identity matrices — positioning is handled entirely in the vertex shader */
    const identity = new THREE.Matrix4();
    for (let i = 0; i < INSTANCE_COUNT; i++) mesh.setMatrixAt(i, identity);
    mesh.instanceMatrix.needsUpdate = true;
  }, [attrs]);

  /* Shader uniforms */
  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uViewW: { value: viewport.width  },
    uViewH: { value: viewport.height },
    uTexA:  { value: textures[0] },
    uTexB:  { value: textures[1] },
    uBlend: { value: 0 },
  }), [textures, viewport.width, viewport.height]);

  useFrame(({ clock }, _delta) => {
    const ph = phaseRef.current;

    uniforms.uTime.value  = clock.getElapsedTime();
    uniforms.uViewW.value = viewport.width;
    uniforms.uViewH.value = viewport.height;

    ph.timer += _delta;

    if (ph.timer >= PHASE_DURATION) {
      /* Advance phase */
      ph.timer   = 0;
      ph.current = ph.next;
      ph.next    = (ph.next + 1) % CHAR_GROUPS.length;
      uniforms.uTexA.value  = textures[ph.current];
      uniforms.uTexB.value  = textures[ph.next];
      uniforms.uBlend.value = 0;
    } else {
      /* Cross-fade during the last BLEND_DURATION seconds of the phase */
      const remaining        = PHASE_DURATION - ph.timer;
      uniforms.uBlend.value  = remaining < BLEND_DURATION
        ? 1 - remaining / BLEND_DURATION
        : 0;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, INSTANCE_COUNT]}
      frustumCulled={false}
    >
      <planeGeometry args={[0.75, 0.75]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
