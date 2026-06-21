import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

let onUnauthorized = () => {}

export function setUnauthorizedHandler(fn) {
    onUnauthorized = fn
}

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        const url = error.config?.url ?? ""
        const isAuthAttempt =
            url.includes("/api/auth/login") ||
            url.includes("/api/auth/register")

        if (status === 401 && !isAuthAttempt) {
            const hadToken = localStorage.getItem("token")
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            onUnauthorized()

            if (hadToken) {
                window.location.replace("/login?reason=session_expired")
            }
        }

        return Promise.reject(error)
    }
)

export default api
