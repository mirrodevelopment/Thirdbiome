import getApiClient from "../axios/axios";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { getCheckoutSettings } from "./checkoutSettingsService";

const NOTIF_STORAGE_KEY = "t3b_cod_email_logs";

const readLocalLogs = () => {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLocalLogs = (logs) => {
  try {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(logs));
  } catch { /* ignore */ }
};

/**
 * Build formatted COD email subject and details matching the backend template.
 */
export const buildCodEmailPreview = (order, recipient = "Info@aeobiome.com") => {
  const orderNumber = order.orderNumber || order.order_number || order.id || "TB-NEW";
  const customerName = order.customerName || order.customer_name || "Customer";
  const customerPhone = order.customerPhone || order.customer_phone || "N/A";
  const customerEmail = order.customerEmail || order.customer_email || "N/A";
  const codFee = Number(order.codFee ?? order.cod_fee ?? 0);
  const totalAmount = Number(order.totalAmount ?? order.total_amount ?? 0);
  const productAmount = Math.max(0, totalAmount - codFee);

  const items = Array.isArray(order.items) ? order.items : [];
  const itemsText =
    items.length > 0
      ? items.map((i) => `${i.name || "Product"} × ${i.quantity || 1}`).join(", ")
      : "Biome Balance";

  const addr = order.shippingAddress || order.shipping_address || {};
  const addrLine =
    typeof addr === "string"
      ? addr
      : [addr.street, addr.city, addr.state, addr.zipCode, addr.country]
          .filter(Boolean)
          .join(", ") || "N/A";

  const subject = `New COD Order Received – Third Biome (#${orderNumber})`;

  return {
    subject,
    recipient,
    orderNumber: String(orderNumber),
    customerName,
    customerPhone,
    customerEmail,
    itemsText,
    productAmount,
    codFee,
    totalAmount,
    address: addrLine,
    paymentMethod: "Cash on Delivery (COD)",
    paymentStatus: "Pending",
  };
};

/**
 * Automatically log and dispatch internal COD email notification without manual approval.
 * Called immediately upon COD order creation.
 */
export const triggerAutoCodEmail = async (order) => {
  const settings = await getCheckoutSettings();
  if (settings.enableCodEmailNotification === false) {
    return null;
  }

  const recipient = settings.codNotificationRecipient || "Info@aeobiome.com";
  const preview = buildCodEmailPreview(order, recipient);
  const existingLogs = readLocalLogs();

  // Prevent duplicate auto-notification for the same orderNumber
  const alreadyLogged = existingLogs.find(
    (l) => String(l.orderNumber) === String(preview.orderNumber) && l.notificationType === "cod_auto"
  );
  if (alreadyLogged) {
    return alreadyLogged;
  }

  let deliveryStatus = "sent";
  let errorMessage = null;

  // Optional external webhook / Supabase Edge Function dispatch if configured
  const webhookUrl = import.meta.env.VITE_COD_EMAIL_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient,
          subject: preview.subject,
          order: preview,
          autoApproved: true,
        }),
      });
    } catch (err) {
      deliveryStatus = "queued";
      errorMessage = err.message || "Webhook dispatch deferred";
    }
  }

  const newEntry = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    orderId: order.id || order.orderId || null,
    orderNumber: preview.orderNumber,
    recipient,
    subject: preview.subject,
    notificationType: "cod_auto",
    status: deliveryStatus,
    attempts: 1,
    errorMessage,
    payload: preview,
    sentAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  // Save to local cache for immediate Admin Panel visibility
  writeLocalLogs([newEntry, ...existingLogs]);

  // Sync to Supabase order_notification_logs if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("order_notification_logs").insert({
        order_id: Number(newEntry.orderId) || 0,
        order_number: newEntry.orderNumber,
        recipient: newEntry.recipient,
        notification_type: newEntry.notificationType,
        status: newEntry.status,
        attempts: newEntry.attempts,
        error_message: newEntry.errorMessage,
        sent_at: newEntry.sentAt,
      });
    } catch { /* non-fatal */ }
  }

  return newEntry;
};

