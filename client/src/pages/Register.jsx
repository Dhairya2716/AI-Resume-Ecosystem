import { useState, useEffect } from "react";

function AnimatedNumber({ target }){
  const [val, setVal] = useState(0);

  const num = parseFloat(target);
  const suffix = target.replace(/[0-9.]/g, "");

  useEffect(() => {
    if(isNaN(num)) return;

    let start = 0;
    const step = num / 40;

    const id = setInterval(() => {
      start += step;

      if(start >= num){
        setVal(num);
        clearInterval(id);
      }
      else{
        setVal(start);
      }
    }, 30);

    return () => clearInterval(id);
  }, [num]);

  if(isNaN(num)) return <>{ target }</>

  return(
    <>
    { Number.isInteger(num) ? Math.floor(val) : val.toFixed(1) }
    { suffix }
    </>
  );
}

const STATS = [
  { value: "50k", suffix: "+", label: "Resumes Built" },
  { value: "12", suffix: "", label: "Templates" },
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
      flex: 1,
      background: "#1a1207",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "clamp(1.5rem, 3vh, 2.5rem) clamp(1.5rem, 3vw, 2.5rem)",
      minHeight: "100vh",
      minWidth: "420px",
    }}>
      {/* Warm glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(ellipse 80% 60% at 20% 80%, rgba(180,120,40,0.15) 0%, transparent 60%),
          radial-gradient(ellipse 60% 80% at 80% 20%, rgba(120,60,20,0.12) 0%, transparent 60%)`,
      }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 500 800" preserveAspectRatio="xMidYMid slice">
        <circle cx="420" cy="120" r="180" fill="none" stroke="rgba(210,160,60,0.09)" strokeWidth="1" />
        <circle cx="420" cy="120" r="110" fill="none" stroke="rgba(210,160,60,0.06)" strokeWidth="0.5" />
        <circle cx="80" cy="700" r="200" fill="none" stroke="rgba(210,160,60,0.07)" strokeWidth="1" />
        <line x1="350" y1="0" x2="200" y2="800" stroke="rgba(210,160,60,0.04)" strokeWidth="0.5" />
        <polygon points="400,620 445,710 355,710" fill="none" stroke="rgba(210,160,60,0.07)" strokeWidth="0.5" />
      </svg>

      {/* Logo */}
      <div style={{ position: "relative", zIndex: 1, ...t(0) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 7,
            background: "linear-gradient(135deg, #d4a044 0%, #a06820 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: "#fff", fontWeight: 700, fontFamily: "Georgia, serif",
            flexShrink: 0,
          }}>R</div>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1.05rem", color: "#f0e6cc", letterSpacing: "0.02em" }}>
            Resume<span style={{ color: "#d4a044" }}>Pilot</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 1, ...t(0.15) }}>
        <div style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
          fontWeight: 400, color: "#f0e6cc", lineHeight: 1.2,
          marginBottom: "clamp(0.6rem, 1.5vh, 1rem)",
          letterSpacing: "-0.01em",
        }}>
          Craft your<br />
          <span style={{ fontStyle: "italic", color: "#d4a044" }}>perfect</span> résumé<br />
          in minutes.
        </div>
        <p style={{
          fontFamily: "Georgia, serif", fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)",
          color: "rgba(240,230,204,0.5)", lineHeight: 1.65,
          maxWidth: 300, margin: 0,
        }}>
          AI-powered suggestions, beautiful templates, and real-time preview — everything you need to land your dream role.
        </p>
        <div style={{ width: 40, height: 1, background: "#d4a044", margin: "clamp(0.8rem,2vh,1.5rem) 0", opacity: 0.45 }} />
        <div style={{ display: "flex", gap: "clamp(1.2rem, 3vw, 2.2rem)" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ ...t(0.3 + i * 0.1) }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.1rem,2vw,1.4rem)", fontWeight: 400, color: "#d4a044", lineHeight: 1 }}>
                <AnimatedNumber target={s.value} />
                {s.suffix}
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "0.65rem", color: "rgba(240,230,204,0.4)", marginTop: 3, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div style={{
        position: "relative", zIndex: 1, ...t(0.6),
        borderLeft: "2px solid rgba(212,160,68,0.3)", paddingLeft: "0.9rem",
      }}>
        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8rem", color: "rgba(240,230,204,0.32)", margin: 0, lineHeight: 1.6 }}>
          "The résumé is your first impression — make it extraordinary."
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1207" style={{ flexShrink: 0 }}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function SocialBtn({ icon, label }) {
  const [hover, setHover] = useState(false);
  return (
    <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      width: "100%", padding: "0.7rem 1rem",
      background: hover ? "#f0ebe0" : "#fff",
      border: "1.5px solid #e0d8c8", borderRadius: 7, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
      fontSize: "0.85rem", color: "#1a1207", fontFamily: "Georgia, serif",
      transition: "background 0.18s", marginBottom: "0.7rem",
    }}>
      {icon}<span>{label}</span>
    </button>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "1rem 0" }}>
      <div style={{ flex: 1, height: 1, background: "#e0d8c8" }} />
      <span style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: "#b8a88a", letterSpacing: "0.05em" }}>or</span>
      <div style={{ flex: 1, height: 1, background: "#e0d8c8" }} />
    </div>
  );
}

