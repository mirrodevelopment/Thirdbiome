import { useEffect, useRef, useState } from "react";
import { useCart } from "../cart/CartProvider";
import { inr, IMG } from "../data/content";

/* Glass sticky buy bar. Appears once the element matching `anchorId`
   scrolls past, hides near the footer. */
export default function StickyBuy({ anchorId, price = 1199, label = "Biome Balance", sub = "Subscribe", qty = 1, coupon = null, mobileOnly = false, buttonLabel = "Add to cart" }) {
  const { add, busy } = useCart();
  const handleAdd = () => {
    if (coupon) sessionStorage.setItem("t3b_pending_coupon", coupon);
    else sessionStorage.removeItem("t3b_pending_coupon");
    add({ quantity: qty });
  };
  const [on, setOn] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const check = () => {
      ticking.current = false;
      const anchor = document.getElementById(anchorId);
      if (!anchor) return setOn(false);
      const r = anchor.getBoundingClientRect();
      const past = r.bottom < 120;
      const nearFoot = document.body.scrollHeight - (window.scrollY + window.innerHeight) < 320;
      setOn(past && !nearFoot);
    };
    const onScroll = () => {
      if (!ticking.current) { ticking.current = true; requestAnimationFrame(check); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    check();
    return () => window.removeEventListener("scroll", onScroll);
  }, [anchorId]);

  return (
    <div className={`stickybuy${on ? " on" : ""}${mobileOnly ? " stickybuy--mobile-only" : ""}`}>
      <div className="stickybuy__in">
        <div className="stickybuy__l">
          <span className="imgslot stickybuy__shot" style={{ borderRadius: 8 }}>
            <img src={IMG.hero} alt="" />
          </span>
          <div>
            <div className="t">{label}</div>
            <div className="p">{inr(price)}{sub === "Subscribe" ? "/mo" : ""}</div>
          </div>
        </div>
        <button className="btn btn--dark" disabled={busy} onClick={handleAdd}>{busy ? "Adding…" : buttonLabel}</button>
      </div>
    </div>
  );
}
