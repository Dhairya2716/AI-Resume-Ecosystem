import { motion } from "framer-motion";

export default function ScoreRing({ score, label, size = 100, strokeWidth = 8, color = "#818cf8", bgStroke = "rgba(255, 255, 255, 0.06)" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={bgStroke} strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div style={{ zIndex: 1, textAlign: "center" }}>
        <span style={{ display: "block", fontSize: size * 0.28, fontWeight: "bold", color: "#f8fafc", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>{score}%</span>
        {label && <span style={{ fontSize: size * 0.12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px", display: "block", fontWeight: 600 }}>{label}</span>}
      </div>
    </div>
  );
}
