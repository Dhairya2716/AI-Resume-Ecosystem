import API from "./api"

export const uploadResume = async (file) => {
    const formData = new FormData()
    formData.append("resumeFile", file)
    
    // We send multipart/form-data so multer can parse it
    const res = await API.post("/resume/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return res.data
}

export const getMyResumes = async () => {
    const res = await API.get("/resume/my-resumes")
    return res.data
}

export const matchWithJD = async (resumeId, jobDescription) => {
    const res = await API.post(`/resume/${resumeId}/match-jd`, { jobDescription })
    return res.data
}

export const generateCoverLetter = async (resumeId, jobDescription) => {
    const res = await API.post(`/resume/${resumeId}/cover-letter`, { jobDescription })
    return res.data
}
