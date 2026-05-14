const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const path = require("path")

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const resumeRoutes = require("./routes/resumeRoutes")

dotenv.config()

connectDB()

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())

app.use(cookieParser())

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/auth", authRoutes)
app.use("/api/resume", resumeRoutes)

app.get("/", (req, res) => {
    res.send("AI Resume Ecosystem API Running")  
})

const PORT = process.env.PORT || 5000

app.listen(
    PORT,
    () => {
        console.log(`Server running at port : ${PORT}`)
    }
)