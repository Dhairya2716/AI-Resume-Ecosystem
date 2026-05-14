const Resume = require("../models/Resume")

const parseResume = require("../services/resumeParser")

const uploadResume = async (req, res) => {

    try{

        if(!req.file){

            return res.status(400).json({
                message: "No File uploaded"
            })

        }

        const extractedText = await parseResume(
            req.file.path,
            req.file.mimetype
        )

        const resume = await Resume.create({
            user: req.user,
            title: req.body.title || "Untitled Resume",
            fileName: req.file.filename,
            fileUrl: req.file.path,
            resumeText: extractedText
        })

        res.status(201).json({
            message: "Resume uploaded SuccessFully",
            resume
        })

    }
    catch(error){

        res.status(500).json({
            message: error.message
        })

    }

}

const getUserResume = async (req, res) => {

    try{

        const resumes = await Resume.find({
            user: req.user
        })

        res.status(200).json(resumes)

    }
    catch(error){

        res.status(500).json({
            message: error.message
        })

    }

}

module.exports = {
    uploadResume,
    getUserResume
}