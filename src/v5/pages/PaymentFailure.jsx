import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Arr } from "../components/ui";
import { payuService } from "../../services/paymentService";
import { getOrderByNumber } from "../../services/orderService";

const TRACK_STEPS = ["Paid", "Confirmed", "Packed", "Shipped", "Delivered"];

const statusPillStyle = (paymentStatus) =>
  paymentStatus === "paid"
    ? undefined
    : paymentStatus === "failed"
    ? { background: "color-mix(in srgb, #b3261e 12%, var(--panel))", color: "#b3261e" }
    : { background: "var(--card)", color: "var(--ink-soft)" };

export default function PaymentFailure() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const reason = params.get("reason");
  const orderNumber =
    sessionStorage.getItem("lastOrderNumber") || params.get("orderNumber");
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const doVerify = async () => {
      if (!orderNumber) return;
      try {
        setVerifying(true);
        await payuService.verify(orderNumber);
        try {
          const orderRes = await getOrderByNumber(orderNumber);
          const statusCandidate =
            orderRes?.data?.paymentStatus ||
            orderRes?.paymentStatus ||
            orderRes?.data?.order?.paymentStatus;
          if (statusCandidate) setPaymentStatus(statusCandidate);
        } catch {}
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
      <section className="sheet v5-page" data-screen-label="Payment failed">
        <div className="wrap">
          <span className="eyebrow">Payment</span>
          <h1>Payment <em style={{ color: "#b3261e" }}>Failed</em></h1>
          <p>Unfortunately, your payment could not be completed.</p>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body" data-screen-label="Payment failure details"><div className="wrap" style={{ maxWidth: "760px" }}>
        <div className="v5-order">
          <div className="v5-order__top">
            <div>
              <div className="v5-order__id">Order Number</div>
              <div style={{ fontWeight: 700, marginTop: "4px", fontSize: "1.1rem" }}>{orderNumber || ", "}</div>
            </div>
            {paymentStatus ? (
              <span className="v5-order__status" style={statusPillStyle(paymentStatus)}>{paymentStatus}</span>
            ) : (
              <span className="v5-order__status" style={{ background: "color-mix(in srgb, #b3261e 12%, var(--panel))", color: "#b3261e" }}>Failed</span>
            )}
          </div>
          <div className="v5-track">
            {TRACK_STEPS.map((label, i) => (
              <div className="v5-track__step" key={label}>
                <div className="v5-track__dot">{i + 1}</div>
                <div className="v5-track__l">{label}</div>
              </div>
            ))}
          </div>
          {reason && (
            <p style={{ fontSize: ".88rem", color: "var(--ink-soft)", marginTop: "16px" }}>Reason: {reason}</p>
          )}
          {verifying && (
            <p style={{ fontFamily: "var(--mono)", fontSize: ".66rem", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-soft)", marginTop: "16px" }}>
              Verifying payment with gateway...
            </p>
          )}
          {error && (
            <p style={{ fontSize: ".86rem", color: "#b3261e", marginTop: "16px" }}>{error}</p>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "26px" }}>
          <Link className="btn btn--dark" to="/checkout">Try Again <Arr /></Link>
          <Link className="btn btn--ghost" to="/">Back to Home</Link>
        </div>
      </div></section>
    </>
  );
}
