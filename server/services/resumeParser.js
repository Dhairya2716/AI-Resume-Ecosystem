const fs = require("fs")
const pdfParse = require("pdf-parse")
const mammoth = require("mammoth")

const parseResume = async (filePath, mimetype) => {

    try{

        let extractedText = ""

        //PDF Parsing
        if(mimetype === "application/pdf"){

            console.log("Parsing PDF Resume...")

            const dataBuffer = fs.readFileSync(filePath)

            const pdfData = await pdfParse(dataBuffer)

            console.log("PDF DATA : ")
            console.log(pdfData)

            extractedText = pdfData.text;

            console.log("Extracted Text : ")
            console.log(extractedText)

        }

        //DOCX Parsing
        else if(
            mimetype === 
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ){

            const result = await mammoth.extractRawText({
                path: filePath
            })

            extractedText = result.value

        }

        return extractedText

    }
    catch(err){

        console.log(err)

        return ""

    }

}

module.exports = parseResume