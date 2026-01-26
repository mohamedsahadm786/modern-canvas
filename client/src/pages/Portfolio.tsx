import { useEffect } from 'react';
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
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground neural-bg">
      <Navigation />
      
      <main>
        <Hero />
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
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 SAHAD. All rights reserved. Built with passion for data science and innovation.
          </p>
        </div>
      </footer>
    </div>
  );
}