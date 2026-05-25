const express = require("express")

const router = express.Router()

const protect = require("../middleware/authMiddleware")
const authorizeRoles = require("../middleware/roleMiddleware")

//Admin Dashboard

router.get(
    "/dashboard",
    protect,
    authorizeRoles("admin"),
    (req, res) => {

        res.status(200).json({
            success:true,
            message: "Welcome to Admin Dashboard",
            admin: req.user
        })

    }
)

//Get all Users

router.get(
    "/users",
    protect,
    authorizeRoles("admin"),
    async (req, res) => {

        try{

            const User = require("../models/User")

            const users = await User.find().select("-password")

            res.status(200).json({
                success: true,
                count: user.length,
                users
            })

        }
        catch(err){

            res.status(500).json({
                success: false,
                message: err.message
            })

        }

    }
)

//Delete User

router.delete(
    "/user/:id",
    protect,
    authorizeRoles("admin"),
    async (req, res) => {

        try{

            const User = require("../models/User")

            const user = await User.findById(req.params.id)

            if(!user){

                return res.status(404).json({
                    success: false,
                    message: "User Not Found"
                })

            }

            //delete the user
            await user.deleteOne()

            res.status(200).json({
                success: true,
                message: "User deleted Succesfully"
            })

        }
        catch(err){

            res.status(500).json({
                success: false,
                message: err.message
            })

        }

    }
)

module.exports = router