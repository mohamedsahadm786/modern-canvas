import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle } from 'lucide-react';

export default function RecruiterCTA() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="recruiter-cta"
      className="py-20 lg:py-32 section-glass"
      aria-label="Recruiter call-to-action section"
    >
      <div className="max-w-4xl mx-auto px-6">

        {/* Headline badge */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-block">
            <div
              className="border border-primary/40 rounded-full px-8 py-4 mb-8"
              style={{ background: 'rgba(0,212,255,0.06)', boxShadow: '0 0 24px rgba(0,212,255,0.12)' }}
            >
              <h2
                className="text-xl md:text-2xl font-bold font-mono text-primary"
                data-testid="recruiter-headline"
              >
                Looking for a Data Scientist?
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Main card with border-orbit animation */}
        <motion.div
          className="border-orbit-card rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            className="p-8 md:p-12 text-center rounded-2xl"
            style={{ background: 'hsl(var(--primary) / 0.12)', backdropFilter: 'blur(12px)' }}
          >
            <div className="max-w-3xl mx-auto">

              <motion.h3
                className="text-2xl md:text-3xl font-bold font-mono mb-6 leading-tight text-foreground"
                data-testid="recruiter-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="text-primary">Ready to Transform</span> Your Data into Insights?
              </motion.h3>

              <motion.p
                className="text-base md:text-lg leading-relaxed mb-8 text-muted-foreground font-mono"
                data-testid="recruiter-description"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                I'm SAHAD, a passionate Data Scientist and AI/ML Engineer with expertise in Python, SQL, machine learning, and statistical analysis. I specialize in turning complex data into actionable business insights and building scalable AI-powered solutions.
              </motion.p>

              {/* What I Bring grid */}
              <motion.div
                className="rounded-xl p-6 mb-8 text-left"
                style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 }}
              >
                <h4 className="text-base font-mono font-semibold mb-4 text-primary tracking-widest uppercase text-sm">
                  What I Bring to Your Team:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Advanced Python & SQL expertise',
                    'Machine Learning & Deep Learning',
                    'Statistical Analysis & Modeling',
                    'Data Visualization & Storytelling',
                    'AI-powered Application Development',
                    'Business Intelligence & Analytics',
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground font-mono"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.06 }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: 'var(--neon-cyan, #00d4ff)', boxShadow: '0 0 6px var(--neon-cyan, #00d4ff)' }}
                      />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Button
                  size="lg"
                  className="px-8 py-3 text-base font-mono font-semibold group"
                  style={{ boxShadow: '0 0 20px rgba(0,212,255,0.25)' }}
                  onClick={() => window.open('https://drive.google.com/file/d/1t1SdzVxrDfx0uWxgvOW0mOI9Z8fl-3qi/view?usp=sharing', '_blank')}
                  data-testid="recruiter-download-cv"
                >
                  <Download className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                  Download CV
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-3 text-base font-mono font-semibold border-primary/40 hover:border-primary group"
                  onClick={scrollToContact}
                  data-testid="recruiter-contact"
                >
                  <MessageCircle className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                  Let's Connect
                </Button>
              </motion.div>

              <p className="text-xs font-mono text-muted-foreground/60 mt-6 tracking-widest">
                Available for full-time opportunities and consulting projects
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
