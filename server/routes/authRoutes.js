const express = require("express")
const passport = require("passport")
const { issueTokenCookie } = require("../config/passport")

const {
    registerUser,
    loginUser,
    logoutUser,
    getProfile
} = require("../controllers/authController")

const protect = require("../middleware/authMiddleware")

const router = express.Router()

/* ─── Local Auth ────────────────────────────────────────────────────── */
router.post("/register", registerUser)
router.post("/login",    loginUser)
router.post("/logout",   logoutUser)
router.get( "/profile",  protect, getProfile)   // session restore

/* ─── Google OAuth ──────────────────────────────────────────────────── */
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/register?error=oauth_failed` }),
    issueTokenCookie,
    (req, res) => res.redirect(`${process.env.CLIENT_URL}/dashboard`)
)

/* ─── GitHub OAuth ──────────────────────────────────────────────────── */
router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
)

router.get(
    "/github/callback",
    passport.authenticate("github", { session: false, failureRedirect: `${process.env.CLIENT_URL}/register?error=oauth_failed` }),
    issueTokenCookie,
    (req, res) => res.redirect(`${process.env.CLIENT_URL}/dashboard`)
)

module.exports = router