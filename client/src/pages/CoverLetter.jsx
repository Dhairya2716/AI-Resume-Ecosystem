import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "../components/dashbaord/DashboardSidebar";
import styles from "../components/dashbaord/Dashboard.module.css";
import { getMyResumes, generateCoverLetter, getCoverLetters, deleteCoverLetter } from "../api/resumeService";
import { FileText, Plus, Copy, RefreshCw, Trash2, Clock, Sparkles } from "lucide-react";

import { GlassCard, GradientButton, PremiumInput, SectionHeader, LoadingSkeleton, EmptyStateUI } from "../components/ui";

export default function CoverLetter() {
  const { user } = useAuth();

  // Data State
  const [resumes, setResumes] = useState([]);
  const [history, setHistory] = useState([]);

  // Form State
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // UI State
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // View State (either looking at a history item or the newly generated one)
  const [activeItem, setActiveItem] = useState(null);

  const fetchData = async () => {
    try {
      const [resumesData, historyData] = await Promise.all([
        getMyResumes(),
        getCoverLetters()
      ]);
      setResumes(resumesData.resumes.filter(r => r.atsScore !== null));
      setHistory(historyData.coverLetters || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedResumeId || !jobDescription.trim()) {
      setError("Please select a resume and paste a job description.");
      return;
    }
    setGenerating(true);
    setError("");
    setActiveItem(null);

    try {
      const data = await generateCoverLetter(selectedResumeId, jobDescription);

      const newLetter = data.coverLetter;
      const matchingResume = resumes.find(r => r._id === selectedResumeId);

      const itemToView = {
        id: newLetter._id,
        text: newLetter.coverLetterText,
        jd: newLetter.jobDescription,
        date: new Date(newLetter.createdAt).toLocaleDateString(),
        resumeTitle: matchingResume?.title || "Unknown Resume"
      };

      setActiveItem(itemToView);
      setHistory([{ ...newLetter, resume: { title: itemToView.resumeTitle } }, ...history]);
      setJobDescription("");
      setSelectedResumeId("");

    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate cover letter.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cover letter?")) return;
    try {
      await deleteCoverLetter(id);
      setHistory(history.filter(h => h._id !== id));
      if (activeItem?.id === id) setActiveItem(null);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete cover letter.");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const viewHistoryItem = (item) => {
    setActiveItem({
      id: item._id,
      text: item.coverLetterText,
      jd: item.jobDescription,
      date: new Date(item.createdAt).toLocaleDateString(),
      resumeTitle: item.resume?.title || "Unknown Resume"
    });
    setError("");
  };

  const startNew = () => {
    setActiveItem(null);
    setError("");
    setJobDescription("");
    setSelectedResumeId("");
  };

  return (
    <div className={styles.dashRoot}>
      <DashboardSidebar activeNav="cover-letter" user={user} />
      <div className={styles.pageBody}>
        <div className={styles.mainCol} style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem" }}>
          <SectionHeader
            icon={FileText}
            title="Cover Letter Generator"
            subtitle="Create tailored cover letters using AI based on your resume and a specific job posting."
            action={
              <GradientButton onClick={startNew} size="sm">
                <Plus size={16} /> New Cover Letter
              </GradientButton>
            }
          />

          {loading ? (
            <LoadingSkeleton message="Loading data..." />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem", alignItems: "start" }}>

              {/* ── Sidebar: History ── */}
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                <GlassCard hover={false} animate={false} padding="0"
                  style={{ maxHeight: "calc(100vh - 200px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{
                    padding: "1rem 1.25rem",
                    borderBottom: "1px solid var(--border-subtle)",
                    background: "rgba(0,0,0,0.2)",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                  }}>
                    <Clock size={14} style={{ color: "var(--violet)" }} />
                    <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Recent Letters
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "auto", fontFamily: "var(--font-mono)" }}>
                      {history.length}
                    </span>
                  </div>
                  <div style={{ overflowY: "auto", flex: 1 }}>
                    {history.length === 0 ? (
                      <div style={{ padding: "2rem 1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        No history found.
                      </div>
                    ) : (
                      history.map(item => (
                        <div
                          key={item._id}
                          onClick={() => viewHistoryItem(item)}
                          style={{
                            padding: "0.85rem 1.25rem",
                            borderBottom: "1px solid var(--border-subtle)",
                            cursor: "pointer",
                            background: activeItem?.id === item._id ? "rgba(99,102,241,0.15)" : "transparent",
                            borderLeft: activeItem?.id === item._id ? "3px solid var(--violet)" : "3px solid transparent",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (activeItem?.id !== item._id) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                          }}
                          onMouseLeave={(e) => {
                            if (activeItem?.id !== item._id) e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.resume?.title || "Unknown Resume"}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                              style={{
                                background: "none", border: "none", color: "var(--text-muted)",
                                cursor: "pointer", padding: "2px", borderRadius: "4px",
                                display: "flex", alignItems: "center", transition: "color 0.2s",
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </GlassCard>
              </motion.div>

              {/* ── Main Content: Form or Viewer ── */}
              <div style={{ minHeight: "500px" }}>
                <AnimatePresence mode="wait">
                  {generating ? (
                    <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <GlassCard hover={false} style={{
                        minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center",
                        background: "linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.05))",
                        border: "1.5px solid rgba(99,102,241,0.15)",
                      }}>
                        <LoadingSkeleton message="Writing your professional cover letter..." />
                      </GlassCard>
                    </motion.div>
                  ) : activeItem ? (
                    <motion.div key="view" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                      <GlassCard hover={false} animate={false}>
                        {/* Header */}
                        <div style={{
                          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                          marginBottom: "1.5rem", paddingBottom: "1rem",
                          borderBottom: "1px solid var(--border-subtle)",
                        }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                              <Sparkles size={18} style={{ color: "var(--violet)" }} />
                              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                                Generated Cover Letter
                              </h3>
                            </div>
                            <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.82rem", fontFamily: "var(--font-mono)" }}>
                              Based on: {activeItem.resumeTitle} • {activeItem.date}
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <GradientButton
                              variant="secondary" size="sm"
                              onClick={() => handleCopy(activeItem.text)}
                            >
                              <Copy size={14} />
                              {copied ? "Copied!" : "Copy"}
                            </GradientButton>
                            <GradientButton
                              variant="secondary" size="sm"
                              onClick={() => { setJobDescription(activeItem.jd); setActiveItem(null); }}
                            >
                              <RefreshCw size={14} /> Regenerate
                            </GradientButton>
                          </div>
                        </div>

                        {/* Letter Content */}
                        <div style={{
                          background: "rgba(0,0,0,0.2)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "12px", padding: "2rem",
                          whiteSpace: "pre-wrap", color: "var(--text-primary)",
                          fontSize: "0.95rem", lineHeight: 1.8,
                          fontFamily: "'Georgia', 'Times New Roman', serif",
                          maxHeight: "60vh", overflowY: "auto",
                          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
                        }}>
                          {activeItem.text}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                      <GlassCard hover={false} animate={false}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                          <Sparkles size={20} style={{ color: "var(--violet)" }} />
                          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                            Create New Cover Letter
                          </h3>
                        </div>

                        {error && (
                          <div style={{
                            background: "rgba(244,63,94,0.15)", color: "var(--danger)",
                            padding: "1rem", borderRadius: "12px", border: "1px solid rgba(244,63,94,0.3)",
                            marginBottom: "1.5rem", fontSize: "0.9rem",
                          }}>{error}</div>
                        )}

                        <div style={{ marginBottom: "1.5rem" }}>
                          <PremiumInput
                            label="1. Select Base Resume"
                            type="select"
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(e.target.value)}
                            options={[
                              { value: "", label: "— Choose a Resume —" },
                              ...resumes.map(r => ({ value: r._id, label: `${r.title} (ATS: ${r.atsScore}%)` })),
                            ]}
                          />
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                          <PremiumInput
                            label="2. Paste Job Description"
                            type="textarea"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job posting requirements here..."
                            rows={10}
                          />
                        </div>

                        <GradientButton
                          fullWidth size="lg"
                          onClick={handleGenerate}
                          disabled={!selectedResumeId || !jobDescription.trim() || generating}
                          loading={generating}
                        >
                          <Sparkles size={18} /> Generate Cover Letter
                        </GradientButton>
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
