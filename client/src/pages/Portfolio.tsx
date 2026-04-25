import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Education from '@/components/Education';
import WorkGallery from '@/components/WorkGallery';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Certifications from '@/components/Certifications';
import Skills from '@/components/Skills';
import RecruiterCTA from '@/components/RecruiterCTA';
import Contact from '@/components/Contact';

export default function Portfolio() {
  return (
    <div className="min-h-screen text-foreground">
      <Navigation />

      <main>
        {/* Hero — no glass, canvas fully visible */}
        <Hero />

        {/* All other sections sit on section-glass so canvas shows through */}
        <About />
        <Education />
        <WorkGallery />
        <Projects />
        <Experience />
        <Certifications />
        <Skills />
        <RecruiterCTA />
        <Contact />
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="section-glass border-t border-primary/20 py-8"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="h-px w-32 mx-auto mb-6 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <p className="font-mono text-xs text-muted-foreground tracking-widest">
            © 2024 SAHAD · Built with passion for data science and innovation
          </p>
          <p className="font-mono text-xs text-primary/40 mt-1 tracking-widest">
            &gt;_ all rights reserved
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
