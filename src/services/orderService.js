import getApiClient from "../axios/axios";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { triggerAutoCodEmail } from "./notificationService";

const ADMIN_ORDERS_CACHE_KEY = "t3b_admin_orders_cache";
const DELETED_ORDERS_KEY = "t3b_deleted_orders";

// Get session ID for anonymous users
const getSessionId = () => {
  return localStorage.getItem("sessionId");
};

const getDeletedOrderKeys = () => {
  try {
    const raw = localStorage.getItem(DELETED_ORDERS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr.map(String) : []);
  } catch {
    return new Set();
  }
};

const addDeletedOrderKeys = (keys = []) => {
  try {
    const current = getDeletedOrderKeys();
    keys.filter(Boolean).forEach((k) => current.add(String(k)));
    localStorage.setItem(DELETED_ORDERS_KEY, JSON.stringify([...current]));
  } catch { /* ignore */ }
};

const isOrderDeleted = (order, deletedSet) => {
  if (!order || deletedSet.size === 0) return false;
  const candidates = [order.id, order._id, order.orderId, order.orderNumber, order.order_number]
    .filter(Boolean)
    .map(String);
  return candidates.some((c) => deletedSet.has(c));
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
      paymentStatus: orderData.paymentStatus || "pending",
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
    } catch { /* ignore */ }

    // Resilient sync to Supabase database if configured
    if (isSupabaseConfigured && supabase && orderNumber) {
      try {
        await supabase.from("orders").upsert(
          {
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
          },
          { onConflict: "order_number" }
        );
      } catch (dbErr) {
        console.warn("Supabase order sync warning (non-fatal):", dbErr);
      }
    }

    // Automatic zero-approval COD email notification & log
    let codNotif = null;
    if (isCod) {
      try {
        codNotif = await triggerAutoCodEmail({
          ...payload,
          id: orderId,
          orderNumber: orderNumber || orderId,
        });
      } catch { /* non-fatal */ }
    }

    // Cache created order locally so confirmation & Admin Panel reflect it immediately
    try {
      const existing = JSON.parse(localStorage.getItem(ADMIN_ORDERS_CACHE_KEY) || "[]");
      const newOrderRecord = {
        id: orderId || `ord_${Date.now()}`,
        orderNumber: orderNumber || `TB-${Date.now().toString().slice(-5)}`,
        ...payload,
        status: isCod ? "confirmed" : "pending",
        createdAt: new Date().toISOString(),
        codNotificationSent: Boolean(codNotif),
        codNotificationSentAt: codNotif?.sentAt || null,
      };
      sessionStorage.setItem("lastOrderData", JSON.stringify(newOrderRecord));
      if (Array.isArray(existing)) {
        localStorage.setItem(
          ADMIN_ORDERS_CACHE_KEY,
          JSON.stringify([newOrderRecord, ...existing])
        );
      }
    } catch { /* non-fatal */ }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get order by order number
export const getOrderByNumber = async (orderNumber, email = null) => {
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
};

// Get order details
export const getOrderDetails = async (orderId, email = null) => {
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
};

// Get user orders (authenticated users)
export const getUserOrders = async (params = {}) => {
  const apiClient = await getApiClient();
  const response = await apiClient.get("/orders", { params });
  return response.data;
};

// Cancel order (authenticated users)
export const cancelOrder = async (orderId) => {
  const apiClient = await getApiClient();
  const response = await apiClient.put(`/orders/cancel/${orderId}`);
  return response.data;
};

// =========================================================================
// ADMIN ORDER MANAGEMENT & COD EMAIL NOTIFICATION HELPERS
// =========================================================================

/**
 * Fetch all orders for the Admin Order Management portal.
 * Filters out any orders deleted by the admin locally or on backend.
 */
