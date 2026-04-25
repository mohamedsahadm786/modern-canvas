import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrambleHeading from '@/components/ScrambleHeading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building } from 'lucide-react';
import In1 from '@assets/generated_images/Internship/4.png';
import In2 from '@assets/generated_images/Internship/3.jpg';
import In3 from '@assets/generated_images/Internship/1.jpg';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  duration: string;
  status?: string;
  achievements: string[];
  image: string;
}

const experiences: ExperienceItem[] = [
  {
    id: 'rp2',
    title: 'Data Scientist with GenAI Intern',
    company: 'RP2 Private Ltd.',
    duration: 'July 2025 - December 2025',
    status: 'Ernakulam, India',
    achievements: [
      'Engineered and deployed multi-modal AI systems integrating LLMs, speech models, and video models within containerized back-end pipelines—boosting accuracy by 25% and reducing inference latency by 30% through optimized data flows, embedding-level evaluation, automated drift monitoring, and CI/CD-driven model validation executed under Agile methodology.',
      ' Developed full-stack, real-time AI applications leveraging prompt-orchestrated LLM agents, dynamic question-generation engines, vector-database retrieval, and REST API microservices—improving feature delivery speed by 40% and user engagement by 45% by implementing adaptive response analysis, token-efficiency optimization, and platform-level observability, collaboratively built in cross-functional Agile sprints.'
    ],
    image: In1
  },
  {
    id: 'nevar',
    title: 'Data Analyst Intern',
    company: 'Nevar Systems',
    duration: 'April 2025 - June 2025',
    status: 'Puducherry, India',
    achievements: [
      'Contributed to data-driven decision-making by supporting statistical modeling and exploratory data analysis for ongoing business projects.',
      'Assisted in executing analytical tasks including data cleaning, preprocessing, and generating actionable insights using advanced statistical techniques.',
      'Applied core principles of statistical analysis and demonstrated strong knowledge in data manipulation, visualization, and interpretation to support project objectives.',
      'Collaborated with cross-functional teams to deliver technical solutions and provided valuable inputs for optimizing data pipelines and business outcomes.',
      'Maintained professionalism, accountability, and high-quality standards throughout the 2-month internship, earning recognition for commitment and performance.'
    ],
    image: In2
  },
  {
    id: 'btech',
    title: 'Artificial Intelligence Intern',
    company: 'Btech Walleh',
    duration: 'July 2024 - August 2024',
    status: 'Remote',
    achievements: [
      'Developed and deployed machine learning models in 2+ AI projects, addressing specific challenges.',
      'Designed AI-driven solutions with cross-functional teams, utilizing NLP and computer vision techniques.',
      'Processed and analyzed datasets with 100,000+ records for preprocessing, training, and performance evaluation.',
      'Enhanced proficiency in TensorFlow and PyTorch by implementing and testing 5+ models.'
    ],
    image: In3
  }
];

const slideIn = {
  hidden:  { opacity: 0, x: -60 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
};

const achievementVariant = {
  hidden:  { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.4, delay: 0.3 + i * 0.08 }
  }),
};

export default function Experience() {
  const headingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: headingScroll } = useScroll({
    target: headingRef,
    offset: ['start end', 'end start'],
  });
  const headingY = useTransform(headingScroll, [0, 1], ['-18px', '18px']);

  return (
    <section
      id="experience"
      className="py-20 lg:py-32 section-glass"
      aria-label="Experience section"
    >
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          ref={headingRef}
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ y: headingY }}
        >
          <ScrambleHeading
            as="h2"
            text="EXPERIENCE"
            className="text-4xl md:text-5xl font-bold font-mono text-foreground"
            data-testid="experience-title"
          />
          <div className="h-px w-24 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={slideIn}
            >
              <Card
                className="glass-neon border-0 overflow-hidden hover:scale-[1.01] transition-transform duration-300"
                data-testid={`experience-card-${exp.id}`}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">

                    {/* Content */}
                    <div className="flex-1 p-8">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                        <div className="mb-4 lg:mb-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3
                              className="text-xl lg:text-2xl font-bold font-mono text-primary"
                              data-testid={`experience-title-${exp.id}`}
                            >
                              {exp.title}
                            </h3>
                            {exp.status && (
                              <Badge variant="secondary" className="font-mono text-xs ml-1">
                                {exp.status}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-base font-semibold text-foreground mb-2">
                            <Building className="w-4 h-4 text-primary/70" />
                            {exp.company}
                          </div>

                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary/50" />
                            <span className="font-mono text-xs">{exp.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Achievements */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-mono font-semibold text-primary/80 mb-3 tracking-widest uppercase">
                          Key Achievements:
                        </h4>
                        <ul className="space-y-3">
                          {exp.achievements.map((achievement, achievementIndex) => (
                            <motion.li
                              key={achievementIndex}
                              custom={achievementIndex}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true }}
                              variants={achievementVariant}
                              className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                style={{ background: 'var(--neon-cyan, #00d4ff)', boxShadow: '0 0 6px var(--neon-cyan, #00d4ff)' }}
                              />
                              <span>{achievement}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Image with clip-path reveal */}
                    <motion.div
                      className="lg:w-72 lg:flex-shrink-0 overflow-hidden"
                      initial={{ clipPath: 'inset(0 100% 0 0)' }}
                      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <img
                        src={exp.image}
                        alt={`${exp.company} office environment`}
                        className="w-full h-64 lg:h-full object-cover"
                        loading="lazy"
                        data-testid={`experience-image-${exp.id}`}
                      />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
