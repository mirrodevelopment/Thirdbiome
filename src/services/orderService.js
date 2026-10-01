import getApiClient from "../axios/axios";

// Get session ID for anonymous users
const getSessionId = () => {
  return localStorage.getItem("sessionId");
};

// Create order (checkout)
export const createOrder = async (orderData) => {
  try {
    const apiClient = await getApiClient();
    let sessionId = getSessionId();

    // Generate session ID if not exists
    if (!sessionId) {
      const { generateSessionId } = await import("./cartService");
      sessionId = await generateSessionId();
    }

    const headers = {};
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }

    const response = await apiClient.post("/orders", orderData, {
      headers,
    });
    // Persist for payment flows
    try {
      const orderId =
        response.data?.data?.orderId ||
        response.data?.data?._id ||
        response.data?.order?._id;
      const orderNumber =
        response.data?.data?.orderNumber ||
        response.data?.orderNumber ||
        response.data?.order?.orderNumber;
      if (orderId) sessionStorage.setItem("lastOrderId", String(orderId));
      if (orderNumber)
        sessionStorage.setItem("lastOrderNumber", String(orderNumber));
    } catch { }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get order by order number
export const getOrderByNumber = async (orderNumber, email = null) => {
  try {
    const apiClient = await getApiClient();
    const sessionId = getSessionId();

    const headers = {};
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }

    const params = {};
    if (email) {
      params.email = email;
    }

    const response = await apiClient.get(`/orders/number/${orderNumber}`, {
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get order details
export const getOrderDetails = async (orderId, email = null) => {
  try {
    const apiClient = await getApiClient();
    const sessionId = getSessionId();

    const headers = {};
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }

    const params = {};
    if (email) {
      params.email = email;
    }

    const response = await apiClient.get(`/orders/${orderId}`, {
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user orders (authenticated users)
export const getUserOrders = async (params = {}) => {
  try {
    const apiClient = await getApiClient();
    // Path updated to match production URL: /orders
    const response = await apiClient.get("/orders", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel order (authenticated users)
export const cancelOrder = async (orderId) => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.put(`/orders/cancel/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
