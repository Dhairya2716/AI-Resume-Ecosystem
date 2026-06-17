const mongoose = require("mongoose");

const CoverLetterSchema = new mongoose.Schema(
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
        coverLetterText: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

CoverLetterSchema.index({
    user: 1,
    resume: 1,
    createdAt: -1
});

module.exports = mongoose.model("CoverLetter", CoverLetterSchema);
