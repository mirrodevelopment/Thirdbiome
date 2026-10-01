import getApiClient from "../axios/axios";

export const clubService = {
    /**
     * Submit a new T3B Club application
     * @param {Object} applicationData - The form data from the application
     * @returns {Promise} - The API response
     */
    async submitApplication(applicationData) {
        try {
            const apiClient = await getApiClient();

            // Map frontend camelCase to backend snake_case if necessary
            const payload = {
                name: applicationData.name,
                age: parseInt(applicationData.age),
                sex: applicationData.sex,
                occupation: applicationData.occupation,
                whatsappNumber: applicationData.whatsappNumber || applicationData.whatsapp_number,
                email: applicationData.email,
            };

            console.log("Submitting T3B Club application:", payload);

            const response = await apiClient.post("/t3b-club-applications", payload);
            return response.data;
        } catch (error) {
            console.error("T3B Club Service Error:", error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    },
};

export default clubService;
