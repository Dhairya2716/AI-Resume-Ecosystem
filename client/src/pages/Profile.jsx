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
              background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
              color: message.type === "success" ? "#16a34a" : "#dc2626",
              border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
              padding: "1rem", borderRadius: "8px", marginBottom: "2rem",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <span>{message.text}</span>
              <button onClick={() => setMessage({ text: "", type: "" })} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "inherit" }}>×</button>
            </div>
          )}

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>📄</div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" }}>Total Resumes</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>{stats.totalResumes}</div>
              </div>
            </div>
            <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>⭐</div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" }}>Avg ATS Score</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>{stats.avgAts}%</div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div style={{ background: "white", padding: "2rem", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {user?.avatar ? <img src={user.avatar} alt="avatar" style={{ width: "32px", height: "32px", borderRadius: "50%" }} /> : <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#4f46e5", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.9rem" }}>{user?.name?.[0]}</div>}
              Basic Information
            </h3>
            <form onSubmit={handleUpdateProfile}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #d1d5db" }} 
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={user?.provider !== "local"}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #d1d5db", background: user?.provider !== "local" ? "#f3f4f6" : "white" }} 
                />
                {user?.provider !== "local" && <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.25rem" }}>Email cannot be changed for OAuth accounts.</p>}
              </div>
              <button type="submit" className={styles.accentBtn} disabled={loading} style={{ padding: "0.6rem 1.5rem" }}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Password Form */}
          {user?.provider === "local" && (
            <div style={{ background: "white", padding: "2rem", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", margin: "0 0 1.5rem 0" }}>Change Password</h3>
              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    required 
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #d1d5db" }} 
                  />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    minLength="6"
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #d1d5db" }} 
                  />
                </div>
                <button type="submit" className={styles.accentBtn} disabled={loading} style={{ padding: "0.6rem 1.5rem" }}>
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
