import api from './api';

const roomAPI = { 
    getAll: async () => {
        try {
            const response = await api.get('/room/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
 };

export default roomAPI;