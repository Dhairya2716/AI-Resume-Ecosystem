import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/dashbaord/DashboardSidebar";
import styles from "../components/dashbaord/Dashboard.module.css";
import { LayoutTemplate, Sparkles, Shield, Crown, Check, ArrowRight, Search } from "lucide-react";

import { GlassCard, GradientButton, SectionHeader } from "../components/ui";

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "A clean, two-column layout with a colorful sidebar, perfect for creative and tech roles. Highlights skills and summary.",
    previewColor: "#6366f1",
    gradientFrom: "#6366f1",
    gradientTo: "#8b5cf6",
    features: ["Two-column layout", "Accent colors", "Skills highlighted"],
    badge: "popular",
    category: "premium",
  },
  {
    id: "classic",
    name: "Classic Executive",
    description: "A traditional top-down structure trusted by enterprise recruiters. Highly ATS-friendly with clear hierarchical typography.",
    previewColor: "#94a3b8",
    gradientFrom: "#475569",
    gradientTo: "#64748b",
    features: ["Top-down structure", "Traditional serif", "Max ATS compatibility"],
    badge: "ats",
    category: "ats",
  },
  {
    id: "minimal",
    name: "Minimalist Clean",
    description: "Stripped back and ultra-clean. Focuses purely on content with lots of whitespace. Great for design and management.",
    previewColor: "#06b6d4",
    gradientFrom: "#0891b2",
    gradientTo: "#22d3ee",
    features: ["High whitespace", "Sans-serif typography", "Content focused"],
    badge: "premium",
    category: "premium",
  },
];

const FILTERS = [
  { key: "all", label: "All Templates", icon: LayoutTemplate },
  { key: "ats", label: "ATS-Friendly", icon: Shield },
  { key: "premium", label: "Premium", icon: Crown },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } },
};

