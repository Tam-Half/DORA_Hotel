import api from "./api";
const bookingAPI = { 
    getAll: async (params) => {
        try {
            const response = await api.get('/booking/', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
 };

export default bookingAPI;