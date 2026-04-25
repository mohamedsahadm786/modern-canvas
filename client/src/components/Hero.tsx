import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useTypewriter } from '@/hooks/useTypewriter';
import MorphVisual from '@/components/MorphVisual';

const TITLE    = 'MOHAMED SAHAD M';
const SUBTITLE = 'DATA SCIENTIST  ·  AI/ML ENGINEER  ·  STATISTICIAN';
const TAGLINE  = 'Transforming raw data into meaningful insights';

export default function Hero() {
  const subtitle  = useTypewriter(SUBTITLE, 38, 1000);
  const tagline   = useTypewriter(TAGLINE,  28, 3200);
  const imageRef  = useRef<HTMLDivElement>(null);

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

  // Letter-by-letter title animation
  const titleChars = TITLE.split('');

  return (
    <section
      id="hero"
      className="relative h-screen overflow-hidden flex items-center"
      aria-label="Hero section"
    >
      {/* ── Left content column ─────────────────────────────── */}
      <div className="relative z-10 w-full lg:w-1/2 px-8 md:px-14 lg:px-16">

        {/* Glitch headline */}
        <h1
          className="glitch-text text-4xl md:text-5xl lg:text-6xl font-bold font-mono mb-6 leading-tight text-white"
          data-text={TITLE}
          data-testid="hero-title"
        >
          {titleChars.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1,  y: 0 }}
              transition={{ delay: 0.2 + i * 0.04, duration: 0.4, ease: 'easeOut' }}
              style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>

        {/* Cyan divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.8, ease: 'easeOut' }}
          className="h-px w-48 bg-primary mb-5"
          style={{ boxShadow: '0 0 12px var(--neon-cyan, #00d4ff)', transformOrigin: 'left' }}
        />

        {/* Typewriter subtitle */}
        <p
          className="font-mono text-sm md:text-base text-primary mb-2 tracking-widest terminal-cursor"
          data-testid="hero-subtitle"
        >
          {subtitle}
        </p>

        {/* Tagline */}
        <p className="font-mono text-xs text-white/50 mb-10 tracking-wide">
          {tagline}
          {tagline.length < TAGLINE.length && tagline.length > 0 && (
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

      {/* ── Right: 3D morphing visualisation ──────────────── */}
      <div
        ref={imageRef}
        className="hidden lg:flex absolute right-0 top-0 w-1/2 h-full items-center justify-center overflow-hidden"
        style={{ transition: 'opacity 0.1s, transform 0.1s' }}
      >
        {/* Left-edge fade so it blends into the text column */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to right, hsl(var(--background)) 0%, transparent 20%, transparent 80%, hsl(var(--background)) 100%)',
          }}
        />

        {/* The auto-cycling 5-state canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: 'easeOut' }}
          className="relative z-20"
        >
          <MorphVisual />
        </motion.div>

        {/* Corner brackets */}
        {(['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'] as const).map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-7 h-7 z-20`}
            style={{
              borderTop:    i < 2  ? '2px solid var(--neon-cyan, #00d4ff)' : 'none',
              borderBottom: i >= 2 ? '2px solid var(--neon-cyan, #00d4ff)' : 'none',
              borderLeft:   i % 2 === 0 ? '2px solid var(--neon-cyan, #00d4ff)' : 'none',
              borderRight:  i % 2 === 1 ? '2px solid var(--neon-cyan, #00d4ff)' : 'none',
              opacity: 0.6,
            }}
          />
        ))}
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
