import { useEffect, useRef } from 'react';

// ── Domain keywords falling as code rain ──────────────────────────────────────
const KEYWORDS = [
  // Stats
  'μ', 'σ²', '∑x', 'H₀', 'χ²', 'R²', 'MLE', 'ANOVA', 'p<.05',
  'Bayes', 'prior', 'posterior', 'eigenvalue', 'variance',
  // ML/AI
  'loss()', 'grad', 'epoch', 'ReLU', 'softmax', 'LSTM', 'SHAP',
  'RAG', 'LLM', 'fine-tune', 'attention', 'embedding', 'XGBoost',
  'vector', 'backprop', 'dropout', 'tokenizer', 'transformer',
  // Code
  'def', 'import', 'return', 'async', 'fit()', 'predict()',
  'yield', 'lambda', 'pipeline', '[]', 'class', 'torch',
  // Finance / Analytics
  'ROI', 'CAGR', 'Sharpe', 'alpha', 'beta', 'NPV', 'KPI',
  'P&L', 'risk', 'delta', 'growth', 'revenue',
  // Data stack
  'pandas', 'sklearn', 'numpy', 'SQL', 'ETL', 'EDA',
  'FAISS', 'FastAPI', 'Docker', 'AWS', 'LangChain', 'Qdrant',
];

// Short famous quotes split into rain-sized fragments
const QUOTE_FRAGS = [
  'data > oil', 'insights', 'predict', 'n→∞', 'fit.transform',
  'df.head()', 'corr()', 'p_value', '∇loss', 'ROC·AUC',
  'sigmoid', 'y=Wx+b', 'argmax', 'recall', 'F1score',
  'df.corr()', 'cluster', 'outlier', 'signal', 'noise',
];

const ALL_WORDS = [...KEYWORDS, ...QUOTE_FRAGS];

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

// Neural-net layer config — 5 layers for richer graph
const LAYER_SIZES = [3, 5, 6, 5, 3];

interface Column {
  x: number; y: number; speed: number; word: string;
  scatterVx: number; scatterVy: number;  // velocity during burst
}

interface NNode {
  x: number; y: number; layer: number; r: number; phase: number; label: string;
}

interface Signal {
  from: NNode; to: NNode; t: number; speed: number;
}

