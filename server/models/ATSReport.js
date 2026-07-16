const mongoose = require("mongoose")

const sectionScoreSchema = new mongoose.Schema(
    {
        score: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        feedback: {
            type: String,
            default: ""
        }
    },
    { _id: false }
)

const atsReportSchema = new mongoose.Schema(
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

        overallScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        grade: {
            type: String,
            enum: ["A+", "A", "B+", "B", "C+", "C", "D", "F"],
            default: "F"
        },

        summary: {
            type: String,
            default: ""
        },

        sectionScores: {
            contactInfo: { type: sectionScoreSchema, default: () => ({}) },
            summary:     { type: sectionScoreSchema, default: () => ({}) },
            experience:  { type: sectionScoreSchema, default: () => ({}) },
            education:   { type: sectionScoreSchema, default: () => ({}) },
            skills:      { type: sectionScoreSchema, default: () => ({}) },
            formatting:  { type: sectionScoreSchema, default: () => ({}) }
        },

        strengths: [{ type: String }],

        weaknesses: [{ type: String }],

        suggestions: [{ type: String }],

        keywords: {
            found:   [{ type: String }],
            missing: [{ type: String }]
        }
    },
    {
        timestamps: true
    }
)

atsReportSchema.index({ user: 1, resume: 1, createdAt: -1 })

// Helper to compute grade from score
atsReportSchema.pre("save", function (next) {
    const s = this.overallScore
    if (s >= 95)      this.grade = "A+"
    else if (s >= 85) this.grade = "A"
    else if (s >= 78) this.grade = "B+"
    else if (s >= 70) this.grade = "B"
    else if (s >= 60) this.grade = "C+"
    else if (s >= 50) this.grade = "C"
    else if (s >= 35) this.grade = "D"
    else              this.grade = "F"
    next()
})

module.exports = mongoose.model("ATSReport", atsReportSchema)
