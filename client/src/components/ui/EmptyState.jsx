import { motion } from "framer-motion";

export default function EmptyStateUI({ icon: Icon, title = "No data yet", subtitle = "", action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "4rem 2rem", textAlign: "center", background: "rgba(24, 24, 27, 0.4)",
        borderRadius: "20px", border: "2px dashed rgba(255, 255, 255, 0.08)", minHeight: "400px",
      }}>
      {Icon && (
        <div style={{
          width: "72px", height: "72px", borderRadius: "20px",
          background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem",
        }}>
          <Icon size={32} style={{ color: "#818cf8" }} />
        </div>
      )}
      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 0.5rem 0" }}>{title}</h3>
      {subtitle && <p style={{ color: "#71717a", fontSize: "0.9rem", maxWidth: "380px", lineHeight: 1.6, margin: 0 }}>{subtitle}</p>}
      {action && <div style={{ marginTop: "1.5rem" }}>{action}</div>}
    </motion.div>
  );
}
