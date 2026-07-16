const Resume = require("../models/Resume")
const parseResume = require("../services/resumeParser")
const { analyzeResumeATS } = require("../services/aiService")

// ========================
// CREATE RESUME
// ========================

const createResume = async (req, res, next) => {

    try {
        let resumeData = {
            user: req.user.id,
            title: req.body.title || "Untitled Resume",
            template: req.body.template || "modern",
            analysisStatus: "Processing"
        }

        // If a file was uploaded via multer, save its path and default title
        if (req.file) {
            resumeData.resumeFile = req.file.path
            if (!req.body.title) {
                resumeData.title = req.file.originalname || "Uploaded Resume"
            }
        }

        // Add structured fields if provided (for manual builder)
        if (req.body.personalInfo) resumeData.personalInfo = req.body.personalInfo;
        if (req.body.summary) resumeData.summary = req.body.summary;
        if (req.body.education) resumeData.education = req.body.education;
        if (req.body.experience) resumeData.experience = req.body.experience;
        if (req.body.skills) resumeData.skills = req.body.skills;
        if (req.body.projects) resumeData.projects = req.body.projects;
        if (req.body.certifications) resumeData.certifications = req.body.certifications;

        let resume = await Resume.create(resumeData)

        // Perform AI Analysis if a file was uploaded
        if (req.file) {
            try {
                // Extract text
                const extractedText = await parseResume(req.file.path, req.file.mimetype)
                
                resume.resumeText = extractedText;
                await resume.save();

                if (extractedText && extractedText.trim().length > 0) {
                    // Call AI analysis
                    const analysis = await analyzeResumeATS(extractedText)

                    // Save insights
                    resume.atsScore = analysis.atsScore || 0
                    resume.summary = analysis.summary || ""
                    resume.strengths = analysis.strengths || []
                    resume.weaknesses = analysis.weaknesses || []
                    resume.aiSuggestions = analysis.aiSuggestions || []
                    resume.analysisStatus = "Analyzed"
                } else {
                    resume.analysisStatus = "Failed"
                    resume.analysisError = "No text could be extracted from the file."
                }
                
                await resume.save()
            } catch (aiError) {
                // Handle AI failure gracefully so upload still succeeds
                console.error("AI Analysis Error:", aiError);
                resume.analysisStatus = "Failed"
                resume.analysisError = aiError.message || "AI Analysis Failed"
                await resume.save()
            }
        }

        res.status(201).json({
            success: true,
            message: "Resume Created Successfully",
            resume
        })

    }
    catch (err) {
        next(err)
    }

}

// const uploadResume = async (req, res) => {

//     try{

//         if(!req.file){

//             return res.status(400).json({
//                 message: "No File uploaded"
//             })

//         }

//         const extractedText = await parseResume(
//             req.file.path,
//             req.file.mimetype
//         )

//         const resume = await Resume.create({
//             user: req.user,
//             title: req.body.title || "Untitled Resume",
//             fileName: req.file.filename,
//             fileUrl: req.file.path,
//             resumeText: extractedText
//         })

//         res.status(201).json({
//             message: "Resume uploaded SuccessFully",
//             resume
//         })

//     }
//     catch(error){

//         res.status(500).json({
//             message: error.message
//         })

//     }

// }

// ==================
// GET MY RESUME
// ==================

const getUserResume = async (req, res, next) => {

    try {

        const resumes = await Resume.find({
            user: req.user.id
        }).sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: resumes.length,
            resumes
        })

    }
    catch (err) {

        next(err)

    }

}

// ===================
// GET SINGLE RESUME
// ===================

const getSingleResume = async (req, res, next) => {

    try {

        const resume = await Resume.findById(req.params.id)

        if (!resume) {

            return res.status(404).json({
                success: false,
                message: "Resume not found"
            })

        }

        //OWNERSHIP CHECK
        if (resume.user.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Access denied"
            })

        }

        res.status(200).json({
            success: true,
            resume
        })

    }
    catch (err) {
        next(err)
    }

}

