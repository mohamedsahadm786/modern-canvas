import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useCinematicTypewriter } from '@/hooks/useCinematicTypewriter';
import ScrambleHeading from '@/components/ScrambleHeading';

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

  // Fade out the right panel as user scrolls down
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

      {/* ── Right: Hero video ────────────────────────────────── */}
      <div
        ref={imageRef}
        className="hidden lg:block absolute right-0 top-0 w-1/2 h-full"
        style={{ transition: 'opacity 0.1s, transform 0.1s' }}
      >
        {/* Left-edge fade — blends video into the text column */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to right, hsl(var(--background)) 0%, transparent 22%, transparent 80%, hsl(var(--background)) 100%)',
          }}
        />

        {/* Top/bottom edge fades */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 12%, transparent 88%, hsl(var(--background)) 100%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.6 }}
          className="w-full h-full"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              mixBlendMode: 'screen',
            }}
          >
            <source src="/assets/hero-video.mp4" type="video/mp4" />
          </video>
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
