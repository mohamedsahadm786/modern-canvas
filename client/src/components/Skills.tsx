// path: src/components/Skills.tsx

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Import images
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
  image?: string; // optional replacement image for the icon
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
      {
        name: 'Python',
        proficiency: 90,
        icon: Code2,
        image: python,
        description: 'Advanced Python programming for data science, ML, and automation'
      },
      {
        name: 'SQL & Databases',
        proficiency: 85,
        icon: Database,
        image: sql,
        description: 'PostgreSQL, MySQL, database optimization, and complex query writing'
      },
      {
        name: 'Advanced MS Excel',
        proficiency: 88,
        icon: FileSpreadsheet,
        image: ecxel,
        description: 'Advanced formulas, pivot tables, macros, and data analysis tools'
      },
      {
        name: 'Power BI',
        proficiency: 85,
        icon: BarChart3,
        image: powerBI,
        description: 'Business intelligence dashboards and interactive data visualizations'
      },
      {
        name: 'Artificial Intelligence',
        proficiency: 87,
        icon: Bot,
        image: AI,
        description: 'AI model development, NLP, computer vision, and machine learning'
      },
      {
        name: 'Deep Learning',
        proficiency: 85,
        icon: Network,
        image: DL,
        description: 'Neural networks, TensorFlow, PyTorch for complex pattern recognition'
      },
      {
        name: 'SPSS',
        proficiency: 80,
        icon: Calculator,
        image: spss,
        description: 'Statistical analysis software for advanced data analytics'
      },
      {
        name: 'Git & Version Control',
        proficiency: 82,
        icon: GitBranch,
        image: git,
        description: 'Git workflows, GitHub collaboration, and code version management'
      }
    ]
  },
  {
    title: 'Programming Languages',
    description: 'Programming languages and frameworks in my toolkit',
    color: 'bg-green-50 border-green-200',
    skills: [
      {
        name: 'Python',
        proficiency: 90,
        icon: Code2,
        image: python,
        description: 'Primary language for data science, AI/ML, and backend development'
      },
      {
        name: 'R',
        proficiency: 75,
        icon: TrendingUp,
        image: r,
        description: 'Statistical computing, advanced analytics, and research projects'
      },
      {
        name: 'SQL',
        proficiency: 85,
        icon: Database,
        image: sql,
        description: 'Database querying, optimization, and data manipulation'
      },
      {
        name: 'JavaScript',
        proficiency: 70,
        icon: Code2,
        image: JS,
        description: 'Frontend development and data visualization libraries'
      }
    ]
  },
  {
    title: 'Languages',
    description: 'Languages I speak fluently for global communication',
    color: 'bg-emerald-50 border-emerald-200',
    skills: [
      {
        name: 'English',
        proficiency: 95,
        icon: Languages,
        image: english,
        description: 'Native-level proficiency in academic and professional settings'
      },
      {
        name: 'Malayalam',
        proficiency: 100,
        icon: Languages,
        image: malayalam,
        description: 'Native language with complete fluency'
      },
      {
        name: 'Hindi',
        proficiency: 90,
        icon: Languages,
        image: hindi,
        description: 'Fluent in conversation and business communication'
      }
    ]
  },
  {
    title: 'Interpersonal Skills',
    description: 'Soft skills that enable effective collaboration and leadership',
    color: 'bg-purple-50 border-purple-200',
    skills: [
      {
        name: 'Communication',
        proficiency: 92,
        icon: MessageSquare,
        image: communication,
        description: 'Clear presentation of complex data insights to stakeholders'
      },
      {
        name: 'Data Storytelling',
        proficiency: 90,
        icon: BookOpen,
        image: data_story,
        description: 'Transforming complex data into compelling narratives and insights'
      },
      {
        name: 'Leadership',
        proficiency: 85,
        icon: Crown,
        image: leadership,
        description: 'Leading data science projects and mentoring team members'
      },
      {
        name: 'Teamwork',
        proficiency: 95,
        icon: HandHeart,
        image: teamwork,
        description: 'Collaborative approach to cross-functional team projects and initiatives'
      }
    ]
  }
];

export default function Skills() {
  return (
    <section 
      id="skills" 
      className="py-20 lg:py-32 bg-gradient-to-br from-background via-muted/20 to-card/30"
      aria-label="Skills section"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold text-foreground"
            data-testid="skills-title"
          >
            SKILLS
          </h2>
        </div>

        <div className="space-y-16">
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-8">
              <div className="text-left">
                <h3 
                  className="text-2xl md:text-3xl font-bold text-foreground mb-3"
                  data-testid={`skills-category-${categoryIndex}`}
                >
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-lg max-w-3xl">
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
                    <Card 
                      key={skillIndex}
                      className={`group hover-elevate transition-all duration-300 hover:scale-105 ${category.color} border-2 border-black rounded-xl`}
                      data-testid={`skill-card-${categoryIndex}-${skillIndex}`}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="mb-4 flex justify-center">
                          {/* circular container; image fills it */}
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 overflow-hidden">
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

                        <h4 className="text-lg font-bold text-foreground mb-2">
                          {skill.name}
                        </h4>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {skill.description}
                        </p>

                        {showProficiency && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-foreground">
                                Proficiency
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {skill.proficiency}/100
                              </Badge>
                            </div>
                            <Progress 
                              value={skill.proficiency} 
                              className="h-2"
                              data-testid={`skill-progress-${categoryIndex}-${skillIndex}`}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
