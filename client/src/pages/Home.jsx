import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ─── Particle / Dot Grid Animation ─── */
function ParticleBg() {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H, dots;

    const COLS = isMobile ? 14 : 28, ROWS = isMobile ? 9 : 18, SPACING = isMobile ? 60 : 48;

    function init() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      dots = [];
      const offX = (W - (COLS - 1) * SPACING) / 2;
      const offY = (H - (ROWS - 1) * SPACING) / 2;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          dots.push({
            x: offX + c * SPACING,
            y: offY + r * SPACING,
            baseX: offX + c * SPACING,
            baseY: offY + r * SPACING,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.6,
            radius: 1.2 + Math.random() * 0.8,
          });
        }
      }
    }

    let mouse = { x: W / 2, y: H / 2 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;
      dots.forEach((d) => {
        const dx = mouse.x - d.baseX;
        const dy = mouse.y - d.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pull = Math.max(0, 1 - dist / 180);
        const wave = Math.sin(t * d.speed + d.phase) * 4;
        d.x = d.baseX + dx * pull * 0.18 + wave * 0.5;
        d.y = d.baseY + dy * pull * 0.18 + wave * 0.5;

        const alpha = 0.12 + pull * 0.55 + Math.abs(Math.sin(t * d.speed + d.phase)) * 0.1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius + pull * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fill();
      });

      /* connect nearby dots */
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dd = Math.hypot(a.x - b.x, a.y - b.y);
          if (dd < SPACING * 1.6) {
            const alpha = (1 - dd / (SPACING * 1.6)) * 0.06;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ─── Typewriter ─── */
function Typewriter({ words }) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    const delay = deleting ? 40 : charIdx === word.length ? 1600 : 70;

    const t = setTimeout(() => {
      if (!deleting && charIdx < word.length) {
        setDisplay(word.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      } else if (!deleting && charIdx === word.length) {
        setDeleting(true);
      } else if (deleting && charIdx > 0) {
        setDisplay(word.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      } else {
        setDeleting(false);
        setWordIdx((i) => (i + 1) % words.length);
      }
    }, delay);

    return () => clearTimeout(t);
  }, [display, charIdx, deleting, wordIdx, words]);

  return (
    <span style={{ borderRight: "2px solid #111", paddingRight: 3 }}>
      {display}
    </span>
  );
}

/* ─── Scroll fade-in ─── */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ icon, title, desc, accent, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: `1px solid ${hovered ? "#111" : "#e5e5e5"}`,
          borderRadius: 16,
          padding: "32px 28px",
          background: hovered ? "#111" : "#fff",
          transition: "all 0.3s ease, box-shadow 0.3s ease",
          cursor: "default",
          boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{
          fontSize: 28,
          marginBottom: 16,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 52,
          height: 52,
          borderRadius: 12,
          background: hovered ? "rgba(255,255,255,0.08)" : "#f5f5f5",
          transition: "background 0.3s, transform 0.3s",
          transform: hovered ? "scale(1.1)" : "scale(1)",
        }}>
          {icon}
        </div>
        <div style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 18,
          fontWeight: 400,
          marginBottom: 10,
          color: hovered ? "#fff" : "#111",
          transition: "color 0.3s",
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 14,
          lineHeight: 1.65,
          color: hovered ? "rgba(255,255,255,0.6)" : "#666",
          transition: "color 0.3s",
          flex: 1,
        }}>
          {desc}
        </div>
        {accent && (
          <div style={{
            marginTop: 16,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: "linear-gradient(90deg, #6366f1, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            {accent}
          </div>
        )}
      </div>
    </Reveal>
  );
}

/* ─── Stat ─── */
function Stat({ value, label, color, delay }) {
  return (
    <Reveal delay={delay}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "clamp(32px, 8vw, 48px)",
          fontWeight: 400,
          background: color,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          marginBottom: 8,
        }}>
          {value}
        </div>
        <div style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "#888", letterSpacing: "0.03em" }}>{label}</div>
      </div>
    </Reveal>
  );
}

