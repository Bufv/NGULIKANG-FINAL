import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ACCESS_TOKEN_KEY = 'ngulikang_access_token';
const REFRESH_TOKEN_KEY = 'ngulikang_refresh_token';
const USER_KEY = 'ngulikang_user';

const api = axios.create({
    baseURL: API_URL,
    timeout: 15000
});

const refreshClient = axios.create({
    baseURL: API_URL,
    timeout: 15000
});

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const setAuthTokens = ({ accessToken, refreshToken, user }) => {
    if (accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
};

const clearAuthTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                clearAuthTokens();
                return Promise.reject(error);
            }

            try {
                const { data } = await refreshClient.post('/auth/refresh', { refreshToken });
                setAuthTokens(data);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                clearAuthTokens();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

const authApi = {
    login: (payload) => api.post('/auth/login', payload),
    register: (payload) => api.post('/auth/register', payload),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
    me: () => api.get('/auth/me'),
    updateProfile: (formData) => api.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
};

const marketplaceApi = {
    listProducts: (params) => api.get('/marketplace/products', { params }),
    getProduct: (id) => api.get(`/marketplace/products/${id}`)
};

const normalizePath = (url) => {
    if (url.startsWith('http')) {
        return url;
    }
    if (url.startsWith('/api')) {
        return url.replace(/^\/api/, '');
    }
    return url;
};

const apiGet = (url, config) => {
    const normalized = normalizePath(url);
    if (normalized.startsWith('http')) {
        return axios.get(normalized, config).then((response) => response.data);
    }
    return api.get(normalized, config).then((response) => response.data);
};

export {
    api,
    authApi,
    marketplaceApi,
    apiGet,
    getAccessToken,
    getRefreshToken,
    setAuthTokens,
    clearAuthTokens
};
