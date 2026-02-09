import api from './api';

const roomTypeAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/room-type/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default roomTypeAPI;
