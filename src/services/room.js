import api from './api';

const roomAPI = { 
    getAll: async () => {
        try {
            const response = await api.get('/room/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getTimeLine: async (roomId) => {
        try {
            const response = await api.get(`/room/${roomId}/timeline/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getRoomGridStatus : async (floor_id) => {
        try {
            const response = await api.get(`/room/grid-status?floor_id=${floor_id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

 };

export default roomAPI;