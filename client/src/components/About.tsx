import { Card, CardContent } from '@/components/ui/card';
import profileImage from '@assets/generated_images/About/mine.png';

export default function About() {
  return (
    <section 
      id="about" 
      className="py-20 lg:py-32"
      aria-label="About section"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            data-testid="about-title"
          >
            <span className="text-primary font-bold">SAHAD</span> in a Snapshot
          </h2>
        </div>

        {/* Centered Profile Image */}
        <div className="flex justify-center mb-16">
          <img
            src={profileImage}
            alt="SAHAD - Data Scientist profile"
            className="w-48 h-48 lg:w-56 lg:h-56 rounded-full object-cover border-4 border-card-border shadow-lg"
            data-testid="about-profile-image"
            loading="lazy"
          />
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <blockquote className="text-lg font-semibold text-primary border-l-4 border-primary pl-6 italic">
            "Data is the new oil, but refining it into insights is where the real power lies."
          </blockquote>
          
          <p className="text-lg leading-relaxed text-muted-foreground">
            I am a Statistician, Data Scientist, Analyst, and AI/ML Engineer with a deep passion for transforming raw data into meaningful stories. With a Master's in Statistics from Pondicherry University and a Bachelor's from Hindu College, University of Delhi, I have built a strong foundation in statistical modeling, machine learning, and artificial intelligence. My expertise lies in leveraging Python and SQL to extract insights, optimize decision-making, and build scalable data-driven solutions.
          </p>

          <blockquote className="text-lg font-semibold text-primary border-l-4 border-primary pl-6 italic">
            "The goal is to turn data into information, and information into insight."
          </blockquote>
          
          <p className="text-lg leading-relaxed text-muted-foreground">
            Throughout my journey, I have developed and deployed AI-driven applications, worked on deep learning models for sentiment analysis, and optimized large-scale databases to enhance business efficiency. My proficiency in data visualization and storytelling allows me to communicate complex insights effectively, ensuring that data not only speaks but also drives impact.
          </p>

          <blockquote className="text-lg font-semibold text-primary border-l-4 border-primary pl-6 italic">
            "Without data, you're just another person with an opinion."
          </blockquote>
          
          <p className="text-lg leading-relaxed text-muted-foreground">
            Whether it's predictive modeling, NLP, or statistical data analysis, I believe in harnessing the power of data to solve real-world problems. With an analytical mindset and a creative approach, I strive to bridge the gap between numbers and narratives, making data-driven decisions more accessible and actionable.
          </p>
        </div>
      </div>
    </section>
  );
}
