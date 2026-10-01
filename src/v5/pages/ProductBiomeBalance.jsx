import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Shot, AccItem } from "../components/ui";
import { IMG, PLANS, inr } from "../data/content";
import { useCart } from "../cart/CartProvider";
import StickyBuy from "../components/StickyBuy";
import Seo from "../components/Seo";
import PdpWelcomeOffer from "../components/PdpWelcomeOffer";
import ProductReviews from "../components/ProductReviews";
import { track, PIXEL_PRODUCT } from "../lib/analytics";
import biomeProductVideo from "../assets/biome-product-video.mp4";
import biomeVideoPoster from "../assets/biome-video-poster.jpg";

/* The buy box offers 30-, 60-, and 90-day quantities. A 3-bottle bundle
   receives the existing BUY3 offer; there is no recurring billing. */
const onetime = PLANS.find((p) => p.key === "onetime");

/* Monthly subscription hidden for now (no recurring billing in the backend).
   The 3-month bundle adds qty 3 of the live product; its 20% discount rides
   the BUY3 coupon, auto-applied at checkout via t3b_pending_coupon. */
const PDP_PLANS = [
  {
    key: "3month",
    reco: "Clinically recommended",
    t: "3-month bundle",
    d: "Save 20% · 90 capsules · 3 bottles · one-time bundle",
    price: 2878,
    was: 3597,
    perday: "₹32/day",
    qty: 3,
    coupon: "BUY3",
    feats: ["20% off", "Free delivery", "Free steel travel capsule"],
    sticky: "3-month · best value",
  },
  {
    key: "2month",
    t: "2-month supply",
    d: "60-day supply · 2 bottles",
    price: onetime.price * 2,
    was: null,
    perday: "₹40/day",
    qty: 2,
    coupon: null,
    feats: ["Free delivery"],
    sticky: "2-month supply",
  },
  {
    key: "onetime",
    t: "1-month supply",
    d: "A single 30-day bottle · 30 capsules",
    price: onetime.price,
    was: onetime.was,
    perday: "₹40/day",
    qty: 1,
    feats: null,
    sticky: "1-month",
  },
];

/* Keep five gallery stops; the final slot is the product demonstration video. */
const PRODUCT_CAROUSEL_VIDEO = biomeProductVideo;
const GALLERY = [IMG.hero, IMG.skuPostbiotics, IMG.skuClinical, IMG.skuResults, PRODUCT_CAROUSEL_VIDEO];

