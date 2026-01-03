import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600', alt: 'Weight training area' },
  { src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600', alt: 'Cardio section' },
  { src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600', alt: 'Group fitness class' },
  { src: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=600', alt: 'Boxing area' },
  { src: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=600', alt: 'CrossFit zone' },
  { src: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=600', alt: 'Stretching area' },
];

export function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="gallery" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium tracking-wider text-sm">OUR FACILITY</span>
          <h2 className="font-display text-5xl md:text-6xl mt-4">
            EXPLORE OUR
            <span className="text-gradient"> SPACE</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative group overflow-hidden rounded-xl ${
                index === 0 || index === 5 ? 'md:row-span-2' : ''
              }`}
            >
              <div className={`aspect-square ${index === 0 || index === 5 ? 'md:aspect-auto md:h-full' : ''}`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-display text-xl text-primary-foreground bg-primary/80 px-4 py-2 rounded-lg">
                    {image.alt}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}