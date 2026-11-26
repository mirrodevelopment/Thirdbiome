import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../../components/Seo";
import { getAdminSession, adminLogin, adminLogout } from "../../../services/publicationService";
import {
  getAdminOrders,
  updateOrderStatus,
  resendCodNotification,
  createAdminOrder,
  updateAdminOrder,
  deleteAdminOrder,
} from "../../../services/orderService";
import {
  getNotificationLogs,
  createNotificationLog,
  updateNotificationLog,
  deleteNotificationLog,
  buildCodEmailPreview,
} from "../../../services/notificationService";
import {
  getCheckoutSettings,
  DEFAULT_CHECKOUT_SETTINGS,
} from "../../../services/checkoutSettingsService";
import { inr } from "../../data/content";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["pending", "paid", "collected", "failed", "refunded"];
const NOTIF_STATUSES = ["sent", "queued", "failed"];

const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime())
    ? "—"
    : dt.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const normalizeOrder = (o) => {
  const method = String(o.paymentMethod || o.payment_method || "payu").toLowerCase();
  const isCod = Boolean(o.isCod || o.is_cod || method === "cod" || method === "cash_on_delivery");
  let items = o.items || [];
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch {
      items = [];
    }
  }
  let address = o.shippingAddress || o.shipping_address || {};
  if (typeof address === "string") {
    try {
      address = JSON.parse(address);
    } catch {
      address = { street: address };
    }
  }
  return {
    ...o,
    id: o.id || o._id || o.orderId || o.orderNumber,
    orderNumber: o.orderNumber || o.order_number || String(o.id || "").slice(-8),
    customerName:
      o.customerName ||
      o.customer_name ||
      `${address.firstName || ""} ${address.lastName || ""}`.trim() ||
      "Guest Customer",
    customerEmail: o.customerEmail || o.customer_email || address.email || "",
    customerPhone: o.customerPhone || o.customer_phone || address.phone || "",
    totalAmount: Number(o.totalAmount ?? o.total_amount ?? o.total ?? 0),
    codFee: Number(o.codFee ?? o.cod_fee ?? 0),
    paymentMethod: isCod ? "cod" : method,
    isCod,
    paymentStatus: String(o.paymentStatus || o.payment_status || "pending").toLowerCase(),
    status: String(o.status || (isCod ? "confirmed" : "pending")).toLowerCase(),
    createdAt: o.createdAt || o.created_at || o.orderDate,
    items: Array.isArray(items) ? items : [],
    shippingAddress: address,
    codNotificationSent: Boolean(o.codNotificationSent ?? o.cod_notification_sent),
    codNotificationSentAt: o.codNotificationSentAt ?? o.cod_notification_sent_at ?? null,
  };
};

