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
    endShift: async (shiftId, actualCash, note) => {
        try {
            const payload = {
                actualCash,
                note
            };
            const response = await api.post(`/shifts/${shiftId}/end`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getCurrentShift: async (staffId) => {
        try {
            const response = await api.get(`/shifts/current?staffId=${staffId}`);
            return response.data;
        }
        catch (error) {
            throw error.response?.data || error.message;
        }
    }

};

export default shiftAPI;