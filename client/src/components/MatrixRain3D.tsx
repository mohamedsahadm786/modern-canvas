import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const INSTANCE_COUNT = 1200;
const COLUMN_COUNT = 60;
const CAMERA_Z = 7;
const FOV_DEGREES = 55;
const FOV_HALF = Math.tan((FOV_DEGREES * Math.PI) / 360);
const DEPTH_SPREAD = 4.5;
const PHASE_SECONDS = 4;
const CROSSFADE_SECONDS = 1;
const CELL_WIDTH = 64;
const CELL_HEIGHT = 64;

const CHARACTER_GROUPS = [
  ['def', 'class', 'async', 'torch', 'import', 'return', 'fit()', 'log', 'RAG', 'yield'],
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ['Σ', '∫', '∇', 'σ', 'μ', 'λ', 'π', 'δ', 'ε', 'θ'],
  ['O(n)', 'DFS', 'BFS', 'SORT', 'MAP', 'argmax', 'grad', 'loss', 'LLM', 'ETL'],
] as const;

const VERTEX_SHADER = /* glsl */ `
  attribute float aCharSeed;
  attribute float aCharSpeed;
  attribute float aDepth;

  uniform float uTime;

  varying vec2 vGlyphUv;
  varying float vDepthMix;
  varying float vTrail;

  void main() {
    vDepthMix = clamp((aDepth + 1.0) * 0.5, 0.0, 1.0);
    vTrail = smoothstep(0.0, 1.0, uv.y);

    float glyphIndex = mod(floor(uTime * aCharSpeed + aCharSeed), 10.0);
    vGlyphUv = vec2((glyphIndex + uv.x) / 10.0, uv.y);

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uBlend;

  varying vec2 vGlyphUv;
  varying float vDepthMix;
  varying float vTrail;

  float glyphAlpha(vec4 texel) {
    return max(texel.a, dot(texel.rgb, vec3(0.299, 0.587, 0.114)));
  }

  void main() {
    vec4 texA = texture2D(uTexA, vGlyphUv);
    vec4 texB = texture2D(uTexB, vGlyphUv);

    float glyph = mix(glyphAlpha(texA), glyphAlpha(texB), uBlend);
    float body = smoothstep(0.08, 0.95, glyph);
    float tail = mix(0.22, 1.0, pow(vTrail, 1.2));
    float alpha = body * tail * mix(0.45, 0.95, vDepthMix);

    if (alpha < 0.03) discard;

    vec3 color = mix(vec3(0.06, 0.90, 0.22), vec3(0.00, 0.96, 1.00), vDepthMix);
    color *= mix(0.85, 1.25, vTrail);

    gl_FragColor = vec4(color, alpha);
  }
`;

interface Drop {
  column: number;
  cycleOffset: number;
  fallSpeed: number;
  depth: number;
  charSeed: number;
  charSpeed: number;
  wobble: number;
}

function buildAtlas(chars: readonly string[]) {
  const canvas = document.createElement('canvas');
  canvas.width = CELL_WIDTH * chars.length;
  canvas.height = CELL_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('2D canvas context unavailable for matrix atlas.');
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `700 ${Math.floor(CELL_HEIGHT * 0.48)}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';

  chars.forEach((char, index) => {
    ctx.fillText(char, index * CELL_WIDTH + CELL_WIDTH / 2, CELL_HEIGHT / 2);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function MatrixRain3D() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const phaseRef = useRef({ current: 0, next: 1, timer: 0 });
  const transform = useMemo(() => new THREE.Matrix4(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const scale = useMemo(() => new THREE.Vector3(), []);
  const rotation = useMemo(() => new THREE.Quaternion(), []);

  const drops = useMemo<Drop[]>(
    () =>
      Array.from({ length: INSTANCE_COUNT }, (_, index) => ({
        column: index % COLUMN_COUNT,
        cycleOffset: (index % Math.ceil(INSTANCE_COUNT / COLUMN_COUNT)) / 20 + Math.random() * 0.35,
        fallSpeed: 0.18 + Math.random() * 0.32,
        depth: (Math.random() - 0.5) * 2,
        charSeed: Math.floor(Math.random() * 10),
        charSpeed: 2.2 + Math.random() * 4.2,
        wobble: (Math.random() - 0.5) * 0.22,
      })),
    [],
  );

  const textures = useMemo(() => CHARACTER_GROUPS.map((group) => buildAtlas(group)), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexA: { value: textures[0] },
      uTexB: { value: textures[1] },
      uBlend: { value: 0 },
    }),
    [textures],
  );

  const charSeedAttr = useMemo(
    () => new THREE.InstancedBufferAttribute(new Float32Array(drops.map((drop) => drop.charSeed)), 1),
    [drops],
  );
  const charSpeedAttr = useMemo(
    () => new THREE.InstancedBufferAttribute(new Float32Array(drops.map((drop) => drop.charSpeed)), 1),
    [drops],
  );
  const depthAttr = useMemo(
    () => new THREE.InstancedBufferAttribute(new Float32Array(drops.map((drop) => drop.depth)), 1),
    [drops],
  );

  useFrame(({ clock, camera }, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const elapsed = clock.getElapsedTime();
    const phase = phaseRef.current;
    const perspective = camera as THREE.PerspectiveCamera;
    const aspect = perspective.aspect || window.innerWidth / window.innerHeight;

    uniforms.uTime.value = elapsed;

    phase.timer += delta;
    if (phase.timer >= PHASE_SECONDS) {
      phase.timer = 0;
      phase.current = phase.next;
      phase.next = (phase.next + 1) % textures.length;
      uniforms.uTexA.value = textures[phase.current];
      uniforms.uTexB.value = textures[phase.next];
    }

    const blendStart = PHASE_SECONDS - CROSSFADE_SECONDS;
    uniforms.uBlend.value =
      phase.timer > blendStart ? (phase.timer - blendStart) / CROSSFADE_SECONDS : 0;

    for (let index = 0; index < INSTANCE_COUNT; index += 1) {
      const drop = drops[index];
      const z = drop.depth * DEPTH_SPREAD;
      const distance = CAMERA_Z - z;
      const halfHeight = FOV_HALF * distance;
      const halfWidth = halfHeight * aspect;
      const xBase = ((drop.column + 0.5) / COLUMN_COUNT - 0.5) * halfWidth * 2;
      const yProgress = (drop.cycleOffset + elapsed * drop.fallSpeed) % 1;
      const y = halfHeight - yProgress * halfHeight * 2;
      const size = THREE.MathUtils.lerp(0.18, 0.34, (drop.depth + 1) * 0.5);
      const wobble = Math.sin(elapsed * 0.9 + drop.charSeed) * drop.wobble;

      position.set(xBase + wobble, y, z);
      scale.set(size * 0.58, size, 1);
      transform.compose(position, rotation, scale);
      mesh.setMatrixAt(index, transform);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, INSTANCE_COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute attach="attributes-aCharSeed" args={[charSeedAttr.array, 1]} />
        <instancedBufferAttribute attach="attributes-aCharSpeed" args={[charSpeedAttr.array, 1]} />
        <instancedBufferAttribute attach="attributes-aDepth" args={[depthAttr.array, 1]} />
      </planeGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
