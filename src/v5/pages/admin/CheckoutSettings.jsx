import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../../components/Seo";
import { getAdminSession, adminLogout } from "../../../services/publicationService";
import {
  getCheckoutSettings,
  saveCheckoutSettings,
  DEFAULT_CHECKOUT_SETTINGS,
} from "../../../services/checkoutSettingsService";

export default function CheckoutSettings() {
  const [settings, setSettings] = useState(DEFAULT_CHECKOUT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    getAdminSession().then((session) => {
      if (!session) {
        navigate("/admin/login", { replace: true });
      } else {
        setUser(session);
        loadSettings();
      }
    });
  }, [navigate]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getCheckoutSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load checkout settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin/login");
  };

  const showFlash = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(""), 4000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...settings,
        codFee: Number(settings.codFee) || 0,
        minCodAmount: Number(settings.minCodAmount) || 0,
        maxCodAmount: Number(settings.maxCodAmount) || 50000,
      };
      await saveCheckoutSettings(payload);
      setSettings(payload);
      showFlash("Checkout settings saved successfully! Changes are live on the checkout page.");
    } catch (err) {
      alert("Failed to save checkout settings: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Seo
        title="Checkout Page Controls · Admin CMS"
        description="Configure payment options, Cash on Delivery, and checkout thresholds."
        noindex={true}
      />

      <section className="sheet sheet--pad admin-dashboard-sheet">
        <div className="wrap">
          {/* Top Admin Navigation Bar */}
          <div className="admin-topbar">
            <div className="admin-topbar__left">
              <span className="eyebrow dot-dark">Administrative Portal</span>
              <h1 className="admin-topbar__title">Store &amp; Checkout Controls</h1>
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
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
            <Link
              to="/admin/publications"
              className="btn btn--ghost"
              style={{ fontSize: "0.88rem", padding: "8px 18px" }}
            >
              📄 Scientific Publications
            </Link>
            <Link
              to="/admin/checkout-settings"
              className="btn btn--dark"
              style={{ fontSize: "0.88rem", padding: "8px 18px" }}
            >
              💳 Checkout &amp; Payment Controls
            </Link>
          </div>

          {actionMessage && (
            <div className="admin-flash-alert" role="status">
              <span>✓ {actionMessage}</span>
            </div>
          )}

          {/* Metrics Strip */}
          <div className="admin-metrics-row">
            <div className="admin-metric-card">
              <span className="admin-metric-card__val" style={{ color: settings.isCodEnabled ? "var(--green-d)" : "#b3261e" }}>
                {settings.isCodEnabled ? "ACTIVE" : "DISABLED"}
              </span>
              <span className="admin-metric-card__lbl">Cash On Delivery Status</span>
            </div>
            <div className="admin-metric-card">
              <span className="admin-metric-card__val">
                {Number(settings.codFee) > 0 ? `₹${settings.codFee}` : "FREE"}
              </span>
              <span className="admin-metric-card__lbl">COD Handling Fee</span>
            </div>
            <div className="admin-metric-card">
              <span className="admin-metric-card__val">
                ₹{settings.minCodAmount} – ₹{settings.maxCodAmount}
              </span>
              <span className="admin-metric-card__lbl">Order Value Range</span>
            </div>
            <div className="admin-metric-card admin-metric-card--action">
              <Link to="/checkout" target="_blank" className="btn btn--ghost" style={{ width: "100%", justifyContent: "center", fontSize: "0.88rem" }}>
                Preview Checkout Page ↗
              </Link>
            </div>
          </div>

          {/* Settings Form Container */}
          <div className="admin-form-container" style={{ background: "var(--card)", borderRadius: "20px", border: "1px solid var(--line)", padding: "32px" }}>
            {loading ? (
              <p style={{ color: "var(--ink-soft)" }}>Loading checkout configuration...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <section className="admin-form-section" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "24px", marginBottom: "28px" }}>
                  <div className="admin-form-section__header" style={{ marginBottom: "16px" }}>
                    <span className="admin-section-badge">01 · Cash on Delivery (COD) Control</span>
                    <h3 style={{ fontSize: "1.25rem", margin: "8px 0 4px" }}>Payment Method Availability</h3>
                    <p style={{ fontSize: "0.88rem", color: "var(--ink-soft)", margin: 0 }}>
                      Enable or disable the Cash on Delivery payment option on the customer checkout page.
                    </p>
                  </div>

                  <div style={{ padding: "16px", background: "var(--panel)", borderRadius: "14px", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <strong style={{ fontSize: "1rem", display: "block" }}>Enable Cash on Delivery (COD)</strong>
                      <span style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                        When enabled, customers can choose COD alongside PayU at checkout.
                      </span>
                    </div>
                    <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", position: "relative" }}>
                      <input
                        type="checkbox"
                        name="isCodEnabled"
                        checked={settings.isCodEnabled}
                        onChange={handleChange}
                        style={{ width: "22px", height: "22px", accentColor: "var(--green-d)" }}
                      />
                    </label>
                  </div>
                </section>

                <section className="admin-form-section" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "24px", marginBottom: "28px" }}>
                  <div className="admin-form-section__header" style={{ marginBottom: "16px" }}>
                    <span className="admin-section-badge">02 · COD Pricing &amp; Order Thresholds</span>
                    <h3 style={{ fontSize: "1.25rem", margin: "8px 0 4px" }}>Fee and Order Value Guardrails</h3>
                  </div>

                  <div className="admin-form-grid admin-form-grid--3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                    <div className="admin-form-group">
                      <label htmlFor="codFee">COD Handling Fee (₹)</label>
                      <input
                        id="codFee"
                        type="number"
                        name="codFee"
                        min="0"
                        step="1"
                        value={settings.codFee}
                        onChange={handleChange}
                        className="v5-input"
                        placeholder="0 for free"
                      />
                      <small style={{ color: "var(--ink-soft)", fontSize: "0.78rem" }}>
                        Additional convenience fee added to COD orders (0 = Free COD).
                      </small>
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="minCodAmount">Minimum Order for COD (₹)</label>
                      <input
                        id="minCodAmount"
                        type="number"
                        name="minCodAmount"
                        min="0"
                        step="1"
                        value={settings.minCodAmount}
                        onChange={handleChange}
                        className="v5-input"
                        placeholder="0"
                      />
                      <small style={{ color: "var(--ink-soft)", fontSize: "0.78rem" }}>
                        Cart subtotal must be at least this value to select COD.
                      </small>
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="maxCodAmount">Maximum Order for COD (₹)</label>
                      <input
                        id="maxCodAmount"
                        type="number"
                        name="maxCodAmount"
                        min="0"
                        step="100"
                        value={settings.maxCodAmount}
                        onChange={handleChange}
                        className="v5-input"
                        placeholder="50000"
                      />
                      <small style={{ color: "var(--ink-soft)", fontSize: "0.78rem" }}>
                        Safety ceiling to reduce transit risk for large ticket orders.
                      </small>
                    </div>
                  </div>
                </section>

                <section className="admin-form-section" style={{ marginBottom: "28px" }}>
                  <div className="admin-form-section__header" style={{ marginBottom: "16px" }}>
                    <span className="admin-section-badge">03 · Customer Messaging</span>
                    <h3 style={{ fontSize: "1.25rem", margin: "8px 0 4px" }}>Checkout Notices</h3>
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="codNotice">Doorstep Instruction Note</label>
                    <textarea
                      id="codNotice"
                      name="codNotice"
                      rows="3"
                      value={settings.codNotice}
                      onChange={handleChange}
                      className="v5-input"
                      style={{ width: "100%", padding: "10px" }}
                      placeholder="e.g. Pay in cash or UPI at your doorstep upon delivery."
                    />
                    <small style={{ color: "var(--ink-soft)", fontSize: "0.78rem" }}>
                      Displayed to customers on the checkout page when Cash on Delivery is selected.
                    </small>
                  </div>
                </section>

                <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end", borderTop: "1px solid var(--line)", paddingTop: "20px" }}>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={loadSettings}
                    disabled={saving}
                  >
                    Reset Changes
                  </button>
                  <button
                    type="submit"
                    className="btn btn--dark"
                    disabled={saving}
                  >
                    {saving ? "Saving Changes..." : "Save Checkout Settings"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
