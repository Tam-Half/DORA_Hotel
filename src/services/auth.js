import api from './api';
import { useNavigate } from 'react-router-dom';

const authAPI = {
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
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/';
    },

    getToken: () => {
        return localStorage.getItem('access_token');
    }


};

export default authAPI;
