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

export const getResume = async (id) => {
    const res = await API.get(`/resume/${id}`)
    return res.data
}

export const deleteResume = async (id) => {
    const res = await API.delete(`/resume/${id}`)
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

export const getCoverLetters = async () => {
    const res = await API.get("/resume/cover-letters")
    return res.data
}

export const deleteCoverLetter = async (id) => {
    const res = await API.delete(`/resume/cover-letter/${id}`)
    return res.data
}

