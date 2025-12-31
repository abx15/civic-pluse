import api from './api';

const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const login = async (userData) => {
    const response = await api.post('/auth/login', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error("Error parsing user from localStorage", error);
        localStorage.removeItem('user'); // Clean up corrupt data
        return null;
    }
};

export default {
    register,
    login,
    logout,
    getCurrentUser
};
