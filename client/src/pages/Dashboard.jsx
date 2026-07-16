import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyResumes, getCoverLetters } from "../api/resumeService";
import { getATSReports } from "../api/atsService";
import { UploadCloud, Plus, LayoutTemplate, UserIcon, Search, Target, FileSignature, Eye } from "lucide-react";

import DashboardSidebar from "../components/dashbaord/DashboardSidebar";
import StatCard from "../components/dashbaord/StatCard";
import ResumeCard from "../components/dashbaord/ResumeCard";
import AnalysisItem from "../components/dashbaord/AnalysisItem";
import UploadModal from "../components/dashbaord/UploadModal";
import JDMatchModal from "../components/dashbaord/JDMatchModal";
import CoverLetterModal from "../components/dashbaord/CoverLetterModal";
import DetailedInsightsModal from "../components/dashbaord/DetailedInsightsModal";
import DashboardAnimation from "../components/ui/DashboardAnimation";
import styles from "../components/dashbaord/Dashboard.module.css";

// ── Context-aware Quick Actions ──────────────────────────────
const EMPTY_STATE_ACTIONS = [
  { icon: <UploadCloud size={20} />, label: "Upload Resume", bg: "rgba(6, 182, 212, 0.1)", color: "#06B6D4", action: "upload" },
  { icon: <Plus size={20} />, label: "Create Resume", bg: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6", action: "/create-resume" },
  { icon: <LayoutTemplate size={20} />, label: "Browse Templates", bg: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", action: "/templates" },
  { icon: <UserIcon size={20} />, label: "Complete Profile", bg: "rgba(236, 72, 153, 0.1)", color: "#EC4899", action: "/profile" },
];

const HAS_RESUMES_ACTIONS = [
  { icon: <Search size={20} />, label: "Analyze Latest Resume", bg: "rgba(6, 182, 212, 0.1)", color: "#06B6D4", action: "/ats-checker" },
  { icon: <Target size={20} />, label: "Match Job Description", bg: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6", action: "/jd-matcher" },
  { icon: <FileSignature size={20} />, label: "Generate Cover Letter", bg: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", action: "/cover-letter" },
  { icon: <Eye size={20} />, label: "View Latest Resume", bg: "rgba(236, 72, 153, 0.1)", color: "#EC4899", action: "view-latest" },
];

// stagger container
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } },
};

export default function Dashboard() {
  const [showUpload, setShowUpload] = useState(false);
  const [showJDModal, setShowJDModal] = useState(false);
  const [showCLModal, setShowCLModal] = useState(false);
  const [selectedInsightsResume, setSelectedInsightsResume] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState([]);
  const [analysesLoading, setAnalysesLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleResumeAction = (action, resume) => {
    if (action === "ATS") setSelectedInsightsResume(resume);
    if (action === "JD") setShowJDModal(true);
    if (action === "Cover") setShowCLModal(true);
  };

  const fetchResumes = async () => {
    try {
      const data = await getMyResumes();
      const formattedResumes = data.resumes.map(r => ({
        id: r._id,
        name: r.title,
        uploadedAt: new Date(r.createdAt).toISOString().split('T')[0],
        size: "File",
        atsScore: r.atsScore || null,
        status: r.analysisStatus ? r.analysisStatus.toLowerCase() : (r.atsScore ? "analyzed" : "pending"),
        role: r.template || "Unknown",
        strengths: r.strengths || [],
        weaknesses: r.weaknesses || [],
        aiSuggestions: r.aiSuggestions || []
      }));
      setResumes(formattedResumes);
    } catch (err) {
      console.error("Failed to fetch resumes", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch real analysis data: ATS reports + Cover Letters
  const fetchAnalyses = async () => {
    try {
      const items = [];

      // Fetch ATS reports
      try {
        const atsData = await getATSReports();
        if (atsData.reports) {
          atsData.reports.forEach(report => {
            items.push({
              id: report._id,
              type: "ATS Check",
              resume: report.resume?.title || "Resume",
              score: report.overallScore || 0,
              date: new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              highlight: report.summary ? report.summary.substring(0, 50) + (report.summary.length > 50 ? "…" : "") : "ATS analysis completed",
              tag: "ats",
              createdAt: new Date(report.createdAt)
            });
          });
        }
      } catch { /* ATS reports may be empty */ }

      // Fetch Cover Letters
      try {
        const clData = await getCoverLetters();
        if (clData.coverLetters) {
          clData.coverLetters.forEach(cl => {
            items.push({
              id: cl._id,
              type: "Cover Letter",
              resume: cl.resume?.title || "Resume",
              score: null,
              date: new Date(cl.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              highlight: "Cover letter generated",
              tag: "cover",
              createdAt: new Date(cl.createdAt)
            });
          });
        }
      } catch { /* Cover letters may be empty */ }

      // Sort by date, newest first
      items.sort((a, b) => b.createdAt - a.createdAt);
      setAnalyses(items);
    } catch (err) {
      console.error("Failed to fetch analyses", err);
    } finally {
      setAnalysesLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
    fetchAnalyses();
  }, []);

  // ── Computed Stats ──────────────────────────────────────────
  const scoredResumes = resumes.filter((r) => r.atsScore !== null && r.atsScore > 0);
  const avgScore = scoredResumes.length
    ? Math.round(scoredResumes.reduce((a, r) => a + r.atsScore, 0) / scoredResumes.length)
    : 0;
  const highestScore = scoredResumes.length
    ? Math.max(...scoredResumes.map(r => r.atsScore))
    : 0;
  const pendingCount = resumes.filter((r) => r.status === "pending").length;
  const analysesCount = analyses.length;

  const filteredResumes =
    activeTab === "all" ? resumes : resumes.filter((r) => r.status === activeTab);

  // Context-aware quick actions
  const quickActions = resumes.length === 0 ? EMPTY_STATE_ACTIONS : HAS_RESUMES_ACTIONS;
  const latestResumeId = resumes.length > 0 ? resumes[0].id : null;

  const handleQuickAction = (action) => {
    if (action.action === "upload") {
      setShowUpload(true);
    } else if (action.action === "view-latest" && latestResumeId) {
      navigate(`/view-resume/${latestResumeId}`);
    } else if (action.action.startsWith("/")) {
      navigate(action.action);
    }
  };

  // SVG ring helpers
  const R = 34;
  const circ = 2 * Math.PI * R;

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <DashboardAnimation />
      <div className={styles.dashRoot} style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Top Nav ──────────────────────────────────────────────────── */}
        <DashboardSidebar activeNav="dashboard" onUpload={() => setShowUpload(true)} user={user} />

        {/* ── Page Body ────────────────────────────────────────────────── */}
        <div className={styles.pageBody}>

          {/* ── Main Column ─────────────────────────────────────────── */}
          <div className={styles.mainCol}>

            {/* Page header — personalized welcome */}
            <div className={styles.pageHeader}>
              <div className={styles.pageHeaderLeft}>
                <h1 className={styles.pageTitle}>{greeting}, {user?.name?.split(' ')[0] || 'there'} <span style={{ display: "inline-block", transform: "translateY(2px)" }}>👋</span></h1>
                <div className={styles.pageDate}>
                  <span className={styles.pageDateDot} />
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  {highestScore > 0 && (
                    <>
                      <span style={{ margin: "0 6px", color: "var(--text-secondary)" }}>·</span>
                      <span style={{ color: "var(--success)", fontWeight: 600 }}>Highest ATS: {highestScore}%</span>
                    </>
                  )}
                  {resumes.length > 0 && (
                    <>
                      <span style={{ margin: "0 6px", color: "#475569" }}>·</span>
                      <span>{resumes.length} resume{resumes.length !== 1 ? "s" : ""} uploaded</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Stat Cards ──────────────────────────────────────── */}
            <motion.div
              className={styles.statsGrid}
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {[
                { label: "Total Resumes", value: resumes.length, change: "All time", accent: "lime", progress: Math.min(100, resumes.length * 20) },
                { label: "Highest ATS", value: highestScore > 0 ? `${highestScore}%` : "—", change: highestScore > 0 ? "Best score" : "No analyses yet", accent: "blue", progress: highestScore },
                { label: "Avg ATS Score", value: avgScore > 0 ? `${avgScore}%` : "—", change: avgScore > 0 ? `From ${scoredResumes.length} analyzed` : "No analyses yet", accent: "pink", progress: avgScore },
                { label: "Analyses Run", value: analysesCount, change: "ATS + JD + Cover Letters", accent: "amber", progress: Math.min(100, analysesCount * 10) },
              ].map((s) => (
                <motion.div key={s.label} variants={itemVariants}>
                  <StatCard {...s} />
                </motion.div>
              ))}
            </motion.div>

            {/* ── Resume Table ─────────────────────────────────────── */}
            <div>
              <div className={styles.sectionHead}>
                <span className={styles.sectionTitle}>Your Resumes</span>
                <div className={styles.tabPills}>
                  {["all", "analyzed", "pending"].map((t) => (
                    <button
                      key={t}
                      className={`${styles.tabPill} ${activeTab === t ? styles.tabPillActive : ""}`}
                      onClick={() => setActiveTab(t)}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.resumeTable}>
                {/* Table header */}
                <div className={styles.resumeTableHeader}>
                  <div className={styles.resumeTableHeaderCell}>File</div>
                  <div className={styles.resumeTableHeaderCell}>Uploaded</div>
                  <div className={styles.resumeTableHeaderCell}>Status</div>
                  <div className={styles.resumeTableHeaderCell}>ATS Score</div>
                  <div className={styles.resumeTableHeaderCell}>Actions</div>
                </div>

                {/* Rows */}
                {loading ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Loading resumes...</div>
                ) : filteredResumes.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>No resumes found. Upload one to get started!</div>
                ) : (
                  <motion.div variants={listVariants} initial="hidden" animate="show">
                    {filteredResumes.map((resume) => (
                      <motion.div key={resume.id} variants={itemVariants}>
                        <ResumeCard resume={resume} onActionClick={handleResumeAction} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Upload CTA at bottom of table */}
                <motion.div
                  className={styles.uploadCtaRow}
                  onClick={() => setShowUpload(true)}
                  id="upload-cta-card"
                >
                  <div className={styles.uploadCtaCircle}>+</div>
                  <div>
                    <div className={styles.uploadCtaLabel}>Upload new resume</div>
                    <div className={styles.uploadCtaSub}>PDF or DOCX · max 10 MB</div>
                  </div>
                </motion.div>
              </div>
            </div>

          </div>

          {/* ── Side Panel ──────────────────────────────────────────── */}
          <div className={styles.sidePanel}>

            {/* Recent Analysis — real data */}
            <div className={styles.sideCard}>
              <div className={styles.sideCardHeader}>
                <span className={styles.sideCardTitle}>
                  <span className={styles.sideCardTitleIcon}>📋</span>
                  Recent Analysis
                </span>
                <button className={styles.sectionLink} onClick={() => navigate("/ats-checker")}>View all</button>
              </div>
              {analysesLoading ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading...</div>
              ) : analyses.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#64748b", fontSize: 13 }}>
                  No analyses yet. Run an ATS check to get started.
                </div>
              ) : (
                <motion.div variants={listVariants} initial="hidden" animate="show">
                  {analyses.slice(0, 5).map((item) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <AnalysisItem item={item} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Quick Actions — context-aware */}
            <div className={styles.sideCard}>
              <div className={styles.sideCardHeader}>
                <span className={styles.sideCardTitle}>
                  <span className={styles.sideCardTitleIcon}>⚡</span>
                  Quick Actions
                </span>
              </div>
              <div className={styles.quickActions}>
                {quickActions.map((a) => (
                  <motion.div
                    key={a.label}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={styles.quickActionItem}
                    onClick={() => handleQuickAction(a)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.quickActionIconWrap} style={{ background: a.bg, color: a.color }}>
                      {a.icon}
                    </div>
                    <span className={styles.quickActionLabel}>{a.label}</span>
                    <span className={styles.quickActionArrow}>›</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ATS Insights */}
            <div className={styles.sideCard}>
              <div className={styles.sideCardHeader}>
                <span className={styles.sideCardTitle}>
                  <span className={styles.sideCardTitleIcon}>💡</span>
                  ATS Insights
                </span>
              </div>
              <div className={styles.insightBody}>
                <div className={styles.insightScoreRow}>
                  {/* Circular score ring */}
                  <div className={styles.insightRing}>
                    <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
                      <defs>
                        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      <circle cx="40" cy="40" r={R} fill="none" stroke="var(--border-default)" strokeWidth="5" />
                      <motion.circle
                        cx="40" cy="40" r={R}
                        fill="none"
                        stroke="url(#ringGrad)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        initial={{ strokeDashoffset: circ }}
                        animate={{ strokeDashoffset: circ * (1 - avgScore / 100) }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                      />
                    </svg>
                    <div className={styles.insightRingLabel}>
                      <span className={styles.insightRingNum}>{avgScore}%</span>
                      <span className={styles.insightRingText}>Avg ATS</span>
                    </div>
                  </div>
                  <p className={styles.insightDesc}>
                    {avgScore > 0 ? (
                      <>Your average ATS score is <strong style={{ color: "#818cf8" }}>{avgScore}%</strong>. {avgScore >= 85 ? "Excellent work! Your resumes are highly optimized." : avgScore >= 65 ? "Good progress. Focus on keyword density for better matches." : "Keep improving keyword density and formatting for better scores."}</>
                    ) : (
                      "Upload a resume and run an ATS analysis to see your score insights here."
                    )}
                  </p>
                </div>

                <div className={styles.tipsList}>
                  {[
                    'Use standard section headings like "Experience"',
                    "Avoid tables, text boxes, or columns",
                    "Quantify results with numbers & percentages",
                  ].map((tip) => (
                    <div key={tip} className={styles.tipRow}>
                      <span className={styles.tipDot} />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Upload Modal ───────────────────────────────────────────────── */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={() => { fetchResumes(); fetchAnalyses(); }} />}

      {/* ── JD Match Modal ─────────────────────────────────────────────── */}
      {showJDModal && <JDMatchModal onClose={() => setShowJDModal(false)} resumes={resumes} />}

      {/* ── Cover Letter Modal ─────────────────────────────────────────── */}
      {showCLModal && <CoverLetterModal onClose={() => setShowCLModal(false)} resumes={resumes} />}

      {/* ── Detailed Insights Modal ────────────────────────────────────── */}
      {selectedInsightsResume && <DetailedInsightsModal onClose={() => setSelectedInsightsResume(null)} resume={selectedInsightsResume} />}
    </>
  );
}