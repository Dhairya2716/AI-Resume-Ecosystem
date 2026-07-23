const multer = require("multer")
const path = require("path")
const fs = require("fs")

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        )

    }

})

const fileFilter = (req, file, cb) => {

    const allowedFileTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]

    if(allowedFileTypes.includes(file.mimetype)){

        cb(null, true)

    }
    else{

        cb(new Error("Only PDF and DOCX files are allowed"))

    }

}

const upload = multer({
    storage,
    fileFilter
})

module.exports = upload