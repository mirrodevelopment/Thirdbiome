import getApiClient from "../axios/axios";

export const payuService = {
  async initPayment(orderId) {
    const apiClient = await getApiClient();
    const response = await apiClient.post("/payments/payu/init", { orderId });
    return response.data;
  },

  async verify(orderNumber) {
    const apiClient = await getApiClient();
    const response = await apiClient.get(
      `/payments/payu/verify/${orderNumber}`
    );
    return response.data;
  },
};

export default payuService;
