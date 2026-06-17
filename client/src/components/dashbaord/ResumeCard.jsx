import React from "react";
import styles from "./Dashboard.module.css";
import { motion } from "framer-motion";

function getScoreColor(score) {
  if (score === null) return "#d1d5db";
  if (score >= 85) return "#16a34a";
  if (score >= 65) return "#d97706";
  return "#dc2626";
}

export default function ResumeCard({ resume, onActionClick }) {
  const { name, role, uploadedAt, size, atsScore, status } = resume;
  const scoreColor = getScoreColor(atsScore);
  const pct = atsScore !== null ? atsScore : 0;

  return (
    <motion.div
      whileHover={{ background: "#fafbff" }}
      className={styles.resumeRow}
    >
      {/* Name + role */}
      <div className={styles.resumeRowName}>
        <div className={`${styles.resumeFileIcon} ${status === "analyzed" ? styles.resumeFileIcon_analyzed : styles.resumeFileIcon_pending}`}>
          📄
        </div>
        <div style={{ minWidth: 0 }}>
          <div className={styles.resumeNameText} title={name}>{name}</div>
          <div className={styles.resumeRoleText}>{role}</div>
        </div>
      </div>

      {/* Upload date */}
      <div className={styles.resumeRowCell}>{uploadedAt}</div>

      {/* Status */}
      <div>
        <span className={`${styles.statusPill} ${status === "analyzed" ? styles.statusPill_analyzed : styles.statusPill_pending}`}>
          {status}
        </span>
      </div>

      {/* ATS Score bar */}
      <div>
        {atsScore !== null ? (
          <div className={styles.scoreBar}>
            <div className={styles.scoreBarTrack}>
              <motion.div
                className={styles.scoreBarFill}
                style={{ background: scoreColor }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className={styles.scoreNum} style={{ color: scoreColor }}>{atsScore}%</span>
          </div>
        ) : (
          <span className={styles.resumeRowCell}>—</span>
        )}
      </div>

      {/* Actions */}
      <div className={styles.resumeActions}>
        <button 
          className={styles.actionChip}
          onClick={() => onActionClick && onActionClick("ATS", resume)}
          disabled={status !== "analyzed"}
          style={{ opacity: status !== "analyzed" ? 0.5 : 1, cursor: status !== "analyzed" ? "not-allowed" : "pointer" }}
        >
          ATS
        </button>
        <button 
          className={styles.actionChip}
          onClick={() => onActionClick && onActionClick("JD", resume)}
          disabled={status !== "analyzed"}
          style={{ opacity: status !== "analyzed" ? 0.5 : 1, cursor: status !== "analyzed" ? "not-allowed" : "pointer" }}
        >
          JD
        </button>
        <button 
          className={styles.actionChip}
          onClick={() => onActionClick && onActionClick("Cover", resume)}
          disabled={status !== "analyzed"}
          style={{ opacity: status !== "analyzed" ? 0.5 : 1, cursor: status !== "analyzed" ? "not-allowed" : "pointer" }}
        >
          Cover
        </button>
      </div>
    </motion.div>
  );
}
