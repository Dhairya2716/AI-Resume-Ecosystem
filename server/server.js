const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const resumeRoutes = require("./routes/resumeRoutes")
const path = require("path")

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("AI Resume Ecosystem API Running")
})

app.use("/api/auth", authRoutes)
app.use("/api/resume", resumeRoutes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const PORT = process.env.PORT || 5000

app.listen(
    PORT,
    () => {
        console.log(`Server running at port : ${PORT}`)
    }
)