import { useState } from "react";
import styles from "./Dashboard.module.css";
import { matchWithJD } from "../../api/resumeService";

export default function JDMatchModal({ onClose, resumes }) {
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing]           = useState(false);
  const [error, setError]                   = useState("");
  const [result, setResult]                 = useState(null);

  const handleMatch = async () => {
    if (!selectedResume || !jobDescription.trim()) {
      setError("Please select a resume and paste a job description.");
      return;
    }
    setAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const data = await matchWithJD(selectedResume, jobDescription);
      setResult(data.match);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to analyze match.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={!analyzing ? onClose : undefined}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px", width: "90%" }}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Match Job Description</span>
          {!analyzing && <button className={styles.closeBtn} onClick={onClose}>✕</button>}
        </div>

        <div style={{ padding: "1.5rem" }}>
          {error && (
            <div style={{ color: "#f87171", background: "rgba(239, 68, 68, 0.1)", padding: "0.75rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              {error}
            </div>
          )}

          {!result ? (
            <>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#cbd5e1" }}>Select Resume</label>
                <select 
                  value={selectedResume} 
                  onChange={(e) => setSelectedResume(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.05)", color: "#f8fafc", fontSize: "0.95rem" }}
                  disabled={analyzing}
                >
                  <option value="" style={{ color: "#000" }}>-- Choose a resume --</option>
                  {resumes.filter(r => r.status === "analyzed").map(r => (
                    <option key={r.id} value={r.id} style={{ color: "#000" }}>{r.name} (ATS: {r.atsScore}%)</option>
                  ))}
                </select>
                {resumes.filter(r => r.status === "analyzed").length === 0 && (
                  <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.25rem" }}>You need at least one fully analyzed resume to use this feature.</p>
                )}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#cbd5e1" }}>Paste Job Description</label>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job posting here..."
                  style={{ width: "100%", minHeight: "150px", padding: "0.75rem", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.05)", color: "#f8fafc", fontSize: "0.95rem", resize: "vertical" }}
                  disabled={analyzing}
                />
              </div>

              <button
                className={styles.accentBtn}
                style={{ width: "100%", opacity: selectedResume && jobDescription.trim() && !analyzing ? 1 : 0.5, cursor: selectedResume && jobDescription.trim() && !analyzing ? "pointer" : "not-allowed" }}
                disabled={!selectedResume || !jobDescription.trim() || analyzing}
                onClick={handleMatch}
              >
                {analyzing ? "Analyzing Match..." : "Calculate Match Score"}
              </button>
            </>
          ) : (
            <div>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.25rem", color: "#f8fafc", marginBottom: "0.5rem" }}>Match Result</h3>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100px", height: "100px", borderRadius: "50%", background: result.matchScore >= 75 ? "rgba(52, 211, 153, 0.1)" : result.matchScore >= 50 ? "rgba(251, 191, 36, 0.1)" : "rgba(248, 113, 113, 0.1)", color: result.matchScore >= 75 ? "#34d399" : result.matchScore >= 50 ? "#fbbf24" : "#f87171", fontSize: "2rem", fontWeight: "700", border: `4px solid ${result.matchScore >= 75 ? "rgba(52, 211, 153, 0.3)" : result.matchScore >= 50 ? "rgba(251, 191, 36, 0.3)" : "rgba(248, 113, 113, 0.3)"}` }}>
                  {result.matchScore}%
                </div>
              </div>

              {result.missingKeywords?.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ fontSize: "1rem", color: "#e2e8f0", marginBottom: "0.5rem" }}>Missing Keywords</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} style={{ background: "rgba(248, 113, 113, 0.15)", color: "#f87171", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.85rem", fontWeight: "500", border: "1px solid rgba(248, 113, 113, 0.2)" }}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {result.suggestions?.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "1rem", color: "#e2e8f0", marginBottom: "0.5rem" }}>How to Improve</h4>
                  <ul style={{ paddingLeft: "1.25rem", margin: 0, color: "#cbd5e1", fontSize: "0.95rem" }}>
                    {result.suggestions.map((sug, i) => (
                      <li key={i} style={{ marginBottom: "0.25rem" }}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                className={styles.accentBtn}
                style={{ width: "100%", marginTop: "2rem" }}
                onClick={() => setResult(null)}
              >
                Match Another Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
