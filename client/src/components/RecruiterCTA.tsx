import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, MessageCircle, Download, Mail } from 'lucide-react';

export default function RecruiterCTA() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="recruiter-cta" 
      className="py-20 lg:py-32"
      aria-label="Recruiter call-to-action section"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block">
            <div className="bg-primary/10 border-2 border-primary rounded-full px-8 py-4 mb-8">
              <h2 
                className="text-2xl md:text-3xl font-bold text-primary"
                data-testid="recruiter-headline"
              >
                Looking for a Data Scientist?
              </h2>
            </div>
          </div>
        </div>

        <Card className="bg-primary text-primary-foreground hover-elevate transition-all duration-300 hover:scale-[1.02] overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 
                className="text-2xl md:text-3xl font-bold mb-6 leading-tight"
                data-testid="recruiter-title"
              >
                Ready to Transform Your Data into Insights?
              </h3>
              
              <p 
                className="text-lg md:text-xl leading-relaxed mb-8 text-primary-foreground/90"
                data-testid="recruiter-description"
              >
                I'm SAHAD, a passionate Data Scientist and AI/ML Engineer with expertise in Python, SQL, machine learning, and statistical analysis. I specialize in turning complex data into actionable business insights and building scalable AI-powered solutions.
              </p>

              <div className="bg-primary-foreground/10 rounded-lg p-6 mb-8">
                <h4 className="text-xl font-semibold mb-4 text-primary-foreground">
                  What I Bring to Your Team:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <ul className="space-y-2 text-primary-foreground/90">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary-foreground/70 rounded-full mt-2 flex-shrink-0" />
                      <span>Advanced Python & SQL expertise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary-foreground/70 rounded-full mt-2 flex-shrink-0" />
                      <span>Machine Learning & Deep Learning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary-foreground/70 rounded-full mt-2 flex-shrink-0" />
                      <span>Statistical Analysis & Modeling</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-primary-foreground/90">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary-foreground/70 rounded-full mt-2 flex-shrink-0" />
                      <span>Data Visualization & Storytelling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary-foreground/70 rounded-full mt-2 flex-shrink-0" />
                      <span>AI-powered Application Development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary-foreground/70 rounded-full mt-2 flex-shrink-0" />
                      <span>Business Intelligence & Analytics</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-3 text-lg font-semibold group"
                  onClick={() => window.open('https://drive.google.com/file/d/1t1SdzVxrDfx0uWxgvOW0mOI9Z8fl-3qi/view?usp=sharing', '_blank')}
                  data-testid="recruiter-download-cv"
                >
                  <Download className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                  Download CV
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-3 text-lg font-semibold border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary group"
                  onClick={scrollToContact}
                  data-testid="recruiter-contact"
                >
                  <MessageCircle className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                  Let's Connect
                </Button>
              </div>

              <p className="text-sm text-primary-foreground/70 mt-6">
                Available for full-time opportunities and consulting projects
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}