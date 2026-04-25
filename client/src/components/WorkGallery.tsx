import { useState } from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/TiltCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import W1  from '@assets/generated_images/Work/12.jpg';
import W2  from '@assets/generated_images/Work/1.png';
import W3  from '@assets/generated_images/Work/2.jpg';
import W4  from '@assets/generated_images/Work/3.jpg';
import W5  from '@assets/generated_images/Work/4.jpg';
import W6  from '@assets/generated_images/Work/5.jpg';
import W7  from '@assets/generated_images/Work/11.jpg';
import W8  from '@assets/generated_images/Work/6.jpg';
import W9  from '@assets/generated_images/Work/7.png';
import W10 from '@assets/generated_images/Work/8.jpg';
import W11 from '@assets/generated_images/Work/9.jpg';
import W12 from '@assets/generated_images/Work/10.jpg';

const images = [W1, W2, W3, W4, W5, W6, W7, W8, W9, W10, W11, W12];
const workItems = images.map((img, i) => ({
  id: i + 1,
  title: 'Go to Project Section to Explore more',
  description: 'From there, you will get an idea about what is this Project',
  image: img,
  alt: `Work project ${i + 1} – Data science and analytics`,
}));

const cardVariant = {
  hidden:  { opacity: 0, y: 50, scale: 0.93 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.60, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }
  }),
};

export default function WorkGallery() {
  const scrollToProjects = () =>
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="work-gallery"
      className="py-20 lg:py-32 section-glass"
      aria-label="Work gallery section"
    >
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-2"
            data-testid="work-gallery-title"
          >
            THINGS I'VE WORKED ON
          </h2>
          <div className="h-px w-24 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        {/* Masonry grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {workItems.map((item) => (
            <motion.div
              key={item.id}
              custom={item.id - 1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={cardVariant}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Dialog>
                <TiltCard maxTilt={8}>
                  <DialogTrigger asChild>
                    <Card
                      className="group cursor-pointer glass-neon border-0 overflow-hidden"
                      data-testid={`work-item-${item.id}`}
                    >
                      <CardContent className="p-0 relative">
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                          <ZoomIn className="w-8 h-8 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                        </div>
                        {/* Neon border on hover */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{ boxShadow: 'inset 0 0 0 2px var(--neon-cyan, #00d4ff)' }}
                        />
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                </TiltCard>
                <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0" aria-describedby="work-gallery-description">
                  <div className="relative rounded-xl overflow-hidden border border-primary/30">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-auto max-h-[80vh] object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white p-5">
                      <h3 className="font-mono text-base font-bold mb-1 text-primary">{item.title}</h3>
                      <p id="work-gallery-description" className="font-mono text-xs text-white/80">{item.description}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Button
            size="lg"
            onClick={scrollToProjects}
            className="font-mono px-8 py-3 text-base font-semibold"
            style={{ boxShadow: '0 0 16px rgba(0,212,255,0.2)' }}
            data-testid="work-gallery-cta"
          >
            Oh, you thought that was cool? Buckle up, because the real deal is about to drop! 😎
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
