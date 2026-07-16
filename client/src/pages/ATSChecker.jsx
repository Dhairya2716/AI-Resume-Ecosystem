import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "../components/dashbaord/DashboardSidebar";
import dashStyles from "../components/dashbaord/Dashboard.module.css";
import s from "./ATSChecker.module.css";
import { getMyResumes } from "../api/resumeService";
import { runATSCheck, getATSReports, deleteATSReport } from "../api/atsService";
import { SectionHeader } from "../components/ui";
import { FileSearch, BarChart3, ClipboardList, Trash2, RotateCcw } from "lucide-react";

// ── Section meta for display ─────────────────────────────────────────────
const SECTIONS = [
  { key: "contactInfo", label: "Contact Information", icon: "📇" },
  { key: "summary",     label: "Professional Summary", icon: "📝" },
  { key: "experience",  label: "Work Experience",      icon: "💼" },
  { key: "education",   label: "Education",            icon: "🎓" },
  { key: "skills",      label: "Skills",               icon: "⚡" },
  { key: "formatting",  label: "Formatting & ATS",     icon: "📐" },
];

// ── Helper: score → color ────────────────────────────────────────────────
const scoreColor = (score) => {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
};

const scoreGradeClass = (score) => {
  if (score >= 80) return s.gradeHigh;
  if (score >= 60) return s.gradeMedium;
  return s.gradeLow;
};

const historyBadgeClass = (score) => {
  if (score >= 80) return s.historyScoreHigh;
  if (score >= 60) return s.historyScoreMedium;
  return s.historyScoreLow;
};

// ── Animations ───────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

