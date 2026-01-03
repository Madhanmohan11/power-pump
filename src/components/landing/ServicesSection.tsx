import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MEMBERSHIP_PLANS } from '@/lib/types';

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const plans = Object.entries(MEMBERSHIP_PLANS).map(([key, value]) => ({
    id: key,
    ...value,
    popular: key === 'premium',
  }));

  return (
    <section id="services" className="py-24 md:py-32 bg-secondary/30 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium tracking-wider text-sm">MEMBERSHIP PLANS</span>
          <h2 className="font-display text-5xl md:text-6xl mt-4">
            CHOOSE YOUR
            <span className="text-gradient"> PLAN</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-gradient-primary border-2 border-primary shadow-2xl shadow-primary/20 scale-105' 
                  : 'bg-card border border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-background text-primary text-sm font-bold rounded-full border border-primary">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className={`font-display text-2xl mb-2 ${plan.popular ? 'text-primary-foreground' : ''}`}>
                {plan.name}
              </h3>
              <div className={`flex items-baseline gap-1 mb-6 ${plan.popular ? 'text-primary-foreground' : ''}`}>
                <span className="font-display text-5xl">${plan.price}</span>
                <span className={plan.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}>/month</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className={`flex items-center gap-3 ${plan.popular ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                    <Check className={`h-5 w-5 ${plan.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full py-6 font-semibold ${
                  plan.popular 
                    ? 'bg-background text-primary hover:bg-background/90' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}