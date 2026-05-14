const jwt = require("jsonwebtoken")

const protect = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization

        console.log("AUTH HEADER:", authHeader)

        if(!authHeader){

            return res.status(401).json({
                message: "No token"
            })

        }

        const token = authHeader.split(" ")[1]

        console.log("TOKEN:", token)

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        )

        console.log("DECODED:", decoded)

        req.user = decoded.id

        next()

    }
    catch(error){

        console.log("JWT ERROR:", error.message)

        return res.status(401).json({
            message: "Not Authorized"
        })

    }

}

module.exports = protect