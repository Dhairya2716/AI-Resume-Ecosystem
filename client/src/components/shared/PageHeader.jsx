export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      marginBottom: "2rem", paddingBottom: "1.5rem",
      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    }}>
      <div>
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.5px",
          margin: 0, lineHeight: 1.2,
          background: "linear-gradient(to right, #ffffff, #94a3b8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>{title}</h1>
        {subtitle && <p style={{ color: "#71717a", marginTop: "0.5rem", fontSize: "0.9rem", lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
