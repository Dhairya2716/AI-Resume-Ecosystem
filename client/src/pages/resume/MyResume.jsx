import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../../services/api"
import styles from "./resume.module.css"
import DashboardSidebar from "../../components/dashbaord/DashboardSidebar"
import dashStyles from "../../components/dashbaord/Dashboard.module.css"
import { useAuth } from "../../context/AuthContext"

export default function MyResume() {
    const { user } = useAuth()

    const navigate = useNavigate()
    const [resumes, setResumes] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(null) // id of resume being deleted
    const [error, setError] = useState("")

    const fetchResumes = async () => {
        setLoading(true)
        try {
            const res = await API.get("/resume/my-resumes")
            setResumes(res.data.resumes || [])
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load resumes.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchResumes() }, [])

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
        setDeleting(id)
        try {
            await API.delete(`/resume/${id}`)
            setResumes(r => r.filter(x => x._id !== id))
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed.")
        } finally {
            setDeleting(null)
        }
    }

    // Format ISO date to readable
    const fmt = (iso) =>
        iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"

    return (
        <div className={dashStyles.dashRoot}>
            <DashboardSidebar user={user} activeNav="my-resume" />

            <div className={dashStyles.pageBody}>
                <div style={{ maxWidth: 1100, width: "100%", margin: "0 auto", paddingBottom: "3rem" }}>

                    {/* Header */}
                    <div className={styles.pageHeader}>
                        <div>
                            <h1 className={styles.pageTitle}>My Resumes</h1>
                            <p className={styles.pageSub}>{resumes.length} resume{resumes.length !== 1 ? "s" : ""} saved</p>
                        </div>
                        <Link to="/create-resume" className={styles.btnPrimary}>+ New Resume</Link>
                    </div>

                    {/* Error */}
                    {error && <div className={styles.errorBanner}>⚠ {error}</div>}

                    {/* Loading */}
                    {loading ? (
                        <div className={styles.loadingWrap}>
                            <span className={styles.spinner} />
                            Loading your resumes...
                        </div>
                    ) : resumes.length === 0 ? (

                        /* Empty state */
                        <div className={styles.card}>
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📄</div>
                                <p className={styles.emptyTitle}>No resumes yet</p>
                                <p className={styles.emptyText}>Create your first resume to get started</p>
                                <Link to="/create-resume" className={styles.btnPrimary} style={{ marginTop: 8 }}>
                                    + Create Resume
                                </Link>
                            </div>
                        </div>

                    ) : (

                        /* Resume grid */
                        <div className={styles.resumeGrid}>
                            {resumes.map(resume => (
                                <div
                                    key={resume._id}
                                    className={styles.resumeCard}
                                    onClick={() => navigate(`/edit-resume/${resume._id}`)}
                                >
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                        <div className={styles.resumeCardIcon}>📄</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p className={styles.resumeCardTitle}>{resume.title}</p>
                                            <p className={styles.resumeCardMeta}>
                                                {resume.template || "modern"} · {fmt(resume.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {resume.summary && (
                                        <p className={styles.resumeCardBody}>{resume.summary}</p>
                                    )}

                                    {/* Skills preview */}
                                    {resume.skills?.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                            {resume.skills.slice(0, 4).map(s => (
                                                <span key={s} style={{
                                                    fontSize: 11, fontWeight: 700, background: "rgba(99,102,241,0.08)",
                                                    color: "#6366f1", border: "1px solid rgba(99,102,241,0.2)",
                                                    padding: "2px 8px", borderRadius: 20
                                                }}>{s}</span>
                                            ))}
                                            {resume.skills.length > 4 && (
                                                <span style={{ fontSize: 11, color: "#64748b", padding: "2px 4px", fontWeight: 700 }}>
                                                    +{resume.skills.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div
                                        className={styles.resumeCardFooter}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <Link
                                            to={`/view-resume/${resume._id}`}
                                            className={styles.btnSecondary}
                                            style={{ padding: "5px 14px", fontSize: 12 }}
                                        >
                                            View
                                        </Link>
                                        <Link
                                            to={`/edit-resume/${resume._id}`}
                                            className={styles.btnSecondary}
                                            style={{ padding: "5px 14px", fontSize: 12 }}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className={styles.btnDanger}
                                            disabled={deleting === resume._id}
                                            onClick={() => handleDelete(resume._id, resume.title)}
                                        >
                                            {deleting === resume._id ? "..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}