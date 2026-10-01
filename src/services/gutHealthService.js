import getApiClient from "../axios/axios";

/**
 * Service to handle gut health check-in API calls
 * Base: https://admin.thirdbiome.com/api/v1/gut-health
 */
export const gutHealthService = {
    /**
     * Get all gut health check-ins
     * GET /gut-health
     * @returns {Promise}
     */
    async getCheckIns() {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.get("/gut-health");

            if (response.data && response.data.success) {
                return response.data;
            } else {
                return {
                    success: true,
                    data: response.data.data || response.data,
                };
            }
        } catch (error) {
            console.error(
                "Gut Health Service Error:",
                error.response?.data || error.message
            );
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get a single gut health check-in by ID
     * GET /gut-health?id={id}
     * @param {number} id
     * @returns {Promise}
     */
    async getCheckIn(id) {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.get("/gut-health", {
                params: { id },
            });

            if (response.data && response.data.success) {
                return response.data;
            } else {
                return {
                    success: true,
                    data: response.data.data || response.data,
                };
            }
        } catch (error) {
            console.error(
                "Gut Health Service Error:",
                error.response?.data || error.message
            );
            throw error.response?.data || error.message;
        }
    },

    /**
     * Submit a gut health check-in
     * POST /gut-health
     * @param {Object} data - Check-in data
     * @returns {Promise}
     */
    async submitCheckIn(data) {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.post("/gut-health", data);

            if (response.data && response.data.success) {
                return response.data;
            } else {
                return {
                    success: true,
                    data: response.data.data || response.data,
                };
            }
        } catch (error) {
            console.error(
                "Gut Health Service Error:",
                error.response?.data || error.message
            );
            throw error.response?.data || error.message;
        }
    },
};

export default gutHealthService;
