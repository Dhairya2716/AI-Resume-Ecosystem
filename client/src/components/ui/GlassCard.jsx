import { motion } from "framer-motion";

const glowColors = {
  purple: "rgba(99, 102, 241, 0.18)",
  blue:   "rgba(59, 130, 246, 0.18)",
  cyan:   "rgba(6, 182, 212, 0.18)",
  green:  "rgba(5, 150, 105, 0.18)",
  amber:  "rgba(217, 119, 6, 0.18)",
  red:    "rgba(225, 29, 72, 0.18)",
  none:   "transparent",
};

export default function GlassCard({
  children,
  className = "",
  glow = "none",
  hover = true,
  padding = "1.5rem",
  animate = true,
  style = {},
  onClick,
  id,
}) {
  const glowColor = glowColors[glow] || glowColors.none;

  const baseStyle = {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(16px) saturate(180%)",
    WebkitBackdropFilter: "blur(16px) saturate(180%)",
    border: "1.5px solid rgba(255,255,255,0.8)",
    borderTop: "2px solid rgba(255,255,255,0.95)",
    borderRadius: "18px",
    padding,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: glow !== "none"
      ? `0 0 30px ${glowColor}, 0 4px 20px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)`
      : "0 4px 20px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
    ...style,
  };

  const hoverStyle = hover ? {
    borderColor: "rgba(99,102,241,0.25)",
    transform: "translateY(-3px)",
    boxShadow: `0 12px 36px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.9)`,
  } : {};

  const Wrapper = animate ? motion.div : "div";
  const animateProps = animate ? {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  } : {};

  return (
    <Wrapper
      className={`glass-card ${className}`}
      style={baseStyle}
      onClick={onClick}
      id={id}
      {...animateProps}
      onMouseEnter={(e) => {
        if (hover) Object.assign(e.currentTarget.style, hoverStyle);
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = glow !== "none"
            ? `0 0 30px ${glowColor}, 0 4px 20px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)`
            : "0 4px 20px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.9)";
        }
      }}
    >
      {children}
    </Wrapper>
  );
}
