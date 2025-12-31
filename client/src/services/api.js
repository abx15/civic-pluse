import axios from 'axios';

const API_URL =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api';

console.log('API Base URL:', API_URL); // Log for debugging

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (user && user.token) {
                config.headers['Authorization'] = `Bearer ${user.token}`;
            }
        } catch (error) {
            console.error("Error accessing user token", error);
            // Optionally clear storage if corrupt, but api.js might not should do side effects lightly
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
