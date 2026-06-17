const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        // Optional for OAuth users (Google/GitHub sign-in have no password)
        password: {
            type: String,
            required: false,
            default: null
        },

        role: {
            type: String,
            enum: ["user", "admin", "recruiter"],
            default: "user"
        },

        // OAuth fields
        provider: {
            type: String,
            enum: ["local", "google", "github"],
            default: "local"
        },

        providerId: {
            type: String,
            default: null
        },

        avatar: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema)