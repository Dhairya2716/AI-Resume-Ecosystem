import { useEffect, useRef, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

/* ─────────────────────────────────────────────────────────────────────────
   Animated loading screen — matches the project's white/black minimal theme
   (DM Serif Display logo  +  indigo→pink gradient  +  pulsing dots)
───────────────────────────────────────────────────────────────────────── */
function LoadingScreen() {
    const [dot, setDot] = useState(0)

    useEffect(() => {
        const id = setInterval(() => setDot((d) => (d + 1) % 4), 380)
        return () => clearInterval(id)
    }, [])

    return (
        <>
            {/* Google Font — same as Home.jsx */}
            <link
                href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <style>{`
                @keyframes raiLoadSpin {
                    to { transform: rotate(360deg); }
                }
                @keyframes raiLoadFade {
                    0%, 100% { opacity: 0.3; transform: translateY(0); }
                    50%       { opacity: 1;   transform: translateY(-4px); }
                }
                .rai-loading-root {
                    position: fixed; inset: 0;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    background: #fff;
                    font-family: 'DM Sans', sans-serif;
                    z-index: 9999;
                    gap: 32px;
                }
                .rai-logo {
                    font-family: 'DM Serif Display', Georgia, serif;
                    font-size: 26px;
                    letter-spacing: -0.02em;
                    color: #111;
                    user-select: none;
                }
                .rai-logo span {
                    background: linear-gradient(90deg, #6366f1, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .rai-spinner-wrap {
                    position: relative;
                    width: 56px; height: 56px;
                }
                .rai-spinner-track {
                    position: absolute; inset: 0;
                    border-radius: 50%;
                    border: 3px solid #f0f0f0;
                }
                .rai-spinner-arc {
                    position: absolute; inset: 0;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    border-top-color: #6366f1;
                    border-right-color: #ec4899;
                    animation: raiLoadSpin 0.9s linear infinite;
                }
                .rai-dots {
                    display: flex; gap: 7px; align-items: center;
                }
                .rai-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #ec4899);
                    animation: raiLoadFade 1.1s ease-in-out infinite;
                }
                .rai-dot:nth-child(1) { animation-delay: 0ms;    }
                .rai-dot:nth-child(2) { animation-delay: 160ms;  }
                .rai-dot:nth-child(3) { animation-delay: 320ms;  }
                .rai-loading-text {
                    font-size: 13px;
                    color: #aaa;
                    letter-spacing: 0.04em;
                    margin-top: -8px;
                }
            `}</style>

            <div className="rai-loading-root">
                {/* Brand logo */}
                <div className="rai-logo">
                    résumé<span>AI</span>
                </div>

                {/* Spinner */}
                <div className="rai-spinner-wrap">
                    <div className="rai-spinner-track" />
                    <div className="rai-spinner-arc" />
                </div>

                {/* Animated dots + text */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div className="rai-dots">
                        <div className="rai-dot" />
                        <div className="rai-dot" />
                        <div className="rai-dot" />
                    </div>
                    <div className="rai-loading-text">Verifying your session{".".repeat(dot)}</div>
                </div>
            </div>
        </>
    )
}

/* ─────────────────────────────────────────────────────────────────────────
   ProtectedRoute
   Props:
     children    — page to render when authenticated
     redirectTo  — where to send unauthenticated users (default: /register)
     roles       — optional string[] to restrict by user.role
───────────────────────────────────────────────────────────────────────── */
function ProtectedRoute({ children, redirectTo = "/register", roles }) {
    const { user, loading } = useAuth()
    const location = useLocation()

    /* 1 ─ Still resolving session */
    if (loading) return <LoadingScreen />

    /* 2 ─ Not authenticated → redirect, preserving intended destination */
    if (!user)
        return <Navigate to={redirectTo} state={{ from: location }} replace />

    /* 3 ─ Optional role-based guard */
    if (roles && roles.length > 0 && !roles.includes(user.role))
        return <Navigate to="/dashboard" replace />

    /* 4 ─ All good */
    return children
}

export default ProtectedRoute