const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")

require("dotenv").config()

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const resumeRoutes = require("./routes/resumeRoutes")
const adminRoutes = require("./routes/adminRoutes")

connectDB()

const app = express()

//CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

//MIDDLEWARES
app.use(express.json())
app.use(cookieParser())

//STATIC FOLDER
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
)

//ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/resume", resumeRoutes)
app.use("/api/admin", adminRoutes)

//HOME
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