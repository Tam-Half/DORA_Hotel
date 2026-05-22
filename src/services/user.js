import api from './api';

const userAPI = {

    getProfile: async () => {
        try {
            const response = await api.get('/user/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    create: async (userData) => {
        try {
            const response = await api.post('/user/', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getAdminAccounts: async () => {
        try {
            const response = await api.get('/user/admin/accounts');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateAdminAccount: async (id, accountData) => {
        try {
            const response = await api.put(`/user/admin/accounts/${id}`, accountData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    resetAdminAccountPassword: async (id, passwordData) => {
        try {
            const response = await api.put(`/user/admin/accounts/${id}/password`, passwordData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default userAPI;
