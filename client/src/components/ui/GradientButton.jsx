import { motion } from "framer-motion";

const variants = {
  primary: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#ffffff",
    boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
    hoverShadow: "0 8px 28px rgba(99,102,241,0.5)",
    border: "none",
  },
  secondary: {
    background: "rgba(255,255,255,0.9)",
    color: "#4f46e5",
    boxShadow: "0 1px 4px rgba(15,23,42,0.08)",
    hoverShadow: "0 4px 14px rgba(99,102,241,0.18)",
    border: "1.5px solid rgba(99,102,241,0.18)",
  },
  danger: {
    background: "rgba(225,29,72,0.07)",
    color: "#e11d48",
    boxShadow: "none",
    hoverShadow: "0 4px 12px rgba(225,29,72,0.18)",
    border: "1.5px solid rgba(225,29,72,0.18)",
  },
  ghost: {
    background: "transparent",
    color: "#6366f1",
    boxShadow: "none",
    hoverShadow: "none",
    border: "1.5px solid rgba(99,102,241,0.2)",
  },
};

export default function GradientButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  fullWidth = false,
  size = "md",
  style = {},
  className = "",
  id,
  title,
}) {
  const v = variants[variant] || variants.primary;
  const sizes = {
    sm: { padding: "0.5rem 1rem",   fontSize: "0.8rem"  },
    md: { padding: "0.75rem 1.25rem", fontSize: "0.9rem" },
    lg: { padding: "1rem 1.5rem",   fontSize: "1rem"    },
  };
  const s = sizes[size] || sizes.md;

  return (
    <motion.button
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      id={id}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        background: v.background,
        color: v.color,
        border: v.border || "none",
        borderRadius: "12px",
        fontFamily: "inherit",
        fontWeight: 700,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        boxShadow: v.boxShadow,
        transition: "all 0.3s ease",
        width: fullWidth ? "100%" : "auto",
        whiteSpace: "nowrap",
        ...s,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) e.currentTarget.style.boxShadow = v.hoverShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = v.boxShadow;
      }}
    >
      {loading && (
        <span style={{
          width: "16px", height: "16px",
          border: "2px solid rgba(255,255,255,0.35)",
          borderTopColor: "white",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
          flexShrink: 0,
        }} />
      )}
      {children}
    </motion.button>
  );
}
