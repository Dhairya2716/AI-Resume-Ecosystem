const authorizeRoles = (...roles) => {

    return (req, res, next) => {

        //Check Role
        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "Access Denied"
            })

        }

        next()

    }

}

module.exports = authorizeRoles