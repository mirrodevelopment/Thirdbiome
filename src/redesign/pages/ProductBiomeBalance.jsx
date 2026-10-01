import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon, Stars } from "../components/Icon";
import { AccordionItem } from "../components/Accordion";
import { PostbioticsExplained } from "../components/sections/PostbioticsExplained";
import { GtbTechnology } from "../components/sections/GtbTechnology";
import { useCart, inr } from "../cart/CartContext";
import { PRODUCT_IMG } from "../data/products";

const PACKS = [
  {
    plan: "once",
    price: 1499,
    was: 1499,
    label: "One-time",
    variant: "One-time · 30 servings",
    name: "One bottle",
    sub: "A single 30-day supply",
  },
  {
    plan: "3mo",
    price: 3299,
    was: 4497,
    label: "3-Month Reset",
    variant: "3-Month Reset · 90 servings",
    name: "3-Month Reset",
    sub: "3 bottles · the honest minimum",
    badge: "Best value",
  },
  {
    plan: "sub",
    price: 1199,
    was: 1499,
    label: "Subscribe & save",
    variant: "Subscribe & save · 30 servings/mo",
    name: "Subscribe",
    sub: "Monthly · skip or cancel anytime",
  },
];

const INGREDIENTS = [
  {
    name: "Thirdbiome GTB™",
    dose: "500 mg",
    type: "Postbiotic SCFA",
    fns: [
      "Delivers butyrate directly to the colon",
      "Heals the intestinal lining & reduces inflammation",
      "Modulates gut–brain signalling",
      "Supports immunity & SCFA balance",
    ],
  },
  {
    name: "L-Glutamine",
    dose: "5 g",
    type: "Amino acid",
    fns: [
      "Key fuel for intestinal repair",
      "Rebuilds tight junctions in the gut barrier",
      "Reduces permeability (“leaky gut”)",
      "Enhances mucosal immunity",
    ],
  },
  {
    name: "Peppermint extract",
    dose: "50 mg",
    type: "Botanical",
    fns: [
      "Smooth-muscle relaxant",
      "Reduces cramping, spasms & bloating",
      "Shown effective in IBS symptom relief",
    ],
  },
  {
    name: "Fennel extract",
    dose: "50 mg",
    type: "Botanical",
    fns: [
      "Natural carminative & antispasmodic",
      "Reduces intestinal gas & discomfort",
      "Promotes smoother digestion",
    ],
  },
];

const ABOUT_BULLETS = [
  "Coats & fuels colon cells",
  "Tightens the gut barrier",
  "Reduces inflammation",
  "Eases bloating & motility issues",
];

const JOURNEY = [
  ["Week 1", "Reduced bloating, easier digestion"],
  ["Week 2", "More regular bowel movements, less gas & cramping"],
  ["Weeks 3–4", "Improved stool consistency, reduced urgency"],
  ["Weeks 5–6", "Increased energy, better mood, sharper focus"],
  ["Weeks 6–8", "Long-term gut resilience, stronger immunity"],
];

const STORIES = [
  ["Dr. Raj Mohan", "Gastroenterologist · on postbiotics"],
  ["Dr. Sandeep", "Dept. of Pharmacology · on the mechanism"],
  ["Dr. Tejas", "Clinical researcher · on the evidence"],
];

const REVIEWS = [
  ["R", "Riya M.", "The bloating eased in the first week — and I finally stopped feeling foggy by mid-afternoon."],
  ["A", "Arjun S.", "What sold me was the honesty — they show the actual trial and its limits. Rare in this space."],
  ["N", "Neha K.", "One capsule, no 12-step routine. My digestion is finally predictable again."],
];

const FAQ_A = [
  ["What is Biome Balance, and how is it different from probiotics?", "Biome Balance is a postbiotic gut-health formula. Probiotics are live bacteria you hope will survive and colonise; Biome Balance delivers the finished compound — butyrate, via Thirdbiome GTB™ — straight to the colon, so it works on arrival without relying on your existing microbiome."],
  ["What does Thirdbiome GTB™ do to your gut?", "It carries butyrate past stomach acid and releases it at the colon, where it fuels colonocytes, tightens the gut lining’s junctions, and calms immune signalling — the groundwork for a sturdier, less reactive gut."],
  ["How should I take it?", "One daily serving, with or without food. The microencapsulation handles timing, so it isn’t fussy. Most members give it a full 30 days."],
  ["How soon will I see results?", "Often within days to two weeks for bloating and regularity; deeper lining repair builds over 4–8 weeks. Individual results vary."],
  ["Can I take it alongside my probiotics?", "Yes. Postbiotics and probiotics work by different mechanisms and can be complementary."],
  ["Is it safe for long-term use?", "Yes — butyric acid / tributyrin hold GRAS status and it’s non-living. As with any supplement, check with your doctor if you manage a condition."],
  ["How do peppermint & fennel extracts help?", "Peppermint is a smooth-muscle relaxant that eases cramping and spasms; fennel is a carminative that reduces gas and discomfort — together they calm day-to-day digestion."],
];

