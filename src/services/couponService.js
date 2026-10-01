import getApiClient from "../axios/axios";

/**
 * Service to handle coupon-related API calls
 */
export const couponService = {
    /**
     * Get all discount coupons
     * Matches Production URL: GET /coupons
     * @returns {Promise} - The API response
     */
    async getCoupons() {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.get("/coupons");

            if (response.data && response.data.success) {
                return response.data;
            } else {
                return {
                    success: true,
                    data: response.data.data || response.data,
                };
            }
        } catch (error) {
            console.error("Coupon Service Error:", error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    },

    /**
     * Validate a discount coupon
     * Matches Production URL: POST /coupons/validate
     * @param {string} code - The coupon code to validate
     * @param {number} cartTotal - The cart subtotal
     * @returns {Promise} - The API response
     */
    async validateCoupon(code, cartTotal) {
        try {
            const apiClient = await getApiClient();
            const response = await apiClient.post("/coupons/validate", {
                code,
                cart_total: cartTotal
            });
            return response.data;
        } catch (error) {
            console.error("Coupon Validate Error:", error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    }
};

export default couponService;
