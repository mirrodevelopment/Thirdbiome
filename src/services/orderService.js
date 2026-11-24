import getApiClient from "../axios/axios";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

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

    // Ensure COD fields are explicitly specified for database consistency
    const isCod = orderData.paymentMethod === "cod";
    const payload = {
      ...orderData,
      paymentMethod: orderData.paymentMethod || "payu",
      isCod: Boolean(orderData.isCod ?? isCod),
      codFee: Number(orderData.codFee || 0),
      paymentStatus: orderData.paymentStatus || (isCod ? "pending" : "pending"),
    };

    const response = await apiClient.post("/orders", payload, {
      headers,
    });

    // Extract created order identifiers
    const orderId =
      response.data?.data?.orderId ||
      response.data?.data?.id ||
      response.data?.data?._id ||
      response.data?.orderId ||
      response.data?.id ||
      response.data?.order?._id;
    const orderNumber =
      response.data?.data?.orderNumber ||
      response.data?.orderNumber ||
      response.data?.order?.orderNumber;

    // Persist for payment & confirmation flows
    try {
      if (orderId) sessionStorage.setItem("lastOrderId", String(orderId));
      if (orderNumber)
        sessionStorage.setItem("lastOrderNumber", String(orderNumber));
      sessionStorage.setItem("lastPaymentMethod", payload.paymentMethod);
    } catch { }

    // Resilient sync to Supabase database if configured
    if (isSupabaseConfigured && supabase && orderNumber) {
      try {
        await supabase.from("orders").upsert({
          order_number: String(orderNumber),
          customer_name: payload.customerName,
          customer_email: payload.customerEmail,
          customer_phone: payload.customerPhone,
          total_amount: Number(payload.totalAmount) || 0,
          discount_amount: Number(payload.discountAmount) || 0,
          coupon_code: payload.couponCode || null,
          payment_method: payload.paymentMethod,
          payment_status: payload.paymentStatus,
          is_cod: isCod,
          cod_fee: payload.codFee,
          shipping_address: payload.shippingAddress,
          items: payload.items || [],
        }, { onConflict: "order_number" });
      } catch (dbErr) {
        console.warn("Supabase order sync warning (non-fatal):", dbErr);
      }
    }

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
