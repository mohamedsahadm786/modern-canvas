import { useState } from 'react';
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
  image: string; // <-- new field
}

const educationData: EducationItem[] = [
  {
    id: 'msc',
    degree: 'MSc in STATISTICS',
    institution: 'Pondicherry University, Pondicherry, India',
    duration: 'September 2023 - June 2025',
    grade: '8.34/10',
    gradeType: 'CGPA',
    description:
      "A place where I deepened my passion for data science and statistical analysis. Pursuing my Master's in Statistics here has provided me with a strong theoretical foundation and hands-on experience in advanced data analytics, artificial intelligence, and deep learning. The university's research-driven environment and exposure to cutting-edge tools have shaped my ability to solve real-world data challenges.",
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
    description:
      "One of India's most prestigious institutions, Hindu College played a crucial role in building my analytical mindset. My undergraduate journey in Statistics here was filled with rigorous academic training, problem-solving, and a deep dive into the fundamentals of data science. The vibrant intellectual environment and emphasis on research fostered my skills in Python, SQL, and data visualization, laying a strong foundation for my career in analytics.",
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

export default function Education() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <section
      id="education"
      className="py-20 lg:py-32 bg-muted/30"
      aria-label="Education section"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground"
            data-testid="education-title"
          >
            Education
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary h-full hidden lg:block" />

          <div className="space-y-12">
            {educationData.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col lg:flex-row items-center gap-8 relative ${
                  item.side === 'right' ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Blue connector line */}
                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-500 z-0" />

                {/* Content Card */}
                <div className="w-full lg:w-5/12 relative z-10">
                  <Card className="border border-black hover-elevate transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="text-center lg:text-left">
                        <h3
                          className="text-2xl font-bold text-primary mb-2"
                          data-testid={`education-degree-${item.id}`}
                        >
                          {item.degree}
                        </h3>
                        <p className="text-lg font-semibold text-foreground mb-1">
                          {item.institution}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.duration}
                        </p>

                        {/* Grade Badge */}
                        <div className="flex justify-center lg:justify-start mb-4">
                          <Badge variant="secondary" className="px-4 py-2">
                            <span className="font-bold text-lg">
                              {item.grade}
                            </span>
                            <span className="ml-2 text-sm">{item.gradeType}</span>
                          </Badge>
                        </div>

                        {/* Description */}
                        {item.description && (
                          <div className="mb-4">
                            <div
                              className={`text-sm text-muted-foreground leading-relaxed ${
                                expandedItem === item.id ? '' : 'line-clamp-3'
                              }`}
                            >
                              {item.description}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(item.id)}
                              className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
                              data-testid={`education-expand-${item.id}`}
                            >
                              {expandedItem === item.id ? (
                                <>
                                  Show Less{' '}
                                  <ChevronUp className="w-4 h-4 ml-1" />
                                </>
                              ) : (
                                <>
                                  Show More{' '}
                                  <ChevronDown className="w-4 h-4 ml-1" />
                                </>
                              )}
                            </Button>
                          </div>
                        )}

                        {/* Institution Details Button */}
                        <Button
                          onClick={() => window.open(item.link, '_blank')}
                          className="w-full"
                          data-testid={`education-details-${item.id}`}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Institution Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline Node */}
                <div className="hidden lg:flex w-2/12 justify-center relative z-10">
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg z-10" />
                </div>

                {/* Image Card */}
                <div className="w-full lg:w-5/12 relative z-10">
                  <Card className="border border-black hover-elevate transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                      <img
                        src={item.image}
                        alt={`${item.institution} campus`}
                        className="w-full h-64 object-cover rounded-lg"
                        loading="lazy"
                        data-testid={`education-image-${item.id}`}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
