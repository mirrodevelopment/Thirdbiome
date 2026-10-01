import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Botanicals } from "../components/Botanicals";
import { Marquee } from "../components/Marquee";
import { useCart } from "../cart/CartContext";
import { PRODUCT_IMG } from "../data/products";

const FILTERS = [
  { f: "all", label: "All" },
  { f: "now", label: "Available now" },
  { f: "sub", label: "Subscription" },
  { f: "soon", label: "In development" },
];

const CARDS = [
  {
    cat: "now",
    tag: { text: "Available now" },
    img: PRODUCT_IMG,
    name: "Biome Balance",
    for: "Foundational gut repair",
    desc: "The hero postbiotic. Thirdbiome GTB™ — 500 mg/day, delivered straight to the colon. Works from dose one.",
    href: "/products/biome-balance",
    price: "₹1,199",
    was: "₹1,499",
    add: {
      lineId: "biome-balance-once",
      id: "biome-balance",
      name: "Biome Balance",
      variant: "One-time · 30 capsules",
      price: 1499,
      img: PRODUCT_IMG,
    },
  },
  {
    cat: "now",
    tag: { text: "Best value", cls: "pcard__tag--gold" },
    img: PRODUCT_IMG,
    name: "3-Month Reset",
    for: "The honest minimum for gut repair",
    desc: "Three bottles of Biome Balance. The window most members feel the lining settle and digestion turn predictable.",
    href: "/products/biome-balance",
    price: "₹3,299",
    was: "₹4,497",
    add: {
      lineId: "biome-balance-3mo",
      id: "biome-balance",
      name: "Biome Balance · 3-Month Reset",
      variant: "90 capsules · 3 bottles",
      price: 3299,
      img: PRODUCT_IMG,
    },
  },
  {
    cat: "sub",
    tag: { text: "Membership" },
    img: PRODUCT_IMG,
    name: "T3B Club",
    for: "Doctor-guided · delivered monthly",
    desc: "Your Biome Balance on subscription, a 90-day protocol, and direct access to our medical team. Save 20%, cancel anytime.",
    href: "/t3b-club",
    priceNode: (
      <>
        ₹1,199
        <span style={{ fontSize: ".8rem", color: "var(--ink-soft)" }}>/mo</span>
      </>
    ),
    join: "/t3b-club",
  },
  {
    cat: "soon",
    tag: { text: "In development", cls: "pcard__tag--soon" },
    img: PRODUCT_IMG,
    dim: true,
    name: "Biome Calm",
    for: "Gut–brain axis · stress & sleep",
    desc: "A postbiotic built around the legitimate gut–brain route — vagal tone, neuroinflammation, butyrate on the brain. In formulation.",
  },
  {
    cat: "soon",
    tag: { text: "In development", cls: "pcard__tag--soon" },
    img: PRODUCT_IMG,
    dim: true,
    name: "Biome Cycle",
    for: "PMOS & metabolic support",
    desc: "PMOS (the new name for PCOS/PCOD) centres insulin resistance — exactly where butyrate plays. A women’s-health formula in research.",
  },
  {
    cat: "soon",
    tag: { text: "In development", cls: "pcard__tag--soon" },
    img: PRODUCT_IMG,
    dim: true,
    name: "Biome Glow",
    for: "Gut–skin axis",
    desc: "When the lining settles, skin often follows. A targeted postbiotic for the gut–skin connection — early research stage.",
  },
];

const REASSURANCE = [
  "30-day promise",
  "Free shipping over ₹999",
  "Made in a US FDA-registered facility",
  "Cancel anytime",
];

export default function Shop() {
  const { add } = useCart();
  const [filter, setFilter] = useState("all");

  const Media = ({ card }) => {
    const inner = (
      <>
        <span className={`pcard__tag ${card.tag.cls || ""}`.trim()}>
          {card.tag.text}
        </span>
        <img
          src={card.img}
          alt={card.name}
          style={card.dim ? { filter: "saturate(.85) opacity(.92)" } : undefined}
        />
      </>
    );
    return card.href ? (
      <Link to={card.href} className="pcard__media">
        {inner}
      </Link>
    ) : (
      <div className="pcard__media">{inner}</div>
    );
  };

  return (
    <main>
      <section className="phero">
        <Botanicals />
        <div className="wrap">
          <div className="kicker reveal">The shop</div>
          <h1 className="reveal">
            One formula.
            <br />
            <span className="em">Done right.</span>
          </h1>
          <p className="reveal">
            We’d rather make one postbiotic exceptionally well than ten
            supplements adequately. Biome Balance is live today — the rest of the
            protocol is in the lab, built on the same evidence-first standard.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="collfilter reveal">
            {FILTERS.map((f) => (
              <button
                key={f.f}
                className={filter === f.f ? "on" : ""}
                onClick={() => setFilter(f.f)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="pcards">
            {CARDS.filter((c) => filter === "all" || c.cat === filter).map((card) => (
              <article className="pcard reveal" key={card.name}>
                <Media card={card} />
                <div className="pcard__body">
                  <h3 className="pcard__name">{card.name}</h3>
                  <div className="pcard__for">{card.for}</div>
                  <p className="pcard__desc">{card.desc}</p>
                  <div className="pcard__foot">
                    {card.add ? (
                      <>
                        <div className="pcard__price">
                          {card.price} <s>{card.was}</s>
                        </div>
                        <button className="btn btn--sm" onClick={() => add(card.add)}>
                          Add
                        </button>
                      </>
                    ) : card.join ? (
                      <>
                        <div className="pcard__price">{card.priceNode}</div>
                        <Link className="btn btn--sm" to={card.join}>
                          Join
                        </Link>
                      </>
                    ) : (
                      <>
                        <span className="pcard__soon">Join the waitlist</span>
                        <Link className="btn btn--sm btn--ghost" to="/account">
                          Notify me
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight" style={{ background: "var(--sand)" }}>
        <div className="wrap">
          <Marquee className="ticker__in" >
            {REASSURANCE.map((t) => (
              <div className="ticker__item" key={t}>
                <Icon name="check" size={16} sw={2.5} /> {t}
              </div>
            ))}
          </Marquee>
        </div>
      </section>
    </main>
  );
}
