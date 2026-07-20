import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, FileText, CheckCircle2 } from "lucide-react";

export default function ToolPreviews() {
  const [typedText, setTypedText] = useState("");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  const fullText = "Dear Hiring Manager,\n\nI am writing to express my interest in the Senior Product Designer position at Stripe. With over 5 years of experience leading design teams to ship 30% faster, I have developed a deep understanding of user-centric methodologies and design systems.\n\nAt my previous role, I raised our NPS score from 42 to 61 in just two quarters by implementing a cohesive, accessible design language.";

  useEffect(() => {
    if (inView) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.substring(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(interval);
        }
      }, 15); // typing speed
      
      return () => clearInterval(interval);
    }
  }, [inView]);

  return (
    <section className="py-32 px-6 bg-[#050505] relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-sm font-medium mb-6 border border-pink-500/20"
            >
              <Sparkles className="w-4 h-4" /> Cover Letter AI
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6 font-display"
            >
              Drafts that don't <br /> sound like drafts.
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-400 mb-10 max-w-md leading-relaxed"
            >
              Generate a cover letter that references the actual job description and your actual history. It's not a generic template, it's a starting point worth keeping.
            </motion.p>
            
            <ul className="space-y-4">
              {[
                "Analyzes job requirements in seconds",
                "Matches your top achievements",
                "Maintains your authentic tone"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex items-center gap-3 text-zinc-300 font-medium"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative rounded-2xl border border-white/10 bg-[#111]/80 backdrop-blur-xl shadow-2xl p-6 h-[400px] flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <FileText className="w-5 h-5 text-pink-400" />
                <div className="text-sm font-medium text-white">stripe_cover_letter.pdf</div>
                <div className="ml-auto text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Auto-saving...</div>
              </div>
              
              <div className="flex-1 overflow-hidden relative">
                <div className="text-zinc-300 leading-relaxed font-serif whitespace-pre-wrap text-[15px]">
                  {typedText}
                  <motion.span 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-4 bg-pink-500 ml-1 translate-y-1"
                  />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
