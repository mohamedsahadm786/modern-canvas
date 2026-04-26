/**
 * MorphVisual — auto-cycling canvas that morphs through 5 data-science states:
 *   1. Rotating Globe (spinning sphere of nodes)
 *   2. Data Science (scatter plot + regression line + stats)
 *   3. Data Analytics (bar chart + KPI cards + pie)
 *   4. AI / ML Engineering (neural network with activating nodes)
 *   5. Software Engineering (terminal code scrolling + git graph)
 *
 * Each state lasts 7 seconds. Transitions: 1.5s particle scatter morph.
 * Responds to dark/light/night theme via documentElement class.
 */
import { useEffect, useRef } from 'react';

/* ─── colour helpers ──────────────────────────────────────────────────── */
function getThemeColors() {
  const isNight = document.documentElement.classList.contains('night');
  const isDark  = document.documentElement.classList.contains('dark');
  return {
    cyan:    isNight ? '#00ff88' : isDark ? '#00d4ff' : '#0088cc',
    purple:  isNight ? '#bf00ff' : '#7c3aed',
    green:   isNight ? '#00ff41' : '#22c55e',
    orange:  '#f97316',
    yellow:  '#eab308',
    bg:      isNight ? '#030308' : isDark ? '#0a0a0f' : '#ffffff',
    fg:      isNight ? '#00ff88' : isDark ? '#00d4ff' : '#0088cc',
    text:    isNight ? 'rgba(0,255,136,0.7)' : isDark ? 'rgba(0,212,255,0.7)' : 'rgba(0,136,204,0.8)',
  };
}

/* ─── seeded pseudo-random (stable across re-renders) ────────────────── */
function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