export default function ProductBiomeBalance() {
  const { add, busy } = useCart();
  const [thumb, setThumb] = useState(0);
  const trackRef = useRef(null);
  const productVideoRef = useRef(null);
  const [planKey, setPlanKey] = useState(PDP_PLANS[0].key);
  const sel = PDP_PLANS.find((p) => p.key === planKey);

  useEffect(() => { track("ViewContent", { ...PIXEL_PRODUCT }); }, []);

  return (
    <>
      <Seo title="Biome Balance" description="Biome Balance: a proprietary postbiotic (Thirdbiome GTB, 500mg/day) that reaches your colon intact and works from the first dose. One ingredient, clinically studied." />
      {/* PDP */}
      <section className="sheet sheet--pad" data-screen-label="Product">
        <div className="wrap">
          <Link className="pdp__return" to="/"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M11 6l-6 6 6 6" /></svg> Back to shop</Link>
          <div className="pdp">
            {/* GALLERY (swipeable snap carousel, thumbs stay in sync) */}
            <div className="pdp__gallery">
              <div className="pdp__main">
                <div
                  className="pdp__track"
                  ref={trackRef}
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const i = Math.round(el.scrollLeft / el.clientWidth);
                    if (i !== thumb) setThumb(i);
                    if (i === GALLERY.length - 1 && productVideoRef.current?.paused) {
                      productVideoRef.current?.play().catch(() => {});
                    } else if (productVideoRef.current && i !== GALLERY.length - 1) {
                      productVideoRef.current.pause();
                      productVideoRef.current.currentTime = 0;
                    }
                  }}
                >
                  {GALLERY.map((src, i) => (
                    <div className="pdp__slide" key={i}>
                      {i === 0 && (
                        <>
                          <span className="tag tag--glass">Bestseller</span>
                          <div className="pdp__badge-shield" aria-label="Clinically tested postbiotic">
                            <svg className="badge-shield__bg" viewBox="0 0 120 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <linearGradient id="goldShieldGrad" x1="10%" y1="0%" x2="90%" y2="100%">
                                  <stop offset="0%" stopColor="#f2e0ad" />
                                  <stop offset="35%" stopColor="#e2c786" />
                                  <stop offset="70%" stopColor="#cca75e" />
                                  <stop offset="100%" stopColor="#b89040" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M10 0 H110 C115.5 0 120 4.5 120 10 V90 C120 114 60 142 60 142 C60 142 0 114 0 90 V10 C0 4.5 4.5 0 10 0 Z"
                                fill="url(#goldShieldGrad)"
                              />
                            </svg>
                            <div className="badge-shield__content">
                              <svg className="badge-shield__icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
                              </svg>
                              <span className="badge-shield__title">Clinically<br />Tested</span>
                              <span className="badge-shield__sub">Postbiotic</span>
                              <div className="badge-shield__divider" />
                              <span className="badge-shield__proof">CTRI Trial</span>
                            </div>
                          </div>
                        </>
                      )}
                      {i === GALLERY.length - 1 ? (
                        <video ref={productVideoRef} className="pdp__video" muted loop playsInline preload="none" poster={biomeVideoPoster} aria-label="Biome Balance product video">
                          <source src={src} type="video/mp4" />
                          Your browser does not support video playback.
                        </video>
                      ) : <Shot className="imgfill" eager={i === 0} src={src} alt={`Third Biome Biome Balance postbiotic capsules, view ${i + 1}`} />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="buy__thumbs" id="pdpThumbs" style={{ marginTop: 12 }}>
                {GALLERY.map((src, i) => (
                  <button
                    key={i}
                    className={thumb === i ? "active" : undefined}
                    aria-label={i === GALLERY.length - 1 ? "Play product video" : `Show product image ${i + 1}`}
                    onClick={() => {
                      setThumb(i);
                      const t = trackRef.current;
                      if (t) {
                        t.scrollTo({ left: i * t.clientWidth, behavior: "smooth" });
                      }
                      if (i === GALLERY.length - 1) {
                        productVideoRef.current?.play().catch(() => {});
                      } else if (productVideoRef.current) {
                        productVideoRef.current.pause();
                        productVideoRef.current.currentTime = 0;
                      }
                    }}
                    style={{ position: "relative", overflow: "hidden" }}
                  >
                  {i === GALLERY.length - 1
                    ? <span className="pdp-video-thumb"><Shot className="imgfill" src={biomeVideoPoster} alt="" /><span className="pdp-video-thumb__play" aria-hidden="true">▶</span></span>
                    : <Shot className="imgfill" src={src} alt={`Third Biome Biome Balance postbiotic capsules, view ${i + 1}`} />}
                  </button>
                ))}
              </div>
              <div className="acc pdp__acc pdp__gallery-acc">
                <AccItem q="Why choose the 3-month bundle?" defaultOpen><p>It includes three 30-day bottles and saves 20% compared with buying three bottles separately. This is a one-time bundle, not a recurring subscription.</p></AccItem>
                <AccItem q="Clinically studied benefits"><p>In our registered, randomised, double-blinded RCT (CTRI/2025/09/094597), the GTB arm raised stool butyrate by 74% over 45 days, with digestive symptom scores significantly improving alongside.</p></AccItem>
                <AccItem q="How to take"><p>One to two capsules daily with water, any time of day, with or without food. Consistency matters more than timing, take it at the same moment each day to build the habit.</p></AccItem>
                <AccItem q="Ingredients"><p>Thirdbiome GTB™ (micro-encapsulated glyceryl tributyrate) 500 mg. Vegetarian capsule (HPMC). Made in a US FDA-registered, WHO-GMP facility.</p></AccItem>
              </div>
            </div>

            {/* INFO (sticky) */}
            <div className="pdp__info" id="pdpInfo">
              <div className="pdp__head">
                <h1 className="pdp__title">Biome Balance <span className="tag tag--dark">New</span></h1>
                <div className="pdp__price"><span id="headPrice">{inr(sel.price)}</span><s id="headWas">{sel.was ? inr(sel.was) : ""}</s></div>
              </div>
              <div className="pdp__stars">
                <a href="#reviews" aria-label="Read 212 verified reviews">
                  <b aria-hidden="true">★★★★★</b> <span className="pdp__rating-score">4.8</span><span className="pdp__review-meta"> · <span className="pdp__verified-count">212 verified reviews</span></span>
                </a>
              </div>
              <div className="pdp__desc-wrap">
                <p className="pdp__claim-disclaimer">Claims are ingredient-based and not for the product. Images are for illustration purpose only**</p>
                
                <p className="pdp__desc">
                  One daily capsule of GTB™, a clinically studied postbiotic that fuels your gut lining, supports regularity, and relieves occasional bloating without live bacterial die-off.
                </p>

                <div className="pdp__benefit-grid" aria-label="Product Benefits">
                  <div className="pdp-bitem">
                    <span className="pdp-bitem__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 6a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V6Z" />
                        <path d="M5 14a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-2Z" />
                        <circle cx="12" cy="7" r="1" fill="currentColor" />
                        <circle cx="9" cy="15" r="1" fill="currentColor" />
                        <circle cx="15" cy="15" r="1" fill="currentColor" />
                      </svg>
                    </span>
                    <span className="pdp-bitem__label">Promotes Healthy<br />Gut Microbiome<sup>1</sup></span>
                  </div>

                  <div className="pdp-bitem">
                    <span className="pdp-bitem__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H9Z" />
                        <path d="M6 14a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-1a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v1Z" />
                        <path d="M12 21v-4" />
                      </svg>
                    </span>
                    <span className="pdp-bitem__label">Relieves Constipation,<br />Bloating & IBS<sup>2</sup></span>
                  </div>

                  <div className="pdp-bitem">
                    <span className="pdp-bitem__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                        <path d="M9 12h6M12 9v6" />
                      </svg>
                    </span>
                    <span className="pdp-bitem__label">Strengthens Gut<br />Barrier<sup>3</sup></span>
                  </div>

                  <div className="pdp-bitem">
                    <span className="pdp-bitem__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </span>
                    <span className="pdp-bitem__label">Improves Gut<br />Immune Function<sup>4</sup></span>
                  </div>

                  <div className="pdp-bitem">
                    <span className="pdp-bitem__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9Z" />
                        <path d="M8 11.5c.5.5 1.5.5 2 0M14 11.5c.5.5 1.5.5 2 0" />
                        <path d="M9 15.5c1.5 1 4.5 1 6 0" />
                        <path d="M19 5l1.5-1.5M20.5 5L19 3.5" />
                      </svg>
                    </span>
                    <span className="pdp-bitem__label">Promotes Healthy<br />Gut-Skin Axis<sup>5</sup></span>
                  </div>

                  <div className="pdp-bitem">
                    <span className="pdp-bitem__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a6 6 0 0 0-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 0 0-6-6Z" />
                        <circle cx="12" cy="8" r="2" fill="currentColor" />
                        <path d="M4 14a8 8 0 0 0 16 0" strokeDasharray="2 2" />
                      </svg>
                    </span>
                    <span className="pdp-bitem__label">Maximizes Nutrient<br />Absorption<sup>6</sup></span>
                  </div>
                </div>

                <div className="pdp__meta-pills">
                  <span className="pdp-meta-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="5" y="4" width="14" height="16" rx="4" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    {planKey === "3month" ? "90 capsules (3 bottles)" : planKey === "2month" ? "60 capsules (2 bottles)" : "30 capsules per bottle"}
                  </span>
                  <span className="pdp-meta-pill pdp-meta-pill--mint">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12A10 10 0 0 1 12 2Z" fill="currentColor" fillOpacity=".12" />
                      <path d="M8 16c1.5-2 3.5-3.5 6-4-1-2.5-2.5-4.5-4.5-6C8 9 7.5 12 8 16Z" />
                      <path d="M8 16c4-2 6-4 7-8" />
                    </svg>
                    Mint Essenced
                  </span>
                </div>
              </div>

              <div className="subs" id="subs">
                {PDP_PLANS.map((p) => (
                  <label key={p.key} className={`sopt${planKey === p.key ? " sel" : ""}`} data-price={p.price} data-was={p.was || ""}>
                    {p.reco && <span className="reco">{p.reco}</span>}
                    <span className="sopt__top">
                      <input type="radio" name="plan" checked={planKey === p.key} onChange={() => setPlanKey(p.key)} />
                      <span><span className="t">{p.t}</span><span className="d">{p.d}</span></span>
                      <span className="p">{inr(p.price)}{p.was ? <s>{inr(p.was)}</s> : null}<span className="perday">{p.perday}</span></span>
                    </span>
                    {p.feats && (
                      <span className="sopt__feats">{p.feats.map((f, i) => <span key={i}>{f}</span>)}</span>
                    )}
                  </label>
                ))}
              </div>

              <button
                className="btn btn--dark pdp__bag"
                id="addBag"
                disabled={busy}
                onClick={() => {
                  if (sel.coupon) sessionStorage.setItem("t3b_pending_coupon", sel.coupon);
                  else sessionStorage.removeItem("t3b_pending_coupon");
                  add({ quantity: sel.qty || 1 });
                }}
              >Start my gut reset</button>
              <div className="pdp__deliver">30-day money-back guarantee · Free shipping across India</div>

              <div className="pdp__benefits">
                <h2>Benefits</h2>
                <ul className="pdp__list">
                  <li>Stool butyrate increased 74% in the GTB study.</li>
                  <li>Digestive symptom scores improved during the study.</li>
                  <li>Energy and sleep domains improved during the study.</li>
                </ul>
                <Link className="pdp__proof" to="/evidence#clinical-trial">View the study <span aria-hidden="true">→</span></Link>
              </div>
              <Link className="pdp__authority" to="/science#study">
                <span className="pdp__authority-icon" aria-hidden="true">✓</span>
                <span><b>Study reference</b><small>CTRI/2025/09/094597 · 45 days · see study limits</small></span>
                <span aria-hidden="true">→</span>
              </Link>

              <div className="pdp__facts" style={{ marginTop: 20 }}>
                <div className="pfact">
                  <span className="pfact__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l3 8 4-16 3 8h4" /></svg></span>
                  <b>Digestive symptoms improved<sup><a href="/evidence#clinical-trial" aria-label="Evidence source 1">1</a></sup></b>
                  <span>Reported in the 45-day GTB study.</span>
                </div>
                <div className="pfact">
                  <span className="pfact__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="m9 14 2 2 4-4" /></svg></span>
                  <b>Energy and sleep domains improved<sup><a href="/evidence#clinical-trial" aria-label="Evidence source 2">2</a></sup></b>
                  <span>Reported in the 45-day GTB study.</span>
                </div>
                <div className="pfact">
                  <span className="pfact__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg></span>
                  <b>Stool butyrate rose 74%<sup><a href="/evidence#clinical-trial" aria-label="Evidence source 3">3</a></sup></b>
                  <span>GTB arm, over 45 days.</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES (mechanism split) */}
      <section className="sheet sheet--pad" data-screen-label="What it does">
        <div className="wrap">
          <div className="split">
            <div className="split__media"><Shot className="imgfill" src={IMG.linen} alt="Biome Balance capsule, macro" /></div>
            <div className="split__copy" data-reveal="">
              <span className="eyebrow">What it does inside you</span>
              <h2>One capsule. <em>Three jobs.</em></h2>
              <p style={{ color: "var(--ink-soft)", marginTop: 14 }}>Butyrate is the compound a healthy gut makes for itself. Biome Balance delivers it directly, so it goes to work on the gut lining from the very first dose.</p>
              <div className="pdp-mech">
                <div className="mech"><div className="mech__n">01</div><div><div className="mech__t">Repairs the gut lining</div><p className="mech__d">The raw material for tight-junction repair, sealing the gaps behind <b>"leaky gut"</b> so the barrier between gut and bloodstream holds.</p></div></div>
                <div className="mech"><div className="mech__n">02</div><div><div className="mech__t">Fuels your colon cells</div><p className="mech__d">Colonocytes draw <b>~70% of their energy</b> from butyrate. Fed, the lining regenerates faster and digestion steadies.</p></div></div>
                <div className="mech"><div className="mech__n">03</div><div><div className="mech__t">Calms the signals</div><p className="mech__d">Dials down inflammatory signalling <b>(TNF-α)</b> in the gut wall, easing the gas, urgency and unpredictability of a worn-down lining.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DELIVERY SCIENCE (frosted-glass panel over nature photo) */}
      <section className="sheet glasssci" id="science" data-screen-label="Delivery science">
        <div className="glasssci__bg"><Shot src={IMG.microbes} alt="Microbiome macro background" style={{ width: "100%", height: "100%", display: "block" }} /></div>
        <div className="glasssci__grain" style={{ height: 1020 }}></div>
        <div className="wrap" data-reveal="">
          <div className="gpanel gpanel--v5" style={{ margin: "50px 0px" }}>
            <div className="gpanel__body">
              <span className="gpanel__eye gpanel__eye--v5">GTB™ delivery technology</span>
              <h2>Most gut actives don't survive digestion, <em>GTB™ does.</em></h2>
              <div className="gchip gchip--v5">
                <span className="gchip__tag">GTB arm</span>
                <span className="gchip__txt">Raised stool butyrate</span>
                <span className="gchip__n gchip__n--v5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 19V5M5 12l7-7 7 7" /></svg>74%</span>
              </div>
              <p className="gpanel__fine gpanel__fine--v5">Registered, double-blinded RCT · 45 days · CTRI/2025/09/094597</p>
            </div>
            <div className="gpanel__cap">
              <div className="anno anno--tr">
                <p>A pH-targeted shell shields GTB™ from stomach acid through the digestive tract.</p>
              </div>
              <div className="cap" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}><span className="cap__t"></span><span className="cap__b"></span></div>
              <div className="anno anno--br">
                <p>Releases butyrate at the colon, exactly where your gut lining needs it most.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE (supplement facts + cert pills) */}
      <section className="sheet sheet--pad" id="inside" data-screen-label="What's inside">
        <div className="wrap">
          <div className="pinside" data-reveal="">
            <div className="factlabel">
              <div className="factlabel__k">Supplement facts</div>
              <div className="factlabel__t">Biome Balance</div>
              <div className="factlabel__hd"><span>Per 1 capsule serving</span><span>30 servings</span></div>
              <div className="factrow">
                <div className="factrow__n">Thirdbiome GTB™<span>Micro-encapsulated glyceryl tributyrate</span></div>
                <div className="factrow__v">500 mg</div>
              </div>
              <div className="factrow">
                <div className="factrow__n">Vegetarian capsule<span>HPMC shell · pH-targeted release</span></div>
                <div className="factrow__v">1</div>
              </div>
              <div className="factlabel__foot">Every milligram labelled · third-party tested</div>
            </div>
            <div className="pinside__copy">
              <span className="eyebrow">What's inside</span>
              <h2 style={{ marginTop: 14 }}>One ingredient. <em>Nothing to hide.</em></h2>
              <p className="lead2">Most gut supplements hide behind a "proprietary blend" of a dozen strains at doses no one discloses.</p>
              <p>Biome Balance is the opposite: a single, named, proprietary active at a defined 500&nbsp;mg, the finished end-metabolite, not a bacteria count you have to take on faith. If it's on the label, you can look it up.</p>
              <div className="pcerts">
                <span className="pcert">FSSAI approved</span>
                <span className="pcert">US FDA-registered facility</span>
                <span className="pcert">WHO-GMP</span>
                <span className="pcert">Vegetarian</span>
                <span className="pcert">Proprietary technology</span>
              </div>
            </div>
          </div>

          {/* Full-width 3-ingredient cards grid */}
          <div className="pdp-ingredient-cards" aria-label="Ingredient cards">
            <article className="pdp-ingredient-card">
              <div className="pdp-ingredient-card__header">
                <div className="pdp-ingredient-card__titles">
                  <span className="pdp-ingredient-card__kicker">500 mg · Active Postbiotic</span>
                  <h3 className="pdp-ingredient-card__name">Thirdbiome GTB™</h3>
                  <span className="pdp-ingredient-card__sub">Micro-encapsulated glyceryl tributyrate</span>
                </div>
                <div className="pdp-ingredient-card__art" aria-hidden="true">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="24" cy="24" r="18" strokeDasharray="4 3" />
                    <circle cx="24" cy="24" r="10" fill="currentColor" fillOpacity=".12" />
                    <circle cx="24" cy="24" r="4" fill="currentColor" />
                    <path d="M24 2v4M24 42v4M2 24h4M42 24h4" />
                  </svg>
                </div>
              </div>
              <div className="pdp-ingredient-card__what">
                <span className="pdp-ingredient-card__what-title">What it does</span>
                <p>Delivers pure short-chain butyrate directly to the colon, fueling colonocytes to strengthen the mucosal gut barrier, relieve occasional bloating, and support regularity without bacterial die-off.</p>
              </div>
            </article>

            <article className="pdp-ingredient-card">
              <div className="pdp-ingredient-card__header">
                <div className="pdp-ingredient-card__titles">
                  <span className="pdp-ingredient-card__kicker">Targeted Release</span>
                  <h3 className="pdp-ingredient-card__name">Vegetarian HPMC</h3>
                  <span className="pdp-ingredient-card__sub">Acid-resistant plant capsule</span>
                </div>
                <div className="pdp-ingredient-card__art" aria-hidden="true">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="15" y="10" width="18" height="28" rx="9" />
                    <line x1="15" y1="24" x2="33" y2="24" />
                    <path d="M24 10V4" />
                    <path d="M24 4c4 0 7 3 7 7-4 0-7-3-7-7Z" />
                    <path d="M24 8c-3.5 0-6 2.5-6 6 3.5 0 6-2.5 6-6Z" />
                  </svg>
                </div>
              </div>
              <div className="pdp-ingredient-card__what">
                <span className="pdp-ingredient-card__what-title">What it does</span>
                <p>An all-natural vegetarian capsule shell designed to safely pass through low stomach acid (pH 1.5–3.5), releasing the active postbiotic formulation intact at the colonic mucosal barrier.</p>
              </div>
            </article>

            <article className="pdp-ingredient-card">
              <div className="pdp-ingredient-card__header">
                <div className="pdp-ingredient-card__titles">
                  <span className="pdp-ingredient-card__kicker">Aroma & Freshness</span>
                  <h3 className="pdp-ingredient-card__name">Botanical Mint</h3>
                  <span className="pdp-ingredient-card__sub">Natural mint oil essence</span>
                </div>
                <div className="pdp-ingredient-card__art" aria-hidden="true">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 36c4-14 16-24 26-26-4 14-16 24-26 26Z" fill="currentColor" fillOpacity=".12" />
                    <path d="M12 36C22 28 32 18 38 10" />
                    <path d="M22 24c4-2 7-1 10-3" />
                    <path d="M18 30c3-3 5-3 8-6" />
                  </svg>
                </div>
              </div>
              <div className="pdp-ingredient-card__what">
                <span className="pdp-ingredient-card__what-title">What it does</span>
                <p>Infuses every capsule with a clean, refreshing botanical mint aroma to ensure a pleasant daily routine with zero synthetic additives, artificial flavors, or unpleasant aftertaste.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* HOW TO TAKE (intake note + protocol timeline) */}
      <section className="sheet sheet--pad" data-screen-label="How to take">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">How to take · Study timeline</span>
              <h2 style={{ marginTop: 14 }}>Benefits that build over time.</h2>
            </div>
            <p>A guide to the experience members may notice as they build a consistent routine.</p>
          </div>
          <div className="pintake" data-reveal="">
            <div className="pintake__k">The habit</div>
            <div>
              <div className="pintake__t">One capsule daily, with water</div>
              <div className="pintake__s">Any time of day, with or without food. Consistency matters more than timing, take it at the same moment each day.</div>
            </div>
          </div>
          <div className="pdp-proof-row">
            <ol className="pdp-experience-timeline" aria-label="Member experience timeline">
              <li className="pdp-experience-timeline__item pdp-experience-timeline__item--featured">
                <span className="pdp-experience-timeline__time">Dose one</span>
                <div><h3>Works on arrival</h3><p>Unlike a probiotic, there's no colony to establish. The compound is active the moment it reaches your colon.</p></div>
              </li>
              <li className="pdp-experience-timeline__item">
                <span className="pdp-experience-timeline__time">Week 1</span>
                <div><h3>Gas &amp; bloating ease</h3><p>The most common first signal. Digestion starts to feel lighter and more predictable through the day.</p></div>
              </li>
              <li className="pdp-experience-timeline__item">
                <span className="pdp-experience-timeline__time">Week 2–4</span>
                <div><h3>Steadier, clearer</h3><p>Nine in ten members notice a shift by week two, calmer digestion, fewer crashes, sharper focus.</p></div>
              </li>
              <li className="pdp-experience-timeline__item">
                <span className="pdp-experience-timeline__time">Month 3</span>
                <div><h3>The repair pays off</h3><p>Lining repair compounds over a season. Most members choose to keep the protocol going, which is why we recommend three months.</p></div>
              </li>
            </ol>
            <div className="pdp-expert-placeholder">
              <Shot className="imgfill" src={IMG.microbes} alt="Abstract microbiome illustration for a future expert science video" />
              <div className="pdp-expert-placeholder__label"><span className="pdp-expert-placeholder__play" aria-hidden="true">▶</span><span><b>Expert video coming soon</b><small>Captioned explanation of the postbiotic mechanism</small></span></div>
            </div>
          </div>
          <p className="pdp-experience-timeline__note">Experience varies. These milestones describe member-reported expectations and the product mechanism; they are not separate clinical-trial timepoints. The registered RCT reported findings over 45 days. <Link to="/evidence#clinical-trial">See clinical evidence →</Link></p>
        </div>
      </section>

      {/* WHY POSTBIOTIC (comparison table + outcomes strip) */}
      <section className="sheet sheet--pad" data-screen-label="Why postbiotic">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Probiotic vs postbiotic</span>
              <h2 style={{ marginTop: 14 }}>Why not just take a probiotic?</h2>
            </div>
            <p>Probiotics send live bacteria and hope they survive, colonise, and behave. A postbiotic skips the gamble, it's the finished metabolite, delivered intact.</p>
          </div>
          <div className="ctable" data-reveal="">
            <div className="crow crow--head"><div>Question</div><div className="pro">Probiotic</div><div className="post">Biome Balance · GTB™</div></div>
            <div className="crow"><div className="q">Survives stomach acid?</div><div className="pro">Rarely, most strains die first</div><div className="post"><span className="mk">✓</span>Micro-encapsulated to arrive intact</div></div>
            <div className="crow"><div className="q">Needs an existing microbiome?</div><div className="pro">Yes, relies on your bacteria</div><div className="post"><span className="mk">✓</span>No, acts as the finished metabolite</div></div>
            <div className="crow"><div className="q">Has to colonise first?</div><div className="pro">Yes, results vary person to person</div><div className="post"><span className="mk">✓</span>No, works on arrival, from dose one</div></div>
            <div className="crow"><div className="q">Consistent dose to dose?</div><div className="pro">Drifts with heat, storage, time</div><div className="post"><span className="mk">✓</span>Defined 500 mg, every capsule</div></div>
            <div className="crow"><div className="q">Honest evidence?</div><div className="pro">Often broad & strain-agnostic</div><div className="post"><span className="mk">✓</span>Registered RCT, limits disclosed</div></div>
          </div>
          <div className="v5-rwe-strip" data-reveal="" style={{ marginTop: 16, marginBottom: 0 }}>
            <div className="v5-rwe-cell"><span className="n">+74%</span><span className="l">stool butyrate, GTB arm (RCT)</span></div>
            <div className="v5-rwe-cell"><span className="n">87%</span><span className="l">reported less bloating</span></div>
            <div className="v5-rwe-cell"><span className="n">9/10</span><span className="l">calmer digestion by week 2</span></div>
            <div className="v5-rwe-cell"><span className="n">Week 2</span><span className="l">when the first shift lands</span></div>
            <div className="v5-rwe-cell"><span className="n">500mg</span><span className="l">defined daily dose</span></div>
          </div>
          <p className="pout__cap">Registered, double-blinded RCT · 45 days · CTRI/2025/09/094597. Real-world figures from T3B Club 30-day cohorts · self-reported.</p>
          <div className="pdp-compare-cta"><Link className="btn btn--dark" to="#pdpInfo">Switch from probiotics <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      {/* RESULTS (patient outcome cards) */}
      <section className="sheet sheet--pad" data-screen-label="Results">
        <div className="wrap">
          <div className="v5-helped">
            <span className="eyebrow">Real guts, real results</span>
            <h2>What it did for <em>them.</em></h2>
            <div className="v5-patgrid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
              <Link className="v5-pcard" to="/case-studies#v5-karthikayan"><div className="v5-pcard__av"><img src={IMG.patKarthikayan} alt="Karthikayan" /></div><div className="v5-pcard__name">Karthikayan</div><div className="v5-pcard__meta">30 · Male · 30 days</div><div className="v5-pcard__tag">Severe bloating, cravings & acne.</div><div className="v5-pcard__stat"><span className="n">90%</span><span className="l">bloating drop</span></div></Link>
              <Link className="v5-pcard" to="/case-studies#v5-aravind"><div className="v5-pcard__av"><img src={IMG.patAravind} alt="Aravind" /></div><div className="v5-pcard__name">Aravind</div><div className="v5-pcard__meta">46 · Male · 4 weeks</div><div className="v5-pcard__tag">Chronic gas, bloating, gut-brain symptoms.</div><div className="v5-pcard__stat"><span className="n">44%</span><span className="l">gas reduction</span></div></Link>
              <Link className="v5-pcard" to="/case-studies#v5-shweta"><div className="v5-pcard__av"><img src={IMG.patShweta} alt="Shweta" /></div><div className="v5-pcard__name">Shweta</div><div className="v5-pcard__meta">36 · Female · 30 days</div><div className="v5-pcard__tag">Constipation, fasting headaches & mood.</div><div className="v5-pcard__stat"><span className="n">80%</span><span className="l">irritability drop</span></div></Link>
            </div>
            <div className="v5-helped__foot"><Link className="btn btn--white" to="/case-studies">Read all case studies →</Link><p className="v5-helped__disc">All cases are single-participant, self-reported, and do not establish causality.</p></div>
          </div>
        </div>
      </section>

      {/* REVIEWS (Full CRUD with customer-posted product photos) */}
      <ProductReviews />

      {/* FAQ */}
      <section className="sheet sheet--pad" data-screen-label="FAQ">
        <div className="wrap faq">
          <div className="shead" style={{ justifyContent: "center", textAlign: "center" }}><div><span className="eyebrow" style={{ justifyContent: "center" }}>Good questions</span><h2 style={{ marginTop: 14 }}>Before you start</h2></div></div>
          <div className="acc">
            <AccItem q="Is this a probiotic?" defaultOpen><p>No, it's a postbiotic, the finished metabolite (butyrate, via GTB™) your gut would normally make for itself. No live cultures to keep alive or hope will colonise.</p></AccItem>
            <AccItem q="When will I notice something?"><p>Most people feel gas and bloating ease within the first week or two. Gut-brain and systemic benefits build over the season, months, not days.</p></AccItem>
            <AccItem q="Who shouldn't take it?"><p>If you're pregnant, nursing, on medication, or managing a condition, check with your doctor first.</p></AccItem>
          </div>
        </div>
      </section>

      {/* STICKY ADD-TO-BAG */}
      <StickyBuy anchorId="pdpInfo" price={sel.price} label="Biome Balance" sub={sel.sticky} qty={sel.qty || 1} coupon={sel.coupon || null} mobileOnly buttonLabel="Start Now" />

      {/* PDP WELCOME OFFER POPUP (Configurable countdown & offer) */}
      <PdpWelcomeOffer />
    </>
  );
}
