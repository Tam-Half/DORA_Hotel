import api from './api';

const floorAPI = { 
    getAll: async () => {
        try {
            const response = await api.get('/floor/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
 };

export default floorAPI;