export const getAdminOrders = async (params = {}) => {
  const deletedSet = getDeletedOrderKeys();
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get("/orders", { params });
    const raw =
      response.data?.data?.data ||
      response.data?.data ||
      response.data?.orders ||
      response.data;
    const list = (Array.isArray(raw) ? raw : []).filter(
      (o) => !isOrderDeleted(o, deletedSet)
    );
    try {
      localStorage.setItem(ADMIN_ORDERS_CACHE_KEY, JSON.stringify(list));
    } catch { /* ignore */ }
    return list;
  } catch (error) {
    // Fallback to Supabase orders table if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error: sbError } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        if (!sbError && Array.isArray(data) && data.length > 0) {
          return data
            .map((row) => ({
              id: row.id,
              orderNumber: row.order_number,
              customerName: row.customer_name,
              customerEmail: row.customer_email,
              customerPhone: row.customer_phone,
              totalAmount: Number(row.total_amount) || 0,
              discountAmount: Number(row.discount_amount) || 0,
              paymentMethod: row.payment_method || "payu",
              paymentStatus: row.payment_status || "pending",
              isCod: Boolean(row.is_cod),
              codFee: Number(row.cod_fee) || 0,
              codStatus: row.cod_status || "pending_collection",
              status: row.status || (row.is_cod ? "confirmed" : "pending"),
              shippingAddress: row.shipping_address,
              items: row.items || [],
              createdAt: row.created_at,
              codNotificationSent: Boolean(row.cod_notification_sent),
              codNotificationSentAt: row.cod_notification_sent_at || null,
            }))
            .filter((o) => !isOrderDeleted(o, deletedSet));
        }
      } catch { /* ignore */ }
    }

    // Fallback to localStorage cache if offline / API unavailable
    try {
      const cached = localStorage.getItem(ADMIN_ORDERS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed.filter((o) => !isOrderDeleted(o, deletedSet));
        }
      }
    } catch { /* ignore */ }

    throw error;
  }
};

/**
 * Update order status, payment status, or COD collection status (Admin).
 */
export const updateOrderStatus = async (orderId, updates = {}) => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.patch(`/orders/${orderId}/status`, updates);
    return response.data;
  } catch (error) {
    if (isSupabaseConfigured && supabase) {
      try {
        const sbPayload = {};
        if (updates.status !== undefined) sbPayload.status = updates.status;
        if (updates.paymentStatus !== undefined) sbPayload.payment_status = updates.paymentStatus;
        if (updates.codStatus !== undefined) sbPayload.cod_status = updates.codStatus;
        await supabase.from("orders").update(sbPayload).eq("id", orderId);
      } catch { /* ignore */ }
    }
    throw error;
  }
};

/**
 * Manually trigger or resend internal COD email notification to recipient (Admin).
 */
export const resendCodNotification = async (orderId, recipient = "Info@aeobiome.com") => {
  const apiClient = await getApiClient();
  const response = await apiClient.post(`/orders/${orderId}/resend-cod-email`, {
    recipient,
  });
  return response.data;
};

/**
 * CREATE: Manually create an order from the Admin Panel (supports COD & auto-email).
 */
export const createAdminOrder = async (orderData) => {
  const isCod = orderData.paymentMethod === "cod" || Boolean(orderData.isCod);
  const generatedNumber =
    orderData.orderNumber || `TB-${Math.floor(10000 + Math.random() * 90000)}`;
  const record = {
    id: `ord_${Date.now()}`,
    orderNumber: generatedNumber,
    customerName: orderData.customerName || "Customer",
    customerEmail: orderData.customerEmail || "",
    customerPhone: orderData.customerPhone || "",
    totalAmount: Number(orderData.totalAmount) || 0,
    discountAmount: Number(orderData.discountAmount) || 0,
    paymentMethod: isCod ? "cod" : orderData.paymentMethod || "payu",
    isCod,
    codFee: Number(orderData.codFee) || 0,
    paymentStatus: orderData.paymentStatus || "pending",
    status: orderData.status || (isCod ? "confirmed" : "pending"),
    shippingAddress: orderData.shippingAddress || {
      street: orderData.street || "",
      city: orderData.city || "",
      state: orderData.state || "",
      zipCode: orderData.zipCode || "",
      country: "IN",
    },
    items: orderData.items || [
      {
        name: orderData.productName || "Biome Balance",
        price: Number(orderData.totalAmount) || 1499,
        quantity: Number(orderData.quantity) || 1,
      },
    ],
    createdAt: new Date().toISOString(),
    codNotificationSent: false,
    codNotificationSentAt: null,
  };

  try {
    const apiClient = await getApiClient();
    const res = await apiClient.post("/orders", record);
    if (res.data?.data) {
      record.id = res.data.data.id || res.data.data._id || record.id;
      record.orderNumber = res.data.data.orderNumber || record.orderNumber;
    }
  } catch { /* fallback to Supabase / local cache */ }

  if (isCod) {
    try {
      const notif = await triggerAutoCodEmail(record);
      if (notif) {
        record.codNotificationSent = true;
        record.codNotificationSentAt = notif.sentAt;
      }
    } catch { /* non-fatal */ }
  }

  try {
    const existing = JSON.parse(localStorage.getItem(ADMIN_ORDERS_CACHE_KEY) || "[]");
    localStorage.setItem(
      ADMIN_ORDERS_CACHE_KEY,
      JSON.stringify([record, ...(Array.isArray(existing) ? existing : [])])
    );
  } catch { /* ignore */ }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("orders").upsert(
        {
          order_number: record.orderNumber,
          customer_name: record.customerName,
          customer_email: record.customerEmail,
          customer_phone: record.customerPhone,
          total_amount: record.totalAmount,
          payment_method: record.paymentMethod,
          payment_status: record.paymentStatus,
          is_cod: record.isCod,
          cod_fee: record.codFee,
          shipping_address: record.shippingAddress,
          items: record.items,
          cod_notification_sent: record.codNotificationSent,
          cod_notification_sent_at: record.codNotificationSentAt,
        },
        { onConflict: "order_number" }
      );
    } catch { /* ignore */ }
  }

  return record;
};

