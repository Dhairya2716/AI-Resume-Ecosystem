import { motion } from "framer-motion";

const glowColors = {
  purple: "rgba(99, 102, 241, 0.25)",
  blue:   "rgba(59, 130, 246, 0.25)",
  cyan:   "rgba(6, 182, 212, 0.25)",
  green:  "rgba(16, 185, 129, 0.25)",
  amber:  "rgba(245, 158, 11, 0.25)",
  red:    "rgba(244, 63, 94, 0.25)",
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
    background: "var(--glass-bg)",
    backdropFilter: "var(--glass-blur)",
    WebkitBackdropFilter: "var(--glass-blur)",
    border: "1px solid var(--glass-border)",
    borderTop: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "18px",
    padding,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: glow !== "none"
      ? `0 0 30px ${glowColor}, var(--glass-shadow)`
      : "var(--glass-shadow)",
    ...style,
  };

  const hoverStyle = hover ? {
    borderColor: "rgba(99,102,241,0.35)",
    transform: "translateY(-3px)",
    boxShadow: `0 12px 36px rgba(0,0,0,0.3), 0 0 20px rgba(99,102,241,0.15)`,
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
          e.currentTarget.style.borderColor = "var(--glass-border)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = glow !== "none"
            ? `0 0 30px ${glowColor}, var(--glass-shadow)`
            : "var(--glass-shadow)";
        }
      }}
    >
      {children}
    </Wrapper>
  );
}
