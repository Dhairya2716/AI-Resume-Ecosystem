const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")

require("dotenv").config()

// ── ENV VALIDATION ───────────────────────────────────────────────────────
const REQUIRED_ENV = ["MONGODB_URI", "JWT_SECRET_KEY", "GEMINI_API_KEY"]
const OPTIONAL_ENV = ["CLIENT_URL", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"]

const missing = REQUIRED_ENV.filter(key => !process.env[key])
if (missing.length > 0) {
    console.error(`\n❌  Missing required environment variables:\n   ${missing.join(", ")}\n`)
    console.error("   Create a .env file in /server with these values. See .env.example.\n")
    process.exit(1)
}

const missingOptional = OPTIONAL_ENV.filter(key => !process.env[key])
if (missingOptional.length > 0) {
    console.warn(`⚠  Optional env vars not set (some features may be limited): ${missingOptional.join(", ")}`)
}

console.log("✓ Environment variables validated")

const connectDB = require("./config/db")

// ── Init Passport strategies before routes ──
const { passport } = require("./config/passport")

const authRoutes = require("./routes/authRoutes")
const resumeRoutes = require("./routes/resumeRoutes")
const atsRoutes = require("./routes/atsRoutes")
const adminRoutes = require("./routes/adminRoutes")

const errorHandler = require("./middleware/errorMiddleware")

connectDB()

const app = express()

// ── CORS ─────────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))

// ── CORE MIDDLEWARE ───────────────────────────────────────────────────────
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())   // stateless — no sessions

// ── STATIC ───────────────────────────────────────────────────────────────
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
)

// ── ROUTES ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes)
app.use("/api/resume", resumeRoutes)
app.use("/api/ats", atsRoutes)
app.use("/api/admin", adminRoutes)

// ── ERROR HANDLER ─────────────────────────────────────────────────────────
app.use(errorHandler)

// ── HEALTH CHECK ──────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.send("AI Resume Ecosystem API Running ✓")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running at port : ${PORT}`)
})