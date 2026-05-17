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
    }

};

export default reportAPI;