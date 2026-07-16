export default function LoadingState({ message = "Loading...", minHeight = "400px" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight, width: "100%", padding: "2rem" }}>
      <div style={{
        width: "40px", height: "40px",
        border: "3px solid rgba(255, 255, 255, 0.06)",
        borderTopColor: "#818cf8",
        borderRightColor: "#a78bfa",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "1rem"
      }} />
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
      <p style={{ color: "#94a3b8", fontSize: "0.95rem", fontWeight: "500" }}>{message}</p>
    </div>
  );
}