/**
 * READ: Fetch all COD email notification logs (API -> Supabase -> localStorage).
 */
export const getNotificationLogs = async () => {
  try {
    const apiClient = await getApiClient();
    const res = await apiClient.get("/cod-notifications");
    const list = res.data?.data || res.data;
    if (Array.isArray(list)) {
      writeLocalLogs(list);
      return list;
    }
  } catch { /* fallback to Supabase / local cache */ }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("order_notification_logs")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          orderId: row.order_id,
          orderNumber: row.order_number,
          recipient: row.recipient,
          subject: `New COD Order Received – Third Biome (#${row.order_number})`,
          notificationType: row.notification_type || "cod_alert",
          status: row.status || "sent",
          attempts: row.attempts || 1,
          errorMessage: row.error_message || null,
          sentAt: row.sent_at,
          createdAt: row.created_at,
        }));
      }
    } catch { /* fallback to local cache */ }
  }

  return readLocalLogs();
};

/**
 * CREATE: Manually create and send/log a COD notification email.
 */
export const createNotificationLog = async (data) => {
  const entry = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    orderId: data.orderId || null,
    orderNumber: String(data.orderNumber || "MANUAL"),
    recipient: data.recipient || "Info@aeobiome.com",
    subject:
      data.subject ||
      `New COD Order Received – Third Biome (#${data.orderNumber || "MANUAL"})`,
    notificationType: data.notificationType || "manual",
    status: data.status || "sent",
    attempts: 1,
    errorMessage: null,
    payload: data.payload || null,
    sentAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  try {
    const apiClient = await getApiClient();
    const res = await apiClient.post("/cod-notifications", entry);
    if (res.data?.data) return res.data.data;
  } catch { /* fallback to local/Supabase */ }

  const logs = readLocalLogs();
  writeLocalLogs([entry, ...logs]);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("order_notification_logs").insert({
        order_id: Number(entry.orderId) || 0,
        order_number: entry.orderNumber,
        recipient: entry.recipient,
        notification_type: entry.notificationType,
        status: entry.status,
        attempts: entry.attempts,
        sent_at: entry.sentAt,
      });
    } catch { /* ignore */ }
  }

  return entry;
};

/**
 * UPDATE: Update a notification log (recipient, subject, status, or resend).
 */
export const updateNotificationLog = async (id, updates) => {
  try {
    const apiClient = await getApiClient();
    await apiClient.put(`/cod-notifications/${id}`, updates);
  } catch { /* fallback to local/Supabase */ }

  const logs = readLocalLogs();
  const updatedLogs = logs.map((l) =>
    String(l.id) === String(id)
      ? {
          ...l,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      : l
  );
  writeLocalLogs(updatedLogs);

  if (isSupabaseConfigured && supabase) {
    try {
      const sbUpdates = {};
      if (updates.recipient !== undefined) sbUpdates.recipient = updates.recipient;
      if (updates.status !== undefined) sbUpdates.status = updates.status;
      if (updates.attempts !== undefined) sbUpdates.attempts = updates.attempts;
      if (updates.sentAt !== undefined) sbUpdates.sent_at = updates.sentAt;
      await supabase.from("order_notification_logs").update(sbUpdates).eq("id", id);
    } catch { /* ignore */ }
  }

  return updatedLogs.find((l) => String(l.id) === String(id));
};

/**
 * DELETE: Remove a notification log entry.
 */
export const deleteNotificationLog = async (id) => {
  try {
    const apiClient = await getApiClient();
    await apiClient.delete(`/cod-notifications/${id}`);
  } catch { /* fallback to local/Supabase */ }

  const logs = readLocalLogs().filter((l) => String(l.id) !== String(id));
  writeLocalLogs(logs);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("order_notification_logs").delete().eq("id", id);
    } catch { /* ignore */ }
  }

  return true;
};
