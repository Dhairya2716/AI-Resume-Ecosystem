export default function KeywordChips({ keywords, variant = "default" }) {
  if (!keywords || keywords.length === 0) return <span style={{ color: "#52525b", fontSize: "0.9rem" }}>None found</span>;

  const styles = {
    default: { bg: "rgba(255, 255, 255, 0.06)", color: "#cbd5e1", border: "1px solid rgba(255, 255, 255, 0.08)" },
    success: { bg: "rgba(34, 197, 94, 0.1)", color: "#4ade80", border: "1px solid rgba(34, 197, 94, 0.2)" },
    danger:  { bg: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)" },
  };

  const currentStyle = styles[variant] || styles.default;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {keywords.map((kw, i) => (
        <span key={i} style={{
          background: currentStyle.bg,
          color: currentStyle.color,
          border: currentStyle.border,
          padding: "0.25rem 0.75rem",
          borderRadius: "9999px",
          fontSize: "0.82rem",
          fontWeight: "600"
        }}>
          {kw}
        </span>
      ))}
    </div>
  );
}
