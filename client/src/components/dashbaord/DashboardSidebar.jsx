import { useAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";

const NAV_ITEMS = [
  { icon: "⊞", label: "Dashboard",    key: "dashboard" },
  { icon: "↑", label: "Upload",       key: "upload"    },
  { icon: "◎", label: "ATS Checker",  key: "ats"       },
  { icon: "≡", label: "JD Matcher",   key: "jd"        },
  { icon: "✉", label: "Cover Letter", key: "cover"     },
  { icon: "⊡", label: "Templates",    key: "templates" },
];

export default function DashboardSidebar({ activeNav = "dashboard", onUpload, user }) {
  const { logout } = useAuth();

  return (
    <nav className={styles.topNav}>
      {/* Logo */}
      <div className={styles.navLogo}>
        Resume<span className={styles.navLogoAccent}>.</span>ai
      </div>

      {/* Nav Links */}
      <div className={styles.navLinks}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`${styles.navLink} ${activeNav === item.key ? styles.navLinkActive : ""}`}
          >
            <span className={styles.navLinkIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className={styles.navRight}>
        <button className={styles.navUploadBtn} onClick={onUpload} id="upload-resume-btn">
          + Upload Resume
        </button>
        <button 
          onClick={logout} 
          style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", fontWeight: 500, fontSize: "0.9rem", padding: "0 0.5rem" }}
          onMouseEnter={(e) => e.target.style.color = "#ef4444"}
          onMouseLeave={(e) => e.target.style.color = "#6b7280"}
        >
          Logout
        </button>
        <div className={styles.navAvatar} title={user?.email ?? "user@example.com"}>
          {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
        </div>
      </div>
    </nav>
  );
}
