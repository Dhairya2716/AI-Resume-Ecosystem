const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const GitHubStrategy = require("passport-github2").Strategy
const jwt = require("jsonwebtoken")

const User = require("../models/User")

/* ─── Shared: generate JWT cookie on OAuth success ─────────────────────
   We use session: false (stateless JWTs), so we set the cookie manually
   inside the strategy's done() callback via the response object.
   Passport doesn't provide res directly, so we attach it in the callback
   route via a custom middleware (see authRoutes.js passportCallbackHandler).
   Instead, the simpler pattern: set cookie inside the strategy, return user.
──────────────────────────────────────────────────────────────────────── */
const handleOAuthUser = async ({ providerId, provider, email, name, avatar }, done) => {
    try {
        // 1. Try to find by providerId (returning user)
        let user = await User.findOne({ provider, providerId })

        // 2. Try to find by email (existing local account → link it)
        if (!user && email) {
            user = await User.findOne({ email })
            if (user) {
                user.provider   = provider
                user.providerId = providerId
                user.avatar     = user.avatar || avatar
                await user.save()
            }
        }

        // 3. Create new OAuth user
        if (!user) {
            user = await User.create({
                name,
                email,
                provider,
                providerId,
                avatar,
                password: null
            })
        }

        return done(null, user)

    } catch (err) {
        return done(err, null)
    }
}

/* ─── Google Strategy ──────────────────────────────────────────────── */
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy(
        {
            clientID:     process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:  "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            const email  = profile.emails?.[0]?.value  || null
            const avatar = profile.photos?.[0]?.value  || null

            await handleOAuthUser({
                providerId: profile.id,
                provider:   "google",
                email,
                name:   profile.displayName,
                avatar,
            }, done)
        }
    ))
}

/* ─── GitHub Strategy ──────────────────────────────────────────────── */
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy(
        {
            clientID:     process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL:  "/api/auth/github/callback",
            scope:        ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            // GitHub may return email in profile.emails or as null (private accounts)
            const email  = profile.emails?.[0]?.value  || null
            const avatar = profile.photos?.[0]?.value  || null

            await handleOAuthUser({
                providerId: String(profile.id),
                provider:   "github",
                email,
                name:   profile.displayName || profile.username,
                avatar,
            }, done)
        }
    ))
}

/* ─── JWT cookie injector ───────────────────────────────────────────
   Called in the OAuth callback route AFTER passport.authenticate()
   succeeds. req.user = the Mongoose user doc set by done(null, user).
──────────────────────────────────────────────────────────────────── */
const issueTokenCookie = (req, res, next) => {
    if (!req.user) return next()

    const token = jwt.sign(
        { id: req.user._id, role: req.user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge:   7 * 24 * 60 * 60 * 1000
    })

    next()
}

module.exports = { passport, issueTokenCookie }
