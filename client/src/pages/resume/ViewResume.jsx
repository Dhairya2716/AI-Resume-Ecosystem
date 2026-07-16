import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import DashboardSidebar from "../../components/dashbaord/DashboardSidebar";
import dashStyles from "../../components/dashbaord/Dashboard.module.css";
import { useAuth } from "../../context/AuthContext";
import GlassCard from "../../components/ui/GlassCard";
import GradientButton from "../../components/ui/GradientButton";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import html2pdf from "html2pdf.js";

function getScoreColor(score) {
  if (score >= 85) return "#059669"; // Emerald 600
  if (score >= 65) return "#d97706"; // Amber 600
  if (score >= 40) return "#ea580c"; // Orange 600
  return "#e11d48"; // Rose 600
}

function getScoreLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 40) return "Needs Work";
  return "Poor";
}

const labelStyle = {
  fontSize: "11px",
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "6px"
};

const valueStyle = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#0f172a",
  lineHeight: 1.5
};

const tagStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 700,
  background: "rgba(99,102,241,0.08)",
  color: "#6366f1",
  border: "1px solid rgba(99,102,241,0.2)"
};

const linkStyle = {
  color: "#6366f1",
  fontSize: "13px",
  textDecoration: "none",
  fontFamily: "var(--font-mono)",
  transition: "color 0.2s",
  fontWeight: 600
};

