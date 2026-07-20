import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ value, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTime;
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Easing out function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(numericValue * easeOut);
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(numericValue);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [inView, value, duration]);

  // Format based on if it has a decimal
  const formattedCount = count % 1 !== 0 
    ? count.toFixed(1) 
    : Math.floor(count).toString();

  const prefix = value.includes('+') && !value.endsWith('+') ? '+' : '';

  return (
    <span ref={ref}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
}

const stats = [
  { value: "2.4", suffix: "M", label: "lines rewritten" },
  { value: "40", suffix: "+", label: "ATS systems mapped" },
  { value: "+31", suffix: " pts", label: "avg. score lift" },
  { value: "3", suffix: " min", label: "to a first draft" },
];

export default function StatsSection() {
  return (
    <section className="py-24 border-y border-white/5 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/5">
          {stats.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-2 font-display">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className="text-sm md:text-base text-zinc-400 font-medium uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
