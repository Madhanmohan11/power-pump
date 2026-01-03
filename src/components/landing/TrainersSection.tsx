import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Instagram, Twitter } from 'lucide-react';

const trainers = [
  {
    name: 'Marcus Johnson',
    role: 'Head Strength Coach',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400',
    bio: '15+ years experience in powerlifting and strength training.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Yoga & Flexibility',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400',
    bio: 'Certified yoga instructor specializing in mobility and recovery.',
  },
  {
    name: 'David Chen',
    role: 'HIIT Specialist',
    image: 'https://images.unsplash.com/photo-1534368786749-b63e05c92717?q=80&w=400',
    bio: 'Former Olympic athlete, expert in high-intensity training.',
  },
  {
    name: 'Aisha Thompson',
    role: 'Nutrition Coach',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400',
    bio: 'Certified nutritionist helping members optimize their diet.',
  },
];

export function TrainersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="trainers" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium tracking-wider text-sm">OUR TEAM</span>
          <h2 className="font-display text-5xl md:text-6xl mt-4">
            EXPERT
            <span className="text-gradient"> TRAINERS</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our certified professionals are dedicated to helping you reach your fitness goals 
            with personalized guidance and unwavering support.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-card"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl mb-1">{trainer.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{trainer.role}</p>
                <p className="text-muted-foreground text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {trainer.bio}
                </p>
                
                <div className="flex gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}