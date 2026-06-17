import { useState } from "react";
import styles from "./Dashboard.module.css";
import { generateCoverLetter } from "../../api/resumeService";

export default function CoverLetterModal({ onClose, resumes }) {
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generating, setGenerating]         = useState(false);
  const [error, setError]                   = useState("");
  const [result, setResult]                 = useState(null);

  const handleGenerate = async () => {
    if (!selectedResume || !jobDescription.trim()) {
      setError("Please select a resume and paste a job description.");
      return;
    }
    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const data = await generateCoverLetter(selectedResume, jobDescription);
      setResult(data.coverLetter);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate cover letter.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (result?.coverLetterText) {
      navigator.clipboard.writeText(result.coverLetterText);
      alert("Cover Letter copied to clipboard!");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={!generating ? onClose : undefined}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px", width: "95%" }}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Generate Cover Letter</span>
          {!generating && <button className={styles.closeBtn} onClick={onClose}>✕</button>}
        </div>

        <div style={{ padding: "1.5rem", maxHeight: "80vh", overflowY: "auto" }}>
          {error && (
            <div style={{ color: "#b91c1c", background: "#fef2f2", padding: "0.75rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}

          {!result ? (
            <>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>Select Resume</label>
                <select 
                  value={selectedResume} 
                  onChange={(e) => setSelectedResume(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                  disabled={generating}
                >
                  <option value="">-- Choose a resume --</option>
                  {resumes.filter(r => r.status === "analyzed").map(r => (
                    <option key={r.id} value={r.id}>{r.name} (ATS: {r.atsScore}%)</option>
                  ))}
                </select>
                {resumes.filter(r => r.status === "analyzed").length === 0 && (
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "0.25rem" }}>You need at least one fully analyzed resume to use this feature.</p>
                )}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>Paste Job Description</label>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job posting here..."
                  style={{ width: "100%", minHeight: "150px", padding: "0.75rem", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem", resize: "vertical" }}
                  disabled={generating}
                />
              </div>

              <button
                className={styles.accentBtn}
                style={{ width: "100%", opacity: selectedResume && jobDescription.trim() && !generating ? 1 : 0.5, cursor: selectedResume && jobDescription.trim() && !generating ? "pointer" : "not-allowed" }}
                disabled={!selectedResume || !jobDescription.trim() || generating}
                onClick={handleGenerate}
              >
                {generating ? "Generating Cover Letter..." : "Generate Cover Letter"}
              </button>
            </>
          ) : (
            <div>
              <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.1rem", color: "#111827", margin: 0 }}>Your AI Cover Letter</h3>
                <button 
                  onClick={handleCopy}
                  style={{ background: "#4f46e5", color: "white", padding: "0.4rem 0.8rem", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "0.85rem" }}
                >
                  Copy to Clipboard
                </button>
              </div>

              <div style={{ padding: "1.5rem", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#374151", fontSize: "0.95rem", lineHeight: "1.6", whiteSpace: "pre-wrap", minHeight: "200px" }}>
                {result.coverLetterText}
              </div>

              <button
                className={styles.accentBtn}
                style={{ width: "100%", marginTop: "1.5rem", background: "#fff", color: "#4f46e5", border: "1px solid #4f46e5" }}
                onClick={() => setResult(null)}
              >
                Generate Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
