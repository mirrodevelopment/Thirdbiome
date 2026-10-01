import getApiClient from "../axios/axios";

/**
 * Service to handle contact form API calls
 * POST https://admin.thirdbiome.com/api/v1/contact
 */
export const contactService = {
    /**
     * Submit a contact message
     * @param {Object} data - { name, email, phone, subject, message }
     * @returns {Promise} - The API response
     */
    async submitContact(data) {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.post("/contact", data);

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
                "Contact Service Error:",
                error.response?.data || error.message
            );
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get all contact messages (admin use)
     * GET https://admin.thirdbiome.com/api/v1/contact
     * @returns {Promise}
     */
    async getMessages() {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.get("/contact");
            return response.data;
        } catch (error) {
            console.error(
                "Contact Service Error:",
                error.response?.data || error.message
            );
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get a single contact message by ID
     * GET https://admin.thirdbiome.com/api/v1/contact?id={id}
     * @param {number} id
     * @returns {Promise}
     */
    async getMessage(id) {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.get("/contact", { params: { id } });
            return response.data;
        } catch (error) {
            console.error(
                "Contact Service Error:",
                error.response?.data || error.message
            );
            throw error.response?.data || error.message;
        }
    },
};

export default contactService;
