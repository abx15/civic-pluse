import axios from "axios";

/**
 * API URL resolution priority:
 * 1. Netlify / Production env
 * 2. Local Vite env
 * 3. Localhost fallback (DEV only)
 */
const API_URL =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? "http://localhost:5000/api" : null);

if (!API_URL) {
    throw new Error("API URL is not defined for production environment");
}

console.log("Resolved API URL:", API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user?.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
