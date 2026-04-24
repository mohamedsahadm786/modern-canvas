import { useEffect, useRef } from 'react';

// ── Domain-specific keywords that reflect your roles ──────────────────────────
const KEYWORDS = [
  // Statistics
  'μ', 'σ²', '∑x', 'H₀', 'p<.05', 'χ²', 'R²', 'MLE', 'ANOVA',
  't-test', 'Bayes', 'prior', 'variance', 'covariance', 'eigenvalue',
  'regression', 'distribution', 'inference', 'posterior',
  // Machine Learning / AI
  'loss()', 'gradient', 'backprop', 'epoch', 'dropout', 'ReLU',
  'softmax', 'attention', 'embedding', 'LSTM', 'XGBoost', 'SHAP',
  'RAG', 'LLM', 'fine-tune', 'transformer', 'tokenizer', 'vector',
  // Coding / Engineering
  'def', 'import', 'return', 'async', 'lambda', 'pipeline',
  'fit()', 'predict()', 'transform()', 'yield', 'class', '[]',
  // Finance / Business Analytics
  'ROI', 'CAGR', 'IRR', 'alpha', 'beta', 'Sharpe', 'NPV', 'P&L',
  'KPI', 'revenue', 'growth', 'portfolio', 'risk', 'delta',
  // Data Science stack
  'pandas', 'numpy', 'sklearn', 'torch', 'FAISS', 'SQL',
  'ETL', 'EDA', 'LangChain', 'Qdrant', 'FastAPI', 'Docker',
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface RainColumn {
  x: number;
  y: number;
  speed: number;
  word: string;
}

interface NNode {
  x: number;
  y: number;
  layer: number;
  r: number;
  phase: number;
}

interface Signal {
  from: NNode;
  to: NNode;
  t: number;       // 0→1 progress
  speed: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let mouseX = -9999;
    let mouseY = -9999;
    let scrollProg = 0;       // 0 (top) → 1 (bottom)

    // ── Resize ──────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initColumns();
      initNeural();
    };
    window.addEventListener('resize', resize, { passive: true });

    // ── Mouse ───────────────────────────────────────────────────
    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // ── Scroll ──────────────────────────────────────────────────
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollProg = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── CODE RAIN ───────────────────────────────────────────────
    const GAP = window.innerWidth < 640 ? 32 : 24;
    let columns: RainColumn[] = [];

    const initColumns = () => {
      const count = Math.floor(canvas.width / GAP);
      columns = Array.from({ length: count }, (_, i) => ({
        x: i * GAP,
        y: Math.random() * -canvas.height * 0.8,
        speed: 0.6 + Math.random() * 1.6,
        word: KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)],
      }));
    };

    // ── NEURAL NET ──────────────────────────────────────────────
    const LAYER_SIZES = [3, 5, 5, 3];
    let nodes: NNode[]  = [];
    let signals: Signal[] = [];

    const initNeural = () => {
      nodes = [];
      const w = canvas.width;
      const h = canvas.height;
      const layerGap = w / (LAYER_SIZES.length + 1);

      LAYER_SIZES.forEach((count, layer) => {
        const nodeGap = h / (count + 1);
        for (let i = 0; i < count; i++) {
          nodes.push({
            x: layerGap * (layer + 1) + (Math.random() - 0.5) * 30,
            y: nodeGap * (i + 1) + (Math.random() - 0.5) * 30,
            layer,
            r: 2.5 + Math.random() * 2.5,
            phase: Math.random() * Math.PI * 2,
          });
        }
      });

      signals = [];
      for (let i = 0; i < 10; i++) spawnSignal(true);
    };

    const nodesInLayer = (l: number) => nodes.filter(n => n.layer === l);

    const spawnSignal = (initialise = false) => {
      const fromLayer = Math.floor(Math.random() * (LAYER_SIZES.length - 1));
      const fromArr = nodesInLayer(fromLayer);
      const toArr   = nodesInLayer(fromLayer + 1);
      if (!fromArr.length || !toArr.length) return;
      signals.push({
        from:  fromArr[Math.floor(Math.random() * fromArr.length)],
        to:    toArr[Math.floor(Math.random() * toArr.length)],
        t:     initialise ? Math.random() : 0,
        speed: 0.003 + Math.random() * 0.005,
      });
    };

    // ── Theme detection ─────────────────────────────────────────
    const getTheme = () => {
      const cl = document.documentElement.classList;
      if (cl.contains('night')) return 'night';
      if (cl.contains('dark'))  return 'dark';
      return 'light';
    };

    // ── DRAW CODE RAIN ──────────────────────────────────────────
    const drawRain = (alpha: number) => {
      if (alpha <= 0.01) return;
      const theme   = getTheme();
      const isLight = theme === 'light';

      ctx.save();
      ctx.globalAlpha = alpha * (isLight ? 0.18 : 0.9);

      // Fade trail
      ctx.fillStyle = isLight
        ? 'rgba(240,248,255, 0.22)'
        : (theme === 'night' ? 'rgba(1,3,8, 0.13)' : 'rgba(3,6,15, 0.12)');
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `12px 'JetBrains Mono', monospace`;

      for (const col of columns) {
        const dx   = col.x - mouseX;
        const dy   = col.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nearCursor = dist < 110;

        if (nearCursor) {
          ctx.fillStyle = isLight ? '#0070a0' : (theme === 'night' ? '#00ffcc' : '#00d4ff');
          ctx.shadowColor = isLight ? '#0070a0' : '#00d4ff';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = isLight ? '#006622' : (theme === 'night' ? '#00ff41' : '#00cc35');
          ctx.shadowBlur = 0;
        }

        ctx.fillText(col.word, col.x, col.y);
        ctx.shadowBlur = 0;

        col.y += col.speed;
        if (col.y > canvas.height + 30) {
          col.y    = Math.random() * -150;
          col.word = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
          col.speed = 0.6 + Math.random() * 1.6;
        }
      }

      ctx.restore();
    };

    // ── DRAW NEURAL NET ─────────────────────────────────────────
    const drawNeural = (alpha: number, time: number) => {
      if (alpha <= 0.01) return;
      const theme   = getTheme();
      const isLight = theme === 'light';
      const cyan   = theme === 'night' ? '#00ffcc' : (isLight ? '#0070a0' : '#00d4ff');
      const green  = theme === 'night' ? '#00ff41' : (isLight ? '#006622' : '#00cc35');
      const purple = theme === 'night' ? '#bf00ff' : (isLight ? '#6d28d9' : '#7c3aed');

      ctx.save();

      // ── Edges ──
      ctx.globalAlpha = alpha * (isLight ? 0.1 : 0.2);
      for (let l = 0; l < LAYER_SIZES.length - 1; l++) {
        const from = nodesInLayer(l);
        const to   = nodesInLayer(l + 1);
        ctx.strokeStyle = isLight ? 'rgba(0,112,160,0.3)' : hexToRgba(cyan, 0.25);
        ctx.lineWidth   = 0.6;
        for (const fn of from) {
          for (const tn of to) {
            ctx.beginPath();
            ctx.moveTo(fn.x, fn.y);
            ctx.lineTo(tn.x, tn.y);
            ctx.stroke();
          }
        }
      }

      // ── Nodes ──
      ctx.globalAlpha = alpha * (isLight ? 0.2 : 0.85);
      const t = time * 0.001;
      for (const node of nodes) {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        const near = Math.sqrt(dx * dx + dy * dy) < 130;
        const pulse = node.r + Math.sin(t * 1.8 + node.phase) * 1.2;
        const r   = near ? pulse + 4 : pulse;
        const col = near ? purple : cyan;

        // Glow halo
        const hexR = parseInt(col.slice(1, 3), 16);
        const hexG = parseInt(col.slice(3, 5), 16);
        const hexB = parseInt(col.slice(5, 7), 16);
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 5);
        grad.addColorStop(0, `rgba(${hexR},${hexG},${hexB},0.35)`);
        grad.addColorStop(1, `rgba(${hexR},${hexG},${hexB},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 5, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur  = 10;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Signals (data packets travelling along edges) ──
      ctx.globalAlpha = alpha * (isLight ? 0.25 : 0.95);
      for (let i = signals.length - 1; i >= 0; i--) {
        const sig = signals[i];
        const x = sig.from.x + (sig.to.x - sig.from.x) * sig.t;
        const y = sig.from.y + (sig.to.y - sig.from.y) * sig.t;

        ctx.fillStyle  = green;
        ctx.shadowColor = green;
        ctx.shadowBlur  = 6;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        sig.t += sig.speed;
        if (sig.t >= 1) {
          signals.splice(i, 1);
          spawnSignal();
        }
      }

      ctx.restore();
    };

    // ── ANIMATION LOOP ──────────────────────────────────────────
    let lastTime = 0;

    const loop = (time: number) => {
      // Limit to ~60fps
      if (time - lastTime < 16) { rafId = requestAnimationFrame(loop); return; }
      lastTime = time;

      // Blend math — code rain fades out first third, neural fades in second third
      const rainAlpha   = clamp(1 - scrollProg * 3.5, 0, 1);
      const neuralAlpha = clamp((scrollProg - 0.22) * 3.2, 0, 1);

      // Only clear when neural is drawing (it needs a clean slate each frame)
      if (neuralAlpha > 0.01) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      drawRain(rainAlpha);
      drawNeural(neuralAlpha, time);

      rafId = requestAnimationFrame(loop);
    };

    // Initialise and start
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initColumns();
    initNeural();
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll',    onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width:  '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
