export default function EmptyState({ icon = "📄", title = "No data available", subtitle = "There is nothing to display here yet.", action }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "4rem 2rem", textAlign: "center",
      background: "rgba(24, 24, 27, 0.4)", borderRadius: "16px",
      border: "1px dashed rgba(255, 255, 255, 0.08)",
    }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.6 }}>{icon}</div>
      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "#f8fafc", margin: 0 }}>{title}</h3>
      <p style={{ color: "#71717a", fontSize: "0.9rem", marginTop: "0.5rem", marginBottom: action ? "1.5rem" : 0, maxWidth: "300px" }}>{subtitle}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
