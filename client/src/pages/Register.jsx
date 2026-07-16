import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthAnimation from "../components/ui/AuthAnimation";

const BACKEND = "http://localhost:5000/api"

function AnimatedNumber({ target }) {
  const [val, setVal] = useState(0);
  const num = parseFloat(target);
  const suffix = target.replace(/[0-9.]/g, "");
  useEffect(() => {
    if (isNaN(num)) return;
    let start = 0;
    const step = num / 40;
    const id = setInterval(() => {
      start += step;
      if (start >= num) { setVal(num); clearInterval(id); }
      else setVal(start);
    }, 30);
    return () => clearInterval(id);
  }, [num]);
  if (isNaN(num)) return <>{target}</>;
  return <>{Number.isInteger(num) ? Math.floor(val) : val.toFixed(1)}{suffix}</>;
}

const STATS = [
  { value: "50k", suffix: "+", label: "Resumes Built" },
  { value: "12",  suffix: "",  label: "Templates" },
  { value: "4.8", suffix: "★", label: "User Rating" },
];

function LeftPanel() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  const t = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(14px)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  });
  return (
    <div style={{
      flex: 1, background: "var(--bg-root)", position: "relative",
      overflow: "hidden", display: "flex", flexDirection: "column",
      justifyContent: "space-between",
      padding: "clamp(1.5rem, 3vh, 2.5rem) clamp(1.5rem, 3vw, 2.5rem)",
      minHeight: "100vh", minWidth: "420px", borderRight: "1px solid var(--border-subtle)"
    }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <AuthAnimation />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, transparent 0%, var(--bg-root) 100%)", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ position: "relative", zIndex: 2, ...t(0) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff", fontWeight: 700, fontFamily: "var(--font-display)", flexShrink: 0, boxShadow: "var(--glow-purple)" }}>R</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Resume<span style={{ color: "var(--accent-purple)" }}>AI</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 2, ...t(0.15) }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 400, color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "clamp(0.6rem, 1.5vh, 1rem)", letterSpacing: "-0.02em" }}>
          Shape every part<br />
          of your <span style={{ fontStyle: "italic", background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>story</span>.
        </div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(0.9rem, 1.2vw, 1rem)", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 340, margin: 0 }}>
          Intelligent tools to build a resume that makes your experience impossible to overlook.
        </p>
        <div style={{ width: 40, height: 2, background: "var(--accent-purple)", margin: "clamp(1.2rem,3vh,2rem) 0", opacity: 0.8, borderRadius: "2px", boxShadow: "var(--glow-purple)" }} />
        <div style={{ display: "flex", gap: "clamp(1.2rem, 3vw, 2.2rem)" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ ...t(0.3 + i * 0.1) }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(1.2rem,2vw,1.6rem)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
                <AnimatedNumber target={s.value} />{s.suffix}
              </div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: 6, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div style={{ position: "relative", zIndex: 2, ...t(0.6), borderLeft: "3px solid var(--accent-purple)", paddingLeft: "1.2rem", background: "linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%)", padding: "1rem", borderRadius: "0 12px 12px 0" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontStyle: "italic", fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
          "The most intelligent workspace to accelerate your career."
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1207" style={{ flexShrink: 0 }}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function SocialBtn({ icon, label, onClick, disabled }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      id={`oauth-btn-${label.toLowerCase().replace(/\s+/g, "-")}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", padding: "0.8rem 1rem",
        background: hover ? "var(--bg-hover)" : "var(--bg-surface)",
        border: "1px solid var(--border-default)", borderRadius: "10px", cursor: disabled ? "wait" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 500, fontFamily: "var(--font-sans)",
        transition: "all 0.2s", marginBottom: "0.8rem",
        opacity: disabled ? 0.6 : 1,
        backdropFilter: "blur(10px)",
      }}
    >
      {icon}<span>{label}</span>
    </button>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "1.5rem 0" }}>
      <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--text-tertiary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>or</span>
      <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
    </div>
  );
}

