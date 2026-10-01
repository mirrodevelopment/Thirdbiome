import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartProvider";
import { inr, IMG } from "../data/content";
import couponService from "../../services/couponService";

/* The drawer auto-applies the pending coupon (set when the 3-month bundle
   is added, or typed manually). A discount is only ever shown after the
   backend confirms it, so the number here always matches checkout. */
export default function CartDrawer() {
  const { items, subtotal, setQty, remove, drawerOpen, closeDrawer } = useCart();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState("");
  const [codeBusy, setCodeBusy] = useState(false);
  const [applied, setApplied] = useState(null); // { code, amount } server-confirmed

  const discountAmount = (data, total) => {
    let amt = data.discountType === "percentage"
      ? (total * parseFloat(data.discountValue)) / 100
      : parseFloat(data.discountValue);
    if (data.maxDiscount) amt = Math.min(amt, parseFloat(data.maxDiscount));
    return Math.min(amt, total);
  };

  /* auto-apply the pending coupon whenever the drawer opens or the cart changes */
  useEffect(() => {
    let cancelled = false;
    const pending = sessionStorage.getItem("t3b_pending_coupon");
    if (!drawerOpen || !pending || subtotal <= 0) {
      if (!pending || subtotal <= 0) setApplied(null);
      return;
    }
    couponService.validateCoupon(pending, subtotal)
      .then((res) => {
        if (cancelled) return;
        if (res?.success && res?.data) {
          setApplied({ code: res.data.code || pending, amount: discountAmount(res.data, subtotal) });
          setCode(res.data.code || pending);
          setCodeMsg("");
        } else {
          setApplied(null);
        }
      })
      .catch(() => { if (!cancelled) setApplied(null); });
    return () => { cancelled = true; };
  }, [drawerOpen, subtotal]);

  const applyCode = async (e) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    setCodeBusy(true);
    setCodeMsg("");
    try {
      const res = await couponService.validateCoupon(trimmed, subtotal);
      if (res?.success && res?.data) {
        sessionStorage.setItem("t3b_pending_coupon", res.data.code || trimmed);
        setApplied({ code: res.data.code || trimmed, amount: discountAmount(res.data, subtotal) });
      } else {
        setApplied(null);
        setCodeMsg(res?.message || "That code didn't work.");
      }
    } catch (err) {
      setApplied(null);
      setCodeMsg(err?.message || "That code didn't work.");
    } finally {
      setCodeBusy(false);
    }
  };

  const removeCoupon = () => {
    sessionStorage.removeItem("t3b_pending_coupon");
    setApplied(null);
    setCode("");
    setCodeMsg("");
  };

  const displayTotal = Math.max(0, subtotal - (applied?.amount || 0));

  return (
    <>
      <div className={`v5-drawer-scrim${drawerOpen ? " on" : ""}`} onClick={closeDrawer} />
      <aside className={`v5-drawer${drawerOpen ? " on" : ""}`} aria-hidden={!drawerOpen}>
        <div className="v5-drawer__head">
          <h3>Your cart</h3>
          <button className="v5-drawer__close" onClick={closeDrawer} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="v5-drawer__body">
          {items.length === 0 ? (
            <div className="v5-drawer__empty">
              <p>Your cart’s as empty as it gets.</p>
              <Link className="btn btn--dark" style={{ marginTop: 16 }} to="/products/biome-balance" onClick={closeDrawer}>
                Shop Biome Balance
              </Link>
            </div>
          ) : items.map((it) => (
            <div className="v5-citem" key={it.id}>
              <div className="v5-citem__img"><img src={it.image || IMG.hero} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div>
                <div className="v5-citem__name">{it.name}</div>
                {it.selectedPlan && <div className="v5-citem__sub">{it.selectedPlan}</div>}
                <div className="v5-qty">
                  <button onClick={() => setQty(it.id, it.quantity - 1)} aria-label="Decrease">−</button>
                  <span>{it.quantity}</span>
                  <button onClick={() => setQty(it.id, it.quantity + 1)} aria-label="Increase">+</button>
                </div>
              </div>
              <div>
                <div className="v5-citem__price">{inr(it.price * it.quantity)}</div>
                <button className="v5-citem__rm" onClick={() => remove(it.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="v5-drawer__foot">
            {applied ? (
              <div className="v5-coupon-applied">
                <span className="v5-coupon-applied__l">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  <b>{applied.code}</b>
                  <span>−{inr(Math.round(applied.amount))}</span>
                </span>
                <button type="button" className="v5-coupon-applied__rm" onClick={removeCoupon}>Remove</button>
              </div>
            ) : (
              <form onSubmit={applyCode} style={{ display: "flex", gap: 8, margin: "4px 0 12px" }}>
                <input
                  className="v5-input"
                  style={{ flex: 1, padding: "10px 14px", fontSize: ".88rem" }}
                  placeholder="Discount code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button className="btn btn--ghost" type="submit" disabled={codeBusy} style={{ padding: ".6em 1.1em", fontSize: ".85rem" }}>
                  Apply
                </button>
              </form>
            )}
            {!applied && codeMsg && <p style={{ fontSize: ".78rem", color: "var(--ink-soft)", margin: "-6px 0 10px" }}>{codeMsg}</p>}

            <button
              className="btn btn--dark"
              style={{ width: "100%" }}
              onClick={() => { closeDrawer(); navigate("/checkout"); }}
            >
              Checkout · {inr(Math.round(displayTotal))}
            </button>
            <button
              className="v5-citem__rm"
              style={{ margin: "12px auto 0" }}
              onClick={() => { closeDrawer(); navigate("/cart"); }}
            >
              Review cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
