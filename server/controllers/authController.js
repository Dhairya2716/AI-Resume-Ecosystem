const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {

    try{

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser){
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

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        )

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email 
        }

        res.status(201).json({
            token,
            user: userData
        })

    }
    catch(err){

        res.status(500).json({
            message: err.message
        })

    }

}

const loginUser = async (req, res) => {

    try{

        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        )

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email 
        }

        res.status(200).json({
            token,
            user: userData
        })

    }
    catch(err){

        res.status(500).json({
            message: err.message
        })

    }

}

module.exports = {
    registerUser,
    loginUser
}