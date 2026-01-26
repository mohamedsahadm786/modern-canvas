// path: src/components/Certifications.tsx

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import C1 from '@assets/generated_images/Certifications/1.png';
import C2 from '@assets/generated_images/Certifications/2.png';
import C3 from '@assets/generated_images/Certifications/3.png';
import C4 from '@assets/generated_images/Certifications/4.png';
import C5 from '@assets/generated_images/Certifications/5.png';
import CR1 from '@assets/generated_images/Certifications/Certificates/1.png';
import CR2 from '@assets/generated_images/Certifications/Certificates/2.jpg';
import CR3 from '@assets/generated_images/Certifications/Certificates/3.jpg';
import CR4 from '@assets/generated_images/Certifications/Certificates/4.jpg';
import CR5 from '@assets/generated_images/Certifications/Certificates/5.jpg';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  description: string;
  link: string;
  image: string; // thumbnail image (C1..C5)
}

const certificates: Certificate[] = [
  {
    id: 1,
    title: 'SQL: Data Reporting and Analysis',
    issuer: 'LinkedIn Learning',
    description: 'Advanced SQL techniques for data reporting and business analysis',
    link: 'https://www.linkedin.com/learning/certificates/5a970e01b43a5d42195f37753a0b4e47c9c98fa1fce21881c6869850e677c54f',
    image: C1
  },
  {
    id: 2,
    title: 'Deep Learning for Developers',
    issuer: 'Infosys',
    description: 'Comprehensive deep learning course covering neural networks and implementation',
    link: 'https://drive.google.com/file/d/11FSAMxII01pRJrA3hE_4dR0Ii5-Vgtu6/view',
    image: C2
  },
  {
    id: 3,
    title: 'Artificial Intelligence',
    issuer: 'Teachnook',
    description: 'Foundation and advanced concepts in artificial intelligence and machine learning',
    link: 'https://drive.google.com/file/d/1mPFkpaR3sD8K1oMiPxqJTl8bSEmL2oX7/view',
    image: C3
  },
  {
    id: 4,
    title: 'Mastering Excel: From Basics to Advanced Concepts',
    issuer: 'Younity.In',
    description: 'Comprehensive Excel training covering formulas, pivot tables, and advanced analytics',
    link: 'https://drive.google.com/file/d/1akw3yn8WyhaPCWMgCe9N7NkoUyBkDKIV/view',
    image: C4
  },
  {
    id: 5,
    title: 'Data Analytics with Python',
    issuer: 'IIT Roorkee',
    description: 'Python programming for data analytics, visualization, and statistical analysis',
    link: 'https://drive.google.com/file/d/1haBa01KHS8UC7RYiFfVX0dYc4DEDMqOi/view',
    image: C5
  }
];

export default function Certifications() {
  // map certificate id -> preview image (CR1..CR5)
  const previewImages: Record<number, string> = {
    1: CR1,
    2: CR2,
    3: CR3,
    4: CR4,
    5: CR5
  };

  return (
    <section 
      id="certifications" 
      className="py-20 lg:py-32 bg-muted/40"
      aria-label="Certifications section"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            data-testid="certifications-title"
          >
            CERTIFICATIONS
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert) => (
            <Card 
              key={cert.id}
              // added black outline + rounded corners; kept hover/scale
              className="group hover-elevate transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm overflow-hidden border-2 border-black rounded-xl"
              data-testid={`certificate-card-${cert.id}`}
            >
              <CardContent className="p-6">
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={cert.image}
                    alt={`${cert.title} certificate`}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Award className="w-12 h-12 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 
                    className="text-lg font-bold text-foreground mb-2 line-clamp-2"
                    data-testid={`certificate-title-${cert.id}`}
                  >
                    {cert.title}
                  </h3>
                  
                  <p className="text-primary font-semibold mb-3">
                    {cert.issuer}
                  </p>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {cert.description}
                  </p>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mb-3 w-full"
                        data-testid={`certificate-preview-${cert.id}`}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Preview Certificate
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full" aria-describedby="certificate-description">
                      <div className="text-center">
                        {/* use previewImages mapping; fallback to cert.image */}
                        <img
                          src={previewImages[cert.id] ?? cert.image}
                          alt={`${cert.title} certificate preview`}
                          className="w-full h-auto max-h-[70vh] object-contain rounded-lg mb-4"
                        />
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          {cert.title}
                        </h3>
                        <p className="text-lg text-primary font-semibold mb-2">
                          Issued by {cert.issuer}
                        </p>
                        <p id="certificate-description" className="text-muted-foreground">
                          {cert.description}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={() => window.open(cert.link, '_blank')}
                    className="w-full"
                    data-testid={`certificate-link-${cert.id}`}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
