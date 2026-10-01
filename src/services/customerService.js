import getApiClient from "../axios/axios";

export const customerService = {
    // Get all customers
    getAll: async () => {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.get("/customers");
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new customer
    create: async (customerData) => {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.post("/customers", customerData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get customer by ID
    getById: async (id) => {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.get(`/customers/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update customer
    update: async (id, customerData) => {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.put(`/customers/${id}`, customerData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete customer
    delete: async (id) => {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.delete(`/customers/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get customer profile (simplified)
    getProfile: async (id) => {
        try {
            const apiClient = await getApiClient();
            // If id provided, use /customers/{id}, otherwise /customers
            const url = id ? `/customers/${id}` : "/customers";
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update customer profile (simplified)
    updateProfile: async (id, customerData) => {
        try {
            const apiClient = await getApiClient();
            // If id provided, use /customers/{id}, otherwise /customers
            const url = id ? `/customers/${id}` : "/customers";
            const response = await apiClient.put(url, customerData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};
