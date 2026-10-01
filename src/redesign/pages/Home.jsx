import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon, Stars } from "../components/Icon";
import { Botanicals } from "../components/Botanicals";
import { Marquee } from "../components/Marquee";
import { useCart, inr } from "../cart/CartContext";
import { PRODUCT_IMG } from "../data/products";

const PLANS = {
  sub: { price: 1199, variant: "Subscription · monthly" },
  once: { price: 1499, variant: "One-time · 30 capsules" },
};

const GOALS = [
  "Bloating & heaviness",
  "Brain fog & focus",
  "Poor sleep",
  "Skin breakouts",
  "Low immunity",
  "Irregular digestion",
  "Sugar cravings & crashes",
  "PMOS & mood",
  "Stress & anxiety",
];

const CERTS = [
  "Patent-pending",
  "CTRI-registered RCT",
  "US FDA-registered facility",
  "WHO-GMP",
  "Veg · clean label",
];

export default function Home() {
  const { add } = useCart();
  const [plan, setPlan] = useState("once");
  const [goals, setGoals] = useState(() => new Set());
  const [sticky, setSticky] = useState(false);

  const price = PLANS[plan].price;

  const addToCart = () => {
    add({
      lineId: `biome-balance-${plan}`,
      id: "biome-balance",
      name: "Biome Balance",
      variant: PLANS[plan].variant,
      price,
      img: PRODUCT_IMG,
    });
  };

  const toggleGoal = (g) =>
    setGoals((prev) => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });

  // sticky buy bar: appears after the hero, hides near the footer
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearFoot =
        document.body.scrollHeight - (y + window.innerHeight) < 240;
      setSticky(y > 620 && !nearFoot);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <main id="top">
        {/* HERO */}
        <section className="hero">
          <Botanicals />
          <div className="wrap hero__grid">
            <div>
              <div className="eyebrow reveal">Trust the gut. Question the noise.</div>
              <h1 className="display reveal" style={{ marginTop: 14 }}>
                Gut repair,
                <br />
                finally <span className="em">measurable.</span>
              </h1>
              <p className="hero__sub lead reveal">
                One patent-pending postbiotic — Thirdbiome GTB™ — delivered
                straight to your colon, where it goes to work from the very first
                dose. No live bacteria to gamble on.
              </p>
              <div className="hero__cta reveal">
                <a className="btn btn--lg" href="#shop">
                  Shop Biome Balance
                </a>
                <Link className="btn btn--ghost btn--lg" to="/quiz">
                  Take the gut quiz
                </Link>
              </div>
              <div className="hero__proof reveal">
                <Stars label="4.8 out of 5" />
                <span className="pf">
                  <b>4.8/5</b> from early members
                </span>
                <span className="pf">
                  <b>+74%</b> stool butyrate in trial
                </span>
              </div>
            </div>
            <div className="hero__media reveal">
              <img
                className="px-img"
                src={PRODUCT_IMG}
                alt="Biome Balance — postbiotic formula"
              />
              <div className="hero__badge">
                <div className="ic">
                  <Icon name="shield" size={20} sw={2.2} />
                </div>
                <div>
                  <div className="t">Postbiotic formula</div>
                  <div className="d">Thirdbiome GTB™ · 500 mg</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CERT TICKER */}
        <div className="ticker">
          <div className="wrap">
            <Marquee className="ticker__in">
              {CERTS.map((c) => (
                <div className="ticker__item" key={c}>
                  <Icon name="check" size={16} sw={2.5} /> {c}
                </div>
              ))}
            </Marquee>
          </div>
        </div>

        {/* BENEFITS */}
        <section className="section" id="benefits">
          <div className="wrap">
            <div className="head reveal">
              <div className="eyebrow">Why postbiotics</div>
              <h2>
                Your gut runs on <span className="em">butyrate.</span> We deliver
                it directly.
              </h2>
              <p className="lead">
                Probiotics ask your gut to grow a garden. Postbiotics deliver the
                harvest — the finished compound your gut would make for itself.
              </p>
            </div>
            <div className="bens">
              {[
                {
                  ic: "lining",
                  h: "Repairs the lining",
                  p: "Butyrate tightens the junctions that seal a worn-down, “leaky” gut wall.",
                },
                {
                  ic: "bolt",
                  h: "Fuels colonocytes",
                  p: "It’s the primary fuel for the cells lining your large intestine.",
                },
                {
                  ic: "heart",
                  h: "Calms immune signals",
                  p: "Supports IL-10 and Treg pathways that keep gut inflammation in check.",
                },
                {
                  ic: "activity",
                  h: "Supports metabolism",
                  p: "Linked to insulin sensitivity — relevant to metabolic & PMOS goals.",
                },
              ].map((b) => (
                <div className="ben reveal" key={b.h}>
                  <div className="ic">
                    <Icon name={b.ic} size={22} />
                  </div>
                  <h3>{b.h}</h3>
                  <p>{b.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINDER */}
        <section className="section" id="finder" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="finder reveal">
              <div className="eyebrow" style={{ color: "var(--gold)" }}>
                The 30-second finder
              </div>
              <h2>
                What’s your gut <span className="em">working against?</span>
              </h2>
              <p>
                Tap what sounds like you. We’ll point you to the right starting
                protocol — no quiz fatigue, promise.
              </p>
              <div className="finder__goals">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    className="goal"
                    aria-pressed={goals.has(g)}
                    onClick={() => toggleGoal(g)}
                    dangerouslySetInnerHTML={{ __html: g.replace("&", "&amp;") }}
                  />
                ))}
              </div>
              <div className="finder__foot">
                <a className="btn" href="#shop">
                  See my recommendation
                </a>
                <span className="finder__count">
                  {goals.size === 0 ? (
                    "Select what applies to personalise it."
                  ) : (
                    <>
                      <b>{goals.size}</b> selected · Biome Balance is your
                      starting point.
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT / QUICK-BUY */}
        <section className="section" id="shop" style={{ paddingTop: 0 }}>
          <div className="wrap pdp">
            <div>
              <div className="gallery__main">
                <img src={PRODUCT_IMG} alt="Biome Balance" />
              </div>
            </div>
            <div className="pdp__info">
              <span className="stars" aria-label="4.8 of 5">
                ★★★★★{" "}
                <span
                  style={{
                    color: "var(--ink-soft)",
                    fontSize: ".82rem",
                    fontWeight: 600,
                    marginLeft: 6,
                  }}
                >
                  4.8 · 212 reviews
                </span>
              </span>
              <h2 className="pdp__title">Biome Balance</h2>
              <span className="pdp__ing">
                <span
                  className="dot"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--emerald)",
                    display: "inline-block",
                  }}
                />{" "}
                Postbiotic SCFA formula · Thirdbiome GTB™ + L-Glutamine + botanicals
              </span>
              <p className="pdp__desc">
                Foundational postbiotic gut support — Thirdbiome GTB™ for butyrate,
                L-Glutamine to rebuild the lining, and peppermint + fennel to calm
                digestion.
              </p>
              <ul className="pdp__list">
                <li>
                  <Icon name="check" size={18} sw={2.5} /> Works from dose one — no
                  colonising required
                </li>
                <li>
                  <Icon name="check" size={18} sw={2.5} /> 30 daily servings · one a day
                </li>
                <li>
                  <Icon name="check" size={18} sw={2.5} /> Vegetarian · made in a US
                  FDA-registered facility
                </li>
              </ul>
              <div className="buybox">
                <label
                  className={`opt${plan === "sub" ? " sel" : ""}`}
                  onClick={() => setPlan("sub")}
                >
                  <input type="radio" name="buy" checked={plan === "sub"} readOnly />
                  <span className="main">
                    <span className="t">
                      Subscribe &amp; save <span className="save">Best value</span>
                    </span>
                    <span className="d">₹1,199/mo · skip or cancel anytime</span>
                  </span>
                  <span className="p">₹1,199</span>
                </label>
                <label
                  className={`opt${plan === "once" ? " sel" : ""}`}
                  onClick={() => setPlan("once")}
                >
                  <input type="radio" name="buy" checked={plan === "once"} readOnly />
                  <span className="main">
                    <span className="t">One-time purchase</span>
                    <span className="d">A single 30-day bottle</span>
                  </span>
                  <span className="p">₹1,499</span>
                </label>
                <div className="buybox__cta">
                  <button className="btn btn--lg" onClick={addToCart}>
                    Add to cart · <span>{inr(price)}</span>
                  </button>
                </div>
                <div className="buybox__meta">
                  <div>
                    <Icon name="check" size={15} /> 30-day promise
                  </div>
                  <div>
                    <Icon name="clock" size={15} /> Ships in 24h
                  </div>
                  <div>
                    <Icon name="shield" size={15} /> Cancel anytime
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MECHANISM */}
        <section className="section" id="how" style={{ background: "var(--sand)" }}>
          <div className="wrap">
            <div className="head reveal">
              <div className="eyebrow">How Thirdbiome GTB™ works</div>
              <h2>
                One molecule. <span className="em">Three jobs.</span>
              </h2>
              <p className="lead">
                Micro-encapsulated glyceryl tributyrate, engineered for every step
                of the journey.
              </p>
            </div>
            <div className="mech">
              <div className="mstep reveal">
                <h3>Survives the journey</h3>
                <p>
                  A pH-targeted capsule carries GTB past stomach acid — the leg of
                  the trip where most gut actives are lost.
                </p>
              </div>
              <div className="mstep reveal">
                <h3>Releases at the colon</h3>
                <p>
                  Right where it matters, lipases free <b>butyrate</b> — the
                  short-chain fatty acid your large-intestine cells run on.
                </p>
              </div>
              <div className="mstep reveal">
                <h3>Repairs &amp; calms</h3>
                <p>
                  Butyrate fuels colonocytes, tightens a leaky lining, and signals
                  immune calm via IL-10 and Treg cells.
                </p>
              </div>
            </div>
            <p className="mech__note reveal">
              Butyrate can also cross the blood–brain barrier to act on microglia
              and BDNF — the real, evidence-backed route between a calmer gut and a
              clearer head. <b>The science here is strong and still growing.</b>
            </p>
          </div>
        </section>

        {/* EVIDENCE */}
        <section
          className="section"
          id="evidence"
          style={{ paddingTop: "clamp(40px,6vw,80px)" }}
        >
          <div className="wrap">
            <div className="evi reveal">
              <div className="evi__grid">
                <div>
                  <span className="evi__code">CTRI/2025/09/094597</span>
                  <div
                    className="eyebrow"
                    style={{ color: "var(--gold)", marginTop: 16 }}
                  >
                    The evidence
                  </div>
                  <h2>
                    Shown <span className="em">honestly.</span>
                  </h2>
                  <p>
                    A randomised, double-blind trial ran Thirdbiome GTB against a
                    probiotic and a combination formula over 45 days. The GTB arm
                    raised stool butyrate — the biomarker that matters — by 74%,
                    with IBS-SSS and GSRS scores improving alongside.
                  </p>
                  <p className="evi__disclose">
                    The fine print: 30 participants across 3 active arms (~10
                    each), so we report results as <i>numerically greater</i>, not
                    “double.” There was no placebo arm — and IBS placebo response
                    runs 30–40% — so a larger, multi-centre trial is already in
                    planning.
                  </p>
                </div>
                <div className="evi__metrics">
                  {[
                    ["+74%", "stool butyrate in the GTB arm"],
                    ["N=30", "randomised, double-blind"],
                    ["45 days", "trial duration"],
                    ["3 arms", "active-controlled, no placebo"],
                  ].map(([n, l]) => (
                    <div className="emetric" key={l}>
                      <div className="n">{n}</div>
                      <div className="l">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="head reveal">
              <div className="eyebrow">Probiotic vs postbiotic</div>
              <h2>
                Probiotics hope. <span className="em">Postbiotics arrive.</span>
              </h2>
              <p className="lead">
                Both are after the same thing — a calmer, better-sealed gut. The
                difference is whether it has to survive your stomach to get there.
              </p>
            </div>
            <div className="ctable reveal" style={{ marginTop: 34 }}>
              <div className="crow crow--head">
                <div>Question</div>
                <div className="pro">Probiotic</div>
                <div className="post">Postbiotic (us)</div>
              </div>
              {[
                [
                  "Survives stomach acid?",
                  "Rarely — most strains die first",
                  "Micro-encapsulated to arrive intact",
                ],
                [
                  "Needs an existing microbiome?",
                  "Yes — relies on your bacteria",
                  "No — acts directly as the finished compound",
                ],
                [
                  "Has to colonise first?",
                  "Yes — results vary",
                  "No — works on arrival",
                ],
                [
                  "Consistent dose to dose?",
                  "Drifts with heat, storage, time",
                  "Defined 500 mg, every time",
                ],
                [
                  "Honest evidence?",
                  "Often broad & strain-agnostic",
                  "Registered RCT — limits disclosed",
                ],
              ].map(([q, pro, post]) => (
                <div className="crow" key={q}>
                  <div className="q">{q}</div>
                  <div className="pro">{pro}</div>
                  <div className="post">
                    <span className="mk">✓</span>
                    {post}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="section" id="reviews" style={{ background: "var(--mist)" }}>
          <div className="wrap">
            <div className="head head--center reveal">
              <div className="eyebrow">Real guts, real talk</div>
              <h2>Loved by early members</h2>
            </div>
            <div className="revs">
              {[
                [
                  "R",
                  "Riya M.",
                  "The bloating eased in the first week — and I finally stopped feeling foggy by mid-afternoon.",
                ],
                [
                  "A",
                  "Arjun S.",
                  "What sold me was the honesty — they show the actual trial and its limits. Rare in this space.",
                ],
                [
                  "N",
                  "Neha K.",
                  "One capsule, no 12-step routine. My digestion is finally predictable again.",
                ],
              ].map(([av, nm, quote]) => (
                <div className="rev reveal" key={nm}>
                  <Stars />
                  <p>“{quote}”</p>
                  <div className="who">
                    <div className="av">{av}</div>
                    <div>
                      <div className="nm">{nm}</div>
                      <div className="vf">
                        <Icon name="check" size={13} sw={3} /> Verified member
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLUB */}
        <section className="section" id="club">
          <div className="wrap">
            <div className="club reveal">
              <div>
                <div className="eyebrow">Membership</div>
                <h2>The T3B Club</h2>
                <ul>
                  {[
                    "A doctor-guided, 90-day postbiotic protocol tailored to your gut.",
                    "Your Biome Balance, delivered monthly — never run out.",
                    "Weekly check-ins and the science in plain English.",
                    "Direct access to our medical team when you need a real answer.",
                  ].map((t) => (
                    <li key={t}>
                      <Icon name="check" size={20} sw={2.4} /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="club__card">
                <div className="eyebrow">Join the club</div>
                <div className="price">
                  ₹1,199
                  <span style={{ fontSize: "1rem", color: "var(--ink-soft)" }}>
                    /mo
                  </span>
                </div>
                <div className="per">Cancel anytime · save 20% vs one-off</div>
                <Link
                  className="btn btn--lg"
                  to="/t3b-club"
                  style={{ marginTop: 20, width: "100%", justifyContent: "center" }}
                >
                  Start my protocol
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky buy bar */}
      <div className={`stickybuy${sticky ? " show" : ""}`}>
        <div className="wrap stickybuy__in">
          <div className="stickybuy__l">
            <img src={PRODUCT_IMG} alt="" />
            <div className="meta">
              <div className="t">Biome Balance</div>
              <div className="p">
                {plan === "sub" ? "Subscribe · " : "One-time · "}
                <span>{inr(price)}</span>
                {plan === "sub" ? "/mo" : ""}
              </div>
            </div>
          </div>
          <button className="btn" onClick={addToCart}>
            Add to cart
          </button>
        </div>
      </div>
    </>
  );
}
