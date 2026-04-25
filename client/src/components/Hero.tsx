import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useCinematicTypewriter } from '@/hooks/useCinematicTypewriter';
import ScrambleHeading from '@/components/ScrambleHeading';
import MorphVisual from '@/components/MorphVisual';

/* ─────────────────────────────────────────────────────────────────────────
   MorphField: cycles 1 → 2 → 4 → 8 → 1 copies every PHASE_MS ms.
   • 1 / 2 / 4 copies → full size, free random-walk motion
   • 8 copies        → reduced size (0.28×), circular orbit motion
───────────────────────────────────────────────────────────────────────── */
const PHASE_SEQUENCE = [1, 2, 4, 8] as const;
const PHASE_MS       = 4000; // 4 seconds per phase

// Scale: full size for 1/2/4, shrink only at 8
const SCALE: Record<number, number> = { 1: 1.0, 2: 1.0, 4: 1.0, 8: 0.28 };

// Free-float range (only used for count < 8)
const FLOAT: Record<number, number> = { 1: 15, 2: 115, 4: 155, 8: 0 };

// Circular orbit radius for 8 copies
const ORBIT_RADIUS = 165;
const ORBIT_SPEED  = 0.28; // radians per second

/* ── One copy: free-float OR circular orbit, plus Y-axis rotation ──── */
function FloatingMorph({ id, count }: { id: number; count: number }) {
  const scale      = SCALE[count];
  const isCircular = count === 8;

  const xMv = useMotionValue(0);
  const yMv = useMotionValue(0);

  useEffect(() => {
    let alive  = true;
    let rafId  = 0;

    if (isCircular) {
      // ── Circular orbit via rAF ────────────────────────────────────────
      const startAngle = (id / 8) * Math.PI * 2; // evenly space 8 copies
      let t0: number | null = null;

      const loop = (ts: number) => {
        if (!alive) return;
        if (t0 === null) t0 = ts;
        const elapsed = (ts - t0) / 1000;
        const angle   = startAngle + elapsed * ORBIT_SPEED;
        xMv.set(Math.cos(angle) * ORBIT_RADIUS);
        yMv.set(Math.sin(angle) * ORBIT_RADIUS);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);

    } else {
      // ── Random-walk ───────────────────────────────────────────────────
      const range = FLOAT[count];

      const walk = async (mv: ReturnType<typeof useMotionValue<number>>, delay: number) => {
        await new Promise<void>(r => setTimeout(r, delay));
        while (alive) {
          const target   = (Math.random() - 0.5) * range * 2;
          const duration = 2.2 + Math.random() * 2.5;
          await animate(mv, target, { duration, ease: 'easeInOut' });
        }
      };

      walk(xMv, id * 220);
      walk(yMv, id * 170 + 120);
    }

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
    };
  }, [id, count, isCircular, xMv, yMv]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale, opacity: count === 1 ? 1 : 0.82 }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.4 } }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      style={{
        position  : 'absolute',
        left      : '50%',
        top       : '50%',
        marginLeft: -160,  // half of MorphVisual's 320 px CSS width
        marginTop : -160,
        x         : xMv,
        y         : yMv,
      }}
    >
      {/* Continuous full 3-D Y-axis rotation */}
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        style={{ transformPerspective: 1200 }}
      >
        <MorphVisual />
      </motion.div>
    </motion.div>
  );
}

/* ── Phase manager ───────────────────────────────────────────────────── */
function MorphField() {
  const [phaseIdx, setPhaseIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setPhaseIdx(p => (p + 1) % PHASE_SEQUENCE.length),
      PHASE_MS,
    );
    return () => clearInterval(t);
  }, []);

  const count = PHASE_SEQUENCE[phaseIdx];
  const ids   = Array.from({ length: count }, (_, i) => i);

  return (
    // Overflow hidden so flying copies don't bleed into the left text column
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence>
        {ids.map(id => (
          <FloatingMorph key={id} id={id} count={count} />
        ))}
      </AnimatePresence>
    </div>
  );
}

