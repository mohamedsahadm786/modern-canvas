import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import python from '@assets/generated_images/Skills/1.png';
import sql from '@assets/generated_images/Skills/3.png';
import ecxel from '@assets/generated_images/Skills/5.png';
import powerBI from '@assets/generated_images/Skills/2.png';
import AI from '@assets/generated_images/Skills/7.jpg';
import DL from '@assets/generated_images/Skills/8.png';
import spss from '@assets/generated_images/Skills/10.png';
import git from '@assets/generated_images/Skills/git.jpg';
import r from '@assets/generated_images/Skills/9.jpg';
import JS from '@assets/generated_images/Skills/java.webp';
import english from '@assets/generated_images/Skills/11.png';
import malayalam from '@assets/generated_images/Skills/12.png';
import hindi from '@assets/generated_images/Skills/1.webp';
import communication from '@assets/generated_images/Skills/13.png';
import data_story from '@assets/generated_images/Skills/4.png';
import leadership from '@assets/generated_images/Skills/14.png';
import teamwork from '@assets/generated_images/Skills/1.jpg';

import {
  Database,
  BarChart3,
  Code2,
  MessageSquare,
  TrendingUp,
  GitBranch,
  Languages,
  FileSpreadsheet,
  Bot,
  Network,
  Calculator,
  BookOpen,
  Crown,
  HandHeart
} from 'lucide-react';

interface Skill {
  name: string;
  proficiency: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  image?: string;
}

interface SkillCategory {
  title: string;
  description: string;
  skills: Skill[];
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Tools and Technologies',
    description: 'Technical tools and platforms I use for data science and development',
    color: 'bg-blue-50 border-blue-200',
    skills: [
      { name: 'Python', proficiency: 90, icon: Code2, image: python, description: 'Advanced Python programming for data science, ML, and automation' },
      { name: 'SQL & Databases', proficiency: 85, icon: Database, image: sql, description: 'PostgreSQL, MySQL, database optimization, and complex query writing' },
      { name: 'Advanced MS Excel', proficiency: 88, icon: FileSpreadsheet, image: ecxel, description: 'Advanced formulas, pivot tables, macros, and data analysis tools' },
      { name: 'Power BI', proficiency: 85, icon: BarChart3, image: powerBI, description: 'Business intelligence dashboards and interactive data visualizations' },
      { name: 'Artificial Intelligence', proficiency: 87, icon: Bot, image: AI, description: 'AI model development, NLP, computer vision, and machine learning' },
      { name: 'Deep Learning', proficiency: 85, icon: Network, image: DL, description: 'Neural networks, TensorFlow, PyTorch for complex pattern recognition' },
      { name: 'Amazon Web Services (AWS)', proficiency: 80, icon: Calculator, image: spss, description: 'Cloud computing for scalable infrastructure, ML deployment, and data-driven applications' },
      { name: 'Git & Version Control', proficiency: 95, icon: GitBranch, image: git, description: 'Git workflows, GitHub collaboration, and code version management' }
    ]
  },
  {
    title: 'Programming Languages',
    description: 'Programming languages and frameworks in my toolkit',
    color: 'bg-green-50 border-green-200',
    skills: [
      { name: 'Python', proficiency: 90, icon: Code2, image: python, description: 'Primary language for data science, AI/ML, and backend development' },
      { name: 'R', proficiency: 75, icon: TrendingUp, image: r, description: 'Statistical computing, advanced analytics, and research projects' },
      { name: 'SQL', proficiency: 85, icon: Database, image: sql, description: 'Database querying, optimization, and data manipulation' },
      { name: 'JavaScript', proficiency: 70, icon: Code2, image: JS, description: 'Frontend development and data visualization libraries' }
    ]
  },
  {
    title: 'Languages',
    description: 'Languages I speak fluently for global communication',
    color: 'bg-emerald-50 border-emerald-200',
    skills: [
      { name: 'English', proficiency: 95, icon: Languages, image: english, description: 'Native-level proficiency in academic and professional settings' },
      { name: 'Malayalam', proficiency: 100, icon: Languages, image: malayalam, description: 'Native language with complete fluency' },
      { name: 'Hindi', proficiency: 90, icon: Languages, image: hindi, description: 'Fluent in conversation and business communication' }
    ]
  },
  {
    title: 'Interpersonal Skills',
    description: 'Soft skills that enable effective collaboration and leadership',
    color: 'bg-purple-50 border-purple-200',
    skills: [
      { name: 'Communication', proficiency: 92, icon: MessageSquare, image: communication, description: 'Clear presentation of complex data insights to stakeholders' },
      { name: 'Data Storytelling', proficiency: 90, icon: BookOpen, image: data_story, description: 'Transforming complex data into compelling narratives and insights' },
      { name: 'Leadership', proficiency: 85, icon: Crown, image: leadership, description: 'Leading data science projects and mentoring team members' },
      { name: 'Teamwork', proficiency: 95, icon: HandHeart, image: teamwork, description: 'Collaborative approach to cross-functional team projects and initiatives' }
    ]
  }
];

const categoryVariant = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const cardVariant = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
};

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-20 lg:py-32 section-glass"
      aria-label="Skills section"
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
            className="text-4xl md:text-5xl font-bold font-mono text-foreground"
            data-testid="skills-title"
          >
            <span className="text-primary">&gt;_</span> SKILLS
          </h2>
          <div className="h-px w-24 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        <div className="space-y-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={categoryVariant}
              className="space-y-8"
            >
              <div className="text-left">
                <h3
                  className="text-2xl md:text-3xl font-bold font-mono text-foreground mb-3"
                  data-testid={`skills-category-${categoryIndex}`}
                >
                  <span className="text-primary/60 text-lg mr-2">▸</span>
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-base max-w-3xl font-mono text-sm">
                  {category.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.skills.map((skill, skillIndex) => {
                  const IconComponent = skill.icon;
                  const showProficiency =
                    category.title !== 'Languages' &&
                    category.title !== 'Interpersonal Skills';

                  return (
                    <motion.div
                      key={skillIndex}
                      custom={skillIndex}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={cardVariant}
                    >
                      <Card
                        className="group glass-neon border-0 hover:scale-[1.04] transition-all duration-300 h-full"
                        data-testid={`skill-card-${categoryIndex}-${skillIndex}`}
                      >
                        <CardContent className="p-6 text-center">
                          {/* Icon / Image — spins 360° on hover */}
                          <div className="mb-4 flex justify-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:rotate-[360deg] group-hover:shadow-[0_0_16px_var(--neon-cyan,#00d4ff)]"
                              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}
                            >
                              {skill.image ? (
                                <img
                                  src={skill.image}
                                  alt={`${skill.name} logo`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <IconComponent className="w-8 h-8 text-primary" />
                              )}
                            </div>
                          </div>

                          <h4 className="text-base font-bold font-mono text-foreground mb-2">
                            {skill.name}
                          </h4>

                          <p className="text-xs text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                            {skill.description}
                          </p>

                          {showProficiency && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-muted-foreground">
                                  Proficiency
                                </span>
                                <Badge variant="secondary" className="text-xs font-mono">
                                  {skill.proficiency}/100
                                </Badge>
                              </div>
                              {/* Animated progress bar */}
                              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(0,212,255,0.1)' }}>
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ background: 'linear-gradient(90deg, var(--neon-cyan, #00d4ff), var(--neon-purple, #7c3aed))' }}
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${skill.proficiency}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1.2, delay: 0.2 + skillIndex * 0.1, ease: 'easeOut' }}
                                  data-testid={`skill-progress-${categoryIndex}-${skillIndex}`}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
