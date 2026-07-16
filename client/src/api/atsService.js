import API from "./api"

export const runATSCheck = async (resumeId) => {
    const res = await API.post(`/ats/${resumeId}/analyze`)
    return res.data
}

export const getATSReports = async () => {
    const res = await API.get("/ats/reports")
    return res.data
}

export const getATSReport = async (id) => {
    const res = await API.get(`/ats/reports/${id}`)
    return res.data
}

export const deleteATSReport = async (id) => {
    const res = await API.delete(`/ats/reports/${id}`)
    return res.data
}
