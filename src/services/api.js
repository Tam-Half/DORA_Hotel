import axios from 'axios';

const API_URL = window.__ENV__?.API_URL || "http://localhost:3000";

const api = axios.create({
    //   baseURL: `${API_URL}/api`,
    baseURL: import.meta.env.VITE_API_URL || `${API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the auth token in headers if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const axiosBaseQuery = () =>
    async ({ url, method, data, params, headers }) => {
        try {
            const result = await api({
                url,
                method,
                data,
                params,
                headers,
            });
            return { data: result.data };
        } catch (axiosError) {
            return {
                error: {
                    status: axiosError.response?.status,
                    data: axiosError.response?.data || axiosError.message,
                },
            };
        }
    };

export default api;
