import { motion } from "framer-motion";
import { FileText, ScanSearch, Target, PenSquare, BarChart3, Mic } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Build with clarity",
    description: "Shape every part of your story in a focused editor that brings out your strongest lines, section by section.",
    color: "from-violet-500/20 to-violet-500/0",
    iconColor: "text-violet-400"
  },
  {
    icon: ScanSearch,
    title: "See what the machine sees",
    description: "Surface exactly how applicant tracking systems parse, rank, and sometimes misread your resume.",
    color: "from-cyan-500/20 to-cyan-500/0",
    iconColor: "text-cyan-400"
  },
  {
    icon: Target,
    title: "Tailor with intent",
    description: "Match your experience to each role's language and requirements, without losing your own voice.",
    color: "from-emerald-500/20 to-emerald-500/0",
    iconColor: "text-emerald-400"
  },
  {
    icon: PenSquare,
    title: "Cover letters, drafted",
    description: "Generate a first draft that references the actual role and your actual history — a starting point worth keeping.",
    color: "from-pink-500/20 to-pink-500/0",
    iconColor: "text-pink-400"
  },
  {
    icon: BarChart3,
    title: "A real second opinion",
    description: "Get a line-by-line analysis of clarity, impact, and gaps, with a score you can watch move as you edit.",
    color: "from-blue-500/20 to-blue-500/0",
    iconColor: "text-blue-400"
  },
  {
    icon: Mic,
    title: "Walk in rehearsed",
    description: "Practice the questions your resume is likely to invite, and leave with sharper, more specific answers.",
    color: "from-amber-500/20 to-amber-500/0",
    iconColor: "text-amber-400"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

export default function FeaturesSection() {
  return (
    <section className="relative w-full py-32 px-6 overflow-hidden" id="features">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-violet-400 font-semibold tracking-wide uppercase text-sm mb-4"
          >
            The Workspace
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 font-display"
          >
            Everything earns <br className="hidden md:block"/> its place on the page.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg max-w-2xl"
          >
            Tools that work the way a good editor would — cutting what doesn't serve the reader, and sharpening what does.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 overflow-hidden hover:bg-white/10 transition-colors duration-500"
            >
              {/* Radial gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