export default function Templates() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = TEMPLATES.filter(t => {
    const matchesFilter = activeFilter === "all" || t.category === activeFilter;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={styles.dashRoot}>
      <DashboardSidebar activeNav="templates" user={user} />
      <div className={styles.pageBody}>
        <div className={styles.mainCol} style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem" }}>
          <SectionHeader
            icon={LayoutTemplate}
            title="Resume Templates"
            subtitle="Select a professionally designed template to start building your tailored resume."
          />

          {/* ── Filters & Search ── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
            style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            {/* Filter Pills */}
            <div style={{
              display: "flex", alignItems: "center", gap: "4px",
              background: "rgba(15,23,42,0.05)", padding: "4px",
              borderRadius: "10px", border: "1px solid rgba(15,23,42,0.07)",
            }}>
              {FILTERS.map(f => {
                const Icon = f.icon;
                const isActive = activeFilter === f.key;
                return (
                  <button key={f.key} onClick={() => setActiveFilter(f.key)}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "7px 14px", borderRadius: "7px", border: "none",
                      background: isActive ? "#fff" : "transparent",
                      color: isActive ? "#6366f1" : "#64748b",
                      fontSize: "0.82rem", fontWeight: isActive ? 700 : 500, cursor: "pointer",
                      fontFamily: "inherit", transition: "all 0.2s ease",
                      boxShadow: isActive ? "0 2px 8px rgba(15,23,42,0.1)" : "none",
                    }}>
                    <Icon size={14} />
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div style={{ position: "relative", flex: 1, maxWidth: "280px" }}>
              <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", padding: "8px 12px 8px 34px",
                  borderRadius: "10px", border: "1.5px solid rgba(15,23,42,0.1)",
                  background: "rgba(255,255,255,0.9)", color: "#0f172a",
                  fontSize: "0.85rem", fontFamily: "inherit", outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(99,102,241,0.45)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(15,23,42,0.1)";
                  e.target.style.boxShadow = "0 1px 4px rgba(15,23,42,0.05)";
                }}
              />
            </div>
          </motion.div>

          {/* ── Template Grid ── */}
          <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden" animate="show"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {filtered.map(template => {
              const isHovered = hoveredCard === template.id;
              return (
                <motion.div key={template.id} variants={fadeUp}
                  onMouseEnter={() => setHoveredCard(template.id)}
                  onMouseLeave={() => setHoveredCard(null)}>
                  <div style={{
                    background: "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(16px) saturate(180%)",
                    WebkitBackdropFilter: "blur(16px) saturate(180%)",
                    border: `1.5px solid ${isHovered ? `${template.previewColor}35` : "rgba(255,255,255,0.8)"}`,
                    borderTop: "2px solid rgba(255,255,255,0.95)",
                    borderRadius: "20px", overflow: "hidden",
                    display: "flex", flexDirection: "column",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                    boxShadow: isHovered
                      ? `0 20px 48px rgba(15,23,42,0.14), 0 0 0 1px ${template.previewColor}20, inset 0 1px 0 rgba(255,255,255,0.95)`
                      : "0 4px 20px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
                  }}>
                    {/* Preview Area */}
                    <div style={{
                      height: "200px", background: `linear-gradient(135deg, ${template.previewColor}08, ${template.previewColor}04)`,
                      borderBottom: "1px solid rgba(15,23,42,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      position: "relative", overflow: "hidden",
                    }}>
                      {/* Gradient orb */}
                      <div style={{
                        position: "absolute", top: "-30px", right: "-30px",
                        width: "120px", height: "120px", borderRadius: "50%",
                        background: `radial-gradient(circle, ${template.previewColor}20, transparent)`,
                        filter: "blur(20px)", pointerEvents: "none",
                      }} />

                      {/* Mini resume skeleton */}
                      <motion.div animate={{ y: isHovered ? -4 : 0 }} transition={{ duration: 0.3 }}
                        style={{
                          width: "130px", height: "170px",
                          background: "rgba(255,255,255,0.95)",
                          border: "1px solid rgba(15,23,42,0.08)",
                          borderRadius: "6px", position: "relative", overflow: "hidden",
                          boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                          display: "flex", flexDirection: template.id === "modern" ? "row" : "column",
                          padding: template.id === "minimal" ? "1rem" : "0",
                        }}>
                        {template.id === "modern" && (
                          <>
                            <div style={{ width: "30%", background: `${template.previewColor}30`, height: "100%" }} />
                            <div style={{ width: "70%", padding: "0.75rem" }}>
                              <div style={{ width: "80%", height: "6px", background: "rgba(15,23,42,0.12)", borderRadius: "3px", marginBottom: "6px" }} />
                              <div style={{ width: "60%", height: "4px", background: "rgba(15,23,42,0.06)", borderRadius: "2px", marginBottom: "12px" }} />
                              <div style={{ width: "100%", height: "3px", background: "rgba(15,23,42,0.05)", borderRadius: "2px", marginBottom: "3px" }} />
                              <div style={{ width: "100%", height: "3px", background: "rgba(15,23,42,0.05)", borderRadius: "2px", marginBottom: "3px" }} />
                              <div style={{ width: "80%", height: "3px", background: "rgba(15,23,42,0.05)", borderRadius: "2px" }} />
                            </div>
                          </>
                        )}
                        {template.id === "classic" && (
                          <div style={{ padding: "0.75rem", width: "100%" }}>
                            <div style={{ width: "100%", height: "8px", background: `${template.previewColor}40`, borderRadius: "2px", marginBottom: "6px" }} />
                            <div style={{ width: "100%", height: "1.5px", background: "rgba(15,23,42,0.12)", marginBottom: "12px" }} />
                            <div style={{ width: "40%", height: "4px", background: "rgba(15,23,42,0.08)", borderRadius: "2px", marginBottom: "6px" }} />
                            <div style={{ width: "100%", height: "3px", background: "rgba(15,23,42,0.05)", borderRadius: "2px", marginBottom: "3px" }} />
                            <div style={{ width: "100%", height: "3px", background: "rgba(15,23,42,0.05)", borderRadius: "2px" }} />
                          </div>
                        )}
                        {template.id === "minimal" && (
                          <div style={{ width: "100%" }}>
                            <div style={{ width: "50%", height: "6px", background: `${template.previewColor}40`, borderRadius: "2px", marginBottom: "16px" }} />
                            <div style={{ width: "30%", height: "3px", background: "rgba(15,23,42,0.08)", borderRadius: "2px", marginBottom: "6px" }} />
                            <div style={{ width: "100%", height: "2px", background: "rgba(15,23,42,0.05)", borderRadius: "1px", marginBottom: "3px" }} />
                            <div style={{ width: "80%", height: "2px", background: "rgba(15,23,42,0.05)", borderRadius: "1px" }} />
                          </div>
                        )}
                      </motion.div>

                      {/* Hover overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: "absolute", inset: 0,
                          background: "rgba(15,23,42,0.25)", backdropFilter: "blur(4px)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          pointerEvents: isHovered ? "auto" : "none",
                        }}>
                        <span style={{
                          display: "flex", alignItems: "center", gap: "6px",
                          padding: "8px 16px", borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.92)", border: "1px solid rgba(255, 255, 255, 0.95)",
                          color: "#6366f1", fontSize: "0.85rem", fontWeight: 700,
                          boxShadow: "0 4px 12px rgba(99,102,241,0.2)",
                        }}>
                          Preview <ArrowRight size={14} />
                        </span>
                      </motion.div>

                      {/* Badge */}
                      <div style={{
                        position: "absolute", top: "12px", right: "12px",
                        padding: "3px 10px", borderRadius: "8px",
                        fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                        ...(template.badge === "ats"
                          ? { background: "rgba(5, 150, 105, 0.1)", color: "#059669", border: "1px solid rgba(5, 150, 105, 0.2)" }
                          : template.badge === "popular"
                          ? { background: "rgba(99, 102, 241, 0.1)", color: "#6366f1", border: "1px solid rgba(99, 102, 241, 0.2)" }
                          : { background: "rgba(139, 92, 246, 0.1)", color: "#7c3aed", border: "1px solid rgba(139, 92, 246, 0.2)" }
                        ),
                      }}>
                        {template.badge === "ats" ? "ATS-Friendly" : template.badge === "popular" ? "Popular" : "Premium"}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem 0" }}>
                        {template.name}
                      </h3>
                      <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1.25rem", flex: 1 }}>
                        {template.description}
                      </p>

                      {/* Features */}
                      <ul style={{ padding: 0, margin: "0 0 1.5rem 0", listStyle: "none" }}>
                        {template.features.map((feature, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "#475569", marginBottom: "0.4rem" }}>
                            <Check size={13} style={{ color: "#059669", flexShrink: 0 }} /> {feature}
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <GradientButton
                        fullWidth
                        onClick={() => navigate(`/create-resume?template=${template.id}`)}
                        style={{
                          background: `linear-gradient(135deg, ${template.gradientFrom}, ${template.gradientTo})`,
                          boxShadow: `0 4px 15px ${template.previewColor}30`,
                        }}
                      >
                        Use {template.name} <ArrowRight size={16} />
                      </GradientButton>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#94a3b8" }}>
              <Search size={40} style={{ marginBottom: "1rem", opacity: 0.25 }} />
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "#64748b" }}>No templates found</p>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
