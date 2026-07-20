import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "../components/dashbaord/DashboardSidebar";
import styles from "../components/dashbaord/Dashboard.module.css";
import { updateProfile } from "../api/authService";
import { getMyResumes } from "../api/resumeService";

import PageHeader from "../components/shared/PageHeader";

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  // Profile Form State
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  
  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [stats, setStats] = useState({ totalResumes: 0, avgAts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getMyResumes();
        const resumes = data.resumes || [];
        const analyzed = resumes.filter(r => r.atsScore !== null);
        const avg = analyzed.length ? Math.round(analyzed.reduce((a, r) => a + r.atsScore, 0) / analyzed.length) : 0;
        setStats({ totalResumes: resumes.length, avgAts: avg });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    fetchStats();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const data = await updateProfile({ name, email });
      updateUser(data.user);
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: err?.response?.data?.message || "Failed to update profile.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters.", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await updateProfile({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setMessage({ text: "Password changed successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: err?.response?.data?.message || "Failed to change password.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashRoot}>
      <DashboardSidebar activeNav="profile" user={user} />
      <div className={styles.pageBody}>
        <div className={styles.mainCol} style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
          <PageHeader 
            title="Profile Settings" 
            subtitle="Manage your account details and password."
          />

          {message.text && (
            <div style={{
              background: message.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)",
              color: message.type === "success" ? "var(--success)" : "var(--danger)",
              border: `1px solid ${message.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}`,
              padding: "1rem", borderRadius: "8px", marginBottom: "2rem",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <span>{message.text}</span>
              <button onClick={() => setMessage({ text: "", type: "" })} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "inherit" }}>×</button>
            </div>
          )}

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ background: "var(--glass-bg)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "var(--glass-shadow)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", boxShadow: "0 0 10px rgba(99,102,241,0.2)" }}>📄</div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Total Resumes</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-primary)" }}>{stats.totalResumes}</div>
              </div>
            </div>
            <div style={{ background: "var(--glass-bg)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "var(--glass-shadow)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", boxShadow: "0 0 10px rgba(16,185,129,0.2)" }}>⭐</div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Avg ATS Score</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-primary)" }}>{stats.avgAts}%</div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div style={{ background: "var(--glass-bg)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-subtle)", marginBottom: "2rem", boxShadow: "var(--glass-shadow)", backdropFilter: "blur(12px)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--text-primary)", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {user?.avatar ? <img src={user.avatar} alt="avatar" style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} /> : <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent-gradient)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.9rem", boxShadow: "var(--glow-purple)" }}>{user?.name?.[0]}</div>}
              Basic Information
            </h3>
            <form onSubmit={handleUpdateProfile}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.2)", color: "var(--text-primary)", outline: "none" }} 
                  onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={user?.provider !== "local"}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", background: user?.provider !== "local" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.2)", color: user?.provider !== "local" ? "var(--text-muted)" : "var(--text-primary)", outline: "none" }} 
                  onFocus={(e) => { if(user?.provider === "local") e.target.style.borderColor = "rgba(99,102,241,0.5)"; }}
                  onBlur={(e) => { if(user?.provider === "local") e.target.style.borderColor = "var(--border-subtle)"; }}
                />
                {user?.provider !== "local" && <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Email cannot be changed for OAuth accounts.</p>}
              </div>
              <button type="submit" className={styles.accentBtn} disabled={loading} style={{ padding: "0.6rem 1.5rem", background: "var(--accent-gradient)", border: "none", color: "white", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "var(--glow-purple)" }}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Password Form */}
          {user?.provider === "local" && (
            <div style={{ background: "var(--glass-bg)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-subtle)", boxShadow: "var(--glass-shadow)", backdropFilter: "blur(12px)" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--text-primary)", margin: "0 0 1.5rem 0" }}>Change Password</h3>
              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    required 
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.2)", color: "var(--text-primary)", outline: "none" }} 
                    onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
                  />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    minLength="6"
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.2)", color: "var(--text-primary)", outline: "none" }} 
                    onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
                  />
                </div>
                <button type="submit" className={styles.accentBtn} disabled={loading} style={{ padding: "0.6rem 1.5rem", background: "var(--accent-gradient)", border: "none", color: "white", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "var(--glow-purple)" }}>
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
