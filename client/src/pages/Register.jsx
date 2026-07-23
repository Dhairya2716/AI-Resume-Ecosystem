import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AIOrb from "../components/ui/AIOrb";
import AuroraBackground from "../components/ui/AuroraBackground";
import CursorGlow from "../components/ui/CursorGlow";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function SocialBtn({ icon, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-wait group ${disabled ? '' : 'hover:-translate-y-0.5'}`}
    >
      <div className="opacity-80 group-hover:opacity-100 transition-opacity">{icon}</div>
      <span>{label}</span>
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">or</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

function Field({ label, id, type = "text", placeholder, value, onChange, icon: Icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors duration-300 group-focus-within:text-violet-400">
          <Icon className="w-5 h-5" />
        </div>
        <input
          id={id} 
          type={type} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder}
          onFocus={() => setFocused(true)} 
          onBlur={() => setFocused(false)}
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all duration-300"
        />
        {/* Glow effect on focus */}
        <div className={`absolute inset-0 -z-10 rounded-xl transition-opacity duration-300 blur-md ${focused ? 'opacity-100 bg-violet-500/20' : 'opacity-0'}`} />
      </div>
    </div>
  );
}

function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6 flex items-start gap-3"
    >
      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      <span className="text-sm text-rose-400 font-medium leading-relaxed">{message}</span>
    </motion.div>
  );
}

function SubmitBtn({ children, loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`relative w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] disabled:opacity-70 disabled:cursor-wait overflow-hidden group ${loading ? '' : 'hover:-translate-y-1'}`}
    >
      {/* Shine effect */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
      
      <div className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : children}
      </div>
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
    <motion.form 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit} 
      noValidate
      className="w-full"
    >
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Welcome back</h1>
        <p className="text-zinc-400 text-sm">Sign in to access your intelligent workspace.</p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <SocialBtn icon={<GoogleIcon />} label="Continue with Google" onClick={() => handleOAuth("google")} disabled={loading} />
        <SocialBtn icon={<GithubIcon />} label="Continue with GitHub" onClick={() => handleOAuth("github")} disabled={loading} />
      </div>
      
      <Divider />
      <ErrorAlert message={error} />

      <Field id="login-email"    label="Email"    type="email"    placeholder="you@example.com" icon={Mail} value={email} onChange={e => { setEmail(e.target.value); clearError(); }} />
      <Field id="login-password" label="Password" type="password" placeholder="••••••••"       icon={Lock} value={pass}  onChange={e => { setPass(e.target.value);  clearError(); }} />

      <div className="flex justify-end mb-8 mt-[-10px]">
        <button type="button" className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
          Forgot password?
        </button>
      </div>

      <SubmitBtn loading={loading}>
        Sign In <ArrowRight className="w-4 h-4 ml-1" />
      </SubmitBtn>

      <p className="text-center text-sm text-zinc-400 mt-8">
        Don't have an account?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          Sign up
        </button>
      </p>
    </motion.form>
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
  const strengthColors = ["bg-zinc-800", "bg-rose-500", "bg-amber-500", "bg-emerald-500"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];
  const activeColor = strengthColors[strength];

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
    <motion.form 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit} 
      noValidate
      className="w-full"
    >
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Create account</h1>
        <p className="text-zinc-400 text-sm">Start building your perfect resume today.</p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <SocialBtn icon={<GoogleIcon />} label="Continue with Google" onClick={() => handleOAuth("google")} disabled={loading} />
        <SocialBtn icon={<GithubIcon />} label="Continue with GitHub" onClick={() => handleOAuth("github")} disabled={loading} />
      </div>
      
      <Divider />
      <ErrorAlert message={error} />

      <Field id="reg-name"     label="Full Name" placeholder="Jane Smith"     icon={User} value={name}  onChange={e => { setName(e.target.value);  clearError(); }} />
      <Field id="reg-email"    label="Email"     type="email" placeholder="you@example.com" icon={Mail} value={email} onChange={e => { setEmail(e.target.value); clearError(); }} />
      <Field id="reg-password" label="Password"  type="password" placeholder="••••••••"    icon={Lock} value={pass}  onChange={e => { setPass(e.target.value);  clearError(); }} />

      {pass.length > 0 && (
        <div className="mb-8 mt-[-10px]">
          <div className="flex gap-1.5 mb-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? activeColor : 'bg-white/10'}`} 
              />
            ))}
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${activeColor.replace('bg-', 'text-')}`}>
            {strengthLabels[strength]}
          </span>
        </div>
      )}

      <div className="mb-2" />
      <SubmitBtn loading={loading}>
        Create Account <ArrowRight className="w-4 h-4 ml-1" />
      </SubmitBtn>

      <p className="text-center text-sm text-zinc-400 mt-8">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          Sign in
        </button>
      </p>
    </motion.form>
  );
}

/* ─── Page shell ──────────────────────────────────────────────────────── */
export default function Register() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate  = useNavigate();

  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);

  // Already logged in → go to dashboard
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  // Sync mode from URL params
  useEffect(() => {
    setMode(searchParams.get("mode") === "register" ? "register" : "login");
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#050505] flex overflow-hidden">
      <CursorGlow />

      {/* Left Panel (Visuals) */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 border-r border-white/10 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <AuroraBackground />
        </div>
        
        {/* 3D Orb overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pt-20 mix-blend-screen opacity-60">
          <AIOrb />
        </div>

        {/* Content */}
        <div className="relative z-20 flex flex-col h-full justify-between pointer-events-none">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-display text-white text-xl shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              R
            </div>
            <div className="font-sans text-xl font-bold text-white tracking-tight">
              Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI</span>
            </div>
          </div>

          <div className="max-w-md mt-auto mb-16">
            <h2 className="text-4xl xl:text-5xl font-display font-bold text-white mb-6 leading-tight">
              Shape every part <br /> of your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 italic">story.</span>
            </h2>
            <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
              Intelligent tools to build a resume that makes your experience impossible to overlook.
            </p>
            
            <div className="flex gap-8 xl:gap-12">
              {STATS.map((s, i) => (
                <div key={i}>
                  <div className="text-2xl xl:text-3xl font-bold text-white mb-1 font-sans tracking-tight">
                    <AnimatedNumber target={s.value} />{s.suffix}
                  </div>
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-sm border-l-2 border-l-violet-500">
            <p className="text-sm font-medium text-zinc-300 italic leading-relaxed">
              "The most intelligent workspace to accelerate your career."
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-auto z-10">
        {/* Back button */}
        <Link to="/" className="absolute top-8 right-8 md:top-12 md:right-12 z-50 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
          <span className="text-sm font-medium transition-colors">Home</span>
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-white/10 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Subtle mesh background on right side */}
        <div className="absolute inset-0 bg-[#050505] -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <LoginForm key="login" onSwitch={() => setMode("register")} />
            ) : (
              <RegisterForm key="register" onSwitch={() => setMode("login")} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}