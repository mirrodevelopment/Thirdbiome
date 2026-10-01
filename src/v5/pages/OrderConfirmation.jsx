import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Arr } from "../components/ui";
import Seo from "../components/Seo";
import { getOrderByNumber } from "../../services/orderService";
import { payuService } from "../../services/paymentService";
import { showToast } from "../../utils/toast";

const TRACK_STEPS = ["Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];

const statusPillStyle = (paid, failed) =>
  paid
    ? undefined
    : failed
    ? { background: "color-mix(in srgb, #b3261e 12%, var(--panel))", color: "#b3261e" }
    : { background: "var(--card)", color: "var(--ink-soft)" };

const DotCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
);

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!orderNumber) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Best-effort: confirm the payment with the gateway BEFORE reading the
        // order, so the stored paymentStatus we gate the UI on is up to date.
        try {
          await payuService.verify(orderNumber);
        } catch {
          // verification failure is non-fatal, the order status still gates the UI
        }
        // Get guest email from query param if present
        const params = new URLSearchParams(location.search);
        const guestEmail = params.get("email");
        const response = await getOrderByNumber(orderNumber, guestEmail);
        if (!cancelled) setOrder(response.data);
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load order details");
          showToast.error("Failed to load order details");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [orderNumber, location.search]);

  if (loading) {
    return (
      <section className="sheet v5-page" data-screen-label="Order confirmation, loading">
        <div className="wrap">
          <span className="eyebrow">Your order</span>
          <h1>One <em>moment.</em></h1>
          <p>Loading order details...</p>
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="sheet v5-page" data-screen-label="Order confirmation, error">
        <div className="wrap">
          <span className="eyebrow">Your order</span>
          <h1>Something went <em>wrong.</em></h1>
          <p>{error || "Order not found"}</p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "26px" }}>
            <button className="btn btn--dark" onClick={() => navigate("/")}>Go Home <Arr /></button>
          </div>
        </div>
      </section>
    );
  }

  // Resolve payment status, gate the success UI on it rather than assuming paid.
  const paymentStatus =
    order.paymentStatus || order.order?.paymentStatus || order.status || null;
  const isPaid = paymentStatus === "paid";
  const isFailed = ["failed", "cancelled", "canceled"].includes(paymentStatus);
  const statusLabel = isPaid ? "Confirmed" : isFailed ? "Payment failed" : "Payment pending";

  // Calculate totals, prefer the order's stored total, fall back to item sum.
  const subtotal = order.items?.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  ) || 0;
  const storedTotal = Number(order.totalAmount ?? order.total ?? order.order?.totalAmount);
  const total = Number.isFinite(storedTotal) && storedTotal > 0 ? storedTotal : subtotal;

  return (
    <>
      <Seo title={isPaid ? "Order confirmed" : "Order status"} />
      <section className="sheet v5-page" data-screen-label="Order confirmed">
        <div className="wrap">
          <span className="eyebrow">
            {isPaid ? "Order confirmed" : isFailed ? "Payment failed" : "Order received"}
          </span>
          <h1>
            {isPaid ? (
              <>Thank you for your <em>order!</em></>
            ) : isFailed ? (
              <>Payment <em>failed.</em></>
            ) : (
              <>Almost <em>there.</em></>
            )}
          </h1>
          <p>
            {isPaid
              ? "Done! Your gut’s going to be so proud of you. Our manager will contact you within 15 minutes."
              : isFailed
              ? "Your payment didn't go through. Please retry from your cart or contact support@thirdbiome.com."
              : "We're confirming your payment. This page updates once it's verified."}
          </p>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body" data-screen-label="Order details"><div className="wrap">
        <div className="v5-2col v5-2col--wideL">
          {/* Left, order card + track rail */}
          <div>
            <div className="v5-order">
              <div className="v5-order__top">
                <div>
                  <div className="v5-order__id">Your order</div>
                  <div style={{ fontWeight: 700, marginTop: "4px", fontSize: "1.1rem" }}>{order.orderNumber}</div>
                </div>
                <span className="v5-order__status" style={statusPillStyle(isPaid, isFailed)}>{statusLabel}</span>
              </div>
              <div className="v5-track">
                {TRACK_STEPS.map((label, i) => {
                  const done = i === 0 && isPaid;
                  return (
                    <div className={`v5-track__step${done ? " done" : ""}`} key={label}>
                      <div className="v5-track__dot">{done ? <DotCheck /> : i + 1}</div>
                      <div className="v5-track__l">{label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {!isPaid && (
              <div
                style={{
                  marginTop: "18px",
                  borderRadius: "var(--r)",
                  padding: "14px 18px",
                  background: isFailed
                    ? "color-mix(in srgb, #b3261e 8%, var(--panel))"
                    : "var(--card)",
                  border: isFailed
                    ? "1px solid color-mix(in srgb, #b3261e 30%, var(--line))"
                    : "1px solid var(--line)",
                }}
              >
                <p style={{ fontSize: ".88rem", fontWeight: 600, color: isFailed ? "#b3261e" : "var(--ink-soft)" }}>
                  {isFailed
                    ? "We couldn't confirm your payment for this order."
                    : "Your payment is still being confirmed. Refresh in a moment to see the latest status."}
                </p>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "18px" }}>
              <button className="btn btn--ghost" onClick={() => navigate("/")}>Continue Shopping</button>
              <button className="btn btn--dark" onClick={() => navigate("/cart")}>View Cart <Arr /></button>
            </div>
          </div>

          {/* Right, order summary */}
          <div className="v5-summary">
            <h3>{order.items.length} Items</h3>
            <div>
              {order.items?.map((item, index) => (
                <div className="v5-citem" key={item.variantId || item.id || index} style={{ padding: "16px 0" }}>
                  <div className="v5-citem__img" style={{ width: "56px", height: "66px" }}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/src/assets/imageTest.webp";
                        }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--ink-soft)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M6 7h12l1 13H5L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="v5-citem__name" style={{ fontSize: ".95rem" }}>{item.name || `Product ${index + 1}`}</div>
                    <div className="v5-citem__sub">{item.quantity}x</div>
                  </div>
                  <div className="v5-citem__price" style={{ fontSize: ".98rem" }}>
                    ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="v5-sumrow" style={{ borderTop: "1px solid var(--line)", marginTop: "4px", paddingTop: "14px" }}>
              <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="v5-sumrow v5-sumrow--total">
              <span>Total</span><span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div></section>
    </>
  );
}
