import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── DataGlobe: rotating 3-D sphere of neural-network nodes ── */
function DataGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const S = 360;
    canvas.width  = S;
    canvas.height = S;

    const N   = 32;
    const R   = 130;
    let angle = 0;
    let time  = 0;

    // Distribute nodes evenly on sphere (Fibonacci / golden angle)
    const nodes = Array.from({ length: N }, (_, i) => {
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / N);
      const theta = 2 * Math.PI * i * 1.6180339887;
      return { phi, theta, phase: Math.random() * Math.PI * 2 };
    });

    // Data-science labels that float near large nodes
    const labels = ['σ', 'μ', 'loss', 'RAG', 'LSTM', 'fit()', 'grad', 'SQL', 'AI', 'AUC', 'ROC', 'p<.05'];
    const nodeLabels = nodes.map((_, i) => (i % 4 === 0 ? labels[Math.floor(i / 4) % labels.length] : null));

    // Signal packets travelling between pairs
    const pairs: Array<[number, number]> = [];
    for (let i = 0; i < N; i++) {
      const j = (i + 7) % N;
      pairs.push([i, j]);
    }
    const signals = pairs.slice(0, 12).map(([a, b]) => ({ from: a, to: b, t: Math.random() }));

    let raf: number;

    const render = () => {
      time  += 0.015;
      angle += 0.006;
      ctx.clearRect(0, 0, S, S);

      const CX = S / 2, CY = S / 2;
      const isNight = document.documentElement.classList.contains('night');
      const cyanStr = isNight ? '0,255,65' : '0,212,255';
      const purpleStr = isNight ? '191,0,255' : '124,58,237';

      // Project all nodes
      const proj = nodes.map(n => {
        const cosA = Math.cos(angle), sinA = Math.sin(angle);
        const x0 = R * Math.sin(n.phi) * Math.cos(n.theta);
        const y0 = R * Math.cos(n.phi);
        const z0 = R * Math.sin(n.phi) * Math.sin(n.theta);
        const xR =  x0 * cosA + z0 * sinA;
        const zR = -x0 * sinA + z0 * cosA;
        // slight tilt around X
        const cosB = Math.cos(0.25), sinB = Math.sin(0.25);
        const yR = y0 * cosB - zR * sinB;
        const zF = y0 * sinB + zR * cosB;
        const fov   = R * 2.8;
        const scale = fov / (fov + zF);
        return { sx: CX + xR * scale, sy: CY + yR * scale, z: zF, scale };
      });

      // Wireframe latitude/longitude lines
      ctx.strokeStyle = `rgba(${cyanStr},0.05)`;
      ctx.lineWidth   = 0.5;
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

      // Edges
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const d = Math.hypot(proj[i].sx - proj[j].sx, proj[i].sy - proj[j].sy);
          if (d < 90) {
            const alpha = (1 - d / 90) * 0.45 * Math.min(proj[i].scale, proj[j].scale);
            ctx.strokeStyle = `rgba(${cyanStr},${alpha.toFixed(3)})`;
            ctx.lineWidth   = 0.7;
            ctx.beginPath();
            ctx.moveTo(proj[i].sx, proj[i].sy);
            ctx.lineTo(proj[j].sx, proj[j].sy);
            ctx.stroke();
          }
        }
      }

      // Signal packets
      signals.forEach(sig => {
        sig.t = (sig.t + 0.008) % 1;
        const a = proj[sig.from], b = proj[sig.to];
        const sx = a.sx + (b.sx - a.sx) * sig.t;
        const sy = a.sy + (b.sy - a.sy) * sig.t;
        const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6);
        grd.addColorStop(0, `rgba(${cyanStr},0.9)`);
        grd.addColorStop(1, `rgba(${cyanStr},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Nodes (painter sorted front→back)
      const sorted = proj.map((p, i) => ({ ...p, i })).sort((a, b) => a.z - b.z);
      sorted.forEach(p => {
        const pulse  = Math.sin(time * 2.2 + nodes[p.i].phase) * 0.3 + 0.7;
        const depth  = ((p.z + R) / (2 * R));
        const r      = 3.2 * p.scale * pulse;
        const alpha  = Math.max(0.15, depth * 0.9);

        // Outer glow
        const grd = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 5);
        grd.addColorStop(0, `rgba(${cyanStr},${(alpha * 0.55 * pulse).toFixed(3)})`);
        grd.addColorStop(1, `rgba(${cyanStr},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r * 5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(${cyanStr},${Math.min(1, alpha).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fill();

        // Label on large front-facing nodes
        if (nodeLabels[p.i] && depth > 0.65 && p.scale > 0.8) {
          ctx.fillStyle = `rgba(${cyanStr},${(depth * 0.8).toFixed(2)})`;
          ctx.font      = `${Math.round(9 * p.scale)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(nodeLabels[p.i]!, p.sx, p.sy - r * 2 - 3);
        }
      });

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

/* ── Morph ring — clip-path polygon that morphs on scroll ── */
function MorphRing() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const clip = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [
    'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',        // diamond
    'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)', // hexagon
    'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)', // heptagon
    'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',  // pentagon
  ]);

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{ clipPath: clip }}
    >
      <div
        className="w-full h-full opacity-5"
        style={{ background: 'radial-gradient(circle, var(--neon-cyan, #00d4ff), transparent 70%)' }}
      />
    </motion.div>
  );
}

/* ── Fade-up variant ── */
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
};

export default function About() {
  return (
    <section
      id="about"
      className="py-20 lg:py-32 section-glass relative overflow-hidden"
      aria-label="About section"
    >
      <MorphRing />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section heading */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <h2
            className="glitch-text text-4xl md:text-5xl font-bold font-mono mb-4"
            data-text="SAHAD in a Snapshot"
            data-testid="about-title"
          >
            <span className="text-primary">SAHAD</span>{' '}
            <span className="text-foreground">in a Snapshot</span>
          </h2>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mt-4" />
        </motion.div>

        {/* Two-column: DataGlobe left, bio right */}
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* DataGlobe — 3-D rotating neural sphere (NOT the same profile photo) */}
          <motion.div
            className="w-full lg:w-5/12 flex justify-center"
            initial={{ opacity: 0, scale: 0.8, rotateY: -25 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ perspective: 800 }}
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full animate-pulse-neon"
                style={{ margin: '-24px', opacity: 0.4 }}
              />
              {/* Corner brackets */}
              {['top-0 left-0','top-0 right-0','bottom-0 left-0','bottom-0 right-0'].map((pos, i) => (
                <div
                  key={i}
                  className={`absolute ${pos} w-6 h-6 z-20`}
                  style={{
                    borderTop:    i < 2  ? '2px solid var(--neon-cyan,#00d4ff)' : 'none',
                    borderBottom: i >= 2 ? '2px solid var(--neon-cyan,#00d4ff)' : 'none',
                    borderLeft:   i % 2 === 0 ? '2px solid var(--neon-cyan,#00d4ff)' : 'none',
                    borderRight:  i % 2 === 1 ? '2px solid var(--neon-cyan,#00d4ff)' : 'none',
                  }}
                />
              ))}
              <DataGlobe />
              {/* Label below globe */}
              <p className="text-center font-mono text-xs text-primary/60 tracking-widest mt-3">
                DATA·AI·STATISTICS·ML
              </p>
            </div>
          </motion.div>

          {/* Bio blocks */}
          <div className="w-full lg:w-7/12 space-y-10">
            {[
              {
                quote: '"Data is the new oil, but refining it into insights is where the real power lies."',
                text:  "I am a Statistician, Data Scientist, Analyst, and AI/ML Engineer with a deep passion for transforming raw data into meaningful stories. With a Master's in Statistics from Pondicherry University and a Bachelor's from Hindu College, University of Delhi, I have built a strong foundation in statistical modeling, machine learning, and artificial intelligence. My expertise lies in leveraging Python and SQL to extract insights, optimize decision-making, and build scalable data-driven solutions.",
              },
              {
                quote: '"The goal is to turn data into information, and information into insight."',
                text:  'Throughout my journey, I have developed and deployed AI-driven applications, worked on deep learning models for sentiment analysis, and optimized large-scale databases to enhance business efficiency. My proficiency in data visualization and storytelling allows me to communicate complex insights effectively, ensuring that data not only speaks but also drives impact.',
              },
              {
                quote: '"Without data, you\'re just another person with an opinion."',
                text:  'Whether it\'s predictive modeling, NLP, or statistical data analysis, I believe in harnessing the power of data to solve real-world problems. With an analytical mindset and a creative approach, I strive to bridge the gap between numbers and narratives, making data-driven decisions more accessible and actionable.',
              },
            ].map((block, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="space-y-4"
              >
                <blockquote className="font-mono text-base font-semibold text-primary border-l-4 border-primary pl-5 italic">
                  {block.quote}
                </blockquote>
                <p className="text-base leading-relaxed text-muted-foreground pl-5">
                  {block.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
