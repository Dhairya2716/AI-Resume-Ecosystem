const express = require("express")

const {
    createResume,
    getSingleResume,
    getUserResume,
    updateResume,
    deleteResume,
    matchResumeToJD,
    generateCoverLetter
} = require("../controllers/resumeController")

const protect = require("../middleware/authMiddleware")

const upload = require("../middleware/uploadMiddleware")

const router = express.Router()

// ================
// CREATE RESUME
// ================

router.post(
    "/create",
    protect,
    upload.single("resumeFile"),
    createResume
)

// ======================================
// MATCH RESUME TO JD
// ======================================

router.post(
    "/:id/match-jd",
    protect,
    matchResumeToJD
)

// ======================================
// GENERATE COVER LETTER
// ======================================

router.post(
    "/:id/cover-letter",
    protect,
    generateCoverLetter
)

// ======================================
// GET ALL RESUMES FOR LOGGED-IN USER
// ======================================

router.get(
    "/my-resumes",
    protect,
    getUserResume
)

// ======================================
// GET SINGLE RESUME
// ======================================

router.get(
    "/:id",
    protect,
    getSingleResume
)

// ======================================
// UPDATE RESUME
// ======================================

router.put(
    "/:id",
    protect,
    updateResume
)

// ======================================
// DELETE RESUME
// ======================================

router.delete(
    "/:id",
    protect,
    deleteResume
)

module.exports = router