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

    getRoomGridStatus : async (floor_id, checkIn, checkOut) => {
        try {
            let url = `/room/grid-status?`;
            const params = [];
            if (floor_id && floor_id !== 'all') params.push(`floor_id=${floor_id}`);
            if (checkIn) params.push(`check_in=${checkIn}`);
            if (checkOut) params.push(`check_out=${checkOut}`);
            url += params.join('&');
            
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getAllRoomTypes: async () => {
        try {
            const response = await api.get('/room-type/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

 };

export default roomAPI;