import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070"
          alt="Gym workout"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>
      <div className="relative container mx-auto px-6 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block mb-6 px-4 py-2 text-xs tracking-widest uppercase text-primary border border-primary/40 rounded-full bg-primary/10"
            >
              Muscle Manufacturer • Made in Malaiyanur
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white"
            >
              UNLEASH YOUR
              <span className="block text-primary mt-2">INNER POWER</span>
            </motion.h1>

            <div className="w-24 h-1 bg-primary my-6" />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-gray-300 max-w-xl mb-8"
            >
              Train with elite equipment, expert coaches, and a community built to
              push your limits and transform your body.
            </motion.p>

          
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-row gap-3 w-full max-w-[320px] sm:max-w-md"
            >
              <Button
                size="lg"
                onClick={scrollToContact}
                className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold
                           py-4 px-4 sm:py-5 sm:px-6"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10
                           py-4 px-4 sm:py-5 sm:px-6"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Tour
              </Button>
            </motion.div>

        
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-12 mb-8 max-w-xl">
              {[
                { number: "500+", label: "Members" },
                { number: "15+", label: "Trainers" },
                { number: "10K+", label: "Transformations", span: true },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-xl
                    px-3 py-3 sm:p-4 text-center
                    ${stat.span ? "col-span-2 sm:col-span-1" : ""}`}
                >
                  <div className="text-xl sm:text-2xl font-bold text-primary leading-tight">
                    {stat.number}
                  </div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

           
          <div className="hidden lg:flex relative h-[520px]">
            <motion.img
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=900"
              alt="Dumbbells"
              className="absolute right-0 top-0 w-64 rounded-2xl shadow-2xl"
            />

            <motion.img
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=900"
              alt="Plates"
              className="absolute right-24 bottom-0 w-72 rounded-2xl shadow-2xl"
            />

            <motion.img
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=900"
              alt="Gym rope training"
              className="absolute left-0 top-24 w-56 rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
