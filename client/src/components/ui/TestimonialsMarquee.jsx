import { motion } from "framer-motion";

const testimonials = [
  { quote: "I'd rewritten my resume four times myself. ResumeAI found the pattern I couldn't see — every bullet described a task, not a result.", name: "Priya N.", role: "Senior PM, Series C startup" },
  { quote: "The ATS reader was the wake-up call. My old resume looked fine to me and unreadable to the system that was actually screening it.", name: "Marcus T.", role: "Data Analyst" },
  { quote: "The interview prep asked me the exact question I froze on last time. Second time around, I had an answer ready.", name: "Elena R.", role: "Product Designer, FAANG" },
  { quote: "It didn't just format my resume; it fundamentally changed how I positioned my experience. Landed a Director role in 3 weeks.", name: "David K.", role: "Director of Engineering" },
  { quote: "The JD matcher is basically a cheat code. It told me exactly which keywords I was missing and how to naturally integrate them.", name: "Sarah J.", role: "Marketing Manager" },
];

export default function TestimonialsMarquee() {
  return (
    <section className="py-32 bg-[#050505] overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
          What happens when <br /> your resume gets read.
        </h2>
      </div>

      <div className="relative w-full flex overflow-x-hidden">
        {/* Gradients to fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
        
        <motion.div 
          className="flex whitespace-nowrap gap-6 px-6 relative z-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          {/* Double the array for infinite scroll */}
          {[...testimonials, ...testimonials].map((t, i) => (
            <div 
              key={i} 
              className="w-[400px] flex-shrink-0 bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 whitespace-normal hover:bg-[#1a1a1a] transition-colors shadow-xl"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-zinc-300 text-lg leading-relaxed mb-8">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/20">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-bold">{t.name}</div>
                  <div className="text-zinc-500 text-sm">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
