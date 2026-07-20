import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "../components/dashbaord/DashboardSidebar";
import styles from "../components/dashbaord/Dashboard.module.css";
import { getMyResumes, matchWithJD } from "../api/resumeService";
import { Target, FileText, Sparkles, CheckCircle2, XCircle, Lightbulb, BarChart3 } from "lucide-react";

import { GlassCard, GradientButton, PremiumInput, SectionHeader, LoadingSkeleton, EmptyStateUI } from "../components/ui";
import ScoreRing from "../components/ui/ScoreRing";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function JDMatcher() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getMyResumes();
        setResumes(data.resumes.filter(r => r.atsScore !== null));
      } catch (err) {
        console.error("Failed to fetch resumes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedResumeId || !jobDescription.trim()) {
      setError("Please select a resume and paste a job description.");
      return;
    }
    setAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const data = await matchWithJD(selectedResumeId, jobDescription);
      setResult(data.match);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to analyze match.");
    } finally {
      setAnalyzing(false);
    }
  };

  const matchStrength = (score) => {
    if (score > 80) return { label: "Strong Match",   color: "#10b981" };
    if (score > 60) return { label: "Moderate Match", color: "#f59e0b" };
    return              { label: "Weak Match",       color: "#f43f5e" };
  };

  return (
    <div className={styles.dashRoot}>
      <DashboardSidebar activeNav="jd-matcher" user={user} />
      <div className={styles.pageBody}>
        <div className={styles.mainCol} style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem" }}>
          <SectionHeader
            icon={Target}
            title="Job Description Matcher"
            subtitle="Compare your resume against a specific job posting to find gaps and boost your match score."
          />

          {loading ? (
            <LoadingSkeleton message="Loading resumes..." />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
              {/* ── Left Column: Inputs ── */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <GlassCard hover={false} animate={false}>
                  <PremiumInput
                    label="Select Resume"
                    type="select"
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    disabled={analyzing}
                    options={[
                      { value: "", label: "— Choose a Resume —" },
                      ...resumes.map(r => ({ value: r._id, label: `${r.title} (ATS: ${r.atsScore}%)` })),
                    ]}
                  />
                  {resumes.length === 0 && (
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                      You need to upload and analyze a resume first.
                    </p>
                  )}
                </GlassCard>

                <GlassCard hover={false} animate={false} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <PremiumInput
                    label="Paste Job Description"
                    type="textarea"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job posting requirements here..."
                    disabled={analyzing}
                    rows={10}
                  />
                </GlassCard>

                {error && (
                  <div style={{
                    background: "rgba(244,63,94,0.15)", color: "var(--danger)",
                    padding: "1rem", borderRadius: "12px", border: "1px solid rgba(244,63,94,0.3)",
                    fontSize: "0.9rem",
                  }}>
                    {error}
                  </div>
                )}

                <GradientButton
                  fullWidth size="lg"
                  onClick={handleAnalyze}
                  disabled={!selectedResumeId || !jobDescription.trim() || analyzing}
                  loading={analyzing}
                >
                  {analyzing ? "Running Match Analysis..." : "Match Resume"}
                </GradientButton>
              </motion.div>

              {/* ── Right Column: Results ── */}
              <div style={{ minHeight: "400px" }}>
                <AnimatePresence mode="wait">
                  {analyzing ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <GlassCard hover={false} style={{ minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <LoadingSkeleton message="Comparing resume with Job Description..." />
                      </GlassCard>
                    </motion.div>
                  ) : result ? (
                    <motion.div key="results" variants={stagger} initial="hidden" animate="show"
                      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {/* Score Hero */}
                      <motion.div variants={fadeUp}>
                        <GlassCard glow="purple" hover={false} animate={false} style={{
                          display: "flex", alignItems: "center", gap: "2rem",
                          background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.07))",
                          border: "1.5px solid rgba(99,102,241,0.18)",
                          padding: "2rem",
                        }}>
                          <ScoreRing score={result.matchScore} size={120} label="Match" />
                          <div>
                            <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.5rem 0" }}>
                              Match Analysis
                            </h3>
                            <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.9rem" }}>
                              Your resume is a{" "}
                              <span style={{ color: matchStrength(result.matchScore).color, fontWeight: 600, textShadow: `0 0 8px ${matchStrength(result.matchScore).color}80` }}>
                                {matchStrength(result.matchScore).label.toLowerCase()}
                              </span>{" "}
                              for this role.
                            </p>
                          </div>
                        </GlassCard>
                      </motion.div>

                      {/* Matched Keywords */}
                      <motion.div variants={fadeUp}>
                        <GlassCard hover={false} animate={false}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                            <CheckCircle2 size={18} style={{ color: "#10b981" }} />
                            <h4 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                              Matched Keywords
                            </h4>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.15)", padding: "2px 8px", borderRadius: "12px", border: "1px solid rgba(16,185,129,0.3)" }}>
                              {result.matchedKeywords?.length || 0}
                            </span>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                            {(result.matchedKeywords || []).map((kw, i) => (
                              <span key={i} style={{
                                background: "rgba(16,185,129,0.15)", color: "#10b981",
                                border: "1px solid rgba(16,185,129,0.3)",
                                padding: "0.3rem 0.75rem", borderRadius: "20px",
                                fontSize: "0.8rem", fontWeight: 600,
                              }}>{kw}</span>
                            ))}
                            {(!result.matchedKeywords || result.matchedKeywords.length === 0) && (
                              <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>None found</span>
                            )}
                          </div>
                        </GlassCard>
                      </motion.div>

                      {/* Missing Keywords */}
                      <motion.div variants={fadeUp}>
                        <GlassCard hover={false} animate={false}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                            <XCircle size={18} style={{ color: "#f43f5e" }} />
                            <h4 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                              Missing Keywords
                            </h4>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f43f5e", background: "rgba(244,63,94,0.15)", padding: "2px 8px", borderRadius: "12px", border: "1px solid rgba(244,63,94,0.3)" }}>
                              {result.missingKeywords?.length || 0}
                            </span>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                            {(result.missingKeywords || []).map((kw, i) => (
                              <span key={i} style={{
                                background: "rgba(244,63,94,0.15)", color: "#f43f5e",
                                border: "1px solid rgba(244,63,94,0.3)",
                                padding: "0.3rem 0.75rem", borderRadius: "20px",
                                fontSize: "0.8rem", fontWeight: 600,
                              }}>{kw}</span>
                            ))}
                            {(!result.missingKeywords || result.missingKeywords.length === 0) && (
                              <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>None found</span>
                            )}
                          </div>
                        </GlassCard>
                      </motion.div>

                      {/* Suggestions */}
                      {result.suggestions?.length > 0 && (
                        <motion.div variants={fadeUp}>
                          <GlassCard hover={false} animate={false} style={{ borderLeft: "3px solid rgba(99,102,241,0.4)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                              <Lightbulb size={18} style={{ color: "#6366f1" }} />
                              <h4 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#6366f1", margin: 0 }}>
                                How to Improve
                              </h4>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                              {result.suggestions.map((s, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.5rem 0", borderBottom: i < result.suggestions.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                                  <span style={{
                                    width: "24px", height: "24px", borderRadius: "6px",
                                    background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
                                    color: "var(--violet)", fontSize: "0.75rem", fontWeight: 700,
                                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                  }}>{i + 1}</span>
                                  <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{s}</span>
                                </div>
                              ))}
                            </div>
                          </GlassCard>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <EmptyStateUI
                        icon={Target}
                        title="Ready to Match"
                        subtitle="Select a resume and paste a job description on the left, then click Match Resume to see your compatibility score."
                      />
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
