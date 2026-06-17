const { GoogleGenerativeAI } = require("@google/generative-ai");

const analyzeResumeATS = async (resumeText) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an Applicant Tracking System (ATS).

Analyze the resume and return ONLY valid JSON.

Rules:

* atsScore: integer from 0–100
* summary: short paragraph
* strengths: array
* weaknesses: array
* aiSuggestions: actionable improvements

Return exactly:

{
"atsScore":0,
"summary":"",
"strengths":[],
"weaknesses":[],
"aiSuggestions":[]
}

Resume:
${resumeText}
`;

        // Wrap AI call in a Promise.race for a 20-second timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Gemini API timeout (20s)")), 20000)
        );

        const aiCallPromise = model.generateContent(prompt);
        const result = await Promise.race([aiCallPromise, timeoutPromise]);

        const responseText = result.response.text();

        // Robustly extract the JSON block using Regex
        let cleanedText = responseText;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedText = jsonMatch[0];
        }

        const parsedJson = JSON.parse(cleanedText);

        // Validate parsed fields to ensure structure
        return {
            atsScore: typeof parsedJson.atsScore === 'number' ? parsedJson.atsScore : 0,
            summary: typeof parsedJson.summary === 'string' ? parsedJson.summary : "",
            strengths: Array.isArray(parsedJson.strengths) ? parsedJson.strengths : [],
            weaknesses: Array.isArray(parsedJson.weaknesses) ? parsedJson.weaknesses : [],
            aiSuggestions: Array.isArray(parsedJson.aiSuggestions) ? parsedJson.aiSuggestions : []
        };

    } catch (err) {
        throw new Error(`AI Analysis failed: ${err.message}`);
    }
};

const analyzeJDMatch = async (resumeText, jdText) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an expert technical recruiter and ATS system.
Compare the candidate's resume against the provided Job Description.

Analyze the fit and return ONLY valid JSON.

Rules:
* matchScore: integer from 0–100 representing how well the resume matches the JD
* matchedKeywords: array of important skills/keywords found in BOTH the JD and resume
* missingKeywords: array of important skills/keywords present in the JD but MISSING from the resume
* strengths: array of strings detailing why the candidate is a good fit
* suggestions: array of actionable advice on how the candidate can improve their resume for this specific role

Return exactly:
{
"matchScore":0,
"matchedKeywords":[],
"missingKeywords":[],
"strengths":[],
"suggestions":[]
}

Job Description:
${jdText}

Resume:
${resumeText}
`;

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Gemini API timeout (20s)")), 20000)
        );

        const aiCallPromise = model.generateContent(prompt);
        const result = await Promise.race([aiCallPromise, timeoutPromise]);

        const responseText = result.response.text();

        // Robustly extract the JSON block using Regex
        let cleanedText = responseText;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedText = jsonMatch[0];
        }

        const parsedJson = JSON.parse(cleanedText);

        return {
            matchScore: typeof parsedJson.matchScore === 'number' ? parsedJson.matchScore : 0,
            matchedKeywords: Array.isArray(parsedJson.matchedKeywords) ? parsedJson.matchedKeywords : [],
            missingKeywords: Array.isArray(parsedJson.missingKeywords) ? parsedJson.missingKeywords : [],
            strengths: Array.isArray(parsedJson.strengths) ? parsedJson.strengths : [],
            suggestions: Array.isArray(parsedJson.suggestions) ? parsedJson.suggestions : []
        };

    } catch (err) {
        throw new Error(`JD Match Analysis failed: ${err.message}`);
    }
};

const generateCoverLetterAI = async (resumeText, jdText) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an expert career coach and professional copywriter.
Write a highly compelling, professional cover letter for the candidate based on their resume and the provided job description.
The cover letter should be 3-4 paragraphs long, bridging the candidate's specific experience with the requirements of the job.
Do not use placeholders like [Your Name] if the information is available in the resume, but use them if the information is completely missing.

Return ONLY valid JSON.

Rules:
* coverLetter: string containing the full cover letter text with line breaks (\\n)

Return exactly:
{
"coverLetter":""
}

Job Description:
${jdText}

Resume:
${resumeText}
`;

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Gemini API timeout (20s)")), 20000)
        );

        const aiCallPromise = model.generateContent(prompt);
        const result = await Promise.race([aiCallPromise, timeoutPromise]);

        const responseText = result.response.text();

        // Robustly extract the JSON block using Regex
        let cleanedText = responseText;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedText = jsonMatch[0];
        }

        const parsedJson = JSON.parse(cleanedText);

        return {
            coverLetter: typeof parsedJson.coverLetter === 'string' ? parsedJson.coverLetter : ""
        };

    } catch (err) {
        throw new Error(`Cover Letter Generation failed: ${err.message}`);
    }
};

module.exports = { analyzeResumeATS, analyzeJDMatch, generateCoverLetterAI };