const TITLE    = 'MOHAMED SAHAD M';
const SUBTITLE = 'DATA SCIENTIST  ·  AI/ML ENGINEER  ·  STATISTICIAN';
const TAGLINE  = 'Transforming raw data into meaningful insights';

export default function Hero() {
  const { lines, cursor } = useCinematicTypewriter([
    { text: SUBTITLE, speed: 38, pauseAfter: 520 },
    { text: TAGLINE,  speed: 26, pauseAfter: 0   },
  ], 1000);

  const [subtitleText, taglineText] = lines;
  const imageRef = useRef<HTMLDivElement>(null);

  // Fade out the MorphVisual as user scrolls down
  useEffect(() => {
    const container = imageRef.current;
    if (!container) return;
    const onScroll = () => {
      const prog = Math.min(window.scrollY / window.innerHeight, 1);
      container.style.opacity = String(Math.max(0, 1 - prog * 2.2));
      container.style.transform = `translateY(${prog * 30}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative h-screen overflow-hidden flex items-center"
      aria-label="Hero section"
    >
      {/* ── Left content column ─────────────────────────────── */}
      <div className="relative z-10 w-full lg:w-1/2 px-8 md:px-14 lg:px-16">

        {/* Scramble headline */}
        <ScrambleHeading
          as="h1"
          text={TITLE}
          className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono mb-6 leading-tight text-white"
          delay={200}
          data-testid="hero-title"
        />

        {/* Cyan divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.8, ease: 'easeOut' }}
          className="h-px w-48 bg-primary mb-5"
          style={{ boxShadow: '0 0 12px var(--neon-cyan, #00d4ff)', transformOrigin: 'left' }}
        />

        {/* Cinematic typewriter — subtitle */}
        <p
          className="font-mono text-sm md:text-base text-primary mb-2 tracking-widest"
          data-testid="hero-subtitle"
        >
          {subtitleText}
          {cursor === 0 && (
            <span className="animate-type-cursor text-primary ml-0.5">▋</span>
          )}
        </p>

        {/* Cinematic typewriter — tagline */}
        <p className="font-mono text-xs text-white/50 mb-10 tracking-wide">
          {taglineText}
          {cursor >= 1 && (
            <span className="animate-type-cursor text-primary">▋</span>
          )}
        </p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1,  y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            size="lg"
            className="font-mono border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-background backdrop-blur-sm px-8 py-3 text-base font-semibold transition-all duration-300"
            style={{ boxShadow: '0 0 16px rgba(0,212,255,0.25)' }}
            onClick={() => window.open('https://drive.google.com/file/d/1t1SdzVxrDfx0uWxgvOW0mOI9Z8fl-3qi/view?usp=sharing', '_blank')}
            data-testid="hero-cv-button"
          >
            &gt; Explore CV
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="font-mono border border-white/30 text-white/80 hover:border-primary hover:text-primary bg-transparent px-8 py-3 text-base font-semibold transition-all duration-300"
            onClick={() => scrollToSection('projects')}
            data-testid="hero-projects-button"
          >
            &gt; See Projects
          </Button>
        </motion.div>
      </div>

      {/* ── Right: MorphField (1→2→4→8→1 floating copies) ── */}
      <div
        ref={imageRef}
        className="hidden lg:block absolute right-0 top-0 w-1/2 h-full"
        style={{ transition: 'opacity 0.1s, transform 0.1s' }}
      >
        {/* Left-edge fade so it blends into the text column */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to right, hsl(var(--background)) 0%, transparent 18%, transparent 82%, hsl(var(--background)) 100%)',
          }}
        />

        {/* Field fills the whole right panel — copies float anywhere inside */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.4 }}
          className="w-full h-full"
        >
          <MorphField />
        </motion.div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 text-primary/60"
      >
        <span className="font-mono text-xs tracking-widest">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
