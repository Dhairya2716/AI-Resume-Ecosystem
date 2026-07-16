import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import s from "./AppLayout.module.css";

const NAV_ITEMS = [
  { section: "Main" },
  { icon: "⊞", label: "Dashboard",    path: "/dashboard" },
  { icon: "📄", label: "My Resumes",   path: "/my-resume" },
  { icon: "↑", label: "Upload",       path: null, action: "upload" },

  { section: "AI Tools" },
  { icon: "◎", label: "ATS Checker",   path: "/ats-checker" },
  { icon: "≡", label: "JD Matcher",    path: "/jd-matcher" },
  { icon: "✉", label: "Cover Letter",  path: "/cover-letter" },

  { section: "Build" },
  { icon: "⊡", label: "Templates",     path: "/templates" },
  { icon: "+", label: "Create Resume", path: "/create-resume" },

  { section: "Account" },
  { icon: "👤", label: "Profile",      path: "/profile" },
];

export default function AppLayout({ children, pageTitle, onUpload }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (item) => {
    if (item.action === "upload") {
      onUpload?.();
      return;
    }
    if (item.path) {
      navigate(item.path);
      setMobileOpen(false);
    }
  };

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className={s.layoutRoot}>
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className={`${s.sidebar} ${collapsed ? s.sidebarCollapsed : ""} ${mobileOpen ? s.sidebarOpen : ""}`}>
        {/* Toggle */}
        <button
          className={s.sidebarToggle}
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "›" : "‹"}
        </button>

        {/* Logo */}
        <div className={s.sidebarLogo}>
          <div className={s.logoIcon}>R</div>
          <span className={s.logoText}>
            Resume<span className={s.logoAccent}>.ai</span>
          </span>
        </div>

        {/* Nav */}
        <nav className={s.sidebarNav}>
          {NAV_ITEMS.map((item, i) => {
            if (item.section) {
              return (
                <div key={`section-${i}`} className={s.navSection}>
                  <div className={s.navSectionLabel}>{item.section}</div>
                </div>
              );
            }

            return (
              <div
                key={item.label}
                className={`${s.navItem} ${isActive(item.path) ? s.navItemActive : ""}`}
                onClick={() => handleNavClick(item)}
                title={collapsed ? item.label : undefined}
              >
                <span className={s.navIcon}>{item.icon}</span>
                <span className={s.navLabel}>{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Bottom user */}
        <div className={s.sidebarBottom}>
          <div
            className={s.navItem}
            onClick={logout}
            style={{ color: "var(--text-tertiary)" }}
          >
            <span className={s.navIcon}>⎋</span>
            <span className={s.navLabel}>Log out</span>
          </div>

          <div className={s.userCard} onClick={() => navigate("/profile")}>
            <div className={s.userAvatar}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className={s.userName}>{user?.name || "User"}</div>
              <div className={s.userEmail}>{user?.email || ""}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Area ────────────────────────────────────────── */}
      <div className={`${s.mainArea} ${collapsed ? s.mainAreaCollapsed : ""}`}>
        {/* Top Bar */}
        <div className={s.topBar}>
          <div className={s.topBarLeft}>
            {/* Mobile menu toggle */}
            <button
              className={s.topBarBtn}
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: "none" }}
              id="mobile-menu-toggle"
            >
              ☰
            </button>

            <div className={s.breadcrumb}>
              <span>Resume.ai</span>
              <span className={s.breadcrumbSep}>/</span>
              <span className={s.breadcrumbCurrent}>{pageTitle || "Dashboard"}</span>
            </div>
          </div>

          <div className={s.topBarRight}>
            <button
              className={s.topBarBtn}
              onClick={() => navigate("/create-resume")}
            >
              + New Resume
            </button>
            <button
              className={`${s.topBarBtn} ${s.topBarBtnPrimary}`}
              onClick={onUpload}
            >
              ↑ Upload
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={s.mainContent}>
          {children}
        </div>
      </div>
    </div>
  );
}
