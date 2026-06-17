import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getMyResumes } from "../api/resumeService";

import DashboardSidebar from "../components/dashbaord/DashboardSidebar";
import StatCard from "../components/dashbaord/StatCard";
import ResumeCard from "../components/dashbaord/ResumeCard";
import AnalysisItem from "../components/dashbaord/AnalysisItem";
import UploadModal from "../components/dashbaord/UploadModal";
import JDMatchModal from "../components/dashbaord/JDMatchModal";
import CoverLetterModal from "../components/dashbaord/CoverLetterModal";
import DetailedInsightsModal from "../components/dashbaord/DetailedInsightsModal";
import styles from "../components/dashbaord/Dashboard.module.css";

const MOCK_ANALYSES = [
  { id: 1, type: "ATS Check", resume: "Software_Engineer_Resume.pdf", score: 87, date: "May 18", highlight: "Strong keyword match", tag: "ats" },
  { id: 2, type: "JD Match", resume: "Product_Manager_v2.pdf", score: 68, date: "May 16", highlight: "Missing: Agile, OKR", tag: "jd" },
  { id: 3, type: "ATS Check", resume: "Data_Scientist_Resume.pdf", score: 91, date: "May 11", highlight: "Excellent formatting", tag: "ats" },
  { id: 4, type: "Cover Letter", resume: "Software_Engineer_Resume.pdf", score: null, date: "May 19", highlight: "Generated for Google SWE", tag: "cover" },
];

const QUICK_ACTIONS = [
  { icon: "◎", label: "Run ATS Check", bg: "#f0fdf4", color: "#16a34a" },
  { icon: "≡", label: "Match Job Description", bg: "#eff6ff", color: "#2563eb" },
  { icon: "✉", label: "Generate Cover Letter", bg: "#faf5ff", color: "#9333ea" },
  { icon: "⊡", label: "Browse Templates", bg: "#fffbeb", color: "#d97706" },
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
  const { user } = useAuth();

  const handleResumeAction = (action, resume) => {
    if (action === "ATS") setSelectedInsightsResume(resume);
    if (action === "JD") setShowJDModal(true);
    if (action === "Cover") setShowCLModal(true);
  };

  const fetchResumes = async () => {
    try {
      const data = await getMyResumes();
      // Map DB resumes to the UI structure expected by ResumeCard
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

  useEffect(() => {
    fetchResumes();
  }, []);

  const scoredResumes = resumes.filter((r) => r.atsScore !== null);
  const avgScore = scoredResumes.length
    ? Math.round(scoredResumes.reduce((a, r) => a + r.atsScore, 0) / scoredResumes.length)
    : 0;
  const pendingCount = resumes.filter((r) => r.status === "pending").length;
  const filteredResumes =
    activeTab === "all" ? resumes : resumes.filter((r) => r.status === activeTab);

  // SVG ring helpers
  const R = 34;
  const circ = 2 * Math.PI * R;

  return (
    <>
      <div className={styles.dashRoot}>
        {/* ── Top Nav ──────────────────────────────────────────────────── */}
        <DashboardSidebar activeNav="dashboard" onUpload={() => setShowUpload(true)} user={user} />

        {/* ── Page Body ────────────────────────────────────────────────── */}
        <div className={styles.pageBody}>

          {/* ── Main Column ─────────────────────────────────────────── */}
          <div className={styles.mainCol}>

            {/* Page header */}
            <div className={styles.pageHeader}>
              <div className={styles.pageHeaderLeft}>
                <h1 className={styles.pageTitle}>Good morning, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
                <div className={styles.pageDate}>
                  <span className={styles.pageDateDot} />
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
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
                { label: "Total Resumes", value: resumes.length, change: "All time", accent: "lime", progress: 80 },
                { label: "Avg ATS Score", value: `${avgScore}%`, change: "Calculated from analyzed", accent: "blue", progress: avgScore },
                { label: "Analyses Run", value: MOCK_ANALYSES.length, change: "All time", accent: "pink", progress: 100 },
                { label: "Pending Review", value: pendingCount, change: "Awaiting", accent: "amber", progress: 25 },
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
                  <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>Loading resumes...</div>
                ) : filteredResumes.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No resumes found. Upload one to get started!</div>
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
                  whileHover={{ background: "#fafbff" }}
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

            {/* Recent Analysis */}
            <div className={styles.sideCard}>
              <div className={styles.sideCardHeader}>
                <span className={styles.sideCardTitle}>
                  <span className={styles.sideCardTitleIcon}>📋</span>
                  Recent Analysis
                </span>
                <button className={styles.sectionLink}>View all</button>
              </div>
              <motion.div variants={listVariants} initial="hidden" animate="show">
                {MOCK_ANALYSES.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <AnalysisItem item={item} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className={styles.sideCard}>
              <div className={styles.sideCardHeader}>
                <span className={styles.sideCardTitle}>
                  <span className={styles.sideCardTitleIcon}>⚡</span>
                  Quick Actions
                </span>
              </div>
              <div className={styles.quickActions}>
                {QUICK_ACTIONS.map((a) => (
                  <motion.div
                    key={a.label}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={styles.quickActionItem}
                    onClick={() => {
                      if (a.label === 'Match Job Description') setShowJDModal(true);
                      if (a.label === 'Generate Cover Letter') setShowCLModal(true);
                    }}
                    style={{ cursor: (a.label === 'Match Job Description' || a.label === 'Generate Cover Letter') ? 'pointer' : 'default' }}
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
                      <circle cx="40" cy="40" r={R} fill="none" stroke="#f3f4f6" strokeWidth="5" />
                      <motion.circle
                        cx="40" cy="40" r={R}
                        fill="none"
                        stroke="#4f46e5"
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
                    Your average ATS score is <strong style={{ color: "#4f46e5" }}>{avgScore}%</strong>. Keep improving keyword density for better matches.
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
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={fetchResumes} />}

      {/* ── JD Match Modal ─────────────────────────────────────────────── */}
      {showJDModal && <JDMatchModal onClose={() => setShowJDModal(false)} resumes={resumes} />}

      {/* ── Cover Letter Modal ─────────────────────────────────────────── */}
      {showCLModal && <CoverLetterModal onClose={() => setShowCLModal(false)} resumes={resumes} />}

      {/* ── Detailed Insights Modal ────────────────────────────────────── */}
      {selectedInsightsResume && <DetailedInsightsModal onClose={() => setSelectedInsightsResume(null)} resume={selectedInsightsResume} />}
    </>
  );
}