/* ─── Step ─── */
function Step({ num, title, desc, delay }) {
  return (
    <Reveal delay={delay}>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{
          minWidth: 40, height: 40,
          borderRadius: "50%",
          border: "2px solid #111",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'DM Serif Display', serif",
          fontSize: 16,
          flexShrink: 0,
          fontWeight: 600,
          background: "linear-gradient(135deg, #6366f1, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {num}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6, color: "#111" }}>{title}</div>
          <div style={{ fontSize: 14, color: "#777", lineHeight: 1.65 }}>{desc}</div>
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const features = [
    {
      icon: "📄",
      title: "AI Resume Builder",
      desc: "Generate polished, job-ready resumes from a simple form. Claude structures your experience into compelling, keyword-optimized content.",
      accent: "Powered by Claude AI",
    },
    {
      icon: "🎯",
      title: "ATS Score Checker",
      desc: "Instantly scan your resume against Applicant Tracking Systems. Get a real score, fix suggestions, and pass the bots.",
      accent: null,
    },
    {
      icon: "🔍",
      title: "JD Matcher",
      desc: "Paste any job description and see exactly how your resume matches. AI highlights gaps and recommends targeted improvements.",
      accent: "Semantic match engine",
    },
    {
      icon: "✉️",
      title: "Cover Letter Generator",
      desc: "One click to a personalized cover letter. Context-aware, tone-matched, and never generic.",
      accent: null,
    },
    {
      icon: "🎨",
      title: "Resume Templates",
      desc: "Curated, recruiter-approved templates across industries. Clean typography and layout that gets you noticed.",
      accent: null,
    },
    {
      icon: "✏️",
      title: "Smart Resume Editor",
      desc: "Edit inline with AI assistance. Real-time suggestions, bullet point rewrites, and one-click tone adjustments.",
      accent: "Inline AI edits",
    },
  ];

  return (
    <>
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        body { background: #fff !important; color-scheme: light; }
        html { background: #fff !important; color-scheme: light; }
      `}</style>

      <ParticleBg />

      <div style={{
        position: "relative",
        zIndex: 1,
        fontFamily: "'DM Sans', sans-serif",
        color: "#111",
        background: "#fff",
        minHeight: "100vh",
      }}>

        {/* ── NAV ── */}
        <nav style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0 20px" : "0 48px",
          height: isMobile ? 56 : 64,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #f0f0f0",
        }}>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: isMobile ? 18 : 20,
            letterSpacing: "-0.02em",
          }}>
            résumé<span style={{
              background: "linear-gradient(90deg, #6366f1, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>AI</span>
          </div>

          {!isMobile && (
            <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
              {["Features", "How it Works", "Templates"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} style={{
                  fontSize: 14,
                  color: "#555",
                  textDecoration: "none",
                  fontWeight: 400,
                  transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => e.target.style.color = "#111"}
                  onMouseLeave={(e) => e.target.style.color = "#555"}
                >
                  {item}
                </a>
              ))}
            </div>
          )}

          {!isMobile && (
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/register?mode=login" style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "transparent",
                fontSize: 14,
                color: "#333",
                textDecoration: "none",
                fontWeight: 500,
              }}>
                Sign in
              </Link>
              <Link to="/register?mode=register" style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "1px solid #111",
                background: "#111",
                fontSize: 14,
                color: "#fff",
                textDecoration: "none",
                fontWeight: 500,
              }}>
                Get started
              </Link>
            </div>
          )}

          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "none",
                border: "none",
                fontSize: 24,
                cursor: "pointer",
                color: "#111",
                padding: "4px 8px",
              }}
            >
              ☰
            </button>
          )}

          {/* Mobile Menu */}
          {isMobile && mobileMenuOpen && (
            <div style={{
              position: "absolute",
              top: 56,
              left: 0,
              right: 0,
              background: "rgba(255,255,255,0.98)",
              borderBottom: "1px solid #f0f0f0",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              {["Features", "How it Works", "Templates"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: 14,
                    color: "#555",
                    textDecoration: "none",
                    fontWeight: 400,
                    padding: "8px 0",
                  }}
                >
                  {item}
                </a>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexDirection: "column" }}>
                <Link to="/register?mode=login" style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "transparent",
                  fontSize: 14,
                  color: "#333",
                  textDecoration: "none",
                  fontWeight: 500,
                  textAlign: "center",
                }}>
                  Sign in
                </Link>
                <Link to="/register?mode=register" style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid #111",
                  background: "#111",
                  fontSize: 14,
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 500,
                  textAlign: "center",
                }}>
                  Get started
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <section style={{
          minHeight: isMobile ? "80vh" : "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "80px 16px 60px" : "120px 24px 80px",
          textAlign: "center",
        }}>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 999,
            border: "1px solid #e5e5e5",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: 40,
            background: "#fff",
            color: "#555",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              display: "inline-block",
            }} />
            AI-powered career toolkit
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(42px, 7vw, 82px)",
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            maxWidth: 800,
            marginBottom: 12,
            color: "#0a0a0a",
          }}>
            Land your dream job
          </h1>

          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(42px, 7vw, 82px)",
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            maxWidth: 800,
            marginBottom: 28,
            color: "#0a0a0a",
            fontStyle: "italic",
          }}>
            with{" "}
            <span style={{
              background: "linear-gradient(90deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              <Typewriter words={[
                "smarter resumes.",
                "AI-powered edits.",
                "perfect ATS scores.",
                "tailored cover letters.",
                "instant JD matching.",
              ]} />
            </span>
          </h1>

          <p style={{
            fontSize: isMobile ? 16 : 18,
            color: "#666",
            lineHeight: 1.7,
            maxWidth: 540,
            marginBottom: 44,
          }}>
            The complete AI ecosystem for job seekers — build, optimize, and tailor your resume in minutes, not hours.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", maxWidth: "100%" }}>
            <Link to="/register?mode=register" style={{
              padding: isMobile ? "12px 24px" : "14px 32px",
              borderRadius: 12,
              background: "#111",
              color: "#fff",
              textDecoration: "none",
              fontSize: isMobile ? 14 : 15,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "inline-block",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Build my resume →
            </Link>
            <Link to="/templates" style={{
              padding: isMobile ? "12px 24px" : "14px 32px",
              borderRadius: 12,
              background: "transparent",
              color: "#111",
              textDecoration: "none",
              fontSize: isMobile ? 14 : 15,
              fontWeight: 500,
              border: "1px solid #ddd",
              transition: "border-color 0.2s, background 0.2s",
              display: "inline-block",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#f9f9f9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "transparent"; }}
            >
              Browse templates
            </Link>
          </div>

          {/* floating badge */}
          <div style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            gap: 24,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            {["No credit card required", "Free tier available", "Export to PDF & DOCX"].map((t) => (
              <div key={t} style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13, color: "#888",
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" stroke="#ccc" />
                  <path d="M4 7l2 2 4-4" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{
          padding: isMobile ? "60px 20px" : "80px 48px",
          background: "#f9f9f9",
          borderTop: "1px solid #efefef",
          borderBottom: "1px solid #efefef",
          colorScheme: "light",
        }}>
          <div style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(180px, 1fr))",
            gap: isMobile ? 24 : 48,
          }}>
            <Stat value="98%" label="ATS pass rate" color="linear-gradient(135deg,#6366f1,#818cf8)" delay={0} />
            <Stat value="3×" label="More interviews" color="linear-gradient(135deg,#ec4899,#f472b6)" delay={100} />
            <Stat value="50k+" label="Resumes built" color="linear-gradient(135deg,#f59e0b,#fbbf24)" delay={200} />
            <Stat value="< 5min" label="Average build time" color="linear-gradient(135deg,#10b981,#34d399)" delay={300} />
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ padding: isMobile ? "60px 20px" : "100px 48px", background: "#fff", colorScheme: "light" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: isMobile ? 40 : 64 }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#aaa",
                  marginBottom: 16,
                }}>
                  Everything you need
                </div>
                <h2 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: isMobile ? "clamp(24px, 6vw, 40px)" : "clamp(32px, 5vw, 48px)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "#111",
                  marginBottom: 16,
                }}>
                  The complete career AI toolkit
                </h2>
                <p style={{ fontSize: isMobile ? 14 : 16, color: "#777", maxWidth: 460, margin: "0 auto" }}>
                  Six interconnected tools working together so your resume is always one step ahead.
                </p>
              </div>
            </Reveal>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}>
              {features.map((f, i) => (
                <FeatureCard key={f.title} {...f} delay={i * 80} />
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{
          padding: isMobile ? "60px 20px" : "100px 48px",
          background: "#f9f9f9",
          borderTop: "1px solid #efefef",
          colorScheme: "light",
        }}>
          <div style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 40 : 80,
            alignItems: "center",
          }}>
            <div>
              <Reveal>
                <div style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#aaa",
                  marginBottom: 16,
                }}>
                  How it works
                </div>
                <h2 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: isMobile ? 32 : 40,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "#111",
                  marginBottom: 16,
                }}>
                  From zero to interview-ready
                </h2>
                <p style={{ fontSize: isMobile ? 14 : 15, color: "#777", lineHeight: 1.7, marginBottom: 40 }}>
                  No resume writing experience needed. Our AI handles the hard parts.
                </p>
              </Reveal>

              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <Step num="1" title="Create an account" desc="Sign up free. No credit card, no friction — get straight to building." delay={0} />
                <Step num="2" title="Enter your details" desc="Fill in your experience, skills, and education. Or upload an existing resume to enhance." delay={100} />
                <Step num="3" title="AI builds your resume" desc="Our AI structures, rewrites, and keyword-optimizes your content for maximum impact." delay={200} />
                <Step num="4" title="Check ATS & apply" desc="Run the ATS checker, match to job descriptions, and export in one click." delay={300} />
              </div>
            </div>

            {/* Visual card mock */}
            <Reveal delay={200}>
              <div style={{
                border: "1px solid #e8e8e8",
                borderRadius: 20,
                padding: isMobile ? 24 : 32,
                background: "#fff",
                boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 30px 80px rgba(0,0,0,0.12)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                  paddingBottom: 20,
                  borderBottom: "1px solid #f0f0f0",
                  flexWrap: "wrap",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "#111",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 13, fontWeight: 600,
                  }}>JD</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Jane Doe</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>Product Designer • SF</div>
                  </div>
                  <div style={{
                    marginLeft: "auto",
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #6366f1, #818cf8)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    ATS 96
                  </div>
                </div>

                {[
                  { label: "Experience", bars: [1, 0.8, 0.6] },
                  { label: "Skills", bars: [0.9, 0.75, 0.95, 0.6] },
                ].map((section) => (
                  <div key={section.label} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#bbb", marginBottom: 10 }}>
                      {section.label}
                    </div>
                    {section.bars.map((w, i) => (
                      <div key={i} style={{
                        height: 8,
                        borderRadius: 4,
                        background: "#f5f5f5",
                        marginBottom: 8,
                        overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${w * 100}%`,
                          borderRadius: 4,
                          background: i % 2 === 0
                            ? "linear-gradient(90deg, #6366f1, #818cf8)"
                            : "linear-gradient(90deg, #e5e7eb, #d1d5db)",
                          transition: "width 0.6s ease-out",
                        }} />
                      </div>
                    ))}
                  </div>
                ))}

                <div style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "#f9f9f9",
                  border: "1px solid #f0f0f0",
                  fontSize: 13,
                  color: "#555",
                  lineHeight: 1.6,
                }}>
                  <span style={{ fontWeight: 600, color: "#111" }}>AI suggestion:</span>{" "}
                  Add quantifiable achievements to your Experience section. Try{" "}
                  <span style={{
                    background: "linear-gradient(90deg,#6366f1,#ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 600,
                  }}>
                    "Increased user retention by 34%"
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          padding: isMobile ? "80px 20px 60px" : "120px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background: "#fff",
          colorScheme: "light",
        }}>
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600, height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <Reveal>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: isMobile ? "clamp(28px, 6vw, 48px)" : "clamp(36px, 5vw, 56px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#111",
              maxWidth: 600,
              margin: "0 auto 20px",
            }}>
              Your next job starts with a better resume.
            </h2>
            <p style={{ fontSize: isMobile ? 14 : 16, color: "#888", marginBottom: 40 }}>
              Join 50,000+ job seekers who landed interviews faster with résumé<span style={{
                background: "linear-gradient(90deg,#6366f1,#ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
              }}>AI</span>.
            </p>
            <Link to="/register?mode=register" style={{
              display: "inline-block",
              padding: isMobile ? "14px 32px" : "16px 40px",
              borderRadius: 14,
              background: "#111",
              color: "#fff",
              textDecoration: "none",
              fontSize: isMobile ? 15 : 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Start for free — it takes 2 minutes
            </Link>
          </Reveal>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: "1px solid #efefef",
          padding: isMobile ? "32px 20px" : "40px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? "flex-start" : "space-between",
          flexWrap: "wrap",
          gap: isMobile ? 16 : 20,
          background: "#fff",
          colorScheme: "light",
        }}>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: isMobile ? 16 : 18,
          }}>
            résumé<span style={{
              background: "linear-gradient(90deg,#6366f1,#ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>AI</span>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 16 : 28, flexWrap: "wrap" }}>
            {["Privacy", "Terms", "Contact"].map((t) => (
              <a key={t} href="#" style={{ fontSize: isMobile ? 12 : 13, color: "#999", textDecoration: "none" }}>{t}</a>
            ))}
          </div>
          <div style={{ fontSize: isMobile ? 11 : 13, color: "#ccc", width: isMobile ? "100%" : "auto" }}>
            © 2026 résuméAI. All rights reserved.
          </div>
        </footer>

      </div>
    </>
  );
}