/* ─── State 1: Rotating Globe ─────────────────────────────────────────── */
function drawGlobe(ctx: CanvasRenderingContext2D, S: number, t: number) {
  const CX = S / 2, CY = S / 2;
  const R = S * 0.36;
  const N = 28;
  const C = getThemeColors();
  const angle = t * 0.4;
  const rand = seededRand(42);

  const nodes = Array.from({ length: N }, (_, i) => {
    const phi   = Math.acos(1 - (2 * (i + 0.5)) / N);
    const theta = 2 * Math.PI * i * 1.6180339887;
    return { phi, theta, phase: rand() * Math.PI * 2 };
  });

  // Wireframe latitude lines
  ctx.strokeStyle = `${C.cyan}22`;
  ctx.lineWidth = 0.6;
  for (let lat = -60; lat <= 60; lat += 30) {
    const y  = R * Math.sin(lat * Math.PI / 180) * 0.85;
    const rL = Math.sqrt(Math.max(0, R * R * 0.72 - y * y));
    if (rL > 0) {
      ctx.beginPath();
      ctx.ellipse(CX, CY + y, rL, rL * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  for (let i = 0; i < 5; i++) {
    const a = (angle * 0.8 + i * Math.PI / 2.5) % Math.PI;
    ctx.beginPath();
    ctx.ellipse(CX, CY, Math.abs(Math.cos(a)) * R * 0.85, R * 0.85, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Project nodes
  const proj = nodes.map(n => {
    const cosA = Math.cos(angle), sinA = Math.sin(angle);
    const x0 = R * Math.sin(n.phi) * Math.cos(n.theta);
    const y0 = R * Math.cos(n.phi);
    const z0 = R * Math.sin(n.phi) * Math.sin(n.theta);
    const xR = x0 * cosA + z0 * sinA;
    const zR = -x0 * sinA + z0 * cosA;
    const cosB = Math.cos(0.25), sinB = Math.sin(0.25);
    const yR = y0 * cosB - zR * sinB;
    const zF = y0 * sinB + zR * cosB;
    const fov = R * 2.8;
    const scale = fov / (fov + zF);
    return { sx: CX + xR * scale, sy: CY + yR * scale, z: zF, scale };
  });

  // Edges
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const d = Math.hypot(proj[i].sx - proj[j].sx, proj[i].sy - proj[j].sy);
      if (d < 85) {
        const alpha = (1 - d / 85) * 0.4 * Math.min(proj[i].scale, proj[j].scale);
        ctx.strokeStyle = `${C.cyan}${Math.floor(alpha * 255).toString(16).padStart(2,'0')}`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(proj[i].sx, proj[i].sy);
        ctx.lineTo(proj[j].sx, proj[j].sy);
        ctx.stroke();
      }
    }
  }

  // Nodes
  proj.sort((a, b) => a.z - b.z).forEach((p, idx) => {
    const pulse = Math.sin(t * 2.5 + nodes[idx % N].phase) * 0.3 + 0.7;
    const depth = (p.z + R) / (2 * R);
    const r = 3.5 * p.scale * pulse;

    const grd = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 5);
    grd.addColorStop(0, `${C.cyan}${Math.floor(depth * 0.5 * 255).toString(16).padStart(2,'0')}`);
    grd.addColorStop(1, `${C.cyan}00`);
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(p.sx, p.sy, r * 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.cyan;
    ctx.globalAlpha = Math.max(0.15, depth * 0.9);
    ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  });

  // Label
  ctx.fillStyle = C.cyan;
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.7;
  ctx.fillText('DATA GLOBE', CX, S - 18);
  ctx.globalAlpha = 1;
}

/* ─── State 2: Data Science (scatter + regression) ───────────────────── */
function drawDataScience(ctx: CanvasRenderingContext2D, S: number, t: number) {
  const C = getThemeColors();
  const pad = 40, W = S - pad * 2, H = S - pad * 2 - 20;
  const rand = seededRand(7);

  // Axes
  ctx.strokeStyle = C.cyan + '66';
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(pad, pad); ctx.lineTo(pad, pad + H); ctx.lineTo(pad + W, pad + H); ctx.stroke();

  // Axis labels
  ctx.fillStyle = C.text; ctx.font = '10px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
  ctx.fillText('Feature X', pad + W / 2, S - 6);
  ctx.save(); ctx.translate(12, pad + H / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText('Target Y', 0, 0); ctx.restore();

  // Generate scatter data
  const points = Array.from({ length: 35 }, (_, i) => {
    const x = rand() * W + pad;
    const y = (pad + H) - (rand() * H * 0.7 + H * 0.15);
    return { x, y };
  });

  // Animate points appearing
  const visible = Math.min(points.length, Math.floor(t * 5));

  // Scatter dots
  for (let i = 0; i < visible; i++) {
    const { x, y } = points[i];
    const grd = ctx.createRadialGradient(x, y, 0, x, y, 6);
    grd.addColorStop(0, C.cyan + 'ee');
    grd.addColorStop(1, C.cyan + '00');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.cyan;
    ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
  }

  // Regression line (animated draw)
  const progress = Math.min(1, (t - 3) * 0.8);
  if (progress > 0) {
    const x1 = pad, y1 = pad + H * 0.7;
    const x2 = pad + W * progress;
    const y2 = (pad + H * 0.7) - (W * progress) * 0.5;
    ctx.strokeStyle = C.orange;
    ctx.lineWidth = 2; ctx.setLineDash([6, 3]);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.setLineDash([]);

    // R² label
    if (progress > 0.8) {
      ctx.fillStyle = C.orange;
      ctx.font = 'bold 11px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
      ctx.globalAlpha = (progress - 0.8) / 0.2;
      ctx.fillText('R² = 0.847', pad + W * 0.6, pad + H * 0.2);
      ctx.fillText('p < 0.001', pad + W * 0.6, pad + H * 0.2 + 16);
      ctx.globalAlpha = 1;
    }
  }

  // Floating stats
  const stats = ['μ = 4.2', 'σ = 1.8', 'n = 350'];
  stats.forEach((s, i) => {
    const pulse = Math.sin(t * 1.5 + i * 1.2) * 0.15 + 0.85;
    ctx.fillStyle = C.purple;
    ctx.font = '10px "JetBrains Mono", monospace'; ctx.textAlign = 'right';
    ctx.globalAlpha = pulse;
    ctx.fillText(s, pad + W, pad + 14 + i * 14);
    ctx.globalAlpha = 1;
  });

  ctx.fillStyle = C.cyan; ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center'; ctx.globalAlpha = 0.7;
  ctx.fillText('DATA SCIENCE', S / 2, S - 6);
  ctx.globalAlpha = 1;
}

/* ─── State 3: Data Analytics (bar chart + KPIs + pie) ───────────────── */
function drawAnalytics(ctx: CanvasRenderingContext2D, S: number, t: number) {
  const C = getThemeColors();
  const pad = 40;

  // Bar chart (left 60%)
  const barW = S * 0.55, barH = S * 0.55, barX = pad, barY = pad;
  const vals = [0.65, 0.82, 0.48, 0.91, 0.73, 0.57];
  const labels = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];
  const barWidth = barW / vals.length - 8;
  const progress = Math.min(1, t * 0.4);
  const colors = [C.cyan, C.purple, C.green, C.orange, C.cyan, C.purple];

  vals.forEach((v, i) => {
    const h = barH * v * progress;
    const x = barX + i * (barWidth + 8) + 4;
    const y = barY + barH - h;
    const grd = ctx.createLinearGradient(x, y, x, y + h);
    grd.addColorStop(0, colors[i]);
    grd.addColorStop(1, colors[i] + '44');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, h, 3);
    ctx.fill();
    ctx.fillStyle = C.text;
    ctx.font = '9px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, barY + barH + 12);
  });

  // Axis
  ctx.strokeStyle = C.cyan + '44'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(barX, barY); ctx.lineTo(barX, barY + barH); ctx.lineTo(barX + barW, barY + barH); ctx.stroke();

  // KPI boxes (right side)
  const kpis = [
    { label: 'Accuracy', val: '94.7%', color: C.green },
    { label: 'Precision', val: '91.2%', color: C.cyan },
    { label: 'Recall', val: '88.5%', color: C.purple },
  ];
  kpis.forEach((k, i) => {
    const kx = S * 0.62, ky = pad + i * 56;
    ctx.strokeStyle = k.color + '66'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(kx, ky, S * 0.33, 44, 4); ctx.stroke();
    ctx.fillStyle = k.color + '11'; ctx.fill();
    ctx.fillStyle = k.color;
    ctx.font = 'bold 14px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
    const pulse = Math.sin(t * 2 + i) * 0.1 + 0.9;
    ctx.globalAlpha = pulse;
    ctx.fillText(k.val, kx + S * 0.165, ky + 20);
    ctx.globalAlpha = 0.6;
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(k.label, kx + S * 0.165, ky + 34);
    ctx.globalAlpha = 1;
  });

  // Mini pie (bottom right)
  const px = S * 0.79, py = S * 0.75, pr = 28;
  const slices = [0.42, 0.31, 0.27];
  const sliceColors = [C.cyan, C.purple, C.green];
  let startAngle = -Math.PI / 2;
  slices.forEach((s, i) => {
    const endAngle = startAngle + s * Math.PI * 2 * Math.min(1, t * 0.35);
    ctx.beginPath(); ctx.moveTo(px, py);
    ctx.arc(px, py, pr, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = sliceColors[i] + 'cc'; ctx.fill();
    ctx.strokeStyle = C.bg; ctx.lineWidth = 1; ctx.stroke();
    startAngle = endAngle;
  });

  ctx.fillStyle = C.cyan; ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center'; ctx.globalAlpha = 0.7;
  ctx.fillText('DATA ANALYTICS', S / 2, S - 6);
  ctx.globalAlpha = 1;
}

/* ─── State 4: AI / ML Engineering (neural network) ──────────────────── */
function drawNeuralNetwork(ctx: CanvasRenderingContext2D, S: number, t: number) {
  const C = getThemeColors();
  const layers = [3, 5, 6, 5, 3];
  const layerX = layers.map((_, i) => (S * 0.12) + i * (S * 0.19));
  const layerColors = [C.cyan, C.purple, C.green, C.purple, C.orange];

  // Build node positions
  const nodes: { x: number; y: number; layer: number }[][] = layers.map((count, li) => {
    return Array.from({ length: count }, (_, ni) => ({
      x: layerX[li],
      y: S / 2 + (ni - (count - 1) / 2) * (S / (count + 1)),
      layer: li,
    }));
  });

  // Edges (animated activation wave)
  for (let l = 0; l < layers.length - 1; l++) {
    const wave = (t * 1.2 - l * 0.5) % 2.5;
    nodes[l].forEach(src => {
      nodes[l + 1].forEach(dst => {
        const activating = wave > 0 && wave < 1;
        const alpha = activating ? 0.4 + Math.sin(wave * Math.PI) * 0.35 : 0.12;
        ctx.strokeStyle = layerColors[l];
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(src.x, src.y); ctx.lineTo(dst.x, dst.y); ctx.stroke();
      });
    });
  }
  ctx.globalAlpha = 1;

  // Nodes
  nodes.forEach((layer, li) => {
    layer.forEach((n, ni) => {
      const wave = (t * 1.2 - li * 0.5) % 2.5;
      const active = wave > 0 && wave < 1;
      const glow = active ? 0.5 + Math.sin(wave * Math.PI) * 0.5 : 0.15;
      const r = li === 2 ? 10 : 8;

      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.5);
      grd.addColorStop(0, layerColors[li]);
      grd.addColorStop(1, layerColors[li] + '00');
      ctx.fillStyle = grd; ctx.globalAlpha = glow;
      ctx.beginPath(); ctx.arc(n.x, n.y, r * 2.5, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = layerColors[li]; ctx.globalAlpha = 0.2 + glow * 0.8;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = layerColors[li]; ctx.globalAlpha = 0.6 + glow * 0.4; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
    });
  });

  // Layer labels
  const layerLabels = ['Input', 'Dense', 'LSTM', 'Dense', 'Output'];
  layerLabels.forEach((lbl, i) => {
    ctx.fillStyle = layerColors[i]; ctx.globalAlpha = 0.6;
    ctx.font = '9px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
    ctx.fillText(lbl, layerX[i], S - 22);
  });
  ctx.globalAlpha = 1;

  // Floating metrics
  const metrics = ['loss: 0.021', 'acc: 98.7%', 'epoch: ' + (Math.floor(t * 3) % 50 + 1)];
  metrics.forEach((m, i) => {
    ctx.fillStyle = C.green; ctx.globalAlpha = 0.7;
    ctx.font = '10px "JetBrains Mono", monospace'; ctx.textAlign = 'right';
    ctx.fillText(m, S - 10, 20 + i * 15);
  });
  ctx.globalAlpha = 1;

  ctx.fillStyle = C.cyan; ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center'; ctx.globalAlpha = 0.7;
  ctx.fillText('AI / ML ENGINEERING', S / 2, S - 6);
  ctx.globalAlpha = 1;
}

/* ─── State 5: Software Engineering (terminal + git graph) ───────────── */
function drawSoftwareEngineering(ctx: CanvasRenderingContext2D, S: number, t: number) {
  const C = getThemeColors();

  // Terminal window
  const tx = 16, ty = 16, tw = S - 32, th = S * 0.55;
  ctx.strokeStyle = C.cyan + '44'; ctx.lineWidth = 1;
  ctx.fillStyle = '#00000066';
  ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 6); ctx.fill(); ctx.stroke();

  // Title bar
  ctx.fillStyle = C.cyan + '22';
  ctx.beginPath(); ctx.roundRect(tx, ty, tw, 22, [6, 6, 0, 0]); ctx.fill();
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(tx + 14 + i * 18, ty + 11, 5, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = C.text; ctx.font = '9px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
  ctx.fillText('terminal — sahad@portfolio:~$', tx + tw / 2, ty + 15);

  // Terminal lines (scrolling)
  const lines = [
    { text: '$ python train.py --epochs 100', color: C.cyan },
    { text: 'Loading dataset... ████████ 100%', color: C.text },
    { text: 'Epoch 47/100 | loss: 0.021 | acc: 98.7%', color: C.green },
    { text: '$ git commit -m "feat: add RAG pipeline"', color: C.cyan },
    { text: '[main 3f7a2c1] feat: add RAG pipeline', color: C.text },
    { text: '$ docker build -t model-api .', color: C.cyan },
    { text: 'Successfully built a9f3e1d7', color: C.green },
    { text: '$ kubectl apply -f deploy.yaml', color: C.cyan },
    { text: 'deployment.apps/model-api created ✓', color: C.green },
  ];
  const visibleLines = Math.min(lines.length, Math.floor(t * 1.5));
  lines.slice(0, visibleLines).forEach((l, i) => {
    ctx.fillStyle = l.color; ctx.globalAlpha = 0.85;
    ctx.font = '10px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
    ctx.fillText(l.text, tx + 10, ty + 36 + i * 16);
  });
  // Cursor blink
  if (visibleLines < lines.length && Math.sin(t * 4) > 0) {
    const lastY = ty + 36 + visibleLines * 16;
    ctx.fillStyle = C.cyan; ctx.globalAlpha = 0.9;
    ctx.fillRect(tx + 10, lastY - 10, 7, 11);
  }
  ctx.globalAlpha = 1;

  // Git graph (bottom)
  const gx = 16, gy = ty + th + 12, gh = S - ty - th - 30;
  const commits = [
    { msg: 'main: deploy v2.0', x: 0.85, branch: 0, color: C.cyan },
    { msg: 'feat: LangChain', x: 0.65, branch: 0, color: C.cyan },
    { msg: 'fix: FAISS index', x: 0.70, branch: 1, color: C.purple },
    { msg: 'feat: RAG pipeline', x: 0.50, branch: 0, color: C.cyan },
    { msg: 'refactor: SQL', x: 0.55, branch: 2, color: C.green },
    { msg: 'init', x: 0.20, branch: 0, color: C.cyan },
  ];

  const trackY = [gy + gh * 0.3, gy + gh * 0.6, gy + gh * 0.85];
  const visibleCommits = Math.min(commits.length, Math.floor(t * 1.2));

  // Draw branch lines
  ctx.lineWidth = 1.5;
  for (let i = 0; i < visibleCommits - 1; i++) {
    const a = commits[i], b = commits[i + 1];
    ctx.strokeStyle = a.color + '88';
    ctx.beginPath();
    ctx.moveTo(gx + a.x * (S - 32), trackY[a.branch]);
    ctx.lineTo(gx + b.x * (S - 32), trackY[b.branch]);
    ctx.stroke();
  }

  // Draw commit dots + labels
  commits.slice(0, visibleCommits).forEach(c => {
    const cx2 = gx + c.x * (S - 32), cy2 = trackY[c.branch];
    const grd = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 8);
    grd.addColorStop(0, c.color); grd.addColorStop(1, c.color + '00');
    ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx2, cy2, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c.color; ctx.beginPath(); ctx.arc(cx2, cy2, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.text; ctx.font = '8px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
    ctx.globalAlpha = 0.7;
    ctx.fillText(c.msg, cx2, cy2 - 11);
    ctx.globalAlpha = 1;
  });

  ctx.fillStyle = C.cyan; ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center'; ctx.globalAlpha = 0.7;
  ctx.fillText('SOFTWARE ENGINEERING', S / 2, S - 6);
  ctx.globalAlpha = 1;
}

/* ─── Transition particle scatter ─────────────────────────────────────── */
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

/* ─── Main component ──────────────────────────────────────────────────── */
export default function MorphVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const S = 360;
    canvas.width = S; canvas.height = S;

    const STATE_DURATION = 7;    // seconds per state
    const TRANS_DURATION = 1.5;  // seconds for transition
    const TOTAL_STATES = 5;
    const drawFns = [drawNeuralNetwork, drawSoftwareEngineering, drawDataScience, drawAnalytics, drawGlobe];
    const stateLabels = ['AI / ML', 'SOFTWARE ENG', 'DATA SCIENCE', 'ANALYTICS', 'GLOBE'];

    let startTime = performance.now() / 1000;
    let particles: Particle[] = [];
    let raf: number;

    const spawnParticles = (fromState: number) => {
      const C = getThemeColors();
      const colors = [C.cyan, C.purple, C.green, C.orange];
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * S,
        y: Math.random() * S,
        vx: (Math.random() - 0.5) * 180,
        vy: (Math.random() - 0.5) * 180,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    };

    let lastState = -1;

    const render = () => {
      const now = performance.now() / 1000;
      const elapsed = now - startTime;

      const totalCycle = STATE_DURATION + TRANS_DURATION;
      const cyclePos = elapsed % (totalCycle * TOTAL_STATES);
      const stateIdx = Math.floor(cyclePos / totalCycle) % TOTAL_STATES;
      const posInCycle = cyclePos % totalCycle;
      const isTransitioning = posInCycle > STATE_DURATION;
      const transProgress = isTransitioning ? (posInCycle - STATE_DURATION) / TRANS_DURATION : 0;
      const stateTime = isTransitioning ? STATE_DURATION : posInCycle;

      // Detect state change → spawn particles
      if (stateIdx !== lastState) {
        if (lastState >= 0) spawnParticles(lastState);
        lastState = stateIdx;
      }

      // Clear
      ctx.clearRect(0, 0, S, S);

      // Draw current state
      ctx.globalAlpha = isTransitioning ? Math.max(0, 1 - transProgress * 2) : 1;
      drawFns[stateIdx](ctx, S, stateTime);
      ctx.globalAlpha = 1;

      // Draw next state fading in during transition
      if (isTransitioning && transProgress > 0.4) {
        const nextState = (stateIdx + 1) % TOTAL_STATES;
        ctx.globalAlpha = (transProgress - 0.4) / 0.6;
        drawFns[nextState](ctx, S, 0);
        ctx.globalAlpha = 1;
      }

      // Animate particles during transition
      if (particles.length > 0) {
        const dt = 0.016;
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 0.92;
          p.vy *= 0.92;
          p.life -= dt / TRANS_DURATION;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      // State indicator dots
      const dotSpacing = 20;
      const dotY = S - 6;
      const totalW = (TOTAL_STATES - 1) * dotSpacing;
      const startX = (S - totalW) / 2;
      for (let i = 0; i < TOTAL_STATES; i++) {
        const C = getThemeColors();
        const active = i === stateIdx;
        ctx.fillStyle = active ? C.cyan : C.cyan + '40';
        ctx.beginPath();
        ctx.arc(startX + i * dotSpacing, dotY, active ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fill();
        if (active) {
          ctx.strokeStyle = C.cyan + '44'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(startX + i * dotSpacing, dotY, 7, 0, Math.PI * 2); ctx.stroke();
        }
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block mx-auto"
      style={{
        width: 320, height: 320,
        filter: 'drop-shadow(0 0 32px rgba(0,212,255,0.45)) drop-shadow(0 0 80px rgba(0,212,255,0.18))',
      }}
    />
  );
}
