import React from "react";
import styles from "./Dashboard.module.css";
import { motion } from "framer-motion";

// Color config per accent
const ACCENT_CONFIG = {
  lime:  { barColor: "#22c55e", fillClass: styles.statProgressFill_lime,  iconClass: styles.statIconWrap_lime,  valueClass: styles.statValue_lime,  cardClass: styles.statCard_lime,  pill: "up"  },
  blue:  { barColor: "#3b82f6", fillClass: styles.statProgressFill_blue,  iconClass: styles.statIconWrap_blue,  valueClass: styles.statValue_blue,  cardClass: styles.statCard_blue,  pill: "up"  },
  pink:  { barColor: "#a855f7", fillClass: styles.statProgressFill_pink,  iconClass: styles.statIconWrap_pink,  valueClass: styles.statValue_pink,  cardClass: styles.statCard_pink,  pill: "neu" },
  amber: { barColor: "#f59e0b", fillClass: styles.statProgressFill_amber, iconClass: styles.statIconWrap_amber, valueClass: styles.statValue_amber, cardClass: styles.statCard_amber, pill: "neu" },
};

const ICONS = {
  lime: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  blue: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  pink: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  amber: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

export default function StatCard({ label, value, change, accent = "lime", progress = 60 }) {
  const cfg = ACCENT_CONFIG[accent] ?? ACCENT_CONFIG.lime;
  const isUp   = change?.includes("↑");
  const isDown = change?.includes("↓");
  const pillClass = isUp ? styles.statChangePill_up : isDown ? styles.statChangePill_down : styles.statChangePill_neu;

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 8px 28px rgba(0,0,0,0.07)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${styles.statCard} ${cfg.cardClass}`}
    >
      <div className={styles.statHeader}>
        <span className={styles.statLabel}>{label}</span>
        <div className={`${styles.statIconWrap} ${cfg.iconClass}`}>
          {ICONS[accent] ?? ICONS.lime}
        </div>
      </div>

      <div className={`${styles.statValue} ${cfg.valueClass}`}>
        {value}
      </div>

      <div className={styles.statProgressTrack}>
        <motion.div
          className={`${styles.statProgressFill} ${cfg.fillClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </div>

      {change && (
        <div className={styles.statChange}>
          <span className={`${styles.statChangePill} ${pillClass}`}>
            {isUp ? "↑" : isDown ? "↓" : "–"}
          </span>
          {change.replace(/^[↑↓]\s*/, "")}
        </div>
      )}
    </motion.div>
  );
}
