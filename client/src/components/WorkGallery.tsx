import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

// Import 12 images
import W1 from '@assets/generated_images/Work/12.jpg';
import W2 from '@assets/generated_images/Work/1.png';
import W3 from '@assets/generated_images/Work/2.jpg';
import W4 from '@assets/generated_images/Work/3.jpg';
import W5 from '@assets/generated_images/Work/4.jpg';
import W6 from '@assets/generated_images/Work/5.jpg';
import W7 from '@assets/generated_images/Work/11.jpg';
import W8 from '@assets/generated_images/Work/6.jpg';
import W9 from '@assets/generated_images/Work/7.png';
import W10 from '@assets/generated_images/Work/8.jpg';
import W11 from '@assets/generated_images/Work/9.jpg';
import W12 from '@assets/generated_images/Work/10.jpg';

// All images in an array
const images = [W1, W2, W3, W4, W5, W6, W7, W8, W9, W10, W11, W12];

// Work items array (12 projects with different images)
const workItems = images.map((img, i) => ({
  id: i + 1,
  title: `Go to Project Section to Explore more`,
  description: `From there, you will get an idea about what is this Project`,
  image: img,
  alt: `Work project ${i + 1} - Data science and analytics`,
}));

export default function WorkGallery() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="work-gallery" 
      className="py-20 lg:py-32 bg-muted/20"
      aria-label="Work gallery section"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            data-testid="work-gallery-title"
          >
            SOME THINGS I'VE WORKED ON
          </h2>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {workItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card 
                  className="group cursor-pointer hover-elevate transition-all duration-300 hover:scale-105 overflow-hidden"
                  data-testid={`work-item-${item.id}`}
                >
                  <CardContent className="p-0 relative">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0" aria-describedby="work-gallery-description">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-6 rounded-b-lg">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p id="work-gallery-description" className="text-white/90">{item.description}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* CTA to Projects */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={scrollToProjects}
            className="px-8 py-3 text-lg font-semibold hover-elevate"
            data-testid="work-gallery-cta"
          >
            Oh, you thought that was cool? Buckle up, because the real deal is about to drop! 😎
          </Button>
        </div>
      </div>
    </section>
  );
}
