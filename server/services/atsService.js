const { GoogleGenerativeAI } = require("@google/generative-ai")

/**
 * Run a detailed, section-by-section ATS analysis using Gemini.
 * Returns structured JSON with section scores, keywords, and actionable feedback.
 */
const analyzeATSDetailed = async (resumeText) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

        const prompt = `You are a senior Applicant Tracking System (ATS) expert and career coach.

Perform a **detailed, section-by-section** analysis of the following resume.

Score each section independently (0-100) and provide specific, actionable feedback for each.
Also identify keywords that are present and important keywords that are missing.

Return ONLY valid JSON — no markdown, no explanation.

Rules:
* overallScore: integer 0-100 (weighted average across sections)
* summary: 2-3 sentence overall assessment
* sectionScores: object with these keys, each having "score" (int 0-100) and "feedback" (string):
  - contactInfo: Is contact info complete, professional, and well-formatted?
  - summary: Is there a compelling professional summary / objective?
  - experience: Are experiences well-described with action verbs, quantified results?
  - education: Is education section present, relevant, properly formatted?
  - skills: Are skills relevant, well-organized, and sufficient?
  - formatting: Is the overall format ATS-friendly (no tables/columns/images, standard headings)?
* strengths: array of 3-5 specific strong points
* weaknesses: array of 3-5 specific areas to improve
* suggestions: array of 4-6 actionable improvement suggestions, ordered by impact
* keywords: object with:
  - found: array of important professional keywords/skills found in the resume
  - missing: array of commonly expected keywords/skills that are absent

Return exactly this structure:
{
  "overallScore": 0,
  "summary": "",
  "sectionScores": {
    "contactInfo": { "score": 0, "feedback": "" },
    "summary": { "score": 0, "feedback": "" },
    "experience": { "score": 0, "feedback": "" },
    "education": { "score": 0, "feedback": "" },
    "skills": { "score": 0, "feedback": "" },
    "formatting": { "score": 0, "feedback": "" }
  },
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "keywords": {
    "found": [],
    "missing": []
  }
}

Resume:
${resumeText}
`

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Gemini API timeout (30s)")), 30000)
        )

        const aiCallPromise = model.generateContent(prompt)
        const result = await Promise.race([aiCallPromise, timeoutPromise])

        const responseText = result.response.text()

        // Robustly extract the JSON block
        let cleanedText = responseText
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            cleanedText = jsonMatch[0]
        }

        const parsed = JSON.parse(cleanedText)

        // Validate and normalize structure
        const ensureSection = (section) => ({
            score: typeof section?.score === "number" ? Math.min(100, Math.max(0, section.score)) : 0,
            feedback: typeof section?.feedback === "string" ? section.feedback : ""
        })

        return {
            overallScore: typeof parsed.overallScore === "number"
                ? Math.min(100, Math.max(0, parsed.overallScore))
                : 0,
            summary: typeof parsed.summary === "string" ? parsed.summary : "",
            sectionScores: {
                contactInfo: ensureSection(parsed.sectionScores?.contactInfo),
                summary:     ensureSection(parsed.sectionScores?.summary),
                experience:  ensureSection(parsed.sectionScores?.experience),
                education:   ensureSection(parsed.sectionScores?.education),
                skills:      ensureSection(parsed.sectionScores?.skills),
                formatting:  ensureSection(parsed.sectionScores?.formatting)
            },
            strengths:   Array.isArray(parsed.strengths) ? parsed.strengths : [],
            weaknesses:  Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
            suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
            keywords: {
                found:   Array.isArray(parsed.keywords?.found) ? parsed.keywords.found : [],
                missing: Array.isArray(parsed.keywords?.missing) ? parsed.keywords.missing : []
            }
        }

    } catch (err) {
        throw new Error(`Detailed ATS Analysis failed: ${err.message}`)
    }
}

module.exports = { analyzeATSDetailed }
