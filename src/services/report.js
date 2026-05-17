import api from "./api";

const reportAPI = {

    getDashboardReport: async (params) => {
        try {
            const response = await api.get("/reports/dashboard", {
                params: params
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    compareMonths: async (month1, month2) => {
        try {
            const response = await api.get("/reports/compare", {
                params: { month1, month2 }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default reportAPI;