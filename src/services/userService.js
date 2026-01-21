import api from './api';

const userService = {

    getProfile: async () => {
        try {
            const response = await api.get('/user/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },


};

export default userService;