function Field({ label, id, type = "text", placeholder, value, onChange, icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "clamp(1rem, 2vh, 1.5rem)" }}>
      <label htmlFor={id} style={{ display: "block", marginBottom: "0.5rem", fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</label>
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: focused ? "var(--accent-purple)" : "var(--text-tertiary)", fontSize: 16, transition: "color 0.2s" }}>{icon}</span>}
        <input
          id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: icon ? "0.8rem 1rem 0.8rem 2.8rem" : "0.8rem 1rem",
            background: "var(--bg-surface)",
            border: `1px solid ${focused ? "var(--accent-purple)" : "var(--border-default)"}`,
            borderRadius: "10px", fontSize: "0.95rem", color: "var(--text-primary)", outline: "none",
            fontFamily: "var(--font-sans)", transition: "all 0.2s",
            boxShadow: focused ? "var(--glow-purple)" : "none",
          }}
        />
      </div>
    </div>
  );
}

function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 7,
      padding: "0.6rem 0.9rem", marginBottom: "1rem",
      fontFamily: "Georgia, serif", fontSize: "0.8rem", color: "#b91c1c",
      display: "flex", alignItems: "flex-start", gap: 7,
    }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
      <span>{message}</span>
    </div>
  );
}

function SubmitBtn({ children, loading }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", padding: "0.9rem",
        background: loading ? "var(--bg-elevated)" : "var(--accent-gradient)",
        border: "none", borderRadius: "10px",
        color: "#fff", fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.02em",
        fontFamily: "var(--font-sans)", cursor: loading ? "wait" : "pointer",
        transition: "all 0.2s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        boxShadow: loading ? "none" : (hover ? "0 0 30px rgba(139, 92, 246, 0.5)" : "var(--glow-purple)"),
        transform: hover && !loading ? "translateY(-1px)" : "none"
      }}
    >
      {loading
        ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />Processing…</>
        : children}
    </button>
  );
}

/* ─── Login Form ──────────────────────────────────────────────────────── */
function LoginForm({ onSwitch }) {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [loading, setLoading] = useState(false);

  const handleOAuth = (provider) => {
    window.location.href = `${BACKEND}/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    try {
      await login({ email, password: pass });
      navigate("/dashboard");
    } catch {
      // error already set in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,2.8vw,2rem)", fontWeight: 400, color: "var(--text-primary)", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>Welcome back</h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0 }}>Sign in to access your intelligent workspace.</p>
      </div>

      <SocialBtn icon={<GoogleIcon />} label="Continue with Google" onClick={() => handleOAuth("google")} disabled={loading} />
      <SocialBtn icon={<GithubIcon />} label="Continue with GitHub" onClick={() => handleOAuth("github")} disabled={loading} />
      <Divider />

      <ErrorAlert message={error} />

      <Field id="login-email"    label="Email"    type="email"    placeholder="you@example.com" icon="✉" value={email} onChange={e => { setEmail(e.target.value); clearError(); }} />
      <Field id="login-password" label="Password" type="password" placeholder="••••••••"       icon="⚿" value={pass}  onChange={e => { setPass(e.target.value);  clearError(); }} />

      <div style={{ textAlign: "right", marginBottom: "1.5rem", marginTop: "-0.5rem" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--accent-cyan)", cursor: "pointer", transition: "color 0.2s" }}>Forgot password?</span>
      </div>

      <SubmitBtn loading={loading}>Sign In</SubmitBtn>

      <p style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "1.5rem", marginBottom: 0 }}>
        Don't have an account?{" "}
        <span onClick={onSwitch} style={{ color: "var(--accent-purple)", cursor: "pointer", fontWeight: 600, transition: "color 0.2s" }}>Sign up</span>
      </p>
    </form>
  );
}

/* ─── Register Form ───────────────────────────────────────────────────── */
function RegisterForm({ onSwitch }) {
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [loading, setLoading] = useState(false);

  const strength = pass.length === 0 ? 0 : pass.length < 6 ? 1 : pass.length < 10 ? 2 : 3;
  const sColor   = ["transparent", "#c0392b", "#d4a044", "#2e7d4f"][strength];

  const handleOAuth = (provider) => {
    window.location.href = `${BACKEND}/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    try {
      await register({ name, email, password: pass });
      navigate("/dashboard");
    } catch {
      // error already set in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,2.8vw,2rem)", fontWeight: 400, color: "var(--text-primary)", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>Create account</h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0 }}>Start building your perfect resume today.</p>
      </div>

      <SocialBtn icon={<GoogleIcon />} label="Continue with Google" onClick={() => handleOAuth("google")} disabled={loading} />
      <SocialBtn icon={<GithubIcon />} label="Continue with GitHub" onClick={() => handleOAuth("github")} disabled={loading} />
      <Divider />

      <ErrorAlert message={error} />

      <Field id="reg-name"     label="Full Name" placeholder="Jane Smith"     icon="✦" value={name}  onChange={e => { setName(e.target.value);  clearError(); }} />
      <Field id="reg-email"    label="Email"     type="email" placeholder="you@example.com" icon="✉" value={email} onChange={e => { setEmail(e.target.value); clearError(); }} />
      <Field id="reg-password" label="Password"  type="password" placeholder="••••••••"    icon="⚿" value={pass}  onChange={e => { setPass(e.target.value);  clearError(); }} />

      {pass.length > 0 && (
        <div style={{ marginBottom: "1.5rem", marginTop: "-0.5rem" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? sColor : "var(--border-default)", transition: "background 0.3s" }} />)}
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: sColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {["", "Weak", "Fair", "Strong"][strength]}
          </span>
        </div>
      )}

      <div style={{ marginBottom: "1.5rem" }} />
      <SubmitBtn loading={loading}>Create Account</SubmitBtn>

      <p style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "1.5rem", marginBottom: 0 }}>
        Already have an account?{" "}
        <span onClick={onSwitch} style={{ color: "var(--accent-purple)", cursor: "pointer", fontWeight: 600, transition: "color 0.2s" }}>Sign in</span>
      </p>
    </form>
  );
}

