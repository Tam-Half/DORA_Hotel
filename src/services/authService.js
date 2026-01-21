import api from './api';

const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/', credentials);
            const { access_token, refresh_token } = response.data;
            if (access_token) {
                localStorage.setItem('access_token', access_token);
            }
            if (refresh_token) {
                localStorage.setItem('refresh_token', refresh_token);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    getToken: () => {
        return localStorage.getItem('access_token');
    }


};

export default authService;
