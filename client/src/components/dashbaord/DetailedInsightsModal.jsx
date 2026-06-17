import React from "react";
import styles from "./Dashboard.module.css";

export default function DetailedInsightsModal({ onClose, resume }) {
  if (!resume) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px", width: "90%" }}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>ATS Insights for {resume.name}</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: "1.5rem", maxHeight: "80vh", overflowY: "auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", color: "#111827", marginBottom: "0.5rem" }}>ATS Match Score</h3>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100px", height: "100px", borderRadius: "50%", background: resume.atsScore >= 75 ? "#ecfdf5" : resume.atsScore >= 50 ? "#fffbeb" : "#fef2f2", color: resume.atsScore >= 75 ? "#059669" : resume.atsScore >= 50 ? "#d97706" : "#dc2626", fontSize: "2rem", fontWeight: "700", border: `4px solid ${resume.atsScore >= 75 ? "#34d399" : resume.atsScore >= 50 ? "#fbbf24" : "#f87171"}` }}>
              {resume.atsScore}%
            </div>
          </div>

          {resume.strengths && resume.strengths.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "1rem", color: "#065f46", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.2rem" }}>✓</span> Key Strengths
              </h4>
              <ul style={{ paddingLeft: "1.25rem", margin: 0, color: "#4b5563", fontSize: "0.95rem" }}>
                {resume.strengths.map((str, i) => (
                  <li key={i} style={{ marginBottom: "0.25rem" }}>{str}</li>
                ))}
              </ul>
            </div>
          )}

          {resume.weaknesses && resume.weaknesses.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "1rem", color: "#991b1b", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.2rem" }}>✗</span> Weaknesses
              </h4>
              <ul style={{ paddingLeft: "1.25rem", margin: 0, color: "#4b5563", fontSize: "0.95rem" }}>
                {resume.weaknesses.map((weak, i) => (
                  <li key={i} style={{ marginBottom: "0.25rem" }}>{weak}</li>
                ))}
              </ul>
            </div>
          )}

          {resume.aiSuggestions && resume.aiSuggestions.length > 0 && (
            <div>
              <h4 style={{ fontSize: "1rem", color: "#1d4ed8", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.2rem" }}>💡</span> Actionable Suggestions
              </h4>
              <ul style={{ paddingLeft: "1.25rem", margin: 0, color: "#4b5563", fontSize: "0.95rem" }}>
                {resume.aiSuggestions.map((sug, i) => (
                  <li key={i} style={{ marginBottom: "0.25rem" }}>{sug}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            className={styles.accentBtn}
            style={{ width: "100%", marginTop: "2rem" }}
            onClick={onClose}
          >
            Close Insights
          </button>
        </div>
      </div>
    </div>
  );
}
