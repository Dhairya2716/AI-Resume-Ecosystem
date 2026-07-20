import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });

  function handleMouseMove(event) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct * 20); // max rotation 10deg
    y.set(yPct * -20);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: y,
        rotateY: x,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      <div 
        style={{ transform: "translateZ(50px)" }}
        className="w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
}

export default function ProductShowcase() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [200, -200]);

  return (
    <section ref={containerRef} className="relative w-full py-32 px-6 overflow-hidden bg-[#050505]" id="showcase">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-display"
          >
            From blank page <br /> to final draft.
          </motion.h2>
        </div>

        <div className="relative w-full max-w-5xl mx-auto h-[700px]" style={{ perspective: "2000px" }}>
          
          {/* Main Dashboard Window */}
          <TiltCard className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] z-10">
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col h-[500px]">
              {/* Window Header */}
              <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="mx-auto text-xs text-zinc-500 font-mono">resumeai.app/editor</div>
              </div>
              
              {/* Workspace */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 border-r border-white/5 p-4 flex flex-col gap-4">
                  <div className="text-sm font-bold text-white mb-4">[R]</div>
                  <div className="text-sm text-zinc-300 bg-white/5 px-3 py-1.5 rounded-md">Overview</div>
                  <div className="text-sm text-zinc-500 px-3 py-1.5">My résumés</div>
                  <div className="text-sm text-zinc-500 px-3 py-1.5">ATS reader</div>
                </div>
                
                {/* Editor Area */}
                <div className="flex-1 p-8">
                  <div className="max-w-xl">
                    <h1 className="text-3xl font-bold text-white mb-1">Alex Morgan</h1>
                    <p className="text-violet-400 mb-8">Product Designer</p>
                    
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Experience</div>
                      
                      <div>
                        <h3 className="font-semibold text-white">Stripe</h3>
                        <p className="text-sm text-zinc-400 mb-2">Senior Product Designer • 2021 - Present</p>
                        <div className="space-y-2">
                          <div className="h-4 bg-white/5 rounded w-full"></div>
                          <div className="h-4 bg-white/5 rounded w-[90%]"></div>
                          <div className="h-4 bg-white/5 rounded w-[95%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Floating UI Elements */}
          <motion.div style={{ y: y1 }} className="absolute right-[-5%] top-[10%] z-20 hidden md:block">
            <TiltCard>
              <div className="w-64 rounded-xl border border-white/10 bg-[#111]/90 backdrop-blur-xl p-5 shadow-2xl shadow-cyan-900/20">
                <div className="text-xs text-zinc-500 mb-1">Machine-read score</div>
                <div className="text-3xl font-bold text-white flex items-baseline gap-1 mb-3">
                  92 <span className="text-sm text-zinc-500 font-normal">/100</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[92%] rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">Every section parses cleanly. Ready to send.</p>
              </div>
            </TiltCard>
          </motion.div>

          <motion.div style={{ y: y2 }} className="absolute left-[-5%] bottom-[15%] z-30 hidden md:block">
            <TiltCard>
              <div className="w-72 rounded-xl border border-violet-500/30 bg-[#111]/90 backdrop-blur-xl p-5 shadow-2xl shadow-violet-900/20 flex gap-4 items-start relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent pointer-events-none" />
                <div className="mt-1">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <div className="text-xs font-medium text-violet-400 mb-1">AI Insight</div>
                  <p className="text-sm text-zinc-300 leading-relaxed mb-3">Strong bones. One measurable outcome would make this undeniable.</p>
                  <button className="text-xs flex items-center gap-1 text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">
                    Apply fix <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </TiltCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
