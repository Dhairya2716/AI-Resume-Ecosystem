import { motion } from "framer-motion";

export default function LoadingSkeleton({ message = "Loading...", type = "spinner", lines = 3 }) {
  if (type === "lines") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1.5rem" }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} style={{
            width: `${100 - i * 15}%`, height: "12px", borderRadius: "6px",
            background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(99,102,241,0.1) 50%, rgba(255,255,255,0.03) 75%)",
            backgroundSize: "200% 100%", animation: "shimmer 1.5s ease-in-out infinite",
          }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "400px", width: "100%",
      padding: "3rem", gap: "1.5rem",
    }}>
      <div style={{ position: "relative", width: "64px", height: "64px" }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: "-10px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.25), transparent)",
            filter: "blur(10px)",
          }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          style={{
            width: "100%", height: "100%", borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.08)",
            borderTopColor: "var(--violet)", borderRightColor: "var(--cyan)",
          }}
        />
      </div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ color: "var(--text-secondary)", fontSize: "0.95rem", fontWeight: 600, margin: 0 }}
      >
        {message}
      </motion.p>
      <div style={{ display: "flex", gap: "6px" }}>
        {[0, 1, 2].map((i) => (
          <motion.div key={i}
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
            style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--violet)" }}
          />
        ))}
      </div>
    </div>
  );
}
