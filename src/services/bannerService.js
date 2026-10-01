import getApiClient from "../axios/axios";

/**
 * Service to handle banner-related API calls
 */
export const bannerService = {
    /**
     * Get all active banners
     * Matches Production URL: GET /banners
     * @returns {Promise} - The API response
     */
    async getBanners() {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.get("/banners");

            // Handle the standardized response {success, data, message}
            if (response.data && response.data.success) {
                return response.data;
            } else {
                // Fallback for different response formats
                return {
                    success: true,
                    data: response.data.data || response.data,
                };
            }
        } catch (error) {
            console.error("Banner Service Error:", error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    }
};

export default bannerService;
