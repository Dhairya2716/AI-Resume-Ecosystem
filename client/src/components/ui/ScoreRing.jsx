import { motion } from "framer-motion";

const scoreColor = (score) => {
  if (score >= 80) return { stroke: "#22c55e", glow: "rgba(34, 197, 94, 0.3)" };
  if (score >= 60) return { stroke: "#f59e0b", glow: "rgba(245, 158, 11, 0.3)" };
  return { stroke: "#ef4444", glow: "rgba(239, 68, 68, 0.3)" };
};

const gradeStyle = (score) => {
  if (score >= 80) return { background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", border: "1px solid rgba(34, 197, 94, 0.25)" };
  if (score >= 60) return { background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.25)" };
  return { background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.25)" };
};

export default function ScoreRing({
  score = 0,
  size = 140,
  label,
  grade,
  strokeWidth = 8,
  showGlow = true,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference * (1 - score / 100);
  const { stroke, glow } = scoreColor(score);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {/* Glow backdrop */}
      {showGlow && (
        <div
          style={{
            position: "absolute",
            inset: "-10px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />
      )}

      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", position: "relative", zIndex: 1 }}
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Animated score ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            filter: showGlow ? `drop-shadow(0 0 6px ${glow})` : "none",
          }}
        />
      </svg>

      {/* Center label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: size * 0.28,
            fontWeight: 800,
            fontFamily: "'Outfit', sans-serif",
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: "-1px",
          }}
        >
          {score}
        </motion.span>

        {grade && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{
              fontSize: size * 0.1,
              fontWeight: 700,
              marginTop: "4px",
              padding: "2px 8px",
              borderRadius: "6px",
              ...gradeStyle(score),
            }}
          >
            {grade}
          </motion.span>
        )}

        {label && !grade && (
          <span
            style={{
              fontSize: size * 0.09,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginTop: "2px",
              fontWeight: 600,
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
