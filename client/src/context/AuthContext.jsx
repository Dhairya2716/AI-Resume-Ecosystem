import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"

import {
    loginUser,
    logoutUser,
    registerUser,
    getProfile,
} from "../api/authService"

/* ─── Context ─────────────────────────────────────────────────────────── */
const AuthContext = createContext(null)

/* ─── Provider ────────────────────────────────────────────────────────── */
export function AuthProvider({ children }) {

    const [user,    setUser]    = useState(null)
    const [loading, setLoading] = useState(true)   // initial session check
    const [error,   setError]   = useState(null)   // last auth error message

    /* ── Restore session on mount ── */
    useEffect(() => {
        let cancelled = false
        const loadUser = async () => {
            try {
                const data = await getProfile()
                if (!cancelled) setUser(data.user)
            } catch {
                if (!cancelled) setUser(null)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        loadUser()
        return () => { cancelled = true }
    }, [])

    /* ── Register ── */
    const register = useCallback(async (formData) => {
        setError(null)
        try {
            const data = await registerUser(formData)
            setUser(data.user)
            return data
        } catch (err) {
            const msg = err?.response?.data?.message || "Registration failed."
            setError(msg)
            throw err
        }
    }, [])

    /* ── Login ── */
    const login = useCallback(async (formData) => {
        setError(null)
        try {
            const data = await loginUser(formData)
            setUser(data.user)
            return data
        } catch (err) {
            const msg = err?.response?.data?.message || "Login failed."
            setError(msg)
            throw err
        }
    }, [])

    /* ── Logout ── */
    const logout = useCallback(async () => {
        try {
            await logoutUser()
        } catch {
            // silent — clear client state regardless
        } finally {
            setUser(null)
        }
    }, [])

    /* ── Clear error helper ── */
    const clearError = useCallback(() => setError(null), [])

    /* ── Expose updating user object directly ── */
    const updateUser = useCallback((updatedUserData) => {
        setUser(updatedUserData)
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, logout, clearError, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

/* ─── Hook ────────────────────────────────────────────────────────────── */
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
    return ctx
}