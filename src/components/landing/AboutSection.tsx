import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Users, Trophy, Clock } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Goal-Oriented Training',
    description: 'Customized workout plans designed to help you achieve your specific fitness goals.',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Join a motivating community of fitness enthusiasts who push each other to excel.',
  },
  {
    icon: Trophy,
    title: 'Proven Results',
    description: 'Our members consistently achieve transformative results with our expert guidance.',
  },
  {
    icon: Clock,
    title: '24/7 Access',
    description: 'Work out on your schedule with round-the-clock access to all facilities.',
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-medium tracking-wider text-sm">ABOUT US</span>
            <h2 className="font-display text-5xl md:text-6xl mt-4 mb-6">
              WHY CHOOSE
              <span className="block text-gradient">IRON PULSE?</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              At Iron Pulse, we believe fitness is more than just exercise—it's a lifestyle. 
              Since 2015, we've been transforming lives through innovative training methods, 
              cutting-edge equipment, and a supportive community that treats every member like family.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our mission is simple: to empower you to become the strongest version of yourself, 
              both physically and mentally. Whether you're a beginner or an elite athlete, 
              Iron Pulse has everything you need to succeed.
            </p>
          </motion.div>

          {/* Right - Feature Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}