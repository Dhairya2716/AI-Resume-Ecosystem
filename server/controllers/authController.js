const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const generateToken = (id, role) => {

    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    )

}

const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const token = generateToken(user._id, user.role)

        //Cookie
        res.cookie(
            "token",
            token,
            {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        )

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        res.status(201).json({
            message: "Registration Successful",
            user: userData
        })

    }
    catch (err) {

        res.status(500).json({
            message: err.message
        })

    }

}

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }

        const token = generateToken(user._id, user.role)

        //Cookie
        res.cookie(
            "token",
            token,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        )

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        res.status(200).json({
            message: "Login Successful",
            user: userData
        })

    }
    catch (err) {

        res.status(500).json({
            message: err.message
        })

    }

}

const logoutUser = async (req, res) => {

    res.clearCookie("token")

    res.status(200).json({
        message: "Logout Successful"
    })

}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}