function Field({ label, type = "text", placeholder, value, onChange, icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "clamp(0.8rem, 1.5vh, 1.2rem)" }}>
      <label style={{
        display: "block", marginBottom: "0.35rem",
        fontFamily: "Georgia, serif", fontSize: "0.7rem",
        color: "#4a3f2f", letterSpacing: "0.07em", textTransform: "uppercase",
      }}>{label}</label>
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: focused ? "#8b6914" : "#b8a88a", fontSize: 13, transition: "color 0.2s" }}>{icon}</span>}
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: icon ? "0.65rem 1rem 0.65rem 2.5rem" : "0.65rem 1rem",
            background: focused ? "#fff" : "#faf7f2",
            border: `1.5px solid ${focused ? "#8b6914" : "#e0d8c8"}`,
            borderRadius: 7, fontSize: "0.88rem", color: "#1a1207", outline: "none",
            fontFamily: "Georgia, serif", transition: "all 0.2s",
            boxShadow: focused ? "0 0 0 3px rgba(139,105,20,0.1)" : "none",
          }}
        />
      </div>
    </div>
  );
}

function SubmitBtn({ children, loading }) {
  const [hover, setHover] = useState(false);
  return (
    <button disabled={loading} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      width: "100%", padding: "0.8rem",
      background: loading ? "#c8a84a" : hover ? "#6b4e10" : "#1a1207",
      border: "none", borderRadius: 7,
      color: "#f5ead4", fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase",
      fontFamily: "Georgia, serif", cursor: loading ? "wait" : "pointer",
      transition: "background 0.2s",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}>
      {loading ? (
        <><span style={{ width: 13, height: 13, border: "2px solid rgba(245,234,212,0.3)", borderTopColor: "#f5ead4", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />Processing…</>
      ) : children}
    </button>
  );
}

function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.4rem,2.5vw,1.8rem)", fontWeight: 400, color: "#1a1207", margin: "0 0 0.3rem", letterSpacing: "-0.01em" }}>Welcome back</h1>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "0.85rem", color: "#8a7a62", margin: 0 }}>Sign in to access your résumés</p>
      </div>
      <SocialBtn icon={<GoogleIcon />} label="Continue with Google" />
      <SocialBtn icon={<GithubIcon />} label="Continue with GitHub" />
      <Divider />
      <Field label="Email" type="email" placeholder="you@example.com" icon="✉" value={email} onChange={e => setEmail(e.target.value)} />
      <Field label="Password" type="password" placeholder="••••••••" icon="⚿" value={pass} onChange={e => setPass(e.target.value)} />
      <div style={{ textAlign: "right", marginBottom: "1.2rem", marginTop: "-0.4rem" }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: "#8b6914", cursor: "pointer" }}>Forgot password?</span>
      </div>
      <SubmitBtn loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>Sign In →</SubmitBtn>
      <p style={{ textAlign: "center", fontFamily: "Georgia, serif", fontSize: "0.8rem", color: "#8a7a62", marginTop: "1.2rem", marginBottom: 0 }}>
        Don't have an account?{" "}
        <span onClick={onSwitch} style={{ color: "#8b6914", cursor: "pointer", fontWeight: 600, textDecoration: "underline", textDecorationColor: "rgba(139,105,20,0.4)" }}>Sign up</span>
      </p>
    </div>
  );
}