/**
 * UPDATE: Edit an order's details, customer info, or statuses (Admin).
 */
export const updateAdminOrder = async (orderId, updates) => {
  try {
    const apiClient = await getApiClient();
    await apiClient.put(`/orders/${orderId}`, updates);
  } catch { /* fallback */ }

  try {
    const existing = JSON.parse(localStorage.getItem(ADMIN_ORDERS_CACHE_KEY) || "[]");
    if (Array.isArray(existing)) {
      const next = existing.map((o) =>
        String(o.id || o._id || o.orderNumber) === String(orderId)
          ? { ...o, ...updates }
          : o
      );
      localStorage.setItem(ADMIN_ORDERS_CACHE_KEY, JSON.stringify(next));
    }
  } catch { /* ignore */ }

  if (isSupabaseConfigured && supabase) {
    try {
      const sbUpdates = {};
      if (updates.customerName !== undefined) sbUpdates.customer_name = updates.customerName;
      if (updates.customerPhone !== undefined) sbUpdates.customer_phone = updates.customerPhone;
      if (updates.customerEmail !== undefined) sbUpdates.customer_email = updates.customerEmail;
      if (updates.status !== undefined) sbUpdates.status = updates.status;
      if (updates.paymentStatus !== undefined) sbUpdates.payment_status = updates.paymentStatus;
      if (updates.totalAmount !== undefined) sbUpdates.total_amount = Number(updates.totalAmount);
      await supabase.from("orders").update(sbUpdates).eq("id", orderId);
    } catch { /* ignore */ }
  }

  return updates;
};

/**
 * DELETE: Permanently delete an order record from backend, Supabase, and Admin cache.
 */
export const deleteAdminOrder = async (orderId, orderNumber = null) => {
  // Record in persistent deleted list so it never reappears even if remote API lacks DELETE /orders/{id}
  addDeletedOrderKeys([orderId, orderNumber]);

  try {
    const apiClient = await getApiClient();
    await apiClient.delete(`/orders/${orderId}`);
  } catch { /* try orderNumber endpoint if available */
    if (orderNumber) {
      try {
        const apiClient = await getApiClient();
        await apiClient.delete(`/orders/number/${orderNumber}`);
      } catch { /* fallback handled by deleted keys */ }
    }
  }

  try {
    const existing = JSON.parse(localStorage.getItem(ADMIN_ORDERS_CACHE_KEY) || "[]");
    if (Array.isArray(existing)) {
      const next = existing.filter((o) => {
        const keys = [o.id, o._id, o.orderId, o.orderNumber, o.order_number]
          .filter(Boolean)
          .map(String);
        return !keys.includes(String(orderId)) && (!orderNumber || !keys.includes(String(orderNumber)));
      });
      localStorage.setItem(ADMIN_ORDERS_CACHE_KEY, JSON.stringify(next));
    }
  } catch { /* ignore */ }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("orders").delete().eq("id", orderId);
      if (orderNumber) {
        await supabase.from("orders").delete().eq("order_number", orderNumber);
      }
    } catch { /* ignore */ }
  }

  return true;
};
