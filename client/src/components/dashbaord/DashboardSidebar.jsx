import { useNavigate } from "react-router-dom";
import { BarChart3, FileText, FileUp, LayoutTemplate, LogOut, ScanSearch, Sparkles, Target } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";

const NAV_ITEMS = [
  { icon: BarChart3, label: "Overview", key: "dashboard", path: "/dashboard" },
  { icon: FileUp, label: "Upload", key: "upload" },
  { icon: ScanSearch, label: "ATS Checker", key: "ats", path: "/ats-checker" },
  { icon: Target, label: "Job Matcher", key: "jd", path: "/jd-matcher" },
  { icon: Sparkles, label: "Cover Letter", key: "cover", path: "/cover-letter" },
  { icon: LayoutTemplate, label: "Templates", key: "templates", path: "/templates" },
];

export default function DashboardSidebar({ activeNav = "dashboard", onUpload, user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleNavigation = (item) => item.key === "upload" ? onUpload?.() : navigate(item.path);

  return <nav className={styles.topNav}>
    <div className={styles.navLogo}><span className={styles.brandMark}>R</span> Resume<span className={styles.navLogoAccent}>AI</span></div>
    <div className={styles.navLinks}>{NAV_ITEMS.map((item) => {
      const Icon = item.icon;
      return <button key={item.key} onClick={() => handleNavigation(item)} className={`${styles.navLink} ${activeNav === item.key ? styles.navLinkActive : ""}`}>
        <span className={styles.navLinkIcon}><Icon size={16} strokeWidth={1.8} /></span>{item.label}
      </button>;
    })}</div>
    <div className={styles.navRight}>
      <button className={styles.navUploadBtn} onClick={onUpload} id="upload-resume-btn"><FileText size={15} /> New resume</button>
      <button onClick={logout} className={styles.logoutBtn} title="Log out"><LogOut size={16} /><span>Log out</span></button>
      <div className={styles.navAvatar} title={user?.email ?? "user@example.com"}>{user?.name ? user.name.charAt(0).toUpperCase() : "A"}</div>
    </div>
  </nav>;
}
