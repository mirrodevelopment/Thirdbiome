import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Arr } from "../components/ui";
import Seo from "../components/Seo";
import { track, PIXEL_PRODUCT } from "../lib/analytics";
import { payuService } from "../../services/paymentService";
import { getOrderByNumber } from "../../services/orderService";
import { getCart } from "../../services/cartService";
import { clearCart as clearCartAction } from "../../redux/slices/CartSlice";

const TRACK_STEPS = ["Paid", "Confirmed", "Packed", "Shipped", "Delivered"];

const DotCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
);

const statusPillStyle = (paymentStatus) =>
  paymentStatus === "paid"
    ? undefined
    : paymentStatus === "failed"
    ? { background: "color-mix(in srgb, #b3261e 12%, var(--panel))", color: "#b3261e" }
    : { background: "var(--card)", color: "var(--ink-soft)" };

export default function PaymentSuccess() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [cartRefreshed, setCartRefreshed] = useState(false);
  const purchaseFired = useRef(false); // guard so Purchase fires at most once

  const params = new URLSearchParams(location.search);
  const orderNumber =
    sessionStorage.getItem("lastOrderNumber") || params.get("orderNumber");

  // Cart refresh effect - runs immediately when component mounts
  useEffect(() => {
    const refreshCartAfterPayment = async () => {
      try {
        // Clear Redux state immediately
        dispatch(clearCartAction());

        // Wait a moment for backend to process
        setTimeout(async () => {
          await getCart();
          setCartRefreshed(true);
        }, 500);
      } catch (error) {
        // Still mark as refreshed to show UI feedback
        setCartRefreshed(true);
      }
    };

    // Refresh cart when component mounts (payment success)
    refreshCartAfterPayment();
  }, [dispatch]);

  // Payment verification effect
  useEffect(() => {
    const doVerify = async () => {
      if (!orderNumber) return;
      try {
        setVerifying(true);
        const res = await payuService.verify(orderNumber);
        setVerifyResult(res?.data || res);
        try {
          const orderRes = await getOrderByNumber(orderNumber);
          const statusCandidate =
            orderRes?.data?.paymentStatus ||
            orderRes?.paymentStatus ||
            orderRes?.data?.order?.paymentStatus;
          if (statusCandidate) setPaymentStatus(statusCandidate);

          // Fire Purchase once, only when the payment is verified paid.
          if (statusCandidate === "paid" && !purchaseFired.current) {
            purchaseFired.current = true;
            const charged = Number(res?.data?.amount ?? res?.amount);
            const orderTotal = Number(
              orderRes?.data?.totalAmount ??
                orderRes?.data?.order?.totalAmount ??
                orderRes?.totalAmount
            );
            const value =
              Number.isFinite(charged) && charged > 0
                ? charged
                : Number.isFinite(orderTotal) && orderTotal > 0
                ? orderTotal
                : undefined;
            track("Purchase", { ...PIXEL_PRODUCT, value, currency: "INR" });
          }
        } catch (orderError) {
          // Error fetching order details
        }
      } catch (e) {
        setError("Unable to verify payment at the moment.");
      } finally {
        setVerifying(false);
      }
    };
    doVerify();
  }, [orderNumber]);

  return (
    <>
      <Seo title="Payment successful" />
      <section className="sheet v5-page" data-screen-label="Payment success">
        <div className="wrap">
          <span className="eyebrow">Payment received</span>
          <h1>Payment <em>Successful</em></h1>
          <p>Thank you! Your payment has been received. We are processing your order.</p>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body" data-screen-label="Payment status"><div className="wrap" style={{ maxWidth: "760px" }}>
        <div className="v5-order">
          <div className="v5-order__top">
            <div>
              <div className="v5-order__id">Order Number</div>
              <div style={{ fontWeight: 700, marginTop: "4px", fontSize: "1.1rem" }}>{orderNumber || ", "}</div>
            </div>
            {paymentStatus ? (
              <span className="v5-order__status" style={statusPillStyle(paymentStatus)}>{paymentStatus}</span>
            ) : (
              <span className="v5-order__status" style={{ background: "var(--card)", color: "var(--ink-soft)" }}>Processing</span>
            )}
          </div>
          <div className="v5-track">
            {TRACK_STEPS.map((label, i) => {
              const done = i === 0 || (i === 1 && paymentStatus === "paid");
              return (
                <div className={`v5-track__step${done ? " done" : ""}`} key={label}>
                  <div className="v5-track__dot">{done ? <DotCheck /> : i + 1}</div>
                  <div className="v5-track__l">{label}</div>
                </div>
              );
            })}
          </div>
          {verifying && (
            <p style={{ fontFamily: "var(--mono)", fontSize: ".66rem", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-soft)", marginTop: "16px" }}>
              Verifying payment with gateway...
            </p>
          )}
          {error && (
            <p style={{ fontSize: ".86rem", color: "#b3261e", marginTop: "16px" }}>{error}</p>
          )}
        </div>

        {cartRefreshed && (
          <div style={{ background: "color-mix(in srgb, var(--green) 8%, var(--panel))", border: "1px solid color-mix(in srgb, var(--green) 30%, var(--line))", borderRadius: "var(--r)", padding: "14px 18px", marginTop: "14px" }}>
            <p style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--green-d)" }}>
              ✅ Your cart has been refreshed and your order is being processed
            </p>
          </div>
        )}

        {verifyResult && (
          <div style={{ marginTop: "18px" }}>
            <div className="v5-order__id" style={{ marginBottom: "8px" }}>Gateway Response</div>
            <pre style={{ fontFamily: "var(--mono)", fontSize: ".68rem", background: "var(--card)", borderRadius: "var(--r)", padding: "14px 16px", overflow: "auto", maxHeight: "256px", lineHeight: 1.5 }}>
              {JSON.stringify(verifyResult, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "26px" }}>
          <Link className="btn btn--dark" to="/">Continue Shopping <Arr /></Link>
        </div>
      </div></section>
    </>
  );
}