function RegisterForm({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const strength = pass.length === 0 ? 0 : pass.length < 6 ? 1 : pass.length < 10 ? 2 : 3;
  const sColor = ["transparent","#c0392b","#d4a044","#2e7d4f"][strength];
  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.4rem,2.5vw,1.8rem)", fontWeight: 400, color: "#1a1207", margin: "0 0 0.3rem", letterSpacing: "-0.01em" }}>Create account</h1>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "0.85rem", color: "#8a7a62", margin: 0 }}>Start building your perfect résumé today</p>
      </div>
      <SocialBtn icon={<GoogleIcon />} label="Continue with Google" />
      <SocialBtn icon={<GithubIcon />} label="Continue with GitHub" />
      <Divider />
      <Field label="Full Name" placeholder="Jane Smith" icon="✦" value={name} onChange={e => setName(e.target.value)} />
      <Field label="Email" type="email" placeholder="you@example.com" icon="✉" value={email} onChange={e => setEmail(e.target.value)} />
      <Field label="Password" type="password" placeholder="••••••••" icon="⚿" value={pass} onChange={e => setPass(e.target.value)} />
      {pass.length > 0 && (
        <div style={{ marginBottom: "1rem", marginTop: "-0.5rem" }}>
          <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
            {[1,2,3].map(i => <div key={i} style={{ flex:1, height: 3, borderRadius:2, background: i<=strength ? sColor : "#e0d8c8", transition:"background 0.3s" }} />)}
          </div>
          <span style={{ fontFamily:"Georgia,serif", fontSize:"0.65rem", color:sColor, textTransform:"uppercase", letterSpacing:"0.08em" }}>
            {["","Weak","Fair","Strong"][strength]}
          </span>
        </div>
      )}
      <div style={{ marginBottom: "1.2rem" }} />
      <SubmitBtn loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>Create Account →</SubmitBtn>
      <p style={{ textAlign: "center", fontFamily: "Georgia, serif", fontSize: "0.8rem", color: "#8a7a62", marginTop: "1.2rem", marginBottom: 0 }}>
        Already have an account?{" "}
        <span onClick={onSwitch} style={{ color: "#8b6914", cursor: "pointer", fontWeight: 600, textDecoration: "underline", textDecorationColor: "rgba(139,105,20,0.4)" }}>Sign in</span>
      </p>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("login");
  const [fading, setFading] = useState(false);
  const switchPage = (next) => { setFading(true); setTimeout(() => { setPage(next); setFading(false); }, 220); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { margin: 0; padding: 0; }
        #root { min-height: 100vh; }
        input::placeholder { color: #b8a88a; font-family: Georgia, serif; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #faf7f2 inset !important;
          -webkit-text-fill-color: #1a1207 !important;
        }
        button:active { transform: scale(0.98); }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", width: "100vw", overflow: "hidden", flexWrap: "wrap" }}>
        {/* LEFT */}
        <LeftPanel />

        {/* RIGHT */}
        <div style={{
          flex: 1.2,
          background: "#faf6ef",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(1.5rem, 4vh, 3rem) clamp(2rem, 5vw, 4rem)",
          position: "relative",
          overflow: "auto",
          minHeight: "100vh",
          minWidth: "420px",
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "radial-gradient(circle at 80% 10%, rgba(212,160,68,0.06) 0%, transparent 50%), radial-gradient(circle at 20% 90%, rgba(139,105,20,0.05) 0%, transparent 50%)",
          }} />
          <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 1, background: "rgba(212,160,68,0.15)" }} />

          <div style={{
            width: "100%", maxWidth: "clamp(320px, 90vw, 420px)",
            padding: "clamp(1.5rem, 3vh, 2.5rem)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(212, 160, 68, 0.1)",
            opacity: fading ? 0 : 1,
            transform: fading ? "translateX(8px)" : "none",
            transition: "all 0.22s ease",
            position: "relative", zIndex: 1,
          }}>
            {page === "login"
              ? <LoginForm onSwitch={() => switchPage("register")} />
              : <RegisterForm onSwitch={() => switchPage("login")} />
            }
          </div>
        </div>
      </div>
    </>
  );
}