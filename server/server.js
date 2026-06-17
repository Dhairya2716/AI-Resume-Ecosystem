const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")

require("dotenv").config()

const connectDB = require("./config/db")

// ── Init Passport strategies before routes ──
const { passport } = require("./config/passport")

const authRoutes = require("./routes/authRoutes")
const resumeRoutes = require("./routes/resumeRoutes")
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
app.use("/api/admin", adminRoutes)

// ── ERROR HANDLER ─────────────────────────────────────────────────────────
app.use(errorHandler)

// ── HEALTH CHECK ──────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.send("AI Resume Ecosystem API Running ✓")
})

// ── GEMINI API KEY CHECK ─────────────────────────────────────────────────
const GeminiApiKey = process.env.GEMINI_API_KEY || ''

if (GeminiApiKey !== '') {
    console.log("The Gemini Api Key is Loaded...")
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running at port : ${PORT}`)
})