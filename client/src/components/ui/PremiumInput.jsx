import { useState } from "react";

const baseInputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "12px",
  border: "1px solid var(--border-subtle)",
  background: "rgba(0,0,0,0.2)",
  color: "var(--text-primary)",
  fontSize: "0.9rem",
  fontFamily: "inherit",
  outline: "none",
  transition: "all 0.2s ease",
  appearance: "none",
  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
};

const focusStyle = {
  borderColor: "rgba(99,102,241,0.6)",
  boxShadow: "0 0 0 3px rgba(99,102,241,0.15), 0 0 12px rgba(99,102,241,0.1)",
  background: "rgba(0,0,0,0.3)",
};

export default function PremiumInput({
  label,
  type = "select",
  value,
  onChange,
  options = [],
  placeholder = "",
  disabled = false,
  style = {},
  className = "",
  id,
  rows = 6,
}) {
  const [focused, setFocused] = useState(false);

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    color: focused ? "var(--violet)" : "var(--text-muted)",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    transition: "color 0.2s ease",
  };

  const inputStyle = {
    ...baseInputStyle,
    ...(focused ? focusStyle : {}),
    ...(disabled ? { opacity: 0.5, cursor: "not-allowed" } : { cursor: type === "select" ? "pointer" : "text" }),
    ...style,
  };

  return (
    <div className={className}>
      {label && <label style={labelStyle}>{label}</label>}
      {type === "select" ? (
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          id={id}
          style={{
            ...inputStyle,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            paddingRight: "2.5rem",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          {options.map((opt, i) => (
            <option
              key={opt.value ?? i}
              value={opt.value}
              style={{ background: "var(--bg-surface)", color: "var(--text-primary)" }}
            >
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          id={id}
          rows={rows}
          style={{
            ...inputStyle,
            resize: "vertical",
            minHeight: "120px",
            lineHeight: 1.6,
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}
    </div>
  );
}
