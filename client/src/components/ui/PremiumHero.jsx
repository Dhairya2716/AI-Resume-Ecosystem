import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import MagneticButton from "./MagneticButton";
import AIOrb from "./AIOrb";
import AuroraBackground from "./AuroraBackground";

export default function PremiumHero() {
  return (
    <AuroraBackground>
      <section className="relative w-full min-h-screen flex items-center justify-center px-4 overflow-hidden pt-20">
        <AIOrb />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-xl shadow-violet-500/10"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-zinc-300">Your career, supercharged by AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 leading-tight font-display"
          >
            Make your next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 italic">
              move remarkable.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10"
          >
            One intelligent workspace to build a resume that makes your experience impossible to overlook.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <MagneticButton variant="glow" to="/register?mode=register" className="px-8 py-4 text-lg">
              Create your resume <ArrowRight className="w-5 h-5" />
            </MagneticButton>
            <MagneticButton variant="secondary" href="#how-it-works" className="px-8 py-4 text-lg">
              See how it works
            </MagneticButton>
          </motion.div>
        </div>
      </section>
    </AuroraBackground>
  );
}
