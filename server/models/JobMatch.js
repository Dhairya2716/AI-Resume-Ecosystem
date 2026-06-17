const mongoose = require("mongoose")

const JobMatchSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: true
        },

        jobDescription: {
            type: String,
            required: true
        },

        matchScore: {
            type: Number,
            default: 0
        },

        matchedKeywords: [String],

        missingKeywords: [String],

        strengths: [String],

        suggestions: [String]

    },

    {
        timestamps: true
    }
)

JobMatchSchema.index({
    user: 1,
    resume: 1,
    createdAt: -1
})

module.exports = mongoose.model(
    "JobMatch",
    JobMatchSchema
)