// path: src/components/Experience.tsx

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Building } from 'lucide-react';
import In1 from '@assets/generated_images/Internship/4.png';
import In2 from '@assets/generated_images/Internship/3.jpg';
import In3 from '@assets/generated_images/Internship/1.jpg';
import In4 from '@assets/generated_images/Internship/2.jpg';

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
    title: 'Data Scientist Intern',
    company: 'RP2 Private Ltd.',
    duration: 'Present',
    status: 'Current Position',
    achievements: [
      'Building AI-powered applications using LLMs (OpenAI, HuggingFace Transformers), speech-to-text (Whisper, DeepSpeech), and NLP/NLU frameworks, integrated with Flask, REST APIs, and real-time audio interaction systems.',
      'Developing and deploying ML pipelines with Python, scikit-learn, TensorFlow, PyTorch, including data preprocessing, feature engineering, model training, evaluation (AUC, SHAP), and optimization for scalability.',
      'Working on full-stack deployment with HTML/CSS/JS, Flask servers, API integration, and applying MLOps practices, version control (Git/GitHub), and cloud readiness for production-grade AI tools.'
    ],
    image: In1
  },
  {
    id: 'nevar',
    title: 'Data Analyst Intern',
    company: 'Nevar Systems',
    duration: 'April 2025 - June 2025',
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
    achievements: [
      'Developed and deployed machine learning models in 2+ AI projects, addressing specific challenges.',
      'Designed AI-driven solutions with cross-functional teams, utilizing NLP and computer vision techniques.',
      'Processed and analyzed datasets with 100,000+ records for preprocessing, training, and performance evaluation.',
      'Enhanced proficiency in TensorFlow and PyTorch by implementing and testing 5+ models.'
    ],
    image: In3
  },
  {
    id: 'younity',
    title: 'Corporate Development Specialist Intern',
    company: 'Younity.In',
    duration: 'July 2023 - August 2023',
    achievements: [
      'Conducted competitive analysis using 10+ industry reports, identifying trends for strategic development.',
      'Developed and implemented 3+ strategic initiatives, enhancing market positioning and revenue.',
      'Contributed insights in 10+ meetings, refining strategic plans.',
      'Assisted in preparing financial forecasts, aiding decision-making with actionable data.'
    ],
    image: In4
  }
];

export default function Experience() {
  return (
    <section 
      id="experience" 
      className="py-20 lg:py-32 bg-gradient-to-br from-muted/30 via-card/20 to-background"
      aria-label="Experience section"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold text-foreground"
            data-testid="experience-title"
          >
            EXPERIENCE
          </h2>
        </div>

        <div className="space-y-8">
          {experiences.map((exp) => (
            <Card 
              key={exp.id}
              className={
                // added border + rounded corner for clean black outline
                "hover-elevate transition-all duration-300 hover:scale-[1.02] overflow-hidden bg-card/80 backdrop-blur-sm border-2 border-black rounded-xl"
              }
              data-testid={`experience-card-${exp.id}`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Content */}
                  <div className="flex-1 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="mb-4 lg:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 
                            className="text-2xl lg:text-3xl font-bold text-primary"
                            data-testid={`experience-title-${exp.id}`}
                          >
                            {exp.title}
                          </h3>
                          {exp.status && (
                            <Badge variant="default" className="ml-2">
                              {exp.status}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-lg font-semibold text-foreground mb-2">
                          <Building className="w-5 h-5 text-muted-foreground" />
                          {exp.company}
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{exp.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-foreground mb-3">
                        Key Achievements:
                      </h4>
                      <ul className="space-y-3">
                        {exp.achievements.map((achievement, achievementIndex) => (
                          <li 
                            key={achievementIndex}
                            className="flex items-start gap-3 text-muted-foreground leading-relaxed"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="lg:w-80 lg:flex-shrink-0">
                    <img
                      src={exp.image}
                      alt={`${exp.company} office environment`}
                      className="w-full h-64 lg:h-full object-cover"
                      loading="lazy"
                      data-testid={`experience-image-${exp.id}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline Connector */}
        <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
      </div>
    </section>
  );
}
