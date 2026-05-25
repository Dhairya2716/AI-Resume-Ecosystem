import React from "react";
import styles from "./Dashboard.module.css";
import { motion } from "framer-motion";

const TAG_META = {
  ats:   { color: "#16a34a" },
  jd:    { color: "#2563eb" },
  cover: { color: "#9333ea" },
};

function getScoreColor(score) {
  if (score === null) return "#9ca3af";
  if (score >= 85) return "#16a34a";
  if (score >= 65) return "#d97706";
  return "#dc2626";
}

export default function AnalysisItem({ item }) {
  const meta = TAG_META[item.tag] ?? TAG_META.ats;
  const scoreColor = getScoreColor(item.score);

  return (
    <motion.div
      whileHover={{ x: 3, background: "#fafbff" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={styles.analysisItem}
    >
      <span className={styles.analysisIndicator} style={{ background: meta.color }} />
      <div className={styles.analysisResume}>
        <div className={styles.analysisResumeName}>{item.resume}</div>
        <div className={styles.analysisHighlight}>{item.highlight}</div>
      </div>
      <span className={styles.analysisScore} style={{ color: scoreColor }}>
        {item.score !== null ? `${item.score}%` : "—"}
      </span>
      <span className={styles.analysisDate}>{item.date}</span>
    </motion.div>
  );
}
