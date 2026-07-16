import { motion } from "framer-motion";

const variantStyles = {
  success: { borderColor: "rgba(34, 197, 94, 0.3)", iconBg: "rgba(34, 197, 94, 0.1)", iconColor: "#4ade80", dotColor: "#22c55e" },
  danger: { borderColor: "rgba(239, 68, 68, 0.3)", iconBg: "rgba(239, 68, 68, 0.1)", iconColor: "#f87171", dotColor: "#ef4444" },
  info: { borderColor: "rgba(99, 102, 241, 0.3)", iconBg: "rgba(99, 102, 241, 0.1)", iconColor: "#818cf8", dotColor: "#6366f1" },
  warning: { borderColor: "rgba(245, 158, 11, 0.3)", iconBg: "rgba(245, 158, 11, 0.1)", iconColor: "#fbbf24", dotColor: "#f59e0b" },
};

export default function AIInsightCard({ title, items = [], variant = "info", icon: Icon, numbered = false }) {
  const vs = variantStyles[variant] || variantStyles.info;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{
        background: "rgba(24, 24, 27, 0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.08)", borderLeft: `3px solid ${vs.borderColor}`,
        borderRadius: "16px", padding: "1.5rem", overflow: "hidden",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        {Icon && (
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px", background: vs.iconBg,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon size={16} style={{ color: vs.iconColor }} />
          </div>
        )}
        <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#f8fafc", margin: 0 }}>{title}</h4>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.length === 0 && (
          <p style={{ color: "#52525b", fontSize: "0.85rem", fontStyle: "italic" }}>No items to display.</p>
        )}
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.5rem 0", borderBottom: i < items.length - 1 ? "1px solid rgba(255, 255, 255, 0.04)" : "none" }}>
            {numbered ? (
              <span style={{
                width: "24px", height: "24px", borderRadius: "6px", background: vs.iconBg,
                color: vs.iconColor, fontSize: "0.75rem", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{i + 1}</span>
            ) : (
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: vs.dotColor, flexShrink: 0, marginTop: "7px", boxShadow: `0 0 8px ${vs.dotColor}` }} />
            )}
            <span style={{ fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
