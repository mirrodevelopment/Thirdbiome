import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { useCart, inr } from "../cart/CartContext";

export function CartDrawer() {
  const { items, subtotal, freeShip, drawerOpen, closeCart, setQty, remove } =
    useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeCart]);

  const remain = Math.max(0, freeShip - subtotal);
  const pct = Math.min(100, (subtotal / freeShip) * 100);

  return (
    <div
      className={`drawer${drawerOpen ? " open" : ""}`}
      onClick={(e) => e.target === e.currentTarget && closeCart()}
    >
      <div className="drawer__panel">
        <div className="drawer__head">
          <h3>Your cart</h3>
          <button className="drawer__close" aria-label="Close" onClick={closeCart}>
            <Icon name="close" size={24} sw={2.2} />
          </button>
        </div>

        {items.length > 0 && (
          <div className="drawer__ship">
            <div className="drawer__ship-t">
              {remain > 0 ? (
                <>
                  You’re {inr(remain)} away from <b>free shipping</b>
                </>
              ) : (
                <>
                  ✓ <b>Free shipping</b> — it’s on us
                </>
              )}
            </div>
            <div className="drawer__ship-bar">
              <span style={{ width: `${remain > 0 ? pct : 100}%` }} />
            </div>
          </div>
        )}

        <div className="drawer__body">
          {items.length === 0 ? (
            <div className="drawer__empty">
              <p>Your cart is empty.</p>
              <Link className="btn" to="/shop" onClick={closeCart}>
                Shop Biome Balance
              </Link>
            </div>
          ) : (
            items.map((it) => (
              <div className="dline" key={it.lineId}>
                <div className="dline__img">
                  <img src={it.img} alt="" />
                </div>
                <div className="dline__mid">
                  <div className="dline__name">{it.name}</div>
                  <div className="dline__var">{it.variant}</div>
                  <div className="dline__qty">
                    <button aria-label="Decrease" onClick={() => setQty(it.lineId, -1)}>
                      −
                    </button>
                    <span>{it.qty}</span>
                    <button aria-label="Increase" onClick={() => setQty(it.lineId, 1)}>
                      +
                    </button>
                  </div>
                </div>
                <div className="dline__right">
                  <div className="dline__price">{inr(it.price * it.qty)}</div>
                  <button className="dline__rm" onClick={() => remove(it.lineId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer__foot">
            <div className="drawer__sub">
              <span>Subtotal</span>
              <span>{inr(subtotal)}</span>
            </div>
            <Link
              className="btn btn--lg"
              to="/cart"
              onClick={closeCart}
              style={{ width: "100%", justifyContent: "center" }}
            >
              Checkout · {inr(subtotal)}
            </Link>
            <div className="drawer__note">
              Taxes &amp; shipping calculated at checkout · 30-day promise
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
