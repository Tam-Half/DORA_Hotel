import api from './api';

const shiftAPI = {

    getAllShifts: async () => {
        try {
            const response = await api.get(`/shifts/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // [THÊM MỚI] Hàm mở ca làm việc
    startShift: async (payload) => {
        try {
            // payload sẽ chứa { staffId, initialCash }
            const response = await api.post(`/shifts/start`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // --- CÁC HÀM CŨ GIỮ NGUYÊN ---
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
    },

    getShiftReport: async (shiftId) => {
        try {
            const response = await api.get(`/shifts/${shiftId}`);
            return response.data;
        }
        catch (error) {
            throw error.response?.data || error.message;
        }
    },

};

export default shiftAPI;