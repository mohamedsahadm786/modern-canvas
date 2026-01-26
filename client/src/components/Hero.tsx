import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import heroImage1 from '@assets/generated_images/Data_scientist_hero_workspace_3108f382.png';
import heroImage2 from '@assets/generated_images/home_page.avif';

const heroImages = [
  {
    src: heroImage1,
    alt: "Data scientist workspace with monitors and visualizations"
  },
  {
    src: heroImage2,
    alt: "AI and machine learning data visualization"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <section 
      id="hero" 
      className="relative h-screen overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className={`text-center text-white px-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            data-testid="hero-title"
          >
            <span className="text-white">MOHAMED SAHAD M</span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"
            data-testid="hero-subtitle"
          >
            DATA SCIENTIST - AI/ML ENGINEER - STATISTICIAN
            <br />
            Transforming raw data into meaningful insights
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-8 py-3 text-lg font-semibold"
              onClick={() => window.open('https://drive.google.com/file/d/1t1SdzVxrDfx0uWxgvOW0mOI9Z8fl-3qi/view?usp=sharing', '_blank')}
              data-testid="hero-cv-button"
            >
              Explore CV
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-semibold"
              onClick={() => scrollToSection('projects')}
              data-testid="hero-projects-button"
            >
              See Projects
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={prevSlide}
          data-testid="hero-prev-button"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={() => setIsPlaying(!isPlaying)}
          data-testid="hero-play-pause-button"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={nextSlide}
          data-testid="hero-next-button"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
            onClick={() => setCurrentSlide(index)}
            data-testid={`hero-indicator-${index}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}