import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import profileImage from '@assets/generated_images/About/mine.png';

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
};

export default function About() {
  return (
    <section
      id="about"
      className="py-20 lg:py-32 section-glass"
      aria-label="About section"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Section heading */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <h2
            className="glitch-text text-4xl md:text-5xl font-bold font-mono mb-4"
            data-text="SAHAD in a Snapshot"
            data-testid="about-title"
          >
            <span className="text-primary">SAHAD</span>{' '}
            <span className="text-foreground">in a Snapshot</span>
          </h2>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mt-4" />
        </motion.div>

        {/* Profile image — wireframe filtered, floats */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative">
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-full animate-pulse-neon"
              style={{ margin: '-6px' }}
            />
            <motion.img
              src={profileImage}
              alt="SAHAD — Data Scientist profile"
              className="wireframe-face w-48 h-48 lg:w-56 lg:h-56 rounded-full object-cover border-2 border-primary/40 relative z-10"
              data-testid="about-profile-image"
              loading="lazy"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            />
            {/* Corner brackets */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-5 h-5 z-20`}
                style={{
                  borderTop:    i < 2  ? '2px solid var(--neon-cyan, #00d4ff)' : 'none',
                  borderBottom: i >= 2 ? '2px solid var(--neon-cyan, #00d4ff)' : 'none',
                  borderLeft:   i % 2 === 0 ? '2px solid var(--neon-cyan, #00d4ff)' : 'none',
                  borderRight:  i % 2 === 1 ? '2px solid var(--neon-cyan, #00d4ff)' : 'none',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Bio content */}
        <div className="max-w-4xl mx-auto space-y-10">
          {[
            {
              quote: '"Data is the new oil, but refining it into insights is where the real power lies."',
              text:  'I am a Statistician, Data Scientist, Analyst, and AI/ML Engineer with a deep passion for transforming raw data into meaningful stories. With a Master's in Statistics from Pondicherry University and a Bachelor's from Hindu College, University of Delhi, I have built a strong foundation in statistical modeling, machine learning, and artificial intelligence. My expertise lies in leveraging Python and SQL to extract insights, optimize decision-making, and build scalable data-driven solutions.',
            },
            {
              quote: '"The goal is to turn data into information, and information into insight."',
              text:  'Throughout my journey, I have developed and deployed AI-driven applications, worked on deep learning models for sentiment analysis, and optimized large-scale databases to enhance business efficiency. My proficiency in data visualization and storytelling allows me to communicate complex insights effectively, ensuring that data not only speaks but also drives impact.',
            },
            {
              quote: '"Without data, you\'re just another person with an opinion."',
              text:  'Whether it\'s predictive modeling, NLP, or statistical data analysis, I believe in harnessing the power of data to solve real-world problems. With an analytical mindset and a creative approach, I strive to bridge the gap between numbers and narratives, making data-driven decisions more accessible and actionable.',
            },
          ].map((block, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="space-y-4"
            >
              <blockquote className="font-mono text-base font-semibold text-primary border-l-4 border-primary pl-5 italic">
                {block.quote}
              </blockquote>
              <p className="text-base leading-relaxed text-muted-foreground pl-5">
                {block.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