/* ─── Page shell ──────────────────────────────────────────────────────── */
export default function Register() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate  = useNavigate();

  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [page,   setPage]   = useState(initialMode);
  const [fading, setFading] = useState(false);

  // Already logged in → go to dashboard
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  // Sync mode from URL params
  useEffect(() => {
    setPage(searchParams.get("mode") === "register" ? "register" : "login");
  }, [searchParams]);

  const switchPage = (next) => {
    setFading(true);
    setTimeout(() => { setPage(next); setFading(false); }, 220);
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { margin: 0; padding: 0; }
        #root { min-height: 100vh; }
        input::placeholder { color: var(--text-muted); font-family: var(--font-sans); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #f0f4ff inset !important;
          -webkit-text-fill-color: #0f172a !important;
        }
        button:active { transform: scale(0.98); }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", width: "100vw", overflow: "hidden", flexWrap: "wrap", background: "#F0F4FF" }}>
        <LeftPanel />

        <div style={{
          flex: 1.2,
          background: "linear-gradient(135deg, #F8FAFF 0%, #EEF2FF 50%, #F0F9FF 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "clamp(1.5rem, 4vh, 3rem) clamp(2rem, 5vw, 4rem)",
          position: "relative", overflow: "auto", minHeight: "100vh", minWidth: "420px",
        }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle at 80% 10%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(circle at 20% 90%, rgba(8,145,178,0.1) 0%, transparent 50%)" }} />

          <div style={{
            width: "100%", maxWidth: "clamp(340px, 90vw, 460px)",
            padding: "clamp(2rem, 4vh, 3rem)",
            backgroundColor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(24px) saturate(200%)", WebkitBackdropFilter: "blur(24px) saturate(200%)",
            borderRadius: "24px",
            border: "1.5px solid rgba(255,255,255,0.9)",
            boxShadow: "0 24px 64px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,1)",
            opacity: fading ? 0 : 1,
            transform: fading ? "translateX(8px)" : "none",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)", position: "relative", zIndex: 1,
          }}>
            {page === "login"
              ? <LoginForm  onSwitch={() => switchPage("register")} />
              : <RegisterForm onSwitch={() => switchPage("login")} />
            }
          </div>
        </div>
      </div>
    </>
  );
}