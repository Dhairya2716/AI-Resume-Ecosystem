const express = require("express")

const {
    uploadResume,
    getUserResume
} = require("../controllers/resumeController")

const protect = require("../middleware/authMiddleware")

const upload = require("../middleware/uploadMiddleware")


const router = express.Router()

router.post(
    "/upload",
    protect,
    upload.single("resume"),
    uploadResume
)

router.get(
    "/",
    protect,
    getUserResume
)

module.exports = router;