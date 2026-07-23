import axios from "axios"

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true,
})

/* ─── Response interceptor ─────────────────────────────────────────────
   • Passes successful responses straight through
   • On 401 (session expired / not logged in), clears the page and
     redirects to /register so the user can log back in
──────────────────────────────────────────────────────────────────────── */
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            // Only redirect if we're not already on a public page
            const publicPaths = ["/", "/register"]
            if (!publicPaths.includes(window.location.pathname)) {
                window.location.href = "/register"
            }
        }
        return Promise.reject(error)
    }
)

export default API