export default function ViewResume() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await API.get(`/resume/${id}`);
        setResume(res.data.resume);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load resume.");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  const handleExportPDF = async () => {
    if (!printRef.current || !resume) return;
    setIsExporting(true);
    
    // Temporarily make it visible for html2pdf to read it properly
    const element = printRef.current;
    element.style.display = "block";
    
    const opt = {
      margin:       0,
      filename:     `${resume.title || 'Resume'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error("PDF Export failed", err);
    } finally {
      element.style.display = "none";
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className={dashStyles.dashRoot}>
        <DashboardSidebar user={user} />
        <div className={dashStyles.pageBody}>
          <LoadingSkeleton message="Loading your resume..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={dashStyles.dashRoot}>
        <DashboardSidebar user={user} />
        <div className={dashStyles.pageBody}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 16 }}>
            <div style={{ fontSize: 40, opacity: 0.3 }}>⚠</div>
            <div style={{ color: "#e11d48", fontSize: 15, fontWeight: 600 }}>{error}</div>
            <GradientButton variant="secondary" onClick={() => navigate("/my-resume")}>
              ← Back to My Resumes
            </GradientButton>
          </div>
        </div>
      </div>
    );
  }

  const r = resume;
  const pi = r.personalInfo || {};
  const hasScore = r.atsScore && r.atsScore > 0;
  const scoreColor = hasScore ? getScoreColor(r.atsScore) : "#64748b";
  const scoreLabel = hasScore ? getScoreLabel(r.atsScore) : "Not Analyzed";

  const fmt = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—";

  return (
    <div className={dashStyles.dashRoot}>
      <DashboardSidebar user={user} />

      <div className={dashStyles.pageBody}>
        <div style={{ flex: 1, maxWidth: 900, margin: "0 auto", paddingBottom: "3rem" }}>

          {/* ── Action Bar ──────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, gap: 16, flexWrap: "wrap" }}>
            <div>
              <h1 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800,
                color: "#0f172a", margin: 0, letterSpacing: "-0.5px"
              }}>
                {r.title}
              </h1>
              <div style={{ fontSize: 13, color: "#64748b", fontFamily: "var(--font-mono)", marginTop: 8, display: "flex", gap: 16, alignItems: "center" }}>
                <span>📅 Created {fmt(r.createdAt)}</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#cbd5e1" }} />
                <span style={{ textTransform: "capitalize" }}>🎨 {r.template || "modern"} template</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <GradientButton variant="secondary" onClick={() => navigate("/my-resume")}>
                ← Back
              </GradientButton>
              <GradientButton variant="secondary" onClick={() => navigate(`/edit-resume/${r._id}`)}>
                ✏ Edit
              </GradientButton>
              <GradientButton variant="primary" onClick={handleExportPDF} loading={isExporting}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Export to PDF
              </GradientButton>
            </div>
          </div>

          {/* ── ATS Score Banner ─────────────────────────────────── */}
          {hasScore && (
            <GlassCard hover={false} style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 24, padding: "24px 28px", borderLeft: `4px solid ${scoreColor}` }}>
              <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(15,23,42,0.05)" strokeWidth="5" />
                  <circle
                    cx="36" cy="36" r="30" fill="none" stroke={scoreColor} strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 30}
                    strokeDashoffset={2 * Math.PI * 30 * (1 - r.atsScore / 100)}
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{r.atsScore}</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                  ATS Score: <span style={{ color: scoreColor }}>{scoreLabel}</span>
                </div>
                {r.summary && (
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{r.summary}</p>
                )}
              </div>
            </GlassCard>
          )}

          {/* ── Strengths & Weaknesses ──────────────────────────── */}
          {(r.strengths?.length > 0 || r.weaknesses?.length > 0) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              {r.strengths?.length > 0 && (
                <GlassCard hover={false}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                    <span>💪</span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Strengths</span>
                  </div>
                  <div>
                    {r.strengths.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669", flexShrink: 0, marginTop: 7 }} />
                        <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
              {r.weaknesses?.length > 0 && (
                <GlassCard hover={false}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                    <span>⚡</span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Areas to Improve</span>
                  </div>
                  <div>
                    {r.weaknesses.map((w, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d97706", flexShrink: 0, marginTop: 7 }} />
                        <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{w}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          )}

          {/* ── Personal Info ───────────────────────────────────── */}
          {(pi.fullName || pi.email || pi.phone) && (
            <GlassCard hover={false} style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                <span>👤</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Personal Info</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
                {pi.fullName && <div><div style={labelStyle}>Full Name</div><div style={valueStyle}>{pi.fullName}</div></div>}
                {pi.email && <div><div style={labelStyle}>Email</div><div style={valueStyle}>{pi.email}</div></div>}
                {pi.phone && <div><div style={labelStyle}>Phone</div><div style={valueStyle}>{pi.phone}</div></div>}
                {pi.address && <div><div style={labelStyle}>Location</div><div style={valueStyle}>{pi.address}</div></div>}
                {pi.linkedin && <div><div style={labelStyle}>LinkedIn</div><a href={pi.linkedin.startsWith("http") ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>{pi.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></div>}
                {pi.github && <div><div style={labelStyle}>GitHub</div><a href={pi.github.startsWith("http") ? pi.github : `https://${pi.github}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>{pi.github.replace(/^https?:\/\/(www\.)?/, '')}</a></div>}
                {pi.portfolio && <div><div style={labelStyle}>Portfolio</div><a href={pi.portfolio.startsWith("http") ? pi.portfolio : `https://${pi.portfolio}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>{pi.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</a></div>}
              </div>
            </GlassCard>
          )}

          {/* ── Professional Summary ────────────────────────────── */}
          {r.summary && (
            <GlassCard hover={false} style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                <span>📝</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Professional Summary</span>
              </div>
              <div>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.7, margin: 0 }}>{r.summary}</p>
              </div>
            </GlassCard>
          )}

          {/* ── Experience ──────────────────────────────────────── */}
          {r.experience?.length > 0 && r.experience.some(e => e.company || e.position) && (
            <GlassCard hover={false} style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                <span>💼</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Experience</span>
              </div>
              <div>
                {r.experience.filter(e => e.company || e.position).map((exp, i) => (
                  <div key={i} style={{ paddingBottom: 20, marginBottom: 20, borderBottom: i < r.experience.length - 1 ? "1px solid rgba(15,23,42,0.06)" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{exp.position}</div>
                        <div style={{ fontSize: 14, color: "#6366f1", marginTop: 3, fontWeight: 600 }}>{exp.company}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", background: "rgba(15,23,42,0.04)", padding: "4px 8px", borderRadius: "6px" }}>
                        {exp.startDate} — {exp.endDate || "Present"}
                      </div>
                    </div>
                    {exp.description && <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* ── Education ───────────────────────────────────────── */}
          {r.education?.length > 0 && r.education.some(e => e.institution || e.degree) && (
            <GlassCard hover={false} style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                <span>🎓</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Education</span>
              </div>
              <div>
                {r.education.filter(e => e.institution || e.degree).map((edu, i) => (
                  <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < r.education.length - 1 ? "1px solid rgba(15,23,42,0.06)" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</div>
                        <div style={{ fontSize: 14, color: "#6366f1", marginTop: 3, fontWeight: 600 }}>{edu.institution}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", background: "rgba(15,23,42,0.04)", padding: "4px 8px", borderRadius: "6px" }}>
                        {edu.startDate} — {edu.endDate || "Present"}
                      </div>
                    </div>
                    {edu.description && <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "8px 0 0" }}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* ── Skills ──────────────────────────────────────────── */}
          {r.skills?.length > 0 && (
            <GlassCard hover={false} style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                <span>🛠</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Skills</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {r.skills.map((skill, i) => (
                  <span key={i} style={tagStyle}>{skill}</span>
                ))}
              </div>
            </GlassCard>
          )}

          {/* ── Projects ────────────────────────────────────────── */}
          {r.projects?.length > 0 && r.projects.some(p => p.title) && (
            <GlassCard hover={false} style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                <span>🚀</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Projects</span>
              </div>
              <div>
                {r.projects.filter(p => p.title).map((proj, i) => (
                  <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < r.projects.length - 1 ? "1px solid rgba(15,23,42,0.06)" : "none" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{proj.title}</div>
                    {proj.techStack && <div style={{ fontSize: 13, color: "#6366f1", marginBottom: 8, fontFamily: "var(--font-mono)", fontWeight: 600 }}>Tech: {proj.techStack}</div>}
                    {proj.description && <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 12px" }}>{proj.description}</p>}
                    <div style={{ display: "flex", gap: 16 }}>
                      {proj.githubLink && <a href={proj.githubLink.startsWith("http") ? proj.githubLink : `https://${proj.githubLink}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>GitHub →</a>}
                      {proj.liveLink && <a href={proj.liveLink.startsWith("http") ? proj.liveLink : `https://${proj.liveLink}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>Live Demo →</a>}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* ── Certifications ──────────────────────────────────── */}
          {r.certifications?.length > 0 && r.certifications.some(c => c.name) && (
            <GlassCard hover={false} style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                <span>🏅</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Certifications</span>
              </div>
              <div>
                {r.certifications.filter(c => c.name).map((cert, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, marginBottom: 12, borderBottom: i < r.certifications.length - 1 ? "1px solid rgba(15,23,42,0.06)" : "none" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{cert.name}</div>
                      {cert.organization && <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{cert.organization}</div>}
                    </div>
                    {cert.issueDate && <div style={{ fontSize: 12, color: "#64748b", fontFamily: "var(--font-mono)" }}>{cert.issueDate}</div>}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* ── AI Suggestions ──────────────────────────────────── */}
          {r.aiSuggestions?.length > 0 && (
            <GlassCard hover={false} glow="purple">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                <span>✨</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>AI Suggestions</span>
              </div>
              <div>
                {r.aiSuggestions.map((sug, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", padding: "2px 8px", borderRadius: 12, flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{sug}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* ── Hidden Printable Resume Template for Export ──────────────── */}
      <div style={{ display: "none" }}>
        <div ref={printRef} style={{ 
          width: "210mm", 
          minHeight: "297mm", 
          padding: "20mm", 
          background: "white", 
          color: "black",
          fontFamily: "Arial, sans-serif",
          boxSizing: "border-box"
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "20px", borderBottom: "2px solid #000", paddingBottom: "10px" }}>
            <h1 style={{ margin: "0 0 8px", fontSize: "28px", fontWeight: "bold", color: "#000" }}>{pi.fullName || "Your Name"}</h1>
            <div style={{ fontSize: "12px", color: "#333", display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
              {pi.email && <span>{pi.email}</span>}
              {pi.phone && <span>{pi.phone}</span>}
              {pi.address && <span>{pi.address}</span>}
              {pi.linkedin && <span>{pi.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
              {pi.github && <span>{pi.github.replace(/^https?:\/\/(www\.)?/, '')}</span>}
            </div>
          </div>

          {/* Summary */}
          {r.summary && (
            <div style={{ marginBottom: "15px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ccc", margin: "0 0 8px", paddingBottom: "4px" }}>Professional Summary</h2>
              <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.5 }}>{r.summary}</p>
            </div>
          )}

          {/* Experience */}
          {r.experience?.length > 0 && r.experience.some(e => e.company || e.position) && (
            <div style={{ marginBottom: "15px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ccc", margin: "0 0 8px", paddingBottom: "4px" }}>Experience</h2>
              {r.experience.filter(e => e.company || e.position).map((exp, i) => (
                <div key={i} style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "bold" }}>{exp.position}</div>
                    <div style={{ fontSize: "12px" }}>{exp.startDate} – {exp.endDate || "Present"}</div>
                  </div>
                  <div style={{ fontSize: "13px", fontStyle: "italic", marginBottom: "4px" }}>{exp.company}</div>
                  {exp.description && <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.5, whiteSpace: "pre-line" }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {r.education?.length > 0 && r.education.some(e => e.institution || e.degree) && (
            <div style={{ marginBottom: "15px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ccc", margin: "0 0 8px", paddingBottom: "4px" }}>Education</h2>
              {r.education.filter(e => e.institution || e.degree).map((edu, i) => (
                <div key={i} style={{ marginBottom: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "bold" }}>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</div>
                    <div style={{ fontSize: "12px" }}>{edu.startDate} – {edu.endDate || "Present"}</div>
                  </div>
                  <div style={{ fontSize: "13px", fontStyle: "italic" }}>{edu.institution}</div>
                  {edu.description && <p style={{ margin: "2px 0 0", fontSize: "12px", lineHeight: 1.5 }}>{edu.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {r.projects?.length > 0 && r.projects.some(p => p.title) && (
            <div style={{ marginBottom: "15px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ccc", margin: "0 0 8px", paddingBottom: "4px" }}>Projects</h2>
              {r.projects.filter(p => p.title).map((proj, i) => (
                <div key={i} style={{ marginBottom: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "bold" }}>{proj.title}</div>
                    {proj.techStack && <div style={{ fontSize: "12px", fontStyle: "italic" }}>{proj.techStack}</div>}
                  </div>
                  {proj.description && <p style={{ margin: "2px 0 0", fontSize: "12px", lineHeight: 1.5 }}>{proj.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {r.skills?.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ccc", margin: "0 0 8px", paddingBottom: "4px" }}>Skills</h2>
              <div style={{ fontSize: "12px", lineHeight: 1.5 }}>
                {r.skills.join(" • ")}
              </div>
            </div>
          )}

          {/* Certifications */}
          {r.certifications?.length > 0 && r.certifications.some(c => c.name) && (
            <div style={{ marginBottom: "15px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ccc", margin: "0 0 8px", paddingBottom: "4px" }}>Certifications</h2>
              {r.certifications.filter(c => c.name).map((cert, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                  <div style={{ fontSize: "13px" }}><span style={{ fontWeight: "bold" }}>{cert.name}</span>{cert.organization ? ` - ${cert.organization}` : ""}</div>
                  {cert.issueDate && <div style={{ fontSize: "12px" }}>{cert.issueDate}</div>}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
