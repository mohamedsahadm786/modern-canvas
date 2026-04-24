import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

import E1 from '@assets/generated_images/Education/1.jpg';
import E2 from '@assets/generated_images/Education/2.jpg';
import E3 from '@assets/generated_images/Education/3.jpg';
import E4 from '@assets/generated_images/Education/4.jpg';

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  grade: string;
  gradeType: string;
  description: string;
  link: string;
  side: 'left' | 'right';
  image: string;
}

const educationData: EducationItem[] = [
  {
    id: 'msc',
    degree: 'MSc in STATISTICS',
    institution: 'Pondicherry University, Pondicherry, India',
    duration: 'September 2023 – June 2025',
    grade: '8.34/10',
    gradeType: 'CGPA',
    description: "A place where I deepened my passion for data science and statistical analysis. Pursuing my Master's in Statistics here has provided me with a strong theoretical foundation and hands-on experience in advanced data analytics, artificial intelligence, and deep learning.",
    link: 'https://en.wikipedia.org/wiki/Pondicherry_University',
    side: 'left',
    image: E1,
  },
  {
    id: 'bsc',
    degree: 'BSc (H) in STATISTICS',
    institution: 'Hindu College, University of Delhi, India',
    duration: 'July 2023',
    grade: '8.49/10',
    gradeType: 'CGPA',
    description: "One of India's most prestigious institutions, Hindu College played a crucial role in building my analytical mindset. My undergraduate journey in Statistics here was filled with rigorous academic training, problem-solving, and a deep dive into the fundamentals of data science.",
    link: 'https://en.wikipedia.org/wiki/Hindu_College,_Delhi',
    side: 'right',
    image: E2,
  },
  {
    id: 'higher',
    degree: 'Higher Secondary Education',
    institution: 'GHSS Irumbuzhi, Kerala, India',
    duration: 'July 2020',
    grade: '95.6%',
    gradeType: 'Percentage',
    description: '',
    link: 'https://www.justdial.com/Malappuram/Government-Higher-Secondary-School-Irumbuzhi-Malappuram-Ho/9999PX483-X483-110709122333-S6I2_BZDET',
    side: 'left',
    image: E3,
  },
  {
    id: 'high',
    degree: 'High School Education',
    institution: 'MMET HS Melmuri, Kerala, India',
    duration: 'June 2018',
    grade: '10 A+/10 A+',
    gradeType: 'Number of A+',
    description: '',
    link: 'https://www.justdial.com/Malappuram/M-M-E-T-High-School-Malappuram-Ho/9999PX483-X483-110709103712-K9Q9_BZDET',
    side: 'right',
    image: E4,
  },
];

const slideVariant = (side: 'left' | 'right') => ({
  hidden:  { opacity: 0, x: side === 'left' ? -80 : 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
});

export default function Education() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <section
      id="education"
      className="py-20 lg:py-32 section-glass"
      aria-label="Education section"
    >
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold font-mono text-foreground"
            data-testid="education-title"
          >
            <span className="text-primary">&gt;_</span> Education
          </h2>
          <div className="h-px w-24 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated centre line */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-px hidden lg:block"
            style={{ background: 'linear-gradient(to bottom, var(--neon-cyan, #00d4ff), var(--neon-purple, #7c3aed))', top: 0 }}
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          />

          <div className="space-y-14">
            {educationData.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col lg:flex-row items-center gap-8 relative ${item.side === 'right' ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Content card */}
                <motion.div
                  className="w-full lg:w-5/12 relative z-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={slideVariant(item.side)}
                >
                  <Card className="glass-neon border-0 hover:scale-[1.02] transition-transform duration-300">
                    <CardContent className="p-6">
                      <h3
                        className="text-xl font-bold font-mono text-primary mb-1"
                        data-testid={`education-degree-${item.id}`}
                      >
                        {item.degree}
                      </h3>
                      <p className="text-sm font-semibold text-foreground mb-1">{item.institution}</p>
                      <p className="text-xs font-mono text-muted-foreground mb-4">{item.duration}</p>

                      <div className="flex mb-4">
                        <Badge variant="secondary" className="font-mono text-xs px-3 py-1">
                          <span className="font-bold">{item.grade}</span>
                          <span className="ml-1 opacity-70">{item.gradeType}</span>
                        </Badge>
                      </div>

                      {item.description && (
                        <div className="mb-4">
                          <p className={`text-sm text-muted-foreground leading-relaxed ${expandedItem === item.id ? '' : 'line-clamp-3'}`}>
                            {item.description}
                          </p>
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                            className="mt-1 p-0 h-auto text-primary hover:text-primary/80 font-mono text-xs"
                            data-testid={`education-expand-${item.id}`}
                          >
                            {expandedItem === item.id
                              ? <>Show Less <ChevronUp className="w-3 h-3 ml-1" /></>
                              : <>Show More <ChevronDown className="w-3 h-3 ml-1" /></>}
                          </Button>
                        </div>
                      )}

                      <Button
                        onClick={() => window.open(item.link, '_blank')}
                        className="w-full font-mono text-xs"
                        data-testid={`education-details-${item.id}`}
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Institution Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Timeline node */}
                <div className="hidden lg:flex w-2/12 justify-center relative z-10">
                  <motion.div
                    className="w-4 h-4 rounded-full border-4 border-background"
                    style={{ background: 'var(--neon-cyan, #00d4ff)', boxShadow: '0 0 12px var(--neon-cyan, #00d4ff)' }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
                  />
                </div>

                {/* Image card */}
                <motion.div
                  className="w-full lg:w-5/12 relative z-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={slideVariant(item.side === 'left' ? 'right' : 'left')}
                >
                  <Card className="glass-neon border-0 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                    <CardContent className="p-0">
                      <img
                        src={item.image}
                        alt={`${item.institution} campus`}
                        className="w-full h-52 object-cover"
                        loading="lazy"
                        data-testid={`education-image-${item.id}`}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
