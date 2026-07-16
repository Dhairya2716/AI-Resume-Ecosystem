const express = require("express")

const {
    runATSAnalysis,
    getATSReports,
    getATSReport,
    deleteATSReport
} = require("../controllers/atsController")

const protect = require("../middleware/authMiddleware")

const router = express.Router()

// ======================================
// RUN ATS ANALYSIS ON A RESUME
// ======================================

router.post(
    "/:resumeId/analyze",
    protect,
    runATSAnalysis
)

// ======================================
// GET ALL REPORTS FOR LOGGED-IN USER
// ======================================

router.get(
    "/reports",
    protect,
    getATSReports
)

// ======================================
// GET SINGLE ATS REPORT
// ======================================

router.get(
    "/reports/:id",
    protect,
    getATSReport
)

// ======================================
// DELETE ATS REPORT
// ======================================

router.delete(
    "/reports/:id",
    protect,
    deleteATSReport
)

module.exports = router
