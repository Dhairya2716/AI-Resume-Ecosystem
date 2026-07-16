import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import API from "../../services/api"
import styles from "./resume.module.css"
import DashboardSidebar from "../../components/dashbaord/DashboardSidebar"
import dashStyles from "../../components/dashbaord/Dashboard.module.css"
import { useAuth } from "../../context/AuthContext"

const blankEdu  = () => ({ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" })
const blankExp  = () => ({ company: "", position: "", startDate: "", endDate: "", description: "" })
const blankProj = () => ({ title: "", techStack: "", description: "", githubLink: "", liveLink: "" })
const blankCert = () => ({ name: "", organization: "", issueDate: "" })

export default function EditResume() {
    const { user }  = useAuth()
    const { id }    = useParams()
    const navigate  = useNavigate()

    // ── Form state ────────────────────────────────────────────
    const [title,    setTitle]    = useState("")
    const [summary,  setSummary]  = useState("")
    const [template, setTemplate] = useState("modern")
    const [personal, setPersonal] = useState({
        fullName: "", email: "", phone: "", address: "", linkedin: "", github: "", portfolio: ""
    })
    const [skills,        setSkills]        = useState([])
    const [skillInput,    setSkillInput]    = useState("")
    const [education,     setEducation]     = useState([blankEdu()])
    const [experience,    setExperience]    = useState([blankExp()])
    const [projects,      setProjects]      = useState([blankProj()])
    const [certifications,setCertifications]= useState([blankCert()])

    // ── UI state ──────────────────────────────────────────────
    const [loading,  setLoading]  = useState(true)
    const [saving,   setSaving]   = useState(false)
    const [error,    setError]    = useState("")
    const [success,  setSuccess]  = useState("")

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

    // ── Fetch existing resume ─────────────────────────────────
    useEffect(() => {
        const load = async () => {
            try {
                const res = await API.get(`/resume/${id}`)
                const r   = res.data.resume
                setTitle(r.title || "")
                setSummary(r.summary || "")
                setTemplate(r.template || "modern")
                setPersonal({ ...{ fullName:"",email:"",phone:"",address:"",linkedin:"",github:"",portfolio:"" }, ...r.personalInfo })
                setSkills(r.skills || [])
                setEducation(r.education?.length  ? r.education  : [blankEdu()])
                setExperience(r.experience?.length ? r.experience : [blankExp()])
                setProjects(r.projects?.length     ? r.projects   : [blankProj()])
                setCertifications(r.certifications?.length ? r.certifications : [blankCert()])
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load resume.")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    // ── Save ──────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(""); setSuccess("")
        if (!title.trim()) { setError("Resume title is required."); return }
        setSaving(true)
        try {
            const res = await API.put(`/resume/${id}`, {
                title, summary, template, personalInfo: personal, skills,
                education, experience, projects, certifications
            })
            setSuccess(res.data.message || "Resume updated!")
        } catch (err) {
            setError(err.response?.data?.message || "Update failed.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className={dashStyles.dashRoot}>
            <DashboardSidebar user={user} activeNav="my-resume" />
            <div className={dashStyles.pageBody}>
                <div className={styles.loadingWrap} style={{ minHeight: "100vh" }}>
                    <span className={styles.spinner} /> Loading resume...
                </div>
            </div>
        </div>
    )

    return (
        <div className={dashStyles.dashRoot}>
            <DashboardSidebar user={user} activeNav="my-resume" />

            <div className={dashStyles.pageBody}>
                <div style={{ maxWidth: 900, width: "100%", margin: "0 auto", paddingBottom: "3rem" }}>

                {/* Header */}
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Edit Resume</h1>
                        <p className={styles.pageSub}>Changes are saved to the cloud</p>
                    </div>
                    <Link to="/my-resume" className={styles.btnSecondary}>← My Resumes</Link>
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
                                    <input className={styles.formInput} placeholder="e.g. Software Engineer Resume"
                                        value={title} onChange={e => setTitle(e.target.value)} />
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Template</label>
                                    <select className={styles.formInput} value={template} onChange={e => setTemplate(e.target.value)}>
                                        <option value="modern">Modern</option>
                                        <option value="classic">Classic</option>
                                        <option value="minimal">Minimal</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Professional Summary</label>
                                <textarea className={styles.formTextarea} rows={3} placeholder="A brief summary..."
                                    value={summary} onChange={e => setSummary(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* ── Personal Info ── */}
                    <div className={styles.card} style={{ marginBottom: 20 }}>
                        <div className={styles.cardHeader}><span className={styles.cardTitle}>👤 Personal Info</span></div>
                        <div className={styles.cardBody}>
                            <div className={styles.formGrid2} style={{ marginBottom: 14 }}>
                                {[
                                    ["fullName","Full Name","text","John Doe"],
                                    ["email","Email","email","john@example.com"],
                                    ["phone","Phone","tel","+1 234 567 8900"],
                                    ["address","Location","text","San Francisco, CA"],
                                    ["linkedin","LinkedIn URL","url","linkedin.com/in/johndoe"],
                                    ["github","GitHub URL","url","github.com/johndoe"],
                                ].map(([key,label,type,ph]) => (
                                    <div className={styles.formField} key={key}>
                                        <label className={styles.formLabel}>{label}</label>
                                        <input className={styles.formInput} type={type} placeholder={ph}
                                            value={personal[key]} onChange={e => updatePersonal(key, e.target.value)} />
                                    </div>
                                ))}
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Portfolio URL</label>
                                <input className={styles.formInput} type="url" placeholder="yourportfolio.dev"
                                    value={personal.portfolio} onChange={e => updatePersonal("portfolio", e.target.value)} />
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
                                        <button type="button" className={styles.tagRemove}
                                            onClick={() => setSkills(sk => sk.filter(x => x !== s))}>×</button>
                                    </span>
                                ))}
                                <input className={styles.tagRawInput} value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill}
                                    placeholder={skills.length === 0 ? "React, Node.js, Python..." : ""} />
                            </div>
                        </div>
                    </div>

                    {/* ── Education ── */}
                    <div className={styles.card} style={{ marginBottom: 20 }}>
                        <div className={styles.cardHeader}><span className={styles.cardTitle}>🎓 Education</span></div>
                        <div className={styles.cardBody}>
                            {education.map((edu, idx) => (
                                <div key={idx} className={styles.repeatItem}>
                                    <div className={styles.repeatItemHeader}>
                                        <span className={styles.repeatItemTitle}>Entry {idx + 1}</span>
                                        {education.length > 1 && <button type="button" className={styles.btnDanger} onClick={() => removeItem(setEducation, idx)}>Remove</button>}
                                    </div>
                                    <div className={styles.formGrid2} style={{ marginBottom: 12 }}>
                                        {[
                                            ["institution","Institution","MIT"],
                                            ["degree","Degree","B.S. Computer Science"],
                                            ["fieldOfStudy","Field of Study","Computer Science"],
                                            ["startDate","Start Date","Sep 2019"],
                                            ["endDate","End Date","May 2023"],
                                        ].map(([key,label,ph]) => (
                                            <div className={styles.formField} key={key}>
                                                <label className={styles.formLabel}>{label}</label>
                                                <input className={styles.formInput} placeholder={ph}
                                                    value={edu[key]} onChange={e => updateArr(setEducation, idx, key, e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.formField}>
                                        <label className={styles.formLabel}>Notes / GPA</label>
                                        <textarea className={styles.formTextarea} rows={2} placeholder="GPA: 3.8..."
                                            value={edu.description} onChange={e => updateArr(setEducation, idx, "description", e.target.value)} />
                                    </div>
                                </div>
                            ))}
                            <button type="button" className={styles.btnGhost} onClick={() => addItem(setEducation, blankEdu)}>+ Add Education</button>
                        </div>
                    </div>

                    {/* ── Experience ── */}
                    <div className={styles.card} style={{ marginBottom: 20 }}>
                        <div className={styles.cardHeader}><span className={styles.cardTitle}>💼 Experience</span></div>
                        <div className={styles.cardBody}>
                            {experience.map((exp, idx) => (
                                <div key={idx} className={styles.repeatItem}>
                                    <div className={styles.repeatItemHeader}>
                                        <span className={styles.repeatItemTitle}>Role {idx + 1}</span>
                                        {experience.length > 1 && <button type="button" className={styles.btnDanger} onClick={() => removeItem(setExperience, idx)}>Remove</button>}
                                    </div>
                                    <div className={styles.formGrid2} style={{ marginBottom: 12 }}>
                                        {[
                                            ["company","Company","Google"],
                                            ["position","Position","Software Engineer"],
                                            ["startDate","Start Date","Jun 2021"],
                                            ["endDate","End Date","Present"],
                                        ].map(([key,label,ph]) => (
                                            <div className={styles.formField} key={key}>
                                                <label className={styles.formLabel}>{label}</label>
                                                <input className={styles.formInput} placeholder={ph}
                                                    value={exp[key]} onChange={e => updateArr(setExperience, idx, key, e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.formField}>
                                        <label className={styles.formLabel}>Description</label>
                                        <textarea className={styles.formTextarea} rows={3} placeholder="Responsibilities..."
                                            value={exp.description} onChange={e => updateArr(setExperience, idx, "description", e.target.value)} />
                                    </div>
                                </div>
                            ))}
                            <button type="button" className={styles.btnGhost} onClick={() => addItem(setExperience, blankExp)}>+ Add Experience</button>
                        </div>
                    </div>

                    {/* ── Projects ── */}
                    <div className={styles.card} style={{ marginBottom: 20 }}>
                        <div className={styles.cardHeader}><span className={styles.cardTitle}>🚀 Projects</span></div>
                        <div className={styles.cardBody}>
                            {projects.map((proj, idx) => (
                                <div key={idx} className={styles.repeatItem}>
                                    <div className={styles.repeatItemHeader}>
                                        <span className={styles.repeatItemTitle}>Project {idx + 1}</span>
                                        {projects.length > 1 && <button type="button" className={styles.btnDanger} onClick={() => removeItem(setProjects, idx)}>Remove</button>}
                                    </div>
                                    <div className={styles.formGrid2} style={{ marginBottom: 12 }}>
                                        {[
                                            ["title","Project Title","AI Resume Ecosystem"],
                                            ["techStack","Tech Stack","React, Node.js"],
                                            ["githubLink","GitHub Link","github.com/..."],
                                            ["liveLink","Live Link","https://myproject.dev"],
                                        ].map(([key,label,ph]) => (
                                            <div className={styles.formField} key={key}>
                                                <label className={styles.formLabel}>{label}</label>
                                                <input className={styles.formInput} placeholder={ph}
                                                    value={proj[key]} onChange={e => updateArr(setProjects, idx, key, e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.formField}>
                                        <label className={styles.formLabel}>Description</label>
                                        <textarea className={styles.formTextarea} rows={2}
                                            value={proj.description} onChange={e => updateArr(setProjects, idx, "description", e.target.value)} />
                                    </div>
                                </div>
                            ))}
                            <button type="button" className={styles.btnGhost} onClick={() => addItem(setProjects, blankProj)}>+ Add Project</button>
                        </div>
                    </div>

                    {/* ── Certifications ── */}
                    <div className={styles.card} style={{ marginBottom: 28 }}>
                        <div className={styles.cardHeader}><span className={styles.cardTitle}>🏅 Certifications</span></div>
                        <div className={styles.cardBody}>
                            {certifications.map((cert, idx) => (
                                <div key={idx} className={styles.repeatItem}>
                                    <div className={styles.repeatItemHeader}>
                                        <span className={styles.repeatItemTitle}>Cert {idx + 1}</span>
                                        {certifications.length > 1 && <button type="button" className={styles.btnDanger} onClick={() => removeItem(setCertifications, idx)}>Remove</button>}
                                    </div>
                                    <div className={styles.formGrid3}>
                                        {[
                                            ["name","Certificate Name","AWS Solutions Architect"],
                                            ["organization","Issuing Org","Amazon"],
                                            ["issueDate","Issue Date","Mar 2024"],
                                        ].map(([key,label,ph]) => (
                                            <div className={styles.formField} key={key}>
                                                <label className={styles.formLabel}>{label}</label>
                                                <input className={styles.formInput} placeholder={ph}
                                                    value={cert[key]} onChange={e => updateArr(setCertifications, idx, key, e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button type="button" className={styles.btnGhost} onClick={() => addItem(setCertifications, blankCert)}>+ Add Certification</button>
                        </div>
                    </div>

                    {/* ── Submit ── */}
                    <div className={styles.formActions}>
                        <Link to="/my-resume" className={styles.btnSecondary}>Cancel</Link>
                        <button type="submit" className={styles.btnPrimary} disabled={saving}>
                            {saving ? <span className={styles.spinner} /> : null}
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>

                </form>
                </div>
            </div>
        </div>
    )
}