export default function OrderList() {
  const [activeSection, setActiveSection] = useState("orders"); // "orders" | "emails"
  const [orders, setOrders] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null); // null | "new" | orderObj
  const [previewEmail, setPreviewEmail] = useState(null);
  const [editingNotif, setEditingNotif] = useState(null); // null | "new" | notifObj
  const [deleteTarget, setDeleteTarget] = useState(null); // null | { type: "order" | "notif", item }
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [user, setUser] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [settings, setSettings] = useState(DEFAULT_CHECKOUT_SETTINGS);
  const navigate = useNavigate();

  // Order form state for Create / Update
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    productName: "Biome Balance",
    quantity: 1,
    totalAmount: 1499,
    codFee: 0,
    paymentMethod: "cod",
    status: "confirmed",
    paymentStatus: "pending",
  });

  // Notification form state for Create / Update
  const [notifForm, setNotifForm] = useState({
    orderNumber: "",
    recipient: "Info@aeobiome.com",
    subject: "",
    status: "sent",
  });

  useEffect(() => {
    getAdminSession().then((session) => {
      if (!session) {
        navigate("/t3b-manage-portal/login", { replace: true });
      } else {
        setUser(session);
        loadData();
      }
    });
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersData, logsData, cfg] = await Promise.all([
        getAdminOrders().catch((err) => {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Using local cache (live backend API unreachable)."
          );
          return [];
        }),
        getNotificationLogs().catch(() => []),
        getCheckoutSettings(),
      ]);
      setOrders((Array.isArray(ordersData) ? ordersData : []).map(normalizeOrder));
      setEmailLogs(Array.isArray(logsData) ? logsData : []);
      if (cfg) setSettings(cfg);
    } finally {
      setLoading(false);
    }
  };

  const showFlash = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(""), 4500);
  };

  const handleLogout = async () => {
    await adminLogout();
    navigate("/t3b-manage-portal/login");
  };

  // --- ORDER CRUD HANDLERS ---
  const openCreateOrder = () => {
    setOrderForm({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      productName: "Biome Balance",
      quantity: 1,
      totalAmount: 1499,
      codFee: Number(settings.codFee) || 0,
      paymentMethod: "cod",
      status: "confirmed",
      paymentStatus: "pending",
    });
    setEditingOrder("new");
  };

  const openEditOrder = (order) => {
    setOrderForm({
      customerName: order.customerName || "",
      customerEmail: order.customerEmail || "",
      customerPhone: order.customerPhone || "",
      street: order.shippingAddress?.street || "",
      city: order.shippingAddress?.city || "",
      state: order.shippingAddress?.state || "",
      zipCode: order.shippingAddress?.zipCode || "",
      productName: order.items?.[0]?.name || "Biome Balance",
      quantity: order.items?.[0]?.quantity || 1,
      totalAmount: order.totalAmount || 1499,
      codFee: order.codFee || 0,
      paymentMethod: order.isCod ? "cod" : "payu",
      status: order.status || "confirmed",
      paymentStatus: order.paymentStatus || "pending",
    });
    setEditingOrder(order);
  };

  const handleSaveOrder = async (e) => {
    e.preventDefault();
    if (editingOrder === "new") {
      const created = await createAdminOrder(orderForm);
      const normalized = normalizeOrder(created);
      setOrders((prev) => [normalized, ...prev]);
      const freshLogs = await getNotificationLogs().catch(() => []);
      setEmailLogs(freshLogs);
      setEditingOrder(null);
      showFlash(
        normalized.isCod
          ? `COD Order #${normalized.orderNumber} created & internal email auto-sent to ${
              settings.codNotificationRecipient || "Info@aeobiome.com"
            }.`
          : `Order #${normalized.orderNumber} created.`
      );
    } else {
      const updates = {
        customerName: orderForm.customerName,
        customerEmail: orderForm.customerEmail,
        customerPhone: orderForm.customerPhone,
        totalAmount: Number(orderForm.totalAmount) || 0,
        status: orderForm.status,
        paymentStatus: orderForm.paymentStatus,
        shippingAddress: {
          ...editingOrder.shippingAddress,
          street: orderForm.street,
          city: orderForm.city,
          state: orderForm.state,
          zipCode: orderForm.zipCode,
        },
      };
      await updateAdminOrder(editingOrder.id, updates);
      setOrders((prev) =>
        prev.map((o) => (o.id === editingOrder.id ? { ...o, ...updates } : o))
      );
      if (selectedOrder?.id === editingOrder.id) {
        setSelectedOrder((prev) => ({ ...prev, ...updates }));
      }
      setEditingOrder(null);
      showFlash(`Order #${editingOrder.orderNumber} updated.`);
    }
  };

  const handleDeleteOrder = (order) => {
    setDeleteTarget({ type: "order", item: order });
    setDeletePassword("");
    setDeleteError("");
  };

  const handleStatusChange = async (order, field, value) => {
    setUpdatingId(order.id);
    try {
      await updateOrderStatus(order.id, { [field]: value });
    } catch { /* local optimistic fallback */ }
    await updateAdminOrder(order.id, { [field]: value }).catch(() => {});
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, [field]: value } : o))
    );
    if (selectedOrder?.id === order.id) {
      setSelectedOrder((prev) => ({ ...prev, [field]: value }));
    }
    showFlash(`Order #${order.orderNumber} ${field} updated to "${value}".`);
    setUpdatingId(null);
  };

  const handleResendEmail = async (order) => {
    setResendingId(order.id);
    const recipient = settings.codNotificationRecipient || "Info@aeobiome.com";
    try {
      await resendCodNotification(order.id, recipient).catch(() => {});
      const preview = buildCodEmailPreview(order, recipient);
      const logEntry = await createNotificationLog({
        orderId: order.id,
        orderNumber: order.orderNumber,
        recipient,
        subject: preview.subject,
        notificationType: "manual_resend",
        status: "sent",
        payload: preview,
      });
      setEmailLogs((prev) => [logEntry, ...prev]);
      const nowIso = new Date().toISOString();
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, codNotificationSent: true, codNotificationSentAt: nowIso }
            : o
        )
      );
      if (selectedOrder?.id === order.id) {
        setSelectedOrder((prev) => ({
          ...prev,
          codNotificationSent: true,
          codNotificationSentAt: nowIso,
        }));
      }
      showFlash(`COD email notification sent to ${recipient} for #${order.orderNumber}.`);
    } finally {
      setResendingId(null);
    }
  };

  // --- EMAIL NOTIFICATION CRUD HANDLERS ---
  const openCreateNotif = () => {
    setNotifForm({
      orderNumber: "",
      recipient: settings.codNotificationRecipient || "Info@aeobiome.com",
      subject: "New COD Order Received – Third Biome",
      status: "sent",
    });
    setEditingNotif("new");
  };

  const openEditNotif = (log) => {
    setNotifForm({
      orderNumber: log.orderNumber || "",
      recipient: log.recipient || "Info@aeobiome.com",
      subject: log.subject || "",
      status: log.status || "sent",
    });
    setEditingNotif(log);
  };

  const handleSaveNotif = async (e) => {
    e.preventDefault();
    if (editingNotif === "new") {
      const created = await createNotificationLog({
        ...notifForm,
        notificationType: "manual",
      });
      setEmailLogs((prev) => [created, ...prev]);
      setEditingNotif(null);
      showFlash(`Notification email created & logged for ${notifForm.recipient}.`);
    } else {
      const updated = await updateNotificationLog(editingNotif.id, notifForm);
      setEmailLogs((prev) =>
        prev.map((l) => (l.id === editingNotif.id ? { ...l, ...updated } : l))
      );
      setEditingNotif(null);
      showFlash(`Notification log updated.`);
    }
  };

  const handleResendLog = async (log) => {
    await resendCodNotification(log.orderId || log.orderNumber, log.recipient).catch(() => {});
    const updated = await updateNotificationLog(log.id, {
      status: "sent",
      attempts: (Number(log.attempts) || 1) + 1,
      sentAt: new Date().toISOString(),
    });
    setEmailLogs((prev) =>
      prev.map((l) => (l.id === log.id ? { ...l, ...updated } : l))
    );
    showFlash(`Resent notification #${log.orderNumber} to ${log.recipient}.`);
  };

  const handleDeleteNotif = (log) => {
    setDeleteTarget({ type: "notif", item: log });
    setDeletePassword("");
    setDeleteError("");
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    if (!deleteTarget) return;
    if (!deletePassword.trim()) {
      setDeleteError("Please enter your admin password to confirm deletion.");
      return;
    }

    setDeleting(true);
    setDeleteError("");
    try {
      const adminEmail = user?.email || "admin@thirdbiome.com";
      await adminLogin(adminEmail, deletePassword);

      if (deleteTarget.type === "order") {
        const order = deleteTarget.item;
        await deleteAdminOrder(order.id, order.orderNumber);
        setOrders((prev) =>
          prev.filter(
            (o) =>
              String(o.id) !== String(order.id) &&
              String(o.orderNumber) !== String(order.orderNumber)
          )
        );
        if (selectedOrder?.id === order.id) setSelectedOrder(null);
        showFlash(`Order #${order.orderNumber} permanently deleted.`);
      } else {
        const log = deleteTarget.item;
        await deleteNotificationLog(log.id);
        setEmailLogs((prev) => prev.filter((l) => String(l.id) !== String(log.id)));
        showFlash(`Notification log for #${log.orderNumber} permanently deleted.`);
      }

      setDeleteTarget(null);
      setDeletePassword("");
    } catch (err) {
      setDeleteError("Incorrect admin password. Deletion cancelled.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (methodFilter === "cod" && !o.isCod) return false;
      if (methodFilter === "payu" && o.isCod) return false;
      if (statusFilter !== "all" && o.status !== statusFilter) return false;

      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        String(o.orderNumber).toLowerCase().includes(q) ||
        String(o.customerName).toLowerCase().includes(q) ||
        String(o.customerEmail).toLowerCase().includes(q) ||
        String(o.customerPhone).toLowerCase().includes(q)
      );
    });
  }, [orders, methodFilter, statusFilter, search]);

  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return emailLogs;
    return emailLogs.filter(
      (l) =>
        String(l.orderNumber).toLowerCase().includes(q) ||
        String(l.recipient).toLowerCase().includes(q) ||
        String(l.subject).toLowerCase().includes(q)
    );
  }, [emailLogs, search]);

  const metrics = useMemo(() => {
    const total = orders.length;
    const cod = orders.filter((o) => o.isCod).length;
    const pending = orders.filter((o) =>
      ["pending", "confirmed", "processing"].includes(o.status)
    ).length;
    const emailsSent = emailLogs.filter((l) => l.status === "sent").length;
    return { total, cod, pending, emailsSent };
  }, [orders, emailLogs]);

  const handleExportCsv = () => {
    if (filteredOrders.length === 0) {
      alert("No orders to export.");
      return;
    }
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Email",
      "Phone",
      "Payment Method",
      "Order Status",
      "Payment Status",
      "COD Fee",
      "Total Amount",
      "Shipping Address",
    ];
    const escapeCsv = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
    const rows = filteredOrders.map((o) => {
      const addr = o.shippingAddress || {};
      const addrStr = [addr.street, addr.city, addr.state, addr.zipCode, addr.country]
        .filter(Boolean)
        .join(", ");
      return [
        o.orderNumber,
        fmtDate(o.createdAt),
        o.customerName,
        o.customerEmail,
        o.customerPhone,
        o.isCod ? "Cash on Delivery" : "PayU",
        o.status,
        o.paymentStatus,
        o.codFee,
        o.totalAmount,
        addrStr,
      ]
        .map(escapeCsv)
        .join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `thirdbiome-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Seo
        title="Order Management · Admin CMS"
        description="Manage Cash on Delivery and PayU orders, track statuses, and perform CRUD on automatic COD email notifications."
        noindex={true}
      />

      <section className="sheet sheet--pad admin-dashboard-sheet">
        <div className="wrap">
          {/* Top Admin Navigation Bar */}
          <div className="admin-topbar">
            <div className="admin-topbar__left">
              <span className="eyebrow dot-dark">Administrative Portal</span>
              <h1 className="admin-topbar__title">Order &amp; COD Email Management</h1>
            </div>
            <div className="admin-topbar__right">
              <span className="admin-user-pill">
                👤 {user?.email || "Administrator"}
              </span>
              <button
                type="button"
                className="btn btn--glass admin-logout-btn"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px", borderBottom: "1px solid var(--line)", paddingBottom: "12px", flexWrap: "wrap" }}>
            <Link
              to="/t3b-manage-portal/publications"
              className="btn btn--ghost"
              style={{ fontSize: "0.88rem", padding: "8px 18px" }}
            >
              📄 Scientific Publications
            </Link>
            <Link
              to="/t3b-manage-portal/checkout-settings"
              className="btn btn--ghost"
              style={{ fontSize: "0.88rem", padding: "8px 18px" }}
            >
              💳 Checkout &amp; Payment Controls
            </Link>
            <Link
              to="/t3b-manage-portal/orders"
              className="btn btn--dark"
              style={{ fontSize: "0.88rem", padding: "8px 18px" }}
            >
              📦 Order Management
            </Link>
          </div>

          {actionMessage && (
            <div className="admin-flash-alert" role="status">
              <span>✓ {actionMessage}</span>
            </div>
          )}

          {error && (
            <div className="admin-error-box" role="alert" style={{ marginBottom: "20px" }}>
              <span>ℹ️ {error}</span>
            </div>
          )}

          {/* Metrics Strip */}
          <div className="admin-metrics-row">
            <div className="admin-metric-card">
              <span className="admin-metric-card__val">{metrics.total}</span>
              <span className="admin-metric-card__lbl">Total Orders</span>
            </div>
            <div className="admin-metric-card admin-metric-card--published">
              <span className="admin-metric-card__val">{metrics.cod}</span>
              <span className="admin-metric-card__lbl">COD Orders</span>
            </div>
            <div className="admin-metric-card admin-metric-card--draft">
              <span className="admin-metric-card__val">{metrics.pending}</span>
              <span className="admin-metric-card__lbl">Pending / Active</span>
            </div>
            <div className="admin-metric-card">
              <span className="admin-metric-card__val" style={{ color: "var(--green-d)" }}>
                {metrics.emailsSent}
              </span>
              <span className="admin-metric-card__lbl">Auto COD Emails Sent</span>
            </div>
          </div>

          {/* Sub-tabs: Orders CRUD vs COD Email Notifications CRUD */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className={activeSection === "orders" ? "btn btn--leaf" : "btn btn--ghost"}
                onClick={() => setActiveSection("orders")}
                style={{ fontSize: "0.86rem", padding: "8px 16px" }}
              >
                📦 Orders ({orders.length})
              </button>
              <button
                type="button"
                className={activeSection === "emails" ? "btn btn--leaf" : "btn btn--ghost"}
                onClick={() => setActiveSection("emails")}
                style={{ fontSize: "0.86rem", padding: "8px 16px" }}
              >
                ✉️ COD Email Notifications ({emailLogs.length})
              </button>
            </div>

            {activeSection === "orders" ? (
              <button
                type="button"
                className="btn btn--dark"
                onClick={openCreateOrder}
                style={{ fontSize: "0.85rem", padding: "8px 16px" }}
              >
                + New COD Order
              </button>
            ) : (
              <button
                type="button"
                className="btn btn--dark"
                onClick={openCreateNotif}
                style={{ fontSize: "0.85rem", padding: "8px 16px" }}
              >
                + Send / Log Email
              </button>
            )}
          </div>

          {/* Search & Filter Controls */}
          <div className="admin-controls-bar" style={{ gap: "12px", flexWrap: "wrap" }}>
            <div className="admin-search-wrap" style={{ minWidth: "240px" }}>
              <input
                type="text"
                placeholder={
                  activeSection === "orders"
                    ? "Search order ID, customer, phone or email..."
                    : "Search order #, recipient or subject..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-search-input"
              />
              {search && (
                <button
                  type="button"
                  className="admin-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              {activeSection === "orders" && (
                <>
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="v5-select"
                    style={{ padding: "8px 14px", borderRadius: "999px", fontSize: "0.85rem" }}
                  >
                    <option value="all">All Payment Methods</option>
                    <option value="cod">Cash on Delivery (COD)</option>
                    <option value="payu">PayU (Online)</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="v5-select"
                    style={{ padding: "8px 14px", borderRadius: "999px", fontSize: "0.85rem" }}
                  >
                    <option value="all">All Statuses</option>
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={handleExportCsv}
                    style={{ fontSize: "0.84rem", padding: "8px 16px" }}
                  >
                    ⬇ Export CSV
                  </button>
                </>
              )}

              <button
                type="button"
                className="btn btn--ghost"
                onClick={loadData}
                style={{ fontSize: "0.84rem", padding: "8px 14px" }}
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {/* SECTION A: ORDERS CRUD TABLE */}
          {activeSection === "orders" ? (
            <div className="admin-table-wrap">
              {loading ? (
                <div className="admin-empty-state"><p>Loading orders...</p></div>
              ) : filteredOrders.length === 0 ? (
                <div className="admin-empty-state">
                  <p>No orders found. Place a COD order on checkout or click "+ New COD Order".</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Method</th>
                      <th>Amount</th>
                      <th>Order Status</th>
                      <th>Payment</th>
                      <th>Auto Mail</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id || order.orderNumber}>
                        <td>
                          <div style={{ fontWeight: 700, fontFamily: "var(--mono)", fontSize: "0.85rem" }}>
                            #{order.orderNumber}
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "var(--ink-soft)" }}>
                            {fmtDate(order.createdAt)}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                          <div style={{ fontSize: "0.76rem", color: "var(--ink-soft)" }}>
                            {order.customerPhone || order.customerEmail}
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: "0.74rem",
                              fontWeight: 700,
                              padding: "4px 10px",
                              borderRadius: "999px",
                              background: order.isCod ? "#ecfdf5" : "#eef2ff",
                              color: order.isCod ? "#047857" : "#4338ca",
                            }}
                          >
                            {order.isCod ? "COD" : "PayU"}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{inr(order.totalAmount)}</div>
                          {order.codFee > 0 && (
                            <div style={{ fontSize: "0.72rem", color: "var(--ink-soft)" }}>
                              incl. ₹{order.codFee} fee
                            </div>
                          )}
                        </td>
                        <td>
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order, "status", e.target.value)}
                            className="v5-select"
                            style={{ padding: "4px 8px", fontSize: "0.8rem", borderRadius: "8px" }}
                          >
                            {ORDER_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase())}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            value={order.paymentStatus}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order, "paymentStatus", e.target.value)
                            }
                            className="v5-select"
                            style={{ padding: "4px 8px", fontSize: "0.8rem", borderRadius: "8px" }}
                          >
                            {PAYMENT_STATUSES.map((pst) => (
                              <option key={pst} value={pst}>
                                {pst.charAt(0).toUpperCase() + pst.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {order.isCod ? (
                            <span
                              style={{
                                fontSize: "0.74rem",
                                fontWeight: 600,
                                color: order.codNotificationSent ? "#15803d" : "#b45309",
                              }}
                            >
                              {order.codNotificationSent ? "✓ Auto-Sent" : "Auto-Queued"}
                            </span>
                          ) : (
                            <span style={{ fontSize: "0.74rem", color: "var(--ink-soft)" }}>—</span>
                          )}
                        </td>
                        <td>
                          <div className="admin-actions-group">
                            <button
                              type="button"
                              className="admin-action-btn admin-action-btn--view"
                              onClick={() => setSelectedOrder(order)}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn admin-action-btn--edit"
                              onClick={() => openEditOrder(order)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn admin-action-btn--delete"
                              onClick={() => handleDeleteOrder(order)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            /* SECTION B: COD EMAIL NOTIFICATIONS CRUD TABLE */
            <div className="admin-table-wrap">
              {loading ? (
                <div className="admin-empty-state"><p>Loading email notifications...</p></div>
              ) : filteredLogs.length === 0 ? (
                <div className="admin-empty-state">
                  <p>No COD email notifications logged yet. Placing any COD order automatically generates and logs one here without approval.</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Recipient</th>
                      <th>Subject</th>
                      <th>Trigger</th>
                      <th>Status</th>
                      <th>Sent At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id}>
                        <td style={{ fontWeight: 700, fontFamily: "var(--mono)" }}>
                          #{log.orderNumber}
                        </td>
                        <td style={{ fontWeight: 600 }}>{log.recipient}</td>
                        <td style={{ fontSize: "0.85rem", maxWidth: "240px" }}>{log.subject}</td>
                        <td>
                          <span className="admin-status-badge admin-status-badge--published">
                            {log.notificationType === "cod_auto" ? "Auto (No Approval)" : "Manual"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`admin-status-badge ${
                              log.status === "sent"
                                ? "admin-status-badge--published"
                                : "admin-status-badge--draft"
                            }`}
                          >
                            {String(log.status || "sent").toUpperCase()}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.78rem", color: "var(--ink-soft)" }}>
                          {fmtDate(log.sentAt || log.createdAt)}
                        </td>
                        <td>
                          <div className="admin-actions-group">
                            <button
                              type="button"
                              className="admin-action-btn admin-action-btn--view"
                              onClick={() => setPreviewEmail(log)}
                            >
                              Preview
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn admin-action-btn--toggle"
                              onClick={() => handleResendLog(log)}
                            >
                              Resend
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn admin-action-btn--edit"
                              onClick={() => openEditNotif(log)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn admin-action-btn--delete"
                              onClick={() => handleDeleteNotif(log)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="v5-cmodal" onClick={() => setSelectedOrder(null)} role="dialog" aria-modal="true">
          <div className="v5-cmodal__card" style={{ maxWidth: "680px", width: "95%" }} onClick={(e) => e.stopPropagation()}>
            <div className="v5-cmodal__head">
              <h3>Order #{selectedOrder.orderNumber}</h3>
              <button type="button" className="v5-cmodal__x" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            <div className="v5-cmodal__body" style={{ display: "grid", gap: "18px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", background: "var(--panel)", padding: "16px", borderRadius: "12px" }}>
                <div>
                  <strong style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--ink-soft)" }}>Customer</strong>
                  <div style={{ fontWeight: 700, marginTop: "4px" }}>{selectedOrder.customerName}</div>
                  <div style={{ fontSize: "0.86rem" }}>{selectedOrder.customerEmail}</div>
                  <div style={{ fontSize: "0.86rem" }}>{selectedOrder.customerPhone}</div>
                </div>
                <div>
                  <strong style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--ink-soft)" }}>Shipping Address</strong>
                  <div style={{ fontSize: "0.86rem", marginTop: "4px", lineHeight: 1.45 }}>
                    {selectedOrder.shippingAddress?.street}<br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}<br />
                    {selectedOrder.shippingAddress?.country}
                  </div>
                </div>
              </div>

              <div>
                <strong style={{ fontSize: "0.85rem", display: "block", marginBottom: "8px" }}>
                  Items ({selectedOrder.items.length})
                </strong>
                <div style={{ border: "1px solid var(--line)", borderRadius: "12px", overflow: "hidden" }}>
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: idx < selectedOrder.items.length - 1 ? "1px solid var(--line)" : "none", fontSize: "0.88rem" }}>
                      <span><b>{it.name}</b> × {it.quantity}</span>
                      <span>{inr(Number(it.price || 0) * Number(it.quantity || 1))}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", background: "var(--panel)", fontWeight: 800, fontSize: "0.95rem" }}>
                    <span>Total ({selectedOrder.isCod ? "Amount to Collect on Delivery" : "Paid Online"})</span>
                    <span>{inr(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.isCod && (
                <div style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--line)", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <div>
                    <strong style={{ fontSize: "0.88rem", display: "block" }}>Automatic COD Email Alert</strong>
                    <span style={{ fontSize: "0.8rem", color: "var(--ink-soft)" }}>
                      Recipient: <b>{settings.codNotificationRecipient || "Info@aeobiome.com"}</b> ·{" "}
                      {selectedOrder.codNotificationSent ? `Sent ${fmtDate(selectedOrder.codNotificationSentAt)}` : "Auto-queued"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn--dark"
                    style={{ fontSize: "0.8rem", padding: "8px 14px" }}
                    onClick={() => handleResendEmail(selectedOrder)}
                    disabled={resendingId === selectedOrder.id}
                  >
                    {resendingId === selectedOrder.id ? "Sending..." : "↻ Resend COD Email"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Order Modal (CRUD) */}
      {editingOrder && (
        <div className="v5-cmodal" onClick={() => setEditingOrder(null)} role="dialog" aria-modal="true">
          <div className="v5-cmodal__card" style={{ maxWidth: "600px", width: "95%" }} onClick={(e) => e.stopPropagation()}>
            <div className="v5-cmodal__head">
              <h3>{editingOrder === "new" ? "Create New COD Order" : `Edit Order #${editingOrder.orderNumber}`}</h3>
              <button type="button" className="v5-cmodal__x" onClick={() => setEditingOrder(null)}>×</button>
            </div>
            <form className="v5-cmodal__body" onSubmit={handleSaveOrder} style={{ display: "grid", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="v5-field">
                  <label>Customer Name</label>
                  <input required className="v5-input" value={orderForm.customerName} onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })} />
                </div>
                <div className="v5-field">
                  <label>Phone</label>
                  <input required className="v5-input" value={orderForm.customerPhone} onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })} />
                </div>
              </div>
              <div className="v5-field">
                <label>Email</label>
                <input type="email" required className="v5-input" value={orderForm.customerEmail} onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })} />
              </div>
              <div className="v5-field">
                <label>Street Address</label>
                <input required className="v5-input" value={orderForm.street} onChange={(e) => setOrderForm({ ...orderForm, street: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div className="v5-field">
                  <label>City</label>
                  <input required className="v5-input" value={orderForm.city} onChange={(e) => setOrderForm({ ...orderForm, city: e.target.value })} />
                </div>
                <div className="v5-field">
                  <label>State</label>
                  <input required className="v5-input" value={orderForm.state} onChange={(e) => setOrderForm({ ...orderForm, state: e.target.value })} />
                </div>
                <div className="v5-field">
                  <label>ZIP</label>
                  <input required className="v5-input" value={orderForm.zipCode} onChange={(e) => setOrderForm({ ...orderForm, zipCode: e.target.value })} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div className="v5-field">
                  <label>Total Amount (₹)</label>
                  <input type="number" required className="v5-input" value={orderForm.totalAmount} onChange={(e) => setOrderForm({ ...orderForm, totalAmount: e.target.value })} />
                </div>
                <div className="v5-field">
                  <label>Order Status</label>
                  <select className="v5-select" value={orderForm.status} onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}>
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="v5-field">
                  <label>Payment Status</label>
                  <select className="v5-select" value={orderForm.paymentStatus} onChange={(e) => setOrderForm({ ...orderForm, paymentStatus: e.target.value })}>
                    {PAYMENT_STATUSES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button type="button" className="btn btn--ghost" onClick={() => setEditingOrder(null)}>Cancel</button>
                <button type="submit" className="btn btn--dark">
                  {editingOrder === "new" ? "Create & Auto-Send Email" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Email Notification Modal (CRUD) */}
      {editingNotif && (
        <div className="v5-cmodal" onClick={() => setEditingNotif(null)} role="dialog" aria-modal="true">
          <div className="v5-cmodal__card" style={{ maxWidth: "520px", width: "95%" }} onClick={(e) => e.stopPropagation()}>
            <div className="v5-cmodal__head">
              <h3>{editingNotif === "new" ? "Send / Log COD Notification" : `Edit Notification #${editingNotif.orderNumber}`}</h3>
              <button type="button" className="v5-cmodal__x" onClick={() => setEditingNotif(null)}>×</button>
            </div>
            <form className="v5-cmodal__body" onSubmit={handleSaveNotif} style={{ display: "grid", gap: "12px" }}>
              <div className="v5-field">
                <label>Order Number</label>
                <input required className="v5-input" placeholder="e.g. TB-10025" value={notifForm.orderNumber} onChange={(e) => setNotifForm({ ...notifForm, orderNumber: e.target.value })} />
              </div>
              <div className="v5-field">
                <label>Recipient Email</label>
                <input type="email" required className="v5-input" value={notifForm.recipient} onChange={(e) => setNotifForm({ ...notifForm, recipient: e.target.value })} />
              </div>
              <div className="v5-field">
                <label>Subject</label>
                <input required className="v5-input" value={notifForm.subject} onChange={(e) => setNotifForm({ ...notifForm, subject: e.target.value })} />
              </div>
              <div className="v5-field">
                <label>Delivery Status</label>
                <select className="v5-select" value={notifForm.status} onChange={(e) => setNotifForm({ ...notifForm, status: e.target.value })}>
                  {NOTIF_STATUSES.map((st) => <option key={st} value={st}>{st.toUpperCase()}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button type="button" className="btn btn--ghost" onClick={() => setEditingNotif(null)}>Cancel</button>
                <button type="submit" className="btn btn--dark">Save Notification</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Format Preview Modal */}
      {previewEmail && (
        <div className="v5-cmodal" onClick={() => setPreviewEmail(null)} role="dialog" aria-modal="true">
          <div className="v5-cmodal__card" style={{ maxWidth: "600px", width: "95%" }} onClick={(e) => e.stopPropagation()}>
            <div className="v5-cmodal__head">
              <h3>Email Preview · #{previewEmail.orderNumber}</h3>
              <button type="button" className="v5-cmodal__x" onClick={() => setPreviewEmail(null)}>×</button>
            </div>
            <div className="v5-cmodal__body">
              <div style={{ fontSize: "0.84rem", marginBottom: "12px", color: "var(--ink-soft)" }}>
                <div><b>To:</b> {previewEmail.recipient}</div>
                <div><b>Subject:</b> {previewEmail.subject}</div>
              </div>
              <div style={{ border: "1px solid var(--line)", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ background: "#0f172a", color: "#fff", padding: "18px", textAlign: "center" }}>
                  <div style={{ fontWeight: 800, letterSpacing: "0.08em", fontSize: "1.1rem" }}>THIRD BIOME</div>
                  <div style={{ display: "inline-block", marginTop: "6px", background: "#dcfce7", color: "#166534", padding: "3px 10px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 700 }}>
                    New Cash on Delivery Order
                  </div>
                </div>
                <div style={{ padding: "18px", fontSize: "0.86rem" }}>
                  <p style={{ marginTop: 0, fontWeight: 600 }}>A customer has successfully placed a Cash on Delivery order.</p>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr><td style={{ padding: "6px 0", color: "var(--ink-soft)" }}>Order ID</td><td><b>#{previewEmail.orderNumber}</b></td></tr>
                      {previewEmail.payload && (
                        <>
                          <tr><td style={{ padding: "6px 0", color: "var(--ink-soft)" }}>Customer</td><td>{previewEmail.payload.customerName} ({previewEmail.payload.customerPhone})</td></tr>
                          <tr><td style={{ padding: "6px 0", color: "var(--ink-soft)" }}>Email</td><td>{previewEmail.payload.customerEmail}</td></tr>
                          <tr><td style={{ padding: "6px 0", color: "var(--ink-soft)" }}>Products</td><td>{previewEmail.payload.itemsText}</td></tr>
                          <tr><td style={{ padding: "6px 0", color: "var(--ink-soft)" }}>COD Charges</td><td>{inr(previewEmail.payload.codFee)}</td></tr>
                          <tr><td style={{ padding: "6px 0", color: "var(--ink-soft)" }}>Address</td><td>{previewEmail.payload.address}</td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                  {previewEmail.payload && (
                    <div style={{ marginTop: "14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: "#166534", fontWeight: 700 }}>AMOUNT TO COLLECT</div>
                      <div style={{ fontSize: "1.4rem", color: "#14532d", fontWeight: 800 }}>{inr(previewEmail.payload.totalAmount)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password-Protected Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="v5-cmodal"
          onClick={() => !deleting && setDeleteTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm deletion with admin password"
        >
          <div
            className="v5-cmodal__card"
            style={{ maxWidth: "440px", width: "95%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="v5-cmodal__head">
              <h3 style={{ color: "#b3261e" }}>Confirm Deletion</h3>
              <button
                type="button"
                className="v5-cmodal__x"
                onClick={() => !deleting && setDeleteTarget(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form className="v5-cmodal__body" onSubmit={handleConfirmDelete} style={{ display: "grid", gap: "14px" }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--ink-soft)", lineHeight: 1.5 }}>
                You are about to permanently delete{" "}
                <b style={{ color: "var(--ink)" }}>
                  {deleteTarget.type === "order"
                    ? `Order #${deleteTarget.item.orderNumber}`
                    : `Notification #${deleteTarget.item.orderNumber}`}
                </b>
                . This action cannot be undone.
              </p>

              {deleteError && (
                <div className="admin-error-box" role="alert" style={{ margin: 0 }}>
                  <span>⚠️ {deleteError}</span>
                </div>
              )}

              <div className="v5-field">
                <label htmlFor="delete-admin-password">Enter Admin Password</label>
                <input
                  id="delete-admin-password"
                  type="password"
                  required
                  autoFocus
                  className="v5-input"
                  placeholder="••••••••••••"
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    if (deleteError) setDeleteError("");
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--dark"
                  style={{ background: "#b3261e", borderColor: "#b3261e" }}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Verify & Delete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
