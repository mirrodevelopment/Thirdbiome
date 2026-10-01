import getApiClient from "../axios/axios";
import axios from "axios";

export const authService = {
  async register(userData) {
    try {
      // Registration doesn't require authentication - use axios directly
      // Map camelCase to snake_case for Laravel backend
      const payload = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phoneNumber, // Backend expects 'phone' instead of 'phone_number'
        email: userData.email,
        password: userData.password,
      };

      console.log("Registration payload:", payload);

      const response = await axios.post(
        "https://admin.thirdbiome.com/api/v1/customers",
        payload,
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration success:", response.data);
      // Note: This API returns {success: true, message: "...", data: {...}} 
      // but DOES NOT return an auth token.
      return response.data;
    } catch (error) {
      console.error("Registration error details:");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Error Data:", error.response?.data);
      console.error("Error Message:", error.message);
      console.error("Full Error:", error);
      throw error;
    }
  },

  async login(credentials) {
    const apiClient = await getApiClient();
    const response = await apiClient.post("/customers/login", credentials);
    return response.data;
  },

  async logout() {
    const apiClient = await getApiClient();
    const response = await apiClient.post("/logout");
    return response.data;
  },

  async forgotPassword(email) {
    const apiClient = await getApiClient();
    const response = await apiClient.post("/forgot-password", { email });
    return response.data;
  },

  async verifyOTP(email, otp) {
    const apiClient = await getApiClient();
    const response = await apiClient.post("/verify-otp", { email, otp });
    return response.data;
  },

  async resetPassword(email, otp, newPassword) {
    const apiClient = await getApiClient();
    const response = await apiClient.post("/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  },

  async updateProfile(userData) {
    const apiClient = await getApiClient();
    const response = await apiClient.put("/profile", userData);
    return response.data;
  },

  // Passwordless login methods
  async sendLoginCode(email) {
    const apiClient = await getApiClient();
    const response = await apiClient.post("/convert-guest", { email });
    return response.data;
  },

  async verifyLoginCodeAndSetPassword(email, otp, password) {
    const apiClient = await getApiClient();
    const response = await apiClient.post("/convert-guest-password", {
      email,
      otp,
      password,
    });
    return response.data;
  },
};
