import React from "react";
import styles from "./Dashboard.module.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function getScoreColor(score) {
  if (score === null) return "#64748b";
  if (score >= 85) return "#4ade80";
  if (score >= 65) return "#fbbf24";
  if (score >= 40) return "#fb923c";
  return "#f87171";
}

export default function ResumeCard({ resume, onActionClick }) {
  const navigate = useNavigate();
  const { name, role, uploadedAt, size, atsScore, status, id } = resume;
  const scoreColor = getScoreColor(atsScore);
  const pct = atsScore !== null ? atsScore : 0;

  return (
    <motion.div
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
          onClick={() => navigate(`/view-resume/${id}`)}
          title="View resume"
        >
          View
        </button>
        <button
          className={styles.actionChip}
          onClick={() => navigate(`/edit-resume/${id}`)}
          title="Edit resume"
        >
          Edit
        </button>
        <button 
          className={styles.actionChip}
          onClick={() => onActionClick && onActionClick("ATS", resume)}
          disabled={status !== "analyzed"}
          style={{ opacity: status !== "analyzed" ? 0.5 : 1, cursor: status !== "analyzed" ? "not-allowed" : "pointer" }}
          title="ATS insights"
        >
          ATS
        </button>
        <button 
          className={styles.actionChip}
          onClick={() => onActionClick && onActionClick("JD", resume)}
          disabled={status !== "analyzed"}
          style={{ opacity: status !== "analyzed" ? 0.5 : 1, cursor: status !== "analyzed" ? "not-allowed" : "pointer" }}
          title="Match JD"
        >
          JD
        </button>
        <button 
          className={styles.actionChip}
          onClick={() => onActionClick && onActionClick("Cover", resume)}
          disabled={status !== "analyzed"}
          style={{ opacity: status !== "analyzed" ? 0.5 : 1, cursor: status !== "analyzed" ? "not-allowed" : "pointer" }}
          title="Cover letter"
        >
          Cover
        </button>
      </div>
    </motion.div>
  );
}

