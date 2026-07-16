import { motion } from "framer-motion";

export default function SectionHeader({ title, subtitle, action, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "2rem",
        paddingBottom: "1.5rem",
        borderBottom: "1px solid rgba(15,23,42,0.07)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        {Icon && (
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "13px",
              background: "rgba(99,102,241,0.08)",
              border: "1.5px solid rgba(99,102,241,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "2px",
              boxShadow: "0 4px 12px rgba(99,102,241,0.1)",
            }}
          >
            <Icon size={22} style={{ color: "#6366f1" }} />
          </div>
        )}
        <div>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
              margin: 0,
              color: "#0f172a",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                color: "#64748b",
                marginTop: "0.4rem",
                fontSize: "0.9rem",
                lineHeight: 1.55,
                maxWidth: "520px",
                margin: "0.4rem 0 0",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </motion.div>
  );
}
