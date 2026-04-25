import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import profileImage from '@assets/generated_images/About/mine.png';
import ScrambleHeading from '@/components/ScrambleHeading';

/* ── ProfilePhoto: 3-D rotating photo with zoom-out entry ── */
function ProfilePhoto() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
      {/* Outer neon glow ring — pulses */}
      <div
        className="absolute inset-0 rounded-full animate-pulse-neon pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
          boxShadow: '0 0 60px rgba(0,212,255,0.25), 0 0 120px rgba(0,212,255,0.10)',
        }}
      />

      {/* Rotating scan ring */}
      <motion.div
        className="absolute inset-4 rounded-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{
          border: '1px solid transparent',
          borderTopColor: 'var(--neon-cyan, #00d4ff)',
          borderRightColor: 'rgba(0,212,255,0.3)',
          opacity: 0.7,
        }}
      />
      <motion.div
        className="absolute inset-8 rounded-full pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{
          border: '1px solid transparent',
          borderBottomColor: 'var(--neon-cyan, #00d4ff)',
          borderLeftColor: 'rgba(0,212,255,0.2)',
          opacity: 0.5,
        }}
      />

      {/* Photo — full 3D Y-axis rotation, entry zoom-out */}
      <motion.div
        initial={{ scale: 1.4, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10"
        style={{ width: 240, height: 240 }}
      >
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformPerspective: 1000, width: '100%', height: '100%' }}
        >
          <img
            src={profileImage}
            alt="Mohamed Sahad M"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
              borderRadius: '50%',
              filter: 'drop-shadow(0 0 24px rgba(0,212,255,0.5)) drop-shadow(0 0 60px rgba(0,212,255,0.2)) grayscale(0.3) contrast(1.1)',
              border: '2px solid rgba(0,212,255,0.4)',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
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
  const headingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: headingScroll } = useScroll({
    target: headingRef,
    offset: ['start end', 'end start'],
  });
  const headingY = useTransform(headingScroll, [0, 1], ['-18px', '18px']);

  return (
    <section
      id="about"
      className="py-20 lg:py-32 section-glass relative overflow-hidden"
      aria-label="About section"
    >
      <MorphRing />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section heading — parallax + scramble */}
        <motion.div
          ref={headingRef}
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          style={{ y: headingY }}
        >
          <ScrambleHeading
            as="h2"
            text="SAHAD in a Snapshot"
            className="text-4xl md:text-5xl font-bold font-mono mb-4"
            data-testid="about-title"
          >
            <span className="text-primary">SAHAD</span>{' '}
            <span className="text-foreground">in a Snapshot</span>
          </ScrambleHeading>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mt-4" />
        </motion.div>

        {/* Two-column: DataGlobe left, bio right */}
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Profile photo — zoom-out entry + continuous 3D Y rotation */}
          <motion.div
            className="w-full lg:w-5/12 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ProfilePhoto />
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
