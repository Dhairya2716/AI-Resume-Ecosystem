const jwt = require("jsonwebtoken")

const protect = async (req, res, next) => {

    try {

        //Token From Cookie
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: "Not Authorized"
            })
        }

        //VERIFY TOKEN
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        )

        //Storing Full User Data
        req.user = decoded

        next()

    }
    catch (error) {

        console.log("JWT ERROR:", error.message)

        return res.status(401).json({
            message: "Not Authorized"
        })

    }

}

module.exports = protect