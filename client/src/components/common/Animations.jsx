import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import styles from "../dashbaord/Dashboard.module.css";

// ── 1. BlurText Animation ──────────────────────────────────────────────────
export function BlurText({ text, delay = 0.04, className = "" }) {
  if (!text) return null;
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { filter: "blur(8px)", opacity: 0, y: 8 },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      style={{ display: "inline-block" }}
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={wordVariants}
          style={{ display: "inline-block", marginRight: "0.22em" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ── 2. AnimatedCounter (CountUp) ───────────────────────────────────────────
export function AnimatedCounter({ value, duration = 1.4 }) {
  const isPercent = typeof value === "string" && value.includes("%");
  const numericString = typeof value === "string" ? value.replace(/[^0-9.-]/g, "") : String(value);
  const num = parseFloat(numericString) || 0;
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);

  useEffect(() => {
    const controls = animate(count, num, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [num, count, duration]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = isPercent ? `${latest}%` : latest;
      }
    });
  }, [rounded, isPercent]);

  return <span ref={ref}>0{isPercent && "%"}</span>;
}

// ── 3. HoverCard 3D Spring Animation ──────────────────────────────────────
export function HoverCard({ children, className = "", style = {}, ...props }) {
  return (
    <motion.div
      className={className}
      style={style}
      whileHover={{
        y: -6,
        scale: 1.012,
        boxShadow: "0 14px 34px rgba(99, 102, 241, 0.07), 0 2px 8px rgba(0, 0, 0, 0.02)",
      }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── 4. FadeInStagger (Grid & List Entrance) ───────────────────────────────
export function FadeInStagger({ children, className = "" }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({ children, className = "" }) {
  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } },
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}

// ── 5. ShinyText ───────────────────────────────────────────────────────────
export function ShinyText({ children, className = "" }) {
  return (
    <span className={`${styles.shinyText} ${className}`}>
      {children}
    </span>
  );
}
