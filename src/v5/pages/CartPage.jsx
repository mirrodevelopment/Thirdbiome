import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Arr } from "../components/ui";
import Seo from "../components/Seo";
import { IMG, inr, FREE_SHIP_THRESHOLD } from "../data/content";
import { useCart } from "../cart/CartProvider";
import couponService from "../../services/couponService";

/* Mirror Checkout.jsx's coupon math so the cart preview matches what checkout will charge.
   Derived from the applied coupon each render so qty changes keep the discount honest. */
function couponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  let d = 0;
  if (coupon.discountType === "percentage") {
    d = (subtotal * parseFloat(coupon.discountValue)) / 100;
    if (coupon.maxDiscount && d > parseFloat(coupon.maxDiscount)) d = parseFloat(coupon.maxDiscount);
  } else {
    d = parseFloat(coupon.discountValue);
  }
  if (!Number.isFinite(d) || d < 0) d = 0;
  if (d > subtotal) d = subtotal;
  return d;
}

export default function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // local state only, checkout re-validates
  const [couponError, setCouponError] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);

  const freeShip = subtotal >= FREE_SHIP_THRESHOLD;
  const away = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
  // Checkout always ships free (single free shipping method), mirror that here
  // so the cart total matches what checkout charges.
  const shipping = 0;
  const discount = couponDiscount(appliedCoupon, subtotal);
  const total = Math.max(0, subtotal + shipping - discount);

  const clearCoupon = () => {
    setAppliedCoupon(null);
    sessionStorage.removeItem("t3b_pending_coupon");
  };

  const applyCoupon = async (e) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed || couponBusy) {
      if (!trimmed) setCouponError("Please enter a discount code");
      return;
    }
    setCouponBusy(true);
    setCouponError("");
    try {
      const res = await couponService.validateCoupon(trimmed, subtotal);
      if (res?.success && res.data) {
        setAppliedCoupon(res.data);
        if (res.data.code) sessionStorage.setItem("t3b_pending_coupon", res.data.code);
        setCode("");
      } else {
        setAppliedCoupon(null);
        setCouponError(res?.message || "Invalid coupon code");
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(typeof err === "string" ? err : err?.message || "Invalid coupon code");
    } finally {
      setCouponBusy(false);
    }
  };

  return (
    <section className="sheet sheet--pad v5-page-body" data-screen-label="Cart" style={{ background: "var(--panel)", paddingTop: "clamp(40px,6vw,72px)" }}>
      <Seo
        title="Cart"
        description="Review your Biome Balance order. Free shipping across India and secure checkout."
      />
      <div className="wrap">
        <span className="eyebrow">Your cart</span>
        <h1 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", margin: "12px 0 clamp(24px,3vw,36px)" }}>Almost there.</h1>

        {items.length > 0 ? (
          /* CART WITH ITEMS */
          <div className="v5-cart" id="cartLive">
            <div>
              <div className="v5-shipbar">
                <div className="v5-shipbar__txt" id="shipTxt">
                  {freeShip
                    ? <><span>🚚</span> You've unlocked <b>FREE shipping</b>, you saved ₹99.</>
                    : <><span>🚚</span> You're <b>{inr(away)}</b> away from <b>FREE shipping</b>.</>}
                </div>
                <div className="v5-shipbar__track"><div className="v5-shipbar__fill" id="shipFill" style={{ width: pct + "%" }} /></div>
              </div>

              {items.map((it) => (
                <div className="v5-citem" key={it.id}>
                  <div className="v5-citem__img">
                    <img src={it.image || IMG.hero} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <div className="v5-citem__name">{it.name}</div>
                    {it.selectedPlan && <div className="v5-citem__sub">{it.selectedPlan}</div>}
                    <div className="v5-citem__benefit">Works from dose one, no colonising required.</div>
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

            <aside>
              <div className="v5-summary">
                <h3>Order summary</h3>
                <div className="v5-sumrow"><span>Subtotal</span><span id="sumSub">{inr(subtotal)}</span></div>
                <div className="v5-sumrow"><span>Shipping</span><span className="free">FREE</span></div>

                {appliedCoupon ? (
                  <div className="v5-sumrow">
                    <span>
                      Discount · {appliedCoupon.code}
                      <button
                        onClick={clearCoupon}
                        aria-label="Remove coupon"
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", font: "inherit", fontSize: ".78rem", textDecoration: "underline", marginLeft: 8, padding: 0 }}
                      >Remove</button>
                    </span>
                    <span style={{ color: "var(--green)" }}>−{inr(discount)}</span>
                  </div>
                ) : (
                  <form onSubmit={applyCoupon} style={{ display: "flex", gap: 8, margin: "9px 0" }}>
                    <input
                      className="v5-input"
                      style={{ flex: 1, minWidth: 0, padding: "10px 14px", fontSize: ".9rem" }}
                      value={code}
                      onChange={(e) => { setCode(e.target.value); setCouponError(""); }}
                      placeholder="Promo code"
                      aria-label="Promo code"
                    />
                    <button className="btn btn--ghost" type="submit" disabled={couponBusy} style={{ padding: ".6em 1.2em", fontSize: ".85rem" }}>
                      {couponBusy ? "Checking…" : "Apply"}
                    </button>
                  </form>
                )}
                {couponError && <p style={{ fontSize: ".82rem", color: "#b3261e", margin: "0 0 6px" }}>{couponError}</p>}

                <div className="v5-sumrow v5-sumrow--total"><span>Total</span><span id="sumTotal">{inr(total)}</span></div>
                <button
                  className="btn btn--dark"
                  style={{ width: "100%", marginTop: 16 }}
                  disabled={items.length === 0}
                  onClick={() => navigate("/checkout")}
                >Checkout <Arr /></button>
                <div className="buy__meta" style={{ justifyContent: "center", marginTop: 14 }}>
                  <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 6 9 17l-5-5" /></svg> Secure payment</div>
                  <div><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg> COD available</div>
                </div>

              </div>
            </aside>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="v5-cart-empty" id="cartEmpty">
            <div style={{ fontSize: "2.4rem", marginBottom: 10 }}>🛒</div>
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: 10 }}>Your cart is empty.</h2>
            <p style={{ color: "var(--ink-soft)", maxWidth: "40ch", margin: "0 auto 22px" }}>Your cart’s as empty as it gets. Add Biome Balance whenever you’re ready.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn--dark" to="/products/biome-balance">Shop Biome Balance →</Link>
              <Link className="btn btn--ghost" to="/quiz">Find your fit</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
