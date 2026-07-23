const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

/* ─── Shared token helper ─────────────────────────────────────────────── */
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    )
}

const setCookieToken = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: true, // MUST be true for sameSite: 'none'
        sameSite: "none", // REQUIRED for cross-domain cookies (Vercel frontend -> Render backend)
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    })
}

/* ─── Register ─────────────────────────────────────────────────────────── */
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            provider: "local"
        })

        const token = generateToken(user._id, user.role)
        setCookieToken(res, token)

        res.status(201).json({
            message: "Registration Successful",
            user: {
                _id:    user._id,
                name:   user.name,
                email:  user.email,
                role:   user.role,
                avatar: user.avatar
            }
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

/* ─── Login ────────────────────────────────────────────────────────────── */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // Prevent local-login attempt on OAuth-only accounts
        if (user.provider !== "local" || !user.password) {
            return res.status(400).json({
                message: `This account uses ${user.provider} sign-in. Please use that instead.`
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = generateToken(user._id, user.role)
        setCookieToken(res, token)

        res.status(200).json({
            message: "Login Successful",
            user: {
                _id:    user._id,
                name:   user.name,
                email:  user.email,
                role:   user.role,
                avatar: user.avatar
            }
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

/* ─── Logout ───────────────────────────────────────────────────────────── */
const logoutUser = async (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true })
    res.status(200).json({ message: "Logout Successful" })
}

/* ─── Get Profile (session restore) ────────────────────────────────────── */
const getProfile = async (req, res) => {
    try {
        // req.user is set by authMiddleware (JWT decoded payload: { id, role })
        const user = await User.findById(req.user.id).select("-password -providerId")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            user: {
                _id:    user._id,
                name:   user.name,
                email:  user.email,
                role:   user.role,
                avatar: user.avatar,
                provider: user.provider
            }
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

/* ─── Update Profile ───────────────────────────────────────────────────── */
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, email, currentPassword, newPassword } = req.body;

        // Update basic info
        if (name) user.name = name;
        if (email) user.email = email;

        // Update password if requested
        if (newPassword) {
            if (user.provider !== "local" || !user.password) {
                return res.status(400).json({ message: "Cannot change password for OAuth accounts" });
            }
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required to set a new password" });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect current password" });
            }
            user.password = await bcrypt.hash(newPassword, 12);
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                provider: updatedUser.provider
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    updateProfile
}