const FAQ_B = [
  ["Who should take Biome Balance?", "Anyone dealing with bloating, irregular digestion, or wanting to rebuild gut-lining health — and looking for an evidence-led option rather than another strain count."],
  ["Is it suitable for vegetarians?", "Yes — it’s vegetarian and clean-label."],
  ["Does it have any side effects?", "It’s well tolerated. Some people notice mild changes in digestion in the first days as the gut adjusts."],
  ["Can it be taken during pregnancy or breastfeeding?", "Please check with your doctor first, as with any supplement during pregnancy or nursing."],
  ["Can I use it daily, or only when I feel bloated?", "It’s built for daily use — consistent butyrate gives the lining a steady supply to repair from, rather than chasing each flare."],
  ["How is this different from fibre or psyllium husk?", "Fibre feeds bacteria that may produce butyrate; Biome Balance delivers butyrate directly, so the benefit isn’t left to chance or your existing flora."],
  ["Is it suitable for people with IBS or IBD?", "Many members use it for IBS-type symptoms, and our trial tracked IBS-SSS scores. For diagnosed IBD, consult your clinician first."],
];

export default function ProductBiomeBalance() {
  const { add } = useCart();
  const [planId, setPlanId] = useState("once");
  const [qty, setQty] = useState(1);
  const [sticky, setSticky] = useState(false);

  const plan = PACKS.find((p) => p.plan === planId);
  const total = plan.price * qty;
  const hasDiscount = plan.was > plan.price;
  const off = Math.round((1 - plan.price / plan.was) * 100);

  const addToCart = () =>
    add({
      lineId: `biome-balance-${plan.plan}`,
      id: "biome-balance",
      name: "Biome Balance",
      variant: plan.variant,
      price: plan.price,
      qty,
      img: PRODUCT_IMG,
    });

  useEffect(() => {
    const onScroll = () => {
      const foot = document.querySelector(".foot");
      const nearFoot = foot && foot.getBoundingClientRect().top < window.innerHeight;
      setSticky(window.scrollY > 640 && !nearFoot);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <main className="pdppage">
        <div className="wrap">
          <div className="crumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <Link to="/shop">Shop</Link>
            <span className="sep">/</span>
            <span className="here">Biome Balance</span>
          </div>
        </div>

        {/* buy */}
        <section className="section" style={{ paddingTop: "clamp(24px,3vw,40px)" }}>
          <div className="wrap pdp">
            <div className="gallery2__main">
              <img src={PRODUCT_IMG} alt="Biome Balance" />
              <span className="gallery2__badge">Postbiotic formula · daily</span>
            </div>

            <div className="pdp__info">
              <a href="#reviews" style={{ textDecoration: "none" }}>
                <span className="stars" aria-label="4.8 of 5">
                  ★★★★★{" "}
                  <span style={{ color: "var(--ink-soft)", fontSize: ".82rem", fontWeight: 600, marginLeft: 6 }}>
                    4.8 · 212 reviews
                  </span>
                </span>
              </a>
              <h1 className="pdp__title">Biome Balance</h1>
              <span className="pdp__ing">
                <span className="dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--emerald)", display: "inline-block" }} />{" "}
                Postbiotic SCFA formula · Thirdbiome GTB™ + L-Glutamine + botanicals
              </span>
              <p className="pdp__desc">
                Advanced postbiotic gut-health formula. Thirdbiome GTB™ delivers
                butyrate to the colon, L-Glutamine rebuilds the lining, and peppermint
                + fennel calm digestion — working deeper than a probiotic ever could.
              </p>

              <div className="pdp__price">
                <span className="now">{inr(plan.price)}</span>
                {hasDiscount && (
                  <>
                    <span className="was">{inr(plan.was)}</span>
                    <span className="off">Save {off}%</span>
                  </>
                )}
              </div>

              <div className="olabel">
                <span>Choose your plan</span>
                <strong>{plan.label}</strong>
              </div>
              <div className="packgrid">
                {PACKS.map((p) => (
                  <button
                    key={p.plan}
                    className={`packcard${p.plan === planId ? " on" : ""}`}
                    onClick={() => setPlanId(p.plan)}
                  >
                    {p.badge && <span className="packcard__badge">{p.badge}</span>}
                    <span className="packcard__name">{p.name}</span>
                    <span className="packcard__sub">{p.sub}</span>
                    <span className="packcard__price">
                      {inr(p.price)}
                      {p.was > p.price && <s>{inr(p.was)}</s>}
                    </span>
                  </button>
                ))}
              </div>

              <ul className="pdp__list">
                <li><Icon name="check" size={18} sw={2.5} /> Works from dose one — no colonising required</li>
                <li><Icon name="check" size={18} sw={2.5} /> 30 daily servings · vegetarian</li>
                <li><Icon name="check" size={18} sw={2.5} /> Made in a US FDA-registered, WHO-GMP facility</li>
              </ul>

              <div className="qtybar">
                <div className="qtybox">
                  <button aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button aria-label="Increase" onClick={() => setQty((q) => q + 1)}>+</button>
                </div>
                <button className="btn btn--lg" style={{ flex: 1, justifyContent: "center" }} onClick={addToCart}>
                  Add to cart · <span>{inr(total)}</span>
                </button>
              </div>

              <div className="pdp__trust">
                <div className="ti"><Icon name="check" size={18} /><div><strong>30-day promise</strong><small>Give it a real month</small></div></div>
                <div className="ti"><Icon name="clock" size={18} /><div><strong>Ships in 24h</strong><small>Free over ₹999</small></div></div>
                <div className="ti"><Icon name="shield" size={18} /><div><strong>Cancel anytime</strong><small>No lock-in, ever</small></div></div>
              </div>

              <div className="acc">
                <AccordionItem title="What's inside" defaultOpen>
                  <p>
                    A focused formula — Thirdbiome GTB™ 500 mg (postbiotic butyrate),
                    L-Glutamine 5 g (lining repair), plus peppermint 50 mg and fennel
                    50 mg to calm digestion. No live bacteria, no sugar, no synthetic
                    fillers. Vegetarian.
                  </p>
                </AccordionItem>
                <AccordionItem title="How to take it">
                  <p>
                    One daily serving, with or without food. The encapsulation carries
                    GTB past stomach acid and releases at the colon — so timing isn’t
                    fussy. Most members give it a full 30 days; gas and bloating tend
                    to settle first, regularity follows.
                  </p>
                </AccordionItem>
                <AccordionItem title="The evidence — shown honestly">
                  <p>
                    Our randomised, double-blind trial (CTRI/2025/09/094597) raised
                    stool butyrate by 74% in the GTB arm over 45 days, with IBS-SSS and
                    GSRS scores improving alongside.
                  </p>
                  <p>
                    The fine print: N=30 across 3 active arms, no placebo. We report
                    results as numerically greater, not “double.”{" "}
                    <Link className="tlink" to="/science#evidence">Read the full evidence</Link>.
                  </p>
                </AccordionItem>
                <AccordionItem title="Shipping & returns">
                  <p>
                    Ships across India, 2–5 day delivery. Free shipping over ₹999. COD
                    available. Subscriptions ship monthly and can be skipped or
                    cancelled anytime. Backed by our 30-day promise.
                  </p>
                </AccordionItem>
              </div>
            </div>
          </div>
        </section>

        {/* about the product */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="head reveal">
              <div className="eyebrow">About the product</div>
              <h2>Not another probiotic. A <span className="emi">postbiotic, delivered.</span></h2>
              <p className="lead">
                Biome Balance is a clinically-designed postbiotic formula built to
                deliver Thirdbiome GTB™ — the short-chain fatty acid (SCFA) your colon
                runs on — straight to the gut lining. Unlike live probiotics that may
                not survive stomach acid, it works deeper and smarter:
              </p>
            </div>
            <ul className="checks2 reveal">
              {ABOUT_BULLETS.map((b) => (
                <li key={b}><Icon name="check" size={20} sw={2.4} /> {b}</li>
              ))}
            </ul>
            <div className="band band--center reveal" style={{ marginTop: "clamp(34px,4vw,52px)" }}>
              <h2>Your daily microbiome support system.</h2>
              <p className="band__lead">Simplified into one daily dose to optimise gut health.</p>
            </div>
          </div>
        </section>

        {/* postbiotics explained + comparison */}
        <PostbioticsExplained />

        {/* GTB technology */}
        <GtbTechnology />

        {/* ingredients */}
        <section className="section" style={{ background: "var(--sand)" }}>
          <div className="wrap">
            <div className="head reveal">
              <div className="eyebrow">Ingredients &amp; functions</div>
              <h2>Every ingredient <span className="em">earns its place.</span></h2>
              <p className="lead">Scientifically formulated to work together for gut repair.</p>
            </div>
            <div className="inggrid">
              {INGREDIENTS.map((ing) => (
                <div className="ingcard reveal" key={ing.name}>
                  <div className="ingcard__top">
                    <span className="ingcard__name">{ing.name}</span>
                    <span className="ingcard__dose">{ing.dose}</span>
                  </div>
                  <div className="ingcard__type">{ing.type}</div>
                  <ul>
                    {ing.fns.map((f) => (
                      <li key={f}><Icon name="check" size={16} sw={2.5} /> {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* journey */}
        <section className="section">
          <div className="wrap">
            <div className="head reveal">
              <div className="eyebrow">Your journey to better gut health</div>
              <h2>What the weeks <span className="em">look like.</span></h2>
              <p className="lead">Track your progress as Biome Balance transforms your gut, week by week.</p>
            </div>
            <div className="timeline">
              {JOURNEY.map(([wk, txt]) => (
                <div className="tline reveal" key={wk}>
                  <div className="yr">{wk}</div>
                  <div><p style={{ margin: 0 }}>{txt}</p></div>
                </div>
              ))}
            </div>
            <p style={{ color: "var(--ink-soft)", marginTop: 18, fontSize: ".9rem" }}>
              Commonly reported milestones — individual results vary.
            </p>
          </div>
        </section>

        {/* reviews */}
        <section className="section" id="reviews" style={{ background: "var(--mist)" }}>
          <div className="wrap">
            <div className="head head--center reveal">
              <div className="eyebrow">Real guts, real talk</div>
              <h2>4.8 from 212 members</h2>
            </div>
            <div className="revs">
              {REVIEWS.map(([av, nm, quote]) => (
                <div className="rev reveal" key={nm}>
                  <Stars />
                  <p>“{quote}”</p>
                  <div className="who">
                    <div className="av">{av}</div>
                    <div>
                      <div className="nm">{nm}</div>
                      <div className="vf"><Icon name="check" size={13} sw={3} /> Verified member</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* biome stories */}
        <section className="section">
          <div className="wrap">
            <div className="head head--center reveal">
              <div className="eyebrow">Biome stories</div>
              <h2>What doctors say</h2>
            </div>
            <div className="stories">
              {STORIES.map(([name, role]) => (
                <div className="story reveal" key={name}>
                  <div className="story__media">
                    <span className="story__play"><Icon name="play" size={22} /></span>
                  </div>
                  <div className="story__body">
                    <div className="story__name">{name}</div>
                    <div className="story__role">{role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" style={{ background: "var(--sand)" }}>
          <div className="wrap">
            <div className="head reveal">
              <div className="eyebrow">FAQ</div>
              <h2>Straight answers, <span className="em">no asterisks.</span></h2>
            </div>
            <div className="faq2">
              <div className="acc">
                {FAQ_A.map(([q, a], i) => (
                  <AccordionItem key={q} title={q} defaultOpen={i === 0}>
                    <p>{a}</p>
                  </AccordionItem>
                ))}
              </div>
              <div className="acc">
                {FAQ_B.map(([q, a]) => (
                  <AccordionItem key={q} title={q}>
                    <p>{a}</p>
                  </AccordionItem>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* money-back */}
        <section className="section">
          <div className="wrap">
            <div className="band band--center reveal">
              <h2>Feel great, or your <span className="emi">money back.</span></h2>
              <p className="band__lead">Backed by our 30-day promise — give it a real month, on us.</p>
              <button className="btn btn--lg" style={{ marginTop: 24 }} onClick={addToCart}>
                Add to cart · {inr(total)}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* sticky buy */}
      <div className={`stickybuy${sticky ? " show" : ""}`}>
        <div className="wrap stickybuy__in">
          <div className="stickybuy__l">
            <img src={PRODUCT_IMG} alt="" />
            <div className="meta">
              <div className="t">Biome Balance</div>
              <div className="p">{plan.label} · {inr(total)}</div>
            </div>
          </div>
          <button className="btn" onClick={addToCart}>Add to cart</button>
        </div>
      </div>
    </>
  );
}
