import api from './api';

const userAPI = {

    getProfile: async () => {
        try {
            const response = await api.get('/user/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    create: async (userData) => {
        try {
            const response = await api.post('/user/', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },


};

export default userAPI;