const NODE_LABELS = ['σ', 'μ', 'loss', 'grad', 'ReLU', 'LSTM', 'fit',
                     'pred', 'val', 'RAG', 'SQL', 'AUC', 'ROC', 'p<.05',
                     'W', 'b', 'ε', 'η'];

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let mouseX = -9999, mouseY = -9999;
    let scrollProg = 0;

    // ── Resize ───────────────────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initColumns();
      initNeural();
    };
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollProg = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    }, { passive: true });

    // ── Code Rain ────────────────────────────────────────────────────────────
    const GAP = window.innerWidth < 640 ? 34 : 26;
    let columns: Column[] = [];

    const initColumns = () => {
      const count = Math.floor(canvas.width / GAP);
      const cx = canvas.width / 2, cy = canvas.height / 2;
      columns = Array.from({ length: count }, (_, i) => {
        const x = i * GAP;
        const dx = x - cx, dy = canvas.height * 0.5 - cy;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        return {
          x,
          y: Math.random() * -canvas.height,
          speed: 0.8 + Math.random() * 1.8,
          word: ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)],
          scatterVx: (dx / len) * (4 + Math.random() * 6),
          scatterVy: (dy / len) * (4 + Math.random() * 6),
        };
      });
    };

    // ── Neural Net ───────────────────────────────────────────────────────────
    let nodes: NNode[] = [];
    let signals: Signal[] = [];
    let labelIdx = 0;

    const initNeural = () => {
      nodes = [];
      const w = canvas.width, h = canvas.height;
      const layerGap = w / (LAYER_SIZES.length + 1);
      LAYER_SIZES.forEach((count, layer) => {
        const nodeGap = h / (count + 1);
        for (let i = 0; i < count; i++) {
          nodes.push({
            x: layerGap * (layer + 1) + (Math.random() - 0.5) * 28,
            y: nodeGap * (i + 1) + (Math.random() - 0.5) * 28,
            layer,
            r: 3 + Math.random() * 3,
            phase: Math.random() * Math.PI * 2,
            label: NODE_LABELS[(labelIdx++) % NODE_LABELS.length],
          });
        }
      });
      signals = [];
      for (let i = 0; i < 18; i++) spawnSignal(true);
    };

    const layerNodes = (l: number) => nodes.filter(n => n.layer === l);

    const spawnSignal = (init = false) => {
      const fl = Math.floor(Math.random() * (LAYER_SIZES.length - 1));
      const fa = layerNodes(fl), ta = layerNodes(fl + 1);
      if (!fa.length || !ta.length) return;
      signals.push({
        from:  fa[Math.floor(Math.random() * fa.length)],
        to:    ta[Math.floor(Math.random() * ta.length)],
        t:     init ? Math.random() : 0,
        speed: 0.004 + Math.random() * 0.006,
      });
    };

    // ── Theme helpers ─────────────────────────────────────────────────────────
    const getTheme = () => {
      const cl = document.documentElement.classList;
      if (cl.contains('night')) return 'night';
      if (cl.contains('dark'))  return 'dark';
      return 'light';
    };

    const themeColors = () => {
      const t = getTheme();
      return {
        rain:   t === 'night' ? '#00ff41'  : t === 'dark' ? '#00cc35' : '#007733',
        cyan:   t === 'night' ? '#00ffcc'  : t === 'dark' ? '#00d4ff' : '#0070a0',
        purple: t === 'night' ? '#bf00ff'  : t === 'dark' ? '#7c3aed' : '#5b21b6',
        trail:  t === 'light' ? 'rgba(240,248,255,0.20)' : t === 'night' ? 'rgba(1,2,6,0.13)' : 'rgba(3,6,15,0.12)',
        rainAlphaScale: t === 'light' ? 0.22 : 1,
      };
    };

    // ── Draw: Code Rain ───────────────────────────────────────────────────────
    const drawRain = (alpha: number, burstAmt: number) => {
      if (alpha < 0.01) return;
      const c = themeColors();
      ctx.save();
      ctx.globalAlpha = alpha * c.rainAlphaScale;

      // Fade trail
      ctx.fillStyle = c.trail;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `12px 'JetBrains Mono', monospace`;

      for (const col of columns) {
        const dist = Math.hypot(col.x - mouseX, col.y - mouseY);
        const nearCursor = dist < 120;

        ctx.fillStyle   = nearCursor ? c.cyan : c.rain;
        ctx.shadowColor = nearCursor ? c.cyan : 'transparent';
        ctx.shadowBlur  = nearCursor ? 8 : 0;
        ctx.fillText(col.word, col.x, col.y);
        ctx.shadowBlur = 0;

        // Normal downward fall + scatter during burst
        col.y += col.speed + burstAmt * 6;
        if (burstAmt > 0.05) {
          col.x += col.scatterVx * burstAmt * 0.4;
        }

        if (col.y > canvas.height + 40 || col.x < -60 || col.x > canvas.width + 60) {
          col.x     = (columns.indexOf(col)) * GAP;
          col.y     = Math.random() * -150;
          col.speed = 0.8 + Math.random() * 1.8;
          col.word  = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
        }
      }

      ctx.restore();
    };

    // ── Draw: Burst Rings (the visible transformation event) ─────────────────
    const drawBurst = (burstAmt: number) => {
      if (burstAmt < 0.02) return;
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const maxR = Math.hypot(cx, cy);
      const c = themeColors();

      ctx.save();

      // 4 expanding rings with staggered phases
      for (let i = 0; i < 4; i++) {
        const phase = ((burstAmt * 1.6) + i * 0.22) % 1;
        const r     = phase * maxR * 1.1;
        const ringAlpha = Math.sin(phase * Math.PI) * burstAmt * 0.8;
        if (ringAlpha < 0.01) continue;

        const grad = ctx.createRadialGradient(cx, cy, r * 0.92, cx, cy, r);
        grad.addColorStop(0, `rgba(0,212,255,0)`);
        grad.addColorStop(0.5, `rgba(0,212,255,${(ringAlpha * 0.9).toFixed(3)})`);
        grad.addColorStop(1, `rgba(0,212,255,0)`);
        ctx.strokeStyle = c.cyan;
        ctx.lineWidth   = 2 + burstAmt * 3;
        ctx.globalAlpha = ringAlpha;
        ctx.shadowColor = c.cyan;
        ctx.shadowBlur  = 18;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Central flash at burst peak
      if (burstAmt > 0.5) {
        const flashAlpha = (burstAmt - 0.5) * 2 * 0.25;
        const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
        flashGrad.addColorStop(0, `rgba(0,212,255,${flashAlpha.toFixed(3)})`);
        flashGrad.addColorStop(1, 'rgba(0,212,255,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle   = flashGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 200, 0, Math.PI * 2);
        ctx.fill();
      }

      // "TRANSFORMING" label at peak
      if (burstAmt > 0.55 && burstAmt < 0.95) {
        ctx.globalAlpha = (burstAmt - 0.55) * 2.5 * 0.7;
        ctx.fillStyle   = c.cyan;
        ctx.shadowColor = c.cyan;
        ctx.shadowBlur  = 20;
        ctx.font        = `bold 14px 'JetBrains Mono', monospace`;
        ctx.textAlign   = 'center';
        ctx.fillText('[ DATA → INSIGHT ]', cx, cy);
        ctx.textAlign   = 'start';
        ctx.shadowBlur  = 0;
      }

      ctx.restore();
    };

    // ── Draw: Neural Net ──────────────────────────────────────────────────────
    const drawNeural = (alpha: number, time: number) => {
      if (alpha < 0.01) return;
      const c = themeColors();
      const t = time * 0.001;

      ctx.save();

      // Edges
      ctx.globalAlpha = alpha * 0.28;
      for (let l = 0; l < LAYER_SIZES.length - 1; l++) {
        const from = layerNodes(l), to = layerNodes(l + 1);
        ctx.lineWidth = 0.7;
        for (const fn of from) {
          for (const tn of to) {
            // Colour edge by layer
            const hue = l * 45;
            ctx.strokeStyle = `hsla(${hue + 180},100%,60%,0.4)`;
            ctx.beginPath();
            ctx.moveTo(fn.x, fn.y);
            ctx.lineTo(tn.x, tn.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      ctx.globalAlpha = alpha;
      for (const node of nodes) {
        const dx   = node.x - mouseX, dy = node.y - mouseY;
        const near = Math.sqrt(dx * dx + dy * dy) < 140;
        const pulse = node.r + Math.sin(t * 2 + node.phase) * 1.5;
        const r     = near ? pulse + 5 : pulse;
        const col   = near ? c.purple : c.cyan;

        // Halo
        const [hexR, hexG, hexB] = [col.slice(1,3), col.slice(3,5), col.slice(5,7)].map(h => parseInt(h, 16));
        const halo = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 5);
        halo.addColorStop(0, `rgba(${hexR},${hexG},${hexB},0.4)`);
        halo.addColorStop(1, `rgba(${hexR},${hexG},${hexB},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle   = col;
        ctx.shadowColor = col;
        ctx.shadowBlur  = 12;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        if (alpha > 0.5) {
          ctx.globalAlpha = alpha * 0.75;
          ctx.fillStyle   = col;
          ctx.font        = '9px JetBrains Mono, monospace';
          ctx.textAlign   = 'center';
          ctx.fillText(node.label, node.x, node.y - r - 4);
          ctx.textAlign   = 'start';
          ctx.globalAlpha = alpha;
        }
      }

      // Signal packets
      ctx.globalAlpha = alpha;
      for (let i = signals.length - 1; i >= 0; i--) {
        const sig = signals[i];
        const sx = sig.from.x + (sig.to.x - sig.from.x) * sig.t;
        const sy = sig.from.y + (sig.to.y - sig.from.y) * sig.t;
        ctx.fillStyle   = c.rain;
        ctx.shadowColor = c.rain;
        ctx.shadowBlur  = 8;
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        sig.t += sig.speed;
        if (sig.t >= 1) { signals.splice(i, 1); spawnSignal(); }
      }

      ctx.restore();
    };

    // ── Main loop ─────────────────────────────────────────────────────────────
    let lastTime = 0;

    const loop = (time: number) => {
      if (time - lastTime < 16) { rafId = requestAnimationFrame(loop); return; }
      lastTime = time;

      // Scroll-progress to alpha mapping
      const rainAlpha   = clamp(1 - scrollProg * 3.5, 0, 1);
      const neuralAlpha = clamp((scrollProg - 0.22) * 3.2, 0, 1);

      // Burst: peaks at scroll ~50%, bell-curve shaped
      const burstCenter = 0.42;
      const burstWidth  = 0.28;
      const burstRaw    = Math.max(0, 1 - Math.abs(scrollProg - burstCenter) / burstWidth);
      const burstAmt    = burstRaw * burstRaw; // ease in

      if (neuralAlpha > 0.01) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      drawRain(rainAlpha, burstAmt);
      drawBurst(burstAmt);
      drawNeural(neuralAlpha, time);

      rafId = requestAnimationFrame(loop);
    };

    // ── Init ─────────────────────────────────────────────────────────────────
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initColumns();
    initNeural();
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }}
    />
  );
}
