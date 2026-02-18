import api from './api';

const shiftAPI = { 
    getShiftByID: async (shiftId) => {
        try {
            const response = await api.get(`/shifts/${shiftId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
   
 };

export default shiftAPI;