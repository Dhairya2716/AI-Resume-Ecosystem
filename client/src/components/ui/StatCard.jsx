import { motion } from "framer-motion";

const colorMap = {
  green: { bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.2)", fill: "linear-gradient(90deg, #22c55e, #4ade80)", glow: "rgba(74, 222, 128, 0.3)", text: "#4ade80" },
  blue: { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.2)", fill: "linear-gradient(90deg, #3b82f6, #60a5fa)", glow: "rgba(96, 165, 250, 0.3)", text: "#60a5fa" },
  purple: { bg: "rgba(139, 92, 246, 0.1)", border: "rgba(139, 92, 246, 0.2)", fill: "linear-gradient(90deg, #8b5cf6, #a78bfa)", glow: "rgba(167, 139, 250, 0.3)", text: "#a78bfa" },
  amber: { bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.2)", fill: "linear-gradient(90deg, #f59e0b, #fbbf24)", glow: "rgba(251, 191, 36, 0.3)", text: "#fbbf24" },
  red: { bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.2)", fill: "linear-gradient(90deg, #ef4444, #f87171)", glow: "rgba(248, 113, 113, 0.3)", text: "#f87171" },
  cyan: { bg: "rgba(6, 182, 212, 0.1)", border: "rgba(6, 182, 212, 0.2)", fill: "linear-gradient(90deg, #06b6d4, #22d3ee)", glow: "rgba(34, 211, 238, 0.3)", text: "#22d3ee" },
};

export default function StatCard({ icon: Icon, value, label, color = "purple", progress }) {
  const c = colorMap[color] || colorMap.purple;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{
        background: "rgba(24, 24, 27, 0.6)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px",
        padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem",
      }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
        {Icon && (
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px", background: c.bg, border: `1px solid ${c.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={16} style={{ color: c.text }} />
          </div>
        )}
      </div>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#f8fafc", lineHeight: 1, letterSpacing: "-0.5px" }}>{value}</span>
      {progress !== undefined && (
        <div style={{ height: "4px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "99px", overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ height: "100%", borderRadius: "99px", background: c.fill, boxShadow: `0 0 10px ${c.glow}` }} />
        </div>
      )}
    </motion.div>
  );
}
