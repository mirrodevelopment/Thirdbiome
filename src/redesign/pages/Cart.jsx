import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCart, inr } from "../cart/CartContext";

const PROMOS = { T3B10: 0.1, GUT15: 0.15 };
const FREE_SHIP = 999;

const Tick = () => <Icon name="check" size={15} sw={2.4} />;

export default function Cart() {
  const { items, setQty, remove, toast } = useCart();
  const [promo, setPromo] = useState(null);
  const [code, setCode] = useState("");

  if (items.length === 0) {
    return (
      <main className="cartpage">
        <div className="wrap">
          <div className="cartempty">
            <div className="ic">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>Let’s fix that — one well-made postbiotic awaits.</p>
            <Link className="btn btn--lg" to="/products/biome-balance">
              Shop Biome Balance
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const count = items.reduce((s, i) => s + i.qty, 0);
  const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
  const disc = promo ? Math.round(sub * PROMOS[promo]) : 0;
  const ship = sub - disc >= FREE_SHIP ? 0 : 79;
  const total = sub - disc + ship;

  const applyPromo = () => {
    const v = code.trim().toUpperCase();
    if (PROMOS[v]) {
      setPromo(v);
      toast(`Promo ${v} applied`);
    } else {
      setPromo(null);
      toast("That code isn’t valid");
    }
  };

  return (
    <main className="cartpage">
      <div className="wrap">
        <div className="cartpage__head">
          <h1>Your cart</h1>
          <span className="cartpage__count">
            {count} item{count > 1 ? "s" : ""}
          </span>
        </div>
        <div className="cartgrid">
          <div>
            {items.map((it) => (
              <div className="cline" key={it.lineId}>
                <div className="cline__img">
                  <img src={it.img} alt="" />
                </div>
                <div>
                  <div className="cline__name">{it.name}</div>
                  <div className="cline__var">{it.variant}</div>
                  <div className="cline__qty">
                    <button onClick={() => setQty(it.lineId, -1)}>−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => setQty(it.lineId, 1)}>+</button>
                  </div>
                </div>
                <div className="cline__right">
                  <div className="cline__price">{inr(it.price * it.qty)}</div>
                  <button className="cline__rm" onClick={() => remove(it.lineId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <Link
              className="tlink"
              to="/shop"
              style={{ display: "inline-block", marginTop: 24, border: "none", color: "var(--ink-soft)" }}
            >
              ← Continue shopping
            </Link>
          </div>

          <aside className="csummary">
            <h3>Order summary</h3>
            <div className="cpromo">
              <input
                placeholder="Promo code (try T3B10)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyPromo()}
              />
              <button className="btn btn--sm" onClick={applyPromo}>
                Apply
              </button>
            </div>
            {promo && (
              <div className="crow disc" style={{ fontSize: ".84rem" }}>
                <Tick /> Code {promo} applied
              </div>
            )}
            <div className="crow">
              <span>Subtotal</span>
              <span>{inr(sub)}</span>
            </div>
            {disc > 0 && (
              <div className="crow disc">
                <span>Discount</span>
                <span>−{inr(disc)}</span>
              </div>
            )}
            <div className="crow">
              <span>Shipping</span>
              <span>{ship === 0 ? "Free" : inr(ship)}</span>
            </div>
            <div className="ctotal">
              <span>Total</span>
              <span>{inr(total)}</span>
            </div>
            <button
              className="btn btn--lg"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => toast("Checkout is a demo in this prototype")}
            >
              Checkout · {inr(total)}
            </button>
            <ul className="ctrust">
              <li>
                <Tick /> 30-day promise on every order
              </li>
              <li>
                <Tick /> Free shipping over ₹999 · ships in 24h
              </li>
              <li>
                <Tick /> Secure checkout · COD available
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