// ═════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═════════════════════════════════════════════════════════════════════════
export default function ATSChecker() {
  const { user } = useAuth();

  // Data
  const [resumes, setResumes] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);

  // Form
  const [selectedResumeId, setSelectedResumeId] = useState("");

  // UI
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  // ── Fetch initial data ───────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeData, reportData] = await Promise.all([
          getMyResumes(),
          getATSReports(),
        ]);
        setResumes(resumeData.resumes || []);
        setReports(reportData.reports || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Run analysis ─────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      setError("Please select a resume to analyze.");
      return;
    }
    setAnalyzing(true);
    setError("");
    setActiveReport(null);

    try {
      const data = await runATSCheck(selectedResumeId);
      const newReport = data.report;

      setActiveReport(newReport);
      setReports((prev) => [newReport, ...prev]);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Analysis failed. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // ── Delete report ────────────────────────────────────────────────────
  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Delete this ATS report?")) return;
    try {
      await deleteATSReport(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
      if (activeReport?._id === id) setActiveReport(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ── Score ring SVG values ────────────────────────────────────────────
  const R = 54;
  const CIRC = 2 * Math.PI * R;

  // ── Score ring for hero ──────────────────────────────────────────────
  const renderScoreRing = (report) => {
    const score = report.overallScore;
    const color = scoreColor(score);
    const offset = CIRC * (1 - score / 100);

    return (
      <div className={s.scoreRingWrap} style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r={R} className={s.scoreRingBg} strokeWidth="8" />
          <motion.circle
            cx="70" cy="70" r={R}
            className={s.scoreRingFg}
            stroke={color}
            strokeWidth="8"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </svg>
        <div className={s.scoreRingCenter}>
          <span className={s.scoreNumber}>{score}</span>
          <span className={`${s.scoreGrade} ${scoreGradeClass(score)}`}>
            {report.grade}
          </span>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className={dashStyles.dashRoot}>
      <DashboardSidebar activeNav="ats" user={user} />

      <div className={dashStyles.pageBody}>
        <div
          className={dashStyles.mainCol}
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem" }}
        >
          <SectionHeader
            icon={FileSearch}
            title="ATS Checker"
            subtitle="Run a deep, section-by-section analysis of your resume against ATS standards."
          />

          {error && (
            <div className={s.errorBanner}>
              <span>⚠</span> {error}
            </div>
          )}

          {loading ? (
            <div className={s.analyzingWrap}>
              <div className={s.analyzingSpinner} />
              <h3 className={s.analyzingTitle}>Loading data…</h3>
            </div>
          ) : (
            <div className={s.atsGrid}>
              {/* ━━━━━━━━━━━━━━━━━━ LEFT PANEL ━━━━━━━━━━━━━━━━━━ */}
              <div className={s.sidePanel}>
                {/* Analyze Card */}
                <div className={s.analyzeCard}>
                  <div className={s.analyzeCardTitle}>Run Analysis</div>

                  <div className={s.selectWrap}>
                    <label className={s.selectLabel}>Resume</label>
                    <select
                      className={s.selectInput}
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      disabled={analyzing}
                      id="ats-resume-select"
                    >
                      <option value="">— Select a Resume —</option>
                      {resumes.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className={s.analyzeBtn}
                    onClick={handleAnalyze}
                    disabled={!selectedResumeId || analyzing}
                    id="ats-analyze-btn"
                  >
                    {analyzing ? (
                      <>
                        <div className={s.analyzeBtnSpinner} />
                        Analyzing…
                      </>
                    ) : (
                      <>📊 Run Deep Analysis</>
                    )}
                  </button>
                </div>

                {/* History */}
                <div className={s.historyCard}>
                  <div className={s.historyHeader}>
                    <span>📋</span> Analysis History
                  </div>
                  <div className={s.historyList}>
                    {reports.length === 0 ? (
                      <div className={s.historyEmpty}>
                        No reports yet. Run your first analysis!
                      </div>
                    ) : (
                      reports.map((report) => (
                        <div
                          key={report._id}
                          className={`${s.historyItem} ${
                            activeReport?._id === report._id
                              ? s.historyItemActive
                              : ""
                          }`}
                          onClick={() => setActiveReport(report)}
                        >
                          <div
                            className={`${s.historyScoreBadge} ${historyBadgeClass(
                              report.overallScore
                            )}`}
                          >
                            {report.overallScore}
                          </div>
                          <div className={s.historyItemInfo}>
                            <div className={s.historyItemTitle}>
                              {report.resume?.title || "Resume"}
                            </div>
                            <div className={s.historyItemMeta}>
                              {new Date(report.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
                          <button
                            className={s.historyDeleteBtn}
                            onClick={(e) => handleDelete(report._id, e)}
                            title="Delete report"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* ━━━━━━━━━━━━━━━━━━ RIGHT PANEL ━━━━━━━━━━━━━━━━━━ */}
              <div className={s.resultPanel}>
                {analyzing ? (
                  /* Analyzing animation */
                  <div className={s.analyzingWrap}>
                    <div className={s.analyzingSpinner} />
                    <h3 className={s.analyzingTitle}>
                      Running Deep ATS Analysis…
                    </h3>
                    <p className={s.analyzingSubtitle}>
                      Scanning sections, keywords, and formatting
                    </p>
                    <div className={s.analyzingPulse}>
                      <div className={s.analyzingDot} />
                      <div className={s.analyzingDot} />
                      <div className={s.analyzingDot} />
                    </div>
                  </div>
                ) : activeReport ? (
                  /* ── Results ────────────────────────────────────── */
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                  >
                    {/* Score Hero */}
                    <motion.div variants={fadeUp} className={s.scoreHero}>
                      {renderScoreRing(activeReport)}
                      <div className={s.scoreHeroInfo}>
                        <h2 className={s.scoreHeroTitle}>ATS Analysis Report</h2>
                        <p className={s.scoreHeroResume}>
                          {activeReport.resume?.title || "Resume"} •{" "}
                          {new Date(activeReport.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p className={s.scoreHeroSummary}>
                          {activeReport.summary}
                        </p>
                        <div className={s.scoreHeroActions}>
                          <button
                            className={`${s.heroBtn} ${s.heroBtnPrimary}`}
                            onClick={() => {
                              setSelectedResumeId(
                                activeReport.resume?._id || ""
                              );
                              setActiveReport(null);
                            }}
                          >
                            🔄 Re-analyze
                          </button>
                          <button
                            className={`${s.heroBtn} ${s.heroBtnDanger}`}
                            onClick={(e) =>
                              handleDelete(activeReport._id, e)
                            }
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Section Scores */}
                    <motion.div
                      variants={fadeUp}
                      className={s.sectionScoresCard}
                    >
                      <h3 className={s.sectionScoresTitle}>
                        <span>📊</span> Section-by-Section Scores
                      </h3>
                      {SECTIONS.map(({ key, label, icon }) => {
                        const section =
                          activeReport.sectionScores?.[key] || {};
                        const score = section.score || 0;
                        const color = scoreColor(score);
                        return (
                          <div key={key} className={s.sectionRow}>
                            <div
                              className={s.sectionIcon}
                              style={{
                                background: `${color}15`,
                              }}
                            >
                              {icon}
                            </div>
                            <div className={s.sectionInfo}>
                              <div className={s.sectionName}>{label}</div>
                              <div className={s.sectionBarWrap}>
                                <motion.div
                                  className={s.sectionBar}
                                  style={{ background: color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${score}%` }}
                                  transition={{
                                    duration: 1.2,
                                    ease: [0.4, 0, 0.2, 1],
                                  }}
                                />
                              </div>
                              {section.feedback && (
                                <p className={s.sectionFeedback}>
                                  {section.feedback}
                                </p>
                              )}
                            </div>
                            <div
                              className={s.sectionScoreLabel}
                              style={{ color }}
                            >
                              {score}%
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>

                    {/* Keywords */}
                    {(activeReport.keywords?.found?.length > 0 ||
                      activeReport.keywords?.missing?.length > 0) && (
                      <motion.div
                        variants={fadeUp}
                        className={s.keywordsCard}
                      >
                        <h3 className={s.keywordsTitle}>
                          <span>🔑</span> Keyword Analysis
                        </h3>
                        <div className={s.keywordsGrid}>
                          <div className={s.keywordsGroup}>
                            <div
                              className={`${s.keywordsGroupLabel} ${s.keywordsGroupLabelFound}`}
                            >
                              <span>✓</span> Found (
                              {activeReport.keywords.found.length})
                            </div>
                            <div className={s.chipWrap}>
                              {activeReport.keywords.found.map((kw, i) => (
                                <span key={i} className={`${s.chip} ${s.chipFound}`}>
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className={s.keywordsGroup}>
                            <div
                              className={`${s.keywordsGroupLabel} ${s.keywordsGroupLabelMissing}`}
                            >
                              <span>✗</span> Missing (
                              {activeReport.keywords.missing.length})
                            </div>
                            <div className={s.chipWrap}>
                              {activeReport.keywords.missing.map((kw, i) => (
                                <span
                                  key={i}
                                  className={`${s.chip} ${s.chipMissing}`}
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Strengths & Weaknesses */}
                    <motion.div variants={fadeUp} className={s.insightsGrid}>
                      <div className={s.insightCard}>
                        <h4
                          className={`${s.insightCardTitle} ${s.insightTitleStrength}`}
                        >
                          <span>✓</span> Strengths
                        </h4>
                        <ul className={s.insightList}>
                          {(activeReport.strengths || []).map((item, i) => (
                            <li key={i} className={s.insightListItem}>
                              <span
                                className={`${s.insightDot} ${s.dotGreen}`}
                              />
                              {item}
                            </li>
                          ))}
                          {(!activeReport.strengths ||
                            activeReport.strengths.length === 0) && (
                            <li className={s.insightListItem}>
                              <span
                                className={`${s.insightDot} ${s.dotGreen}`}
                              />
                              No specific strengths identified.
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className={s.insightCard}>
                        <h4
                          className={`${s.insightCardTitle} ${s.insightTitleWeakness}`}
                        >
                          <span>⚠</span> Areas to Improve
                        </h4>
                        <ul className={s.insightList}>
                          {(activeReport.weaknesses || []).map((item, i) => (
                            <li key={i} className={s.insightListItem}>
                              <span
                                className={`${s.insightDot} ${s.dotRed}`}
                              />
                              {item}
                            </li>
                          ))}
                          {(!activeReport.weaknesses ||
                            activeReport.weaknesses.length === 0) && (
                            <li className={s.insightListItem}>
                              <span
                                className={`${s.insightDot} ${s.dotRed}`}
                              />
                              No major weaknesses found.
                            </li>
                          )}
                        </ul>
                      </div>
                    </motion.div>

                    {/* Suggestions */}
                    {activeReport.suggestions?.length > 0 && (
                      <motion.div
                        variants={fadeUp}
                        className={s.suggestionsCard}
                      >
                        <h3 className={s.suggestionsTitle}>
                          <span>💡</span> Actionable Suggestions
                        </h3>
                        {activeReport.suggestions.map((sug, i) => (
                          <div key={i} className={s.suggestionItem}>
                            <div className={s.suggestionNumber}>{i + 1}</div>
                            <div className={s.suggestionText}>{sug}</div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  /* Empty State */
                  <div className={s.emptyState}>
                    <div className={s.emptyIcon}>📊</div>
                    <h3 className={s.emptyTitle}>Ready to Analyze</h3>
                    <p className={s.emptySubtitle}>
                      Select a resume from the panel on the left and click
                      "Run Deep Analysis" to get a detailed section-by-section
                      ATS report with keywords, strengths, and actionable
                      suggestions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
