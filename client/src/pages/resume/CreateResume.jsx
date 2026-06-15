import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../../services/api"
import styles from "./resume.module.css"

// ── Blank section templates ───────────────────────────────────
const blankEdu = () => ({ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" })
const blankExp = () => ({ company: "", position: "", startDate: "", endDate: "", description: "" })
const blankProj = () => ({ title: "", techStack: "", description: "", githubLink: "", liveLink: "" })
const blankCert = () => ({ name: "", organization: "", issueDate: "" })

export default function CreateResume() {

    const navigate = useNavigate()

    // ── Core fields ───────────────────────────────────────────
    const [title,   setTitle]   = useState("")
    const [summary, setSummary] = useState("")
    const [template, setTemplate] = useState("modern")

    // ── Personal Info ─────────────────────────────────────────
    const [personal, setPersonal] = useState({
        fullName: "", email: "", phone: "", address: "", linkedin: "", github: "", portfolio: ""
    })

    // ── Skills (tag input) ────────────────────────────────────
    const [skills,   setSkills]   = useState([])
    const [skillInput, setSkillInput] = useState("")

    // ── Repeatable sections ───────────────────────────────────
    const [education,      setEducation]      = useState([blankEdu()])
    const [experience,     setExperience]     = useState([blankExp()])
    const [projects,       setProjects]       = useState([blankProj()])
    const [certifications, setCertifications] = useState([blankCert()])

    // ── UI state ──────────────────────────────────────────────
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState("")
    const [success, setSuccess] = useState("")

    // ── Helpers ───────────────────────────────────────────────
    const updatePersonal = (key, val) => setPersonal(p => ({ ...p, [key]: val }))

    const updateArr = (setter, idx, key, val) =>
        setter(arr => arr.map((item, i) => i === idx ? { ...item, [key]: val } : item))

    const addItem    = (setter, blank) => setter(arr => [...arr, blank()])
    const removeItem = (setter, idx)   => setter(arr => arr.filter((_, i) => i !== idx))

    const addSkill = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            const val = skillInput.trim().replace(/,$/, "")
            if (val && !skills.includes(val)) setSkills(s => [...s, val])
            setSkillInput("")
        }
    }

    // ── Submit ────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(""); setSuccess("")
        if (!title.trim()) { setError("Resume title is required."); return }

        setLoading(true)
        try {
            const res = await API.post("/resume/create", {
                title, summary, template, personalInfo: personal, skills,
                education, experience, projects, certifications
            })
            setSuccess(res.data.message || "Resume created!")
            setTimeout(() => navigate("/my-resume"), 1200)
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.pageRoot}>

            {/* Nav */}
            <nav className={styles.topNav}>
                <Link to="/dashboard" className={styles.navLogo}>
                    Resume<span className={styles.navLogoAccent}>AI</span>
                </Link>
                <div className={styles.navLinks}>
                    <Link to="/dashboard"  className={styles.navLink}>Dashboard</Link>
                    <Link to="/my-resume"  className={styles.navLink}>My Resumes</Link>
                    <Link to="/create-resume" className={`${styles.navLink} ${styles.navLinkActive}`}>+ Create</Link>
                </div>
            </nav>

            <div className={styles.pageContent}>

                {/* Header */}
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Create Resume</h1>
                        <p className={styles.pageSub}>Fill in the sections below and save when done</p>
                    </div>
                    <Link to="/my-resume" className={styles.btnSecondary}>← Back</Link>
                </div>

                {/* Banners */}
                {error   && <div className={styles.errorBanner}>⚠ {error}</div>}
                {success && <div className={styles.successBanner}>✓ {success}</div>}

                <form onSubmit={handleSubmit}>

                    {/* ── Basics ── */}
                    <div className={styles.card} style={{ marginBottom: 20 }}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>📄 Basics</span>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.formGrid2} style={{ marginBottom: 14 }}>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Resume Title *</label>
                                    <input
                                        className={styles.formInput}
                                        placeholder="e.g. Software Engineer Resume"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Template</label>
                                    <select
                                        className={styles.formInput}
                                        value={template}
                                        onChange={e => setTemplate(e.target.value)}
                                    >
                                        <option value="modern">Modern</option>
                                        <option value="classic">Classic</option>
                                        <option value="minimal">Minimal</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Professional Summary</label>
                                <textarea
                                    className={styles.formTextarea}
                                    placeholder="A brief summary about yourself..."
                                    value={summary}
                                    onChange={e => setSummary(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Personal Info ── */}
                    <div className={styles.card} style={{ marginBottom: 20 }}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>👤 Personal Info</span>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.formGrid2} style={{ marginBottom: 14 }}>
                                {[
                                    ["fullName",  "Full Name",       "text",  "John Doe"],
                                    ["email",     "Email",           "email", "john@example.com"],
                                    ["phone",     "Phone",           "tel",   "+1 234 567 8900"],
                                    ["address",   "Location",        "text",  "San Francisco, CA"],
                                    ["linkedin",  "LinkedIn URL",    "url",   "linkedin.com/in/johndoe"],
                                    ["github",    "GitHub URL",      "url",   "github.com/johndoe"],
                                ].map(([key, label, type, ph]) => (
                                    <div className={styles.formField} key={key}>
                                        <label className={styles.formLabel}>{label}</label>
                                        <input
                                            className={styles.formInput}
                                            type={type}
                                            placeholder={ph}
                                            value={personal[key]}
                                            onChange={e => updatePersonal(key, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Portfolio URL</label>
                                <input
                                    className={styles.formInput}
                                    type="url"
                                    placeholder="yourportfolio.dev"
                                    value={personal.portfolio}
                                    onChange={e => updatePersonal("portfolio", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Skills ── */}
                    <div className={styles.card} style={{ marginBottom: 20 }}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>🛠 Skills</span>
                            <span style={{ fontSize: 12, color: "#9ca3af" }}>Press Enter or comma to add</span>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.tagInput}>
                                {skills.map(s => (
                                    <span key={s} className={styles.tag}>
                                        {s}
                                        <button
                                            type="button"
                                            className={styles.tagRemove}
                                            onClick={() => setSkills(sk => sk.filter(x => x !== s))}
                                        >×</button>
                                    </span>
                                ))}
                                <input
                                    className={styles.tagRawInput}
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={addSkill}
                                    placeholder={skills.length === 0 ? "React, Node.js, Python..." : ""}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Education ── */}
                    <div className={styles.card} style={{ marginBottom: 20 }}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>🎓 Education</span>
                        </div>
                        <div className={styles.cardBody}>
                            {education.map((edu, idx) => (
                                <div key={idx} className={styles.repeatItem}>
                                    <div className={styles.repeatItemHeader}>
                                        <span className={styles.repeatItemTitle}>Entry {idx + 1}</span>
                                        {education.length > 1 && (
                                            <button type="button" className={styles.btnDanger} onClick={() => removeItem(setEducation, idx)}>Remove</button>
                                        )}
                                    </div>
                                    <div className={styles.formGrid2} style={{ marginBottom: 12 }}>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Institution</label>
                                            <input className={styles.formInput} placeholder="MIT" value={edu.institution} onChange={e => updateArr(setEducation, idx, "institution", e.target.value)} />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Degree</label>
                                            <input className={styles.formInput} placeholder="B.S. Computer Science" value={edu.degree} onChange={e => updateArr(setEducation, idx, "degree", e.target.value)} />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Field of Study</label>
                                            <input className={styles.formInput} placeholder="Computer Science" value={edu.fieldOfStudy} onChange={e => updateArr(setEducation, idx, "fieldOfStudy", e.target.value)} />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Start Date</label>
                                            <input className={styles.formInput} placeholder="Sep 2019" value={edu.startDate} onChange={e => updateArr(setEducation, idx, "startDate", e.target.value)} />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>End Date</label>
                                            <input className={styles.formInput} placeholder="May 2023 (or Present)" value={edu.endDate} onChange={e => updateArr(setEducation, idx, "endDate", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className={styles.formField}>
                                        <label className={styles.formLabel}>Notes / GPA</label>
                                        <textarea className={styles.formTextarea} rows={2} placeholder="GPA: 3.8, Dean's list..." value={edu.description} onChange={e => updateArr(setEducation, idx, "description", e.target.value)} />
                                    </div>
                                </div>
                            ))}
                            <button type="button" className={styles.btnGhost} onClick={() => addItem(setEducation, blankEdu)}>+ Add Education</button>
                        </div>
                    </div>

                    {/* ── Experience ── */}
                    <div className={styles.card} style={{ marginBottom: 20 }}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>💼 Experience</span>
                        </div>
                        <div className={styles.cardBody}>
                            {experience.map((exp, idx) => (
                                <div key={idx} className={styles.repeatItem}>
                                    <div className={styles.repeatItemHeader}>
                                        <span className={styles.repeatItemTitle}>Role {idx + 1}</span>
                                        {experience.length > 1 && (
                                            <button type="button" className={styles.btnDanger} onClick={() => removeItem(setExperience, idx)}>Remove</button>
                                        )}
                                    </div>
                                    <div className={styles.formGrid2} style={{ marginBottom: 12 }}>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Company</label>
                                            <input className={styles.formInput} placeholder="Google" value={exp.company} onChange={e => updateArr(setExperience, idx, "company", e.target.value)} />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Position</label>
                                            <input className={styles.formInput} placeholder="Software Engineer" value={exp.position} onChange={e => updateArr(setExperience, idx, "position", e.target.value)} />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Start Date</label>
                                            <input className={styles.formInput} placeholder="Jun 2021" value={exp.startDate} onChange={e => updateArr(setExperience, idx, "startDate", e.target.value)} />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>End Date</label>
                                            <input className={styles.formInput} placeholder="Present" value={exp.endDate} onChange={e => updateArr(setExperience, idx, "endDate", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className={styles.formField}>
                                        <label className={styles.formLabel}>Description</label>
                                        <textarea className={styles.formTextarea} rows={3} placeholder="Key responsibilities and achievements..." value={exp.description} onChange={e => updateArr(setExperience, idx, "description", e.target.value)} />
                                    </div>
                                </div>
                            ))}
                            <button type="button" className={styles.btnGhost} onClick={() => addItem(setExperience, blankExp)}>+ Add Experience</button>
                        </div>
                    </div>

                    {/* ── Projects ── */}
                    <div className={styles.card} style={{ marginBottom: 20 }}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>🚀 Projects</span>
                        </div>
                        <div className={styles.cardBody}>
                            {projects.map((proj, idx) => (
                                <div key={idx} className={styles.repeatItem}>
                                    <div className={styles.repeatItemHeader}>
                                        <span className={styles.repeatItemTitle}>Project {idx + 1}</span>
                                        {projects.length > 1 && (
                                            <button type="button" className={styles.btnDanger} onClick={() => removeItem(setProjects, idx)}>Remove</button>
                                        )}
                                    </div>
                                    <div className={styles.formGrid2} style={{ marginBottom: 12 }}>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Project Title</label>
                                            <input className={styles.formInput} placeholder="AI Resume Ecosystem" value={proj.title} onChange={e => updateArr(setProjects, idx, "title", e.target.value)} />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Tech Stack</label>
                                            <input className={styles.formInput} placeholder="React, Node.js, MongoDB" value={proj.techStack} onChange={e => updateArr(setProjects, idx, "techStack", e.target.value)} />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>GitHub Link</label>
                                            <input className={styles.formInput} type="url" placeholder="github.com/..." value={proj.githubLink} onChange={e => updateArr(setProjects, idx, "githubLink", e.target.value)} />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Live Link</label>
                                            <input className={styles.formInput} type="url" placeholder="https://myproject.dev" value={proj.liveLink} onChange={e => updateArr(setProjects, idx, "liveLink", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className={styles.formField}>
                                        <label className={styles.formLabel}>Description</label>
                                        <textarea className={styles.formTextarea} rows={2} placeholder="What the project does and your contributions..." value={proj.description} onChange={e => updateArr(setProjects, idx, "description", e.target.value)} />
                                    </div>
                                </div>
                            ))}
                            <button type="button" className={styles.btnGhost} onClick={() => addItem(setProjects, blankProj)}>+ Add Project</button>
                        </div>
                    </div>

                    {/* ── Certifications ── */}
                    <div className={styles.card} style={{ marginBottom: 28 }}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>🏅 Certifications</span>
                        </div>
                        <div className={styles.cardBody}>
                            {certifications.map((cert, idx) => (
                                <div key={idx} className={styles.repeatItem}>
                                    <div className={styles.repeatItemHeader}>
                                        <span className={styles.repeatItemTitle}>Cert {idx + 1}</span>
                                        {certifications.length > 1 && (
                                            <button type="button" className={styles.btnDanger} onClick={() => removeItem(setCertifications, idx)}>Remove</button>
                                        )}
                                    </div>
                                    <div className={styles.formGrid3}>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Certificate Name</label>
                                            <input className={styles.formInput} placeholder="AWS Solutions Architect" value={cert.name} onChange={e => updateArr(setCertifications, idx, "name", e.target.value)} />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Issuing Organization</label>
                                            <input className={styles.formInput} placeholder="Amazon" value={cert.organization} onChange={e => updateArr(setCertifications, idx, "organization", e.target.value)} />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.formLabel}>Issue Date</label>
                                            <input className={styles.formInput} placeholder="Mar 2024" value={cert.issueDate} onChange={e => updateArr(setCertifications, idx, "issueDate", e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" className={styles.btnGhost} onClick={() => addItem(setCertifications, blankCert)}>+ Add Certification</button>
                        </div>
                    </div>

                    {/* ── Submit ── */}
                    <div className={styles.formActions}>
                        <Link to="/my-resume" className={styles.btnSecondary}>Cancel</Link>
                        <button type="submit" className={styles.btnPrimary} disabled={loading}>
                            {loading ? <span className={styles.spinner} /> : null}
                            {loading ? "Saving..." : "Save Resume"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}