// ======================================
// UPDATE RESUME
// ======================================

const updateResume = async (req, res, next) => {

    try {

        const resume = await Resume.findById(req.params.id)

        if (!resume) {

            return res.status(404).json({
                success: false,
                message: "Resume Not Found"
            })

        }

        // OWNERSHIP CHECK
        if (resume.user.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Access Denied"
            })

        }

        const updatedResume = await Resume.findByIdAndUpdate(

            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }

        )

        res.status(200).json({

            success: true,
            message: "Resume Updated Successfully",
            resume: updatedResume

        })

    }
    catch (err) {

        next(err)

    }

}

const deleteResume = async (req, res, next) => {

    try {

        const resume = await Resume.findById(req.params.id)

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            })
        }

        // OWNERSHIP CHECK
        if (resume.user.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Access Denied"
            })

        }

        await resume.deleteOne()

        res.status(200).json({
            success: true,
            message: "Resume Deleted SuccessFully"
        })

    }
    catch (err) {
        next(err)
    }

}

// ======================================
// MATCH RESUME TO JOB DESCRIPTION
// ======================================

const matchResumeToJD = async (req, res, next) => {
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ success: false, message: "Job description is required" });
        }

        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }

        if (resume.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        if (!resume.resumeText) {
            return res.status(400).json({ success: false, message: "Resume text not available. Please ensure the resume was parsed successfully." });
        }

        const { analyzeJDMatch } = require("../services/aiService");
        const analysis = await analyzeJDMatch(resume.resumeText, jobDescription);

        const JobMatch = require("../models/JobMatch");
        const matchRecord = await JobMatch.create({
            user: req.user.id,
            resume: resume._id,
            jobDescription: jobDescription,
            matchScore: analysis.matchScore,
            matchedKeywords: analysis.matchedKeywords,
            missingKeywords: analysis.missingKeywords,
            strengths: analysis.strengths,
            suggestions: analysis.suggestions
        });

        res.status(200).json({
            success: true,
            message: "Job description matched successfully",
            match: matchRecord
        });

    } catch (err) {
        next(err);
    }
}

// ======================================
// GENERATE COVER LETTER
// ======================================

const generateCoverLetter = async (req, res, next) => {
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ success: false, message: "Job description is required" });
        }

        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }

        if (resume.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        if (!resume.resumeText) {
            return res.status(400).json({ success: false, message: "Resume text not available. Please ensure the resume was parsed successfully." });
        }

        const { generateCoverLetterAI } = require("../services/aiService");
        const analysis = await generateCoverLetterAI(resume.resumeText, jobDescription);

        const CoverLetter = require("../models/CoverLetter");
        const coverLetterRecord = await CoverLetter.create({
            user: req.user.id,
            resume: resume._id,
            jobDescription: jobDescription,
            coverLetterText: analysis.coverLetter
        });

        res.status(200).json({
            success: true,
            message: "Cover letter generated successfully",
            coverLetter: coverLetterRecord
        });

    } catch (err) {
        next(err);
    }
}

const getCoverLetters = async (req, res, next) => {
    try {
        const CoverLetter = require("../models/CoverLetter");
        const coverLetters = await CoverLetter.find({ user: req.user.id })
            .populate('resume', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            coverLetters
        });
    } catch (err) {
        next(err);
    }
}

const deleteCoverLetter = async (req, res, next) => {
    try {
        const CoverLetter = require("../models/CoverLetter");
        const coverLetter = await CoverLetter.findById(req.params.id);

        if (!coverLetter) {
            return res.status(404).json({ success: false, message: "Cover letter not found" });
        }

        if (coverLetter.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        await coverLetter.deleteOne();

        res.status(200).json({
            success: true,
            message: "Cover letter deleted successfully"
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createResume,
    getSingleResume,
    getUserResume,
    updateResume,
    deleteResume,
    matchResumeToJD,
    generateCoverLetter,
    getCoverLetters,
    deleteCoverLetter
}