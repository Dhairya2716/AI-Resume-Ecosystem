const Resume = require("../models/Resume")
const ATSReport = require("../models/ATSReport")
const { analyzeATSDetailed } = require("../services/atsService")

// ======================================
// RUN DETAILED ATS ANALYSIS
// POST /api/ats/:resumeId/analyze
// ======================================

const runATSAnalysis = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.resumeId)

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            })
        }

        // Ownership check
        if (resume.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            })
        }

        if (!resume.resumeText || resume.resumeText.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Resume text not available. Please ensure the resume was parsed successfully."
            })
        }

        // Run the detailed analysis
        const analysis = await analyzeATSDetailed(resume.resumeText)

        // Persist the report
        const report = await ATSReport.create({
            user: req.user.id,
            resume: resume._id,
            overallScore: analysis.overallScore,
            summary: analysis.summary,
            sectionScores: analysis.sectionScores,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            suggestions: analysis.suggestions,
            keywords: analysis.keywords
        })

        // Also update the resume's quick ATS score
        resume.atsScore = analysis.overallScore
        resume.strengths = analysis.strengths
        resume.weaknesses = analysis.weaknesses
        resume.aiSuggestions = analysis.suggestions
        resume.analysisStatus = "Analyzed"
        await resume.save()

        res.status(201).json({
            success: true,
            message: "ATS Analysis completed successfully",
            report
        })

    } catch (err) {
        next(err)
    }
}

// ======================================
// GET ALL ATS REPORTS FOR LOGGED-IN USER
// GET /api/ats/reports
// ======================================

const getATSReports = async (req, res, next) => {
    try {
        const reports = await ATSReport.find({ user: req.user.id })
            .populate("resume", "title template")
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: reports.length,
            reports
        })

    } catch (err) {
        next(err)
    }
}

// ======================================
// GET SINGLE ATS REPORT
// GET /api/ats/reports/:id
// ======================================

const getATSReport = async (req, res, next) => {
    try {
        const report = await ATSReport.findById(req.params.id)
            .populate("resume", "title template")

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "ATS Report not found"
            })
        }

        if (report.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            })
        }

        res.status(200).json({
            success: true,
            report
        })

    } catch (err) {
        next(err)
    }
}

// ======================================
// DELETE ATS REPORT
// DELETE /api/ats/reports/:id
// ======================================

const deleteATSReport = async (req, res, next) => {
    try {
        const report = await ATSReport.findById(req.params.id)

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "ATS Report not found"
            })
        }

        if (report.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            })
        }

        await report.deleteOne()

        res.status(200).json({
            success: true,
            message: "ATS Report deleted successfully"
        })

    } catch (err) {
        next(err)
    }
}

module.exports = {
    runATSAnalysis,
    getATSReports,
    getATSReport,
    deleteATSReport
}
