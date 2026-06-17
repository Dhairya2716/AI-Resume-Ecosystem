const mongoose = require("mongoose")

const resumeSchema = new mongoose.Schema(

    {
        // USER
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // BASIC INFO
        title: {
            type: String,
            required: true,
            trim: true
        },

        template: {
            type: String,
            default: "modern"
        },

        // PERSONAL INFO
        personalInfo: {

            fullName: {
                type: String,
                default: ""
            },

            email: {
                type: String,
                default: ""
            },

            phone: {
                type: String,
                default: ""
            },

            address: {
                type: String,
                default: ""
            },

            linkedin: {
                type: String,
                default: ""
            },

            github: {
                type: String,
                default: ""
            },

            portfolio: {
                type: String,
                default: ""
            }

        },

        // SUMMARY
        summary: {
            type: String,
            default: ""
        },

        // EDUCATION
        education: [
            {
                institution: {
                    type: String,
                    default: ""
                },

                degree: {
                    type: String,
                    default: ""
                },

                fieldOfStudy: {
                    type: String,
                    default: ""
                },

                startDate: {
                    type: String,
                    default: ""
                },

                endDate: {
                    type: String,
                    default: ""
                },

                description: {
                    type: String,
                    default: ""
                }
            }
        ],

        // EXPERIENCE
        experience: [
            {
                company: {
                    type: String,
                    default: ""
                },

                position: {
                    type: String,
                    default: ""
                },

                startDate: {
                    type: String,
                    default: ""
                },

                endDate: {
                    type: String,
                    default: ""
                },

                description: {
                    type: String,
                    default: ""
                }
            }
        ],

        // SKILLS
        skills: [
            {
                type: String
            }
        ],

        // PROJECTS
        projects: [
            {
                title: {
                    type: String,
                    default: ""
                },

                techStack: {
                    type: String,
                    default: ""
                },

                description: {
                    type: String,
                    default: ""
                },

                githubLink: {
                    type: String,
                    default: ""
                },

                liveLink: {
                    type: String,
                    default: ""
                }
            }
        ],

        // CERTIFICATIONS
        certifications: [
            {
                name: {
                    type: String,
                    default: ""
                },

                organization: {
                    type: String,
                    default: ""
                },

                issueDate: {
                    type: String,
                    default: ""
                }
            }
        ],

        // AI FEATURES
        resumeText: {
            type: String,
            default: ""
        },

        analysisStatus: {
            type: String,
            enum: ["Pending", "Processing", "Analyzed", "Failed"],
            default: "Pending"
        },

        analysisError: {
            type: String,
            default: ""
        },

        atsScore: {
            type: Number,
            default: 0
        },

        strengths: [
            { type: String }
        ],

        weaknesses: [
            { type: String }
        ],

        aiSuggestions: [
            {
                type: String
            }
        ],

        // FILES
        resumeFile: {
            type: String,
            default: ""
        }

    },

    {
        timestamps: true
    }

)

module.exports = mongoose.model("Resume", resumeSchema)