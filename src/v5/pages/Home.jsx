/* Third Biome v5, Home ('/'), converted from design_handoff_third_biome_v5/site/index.html */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Arr, Check, Shot, AccItem, QARow, Ticker } from "../components/ui";
import { IMG, PLANS, inr } from "../data/content";
import { useCart } from "../cart/CartProvider";
import StickyBuy from "../components/StickyBuy";
import Seo from "../components/Seo";
import contactService from "../../services/contactService";
import { getBlogs } from "../../services/blogService";
import gutMotion from "../assets/gut-motion.mp4";
import ConversationalFaq from "../components/ConversationalFaq";
import StoriesSection from "../components/StoriesSection";
import mascotImg from "../../assets/mascot.png";

const SYMPTOM_CHIPS = [
  { label: "Bloating after a light meal", reply: "The food baby, minus the food. Classic." },
  { label: "Some days, nothing moves", reply: "Your gut’s on strike. Let’s negotiate." },
  { label: "Tired by 3 pm, every day", reply: "Not you. Probably your gut’s nap schedule." },
  { label: "Sugar cravings run my evenings", reply: "Sounds like your microbes have a sweet tooth." },
  { label: "Foggy brain, lost keys", reply: "Gut and brain talk a lot. Yours might be on mute." },
  { label: "Foods I loved now hate me", reply: "Breakups are hard. Especially with paneer." },
  { label: "Sleep 8 hours, wake up tired", reply: "Your body clocked in. Your gut didn’t." },
  { label: "Skin keeps acting up", reply: "Your skin’s reading your gut’s diary." },
  { label: "I catch every cold going", reply: "A lot of your immune system lives in your gut." },
  { label: "Tummy flips before meetings", reply: "Butterflies are real. And sometimes loud." },
  { label: "My plants keep dying", reply: "Okay, we can’t help with that one." },
];


/* One product, framed by the goals it serves, every card leads to Biome Balance
   (no separate SKUs exist yet, so no fake product names/prices). */
const SHOP_CARDS = [
  { tag: "Digestion", img: IMG.goalDigestion, name: "Bloating & heaviness", sub: "Ease gas, bloating and irregular digestion" },
  { tag: "Gut-brain", img: IMG.goalGutbrain, name: "Focus & mood", sub: "Clearer afternoons, steadier mood" },
  { tag: "Defence", img: IMG.goalImmunity, name: "Immunity & resilience", sub: "Support the gut lining that guards you" },
  { tag: "Balance", img: IMG.goalMetabolic, name: "Cravings & metabolic", sub: "Calmer cravings, steadier energy" },
];

const SYSTEM_CARDS = [
  { img: IMG.systemJourney, tag: "Systemic", h: "Survives the journey", p: "A pH-targeted capsule carries GTB past stomach acid, intact." },
  { img: IMG.systemRelease, tag: "Bioavailable", h: "Releases at the colon", p: "Lipases free butyrate exactly where your gut lining needs it." },
  { img: IMG.systemRepair, tag: "Evidence-led", h: "Repairs & calms", p: "Fuels colonocytes, tightens tight junctions, signals immune calm." },
  { img: IMG.systemDaily, tag: "Sustainable", h: "Built for daily use", p: "One capsule a day, formulated for consistency, not intensity." },
];

const PATIENTS = [
  { hash: "v5-aravind", av: "A", photo: IMG.patAravind, name: "Aravind", meta: "46 · Male · 4 weeks", tag: "Chronic gas, bloating, gut-brain symptoms.", n: "44%", l: "gas reduction" },
  { hash: "v5-subashan", av: "S", photo: IMG.patSubashan, name: "Subashan", meta: "21 · Male · 3 weeks", tag: "Bloating & low energy on high-protein diet.", n: "~100%", l: "energy increase" },
  { hash: "v5-alex", av: "Al", photo: IMG.patAlex, name: "Alex", meta: "40 · Male · 1 month", tag: "Gas, urgency, bowel irregularity & anxiety.", n: "71%", l: "gas · urgency resolved" },
  { hash: "v5-deepan", av: "D", photo: IMG.patDeepan, name: "Deepan", meta: "20 · Male · 3 weeks", tag: "Bowel urgency, sugar cravings & acne.", n: "57%", l: "craving drop" },
  { hash: "v5-chakradhar", av: "C", photo: IMG.patChakradhar, name: "Chakradhar", meta: "25 · Male · 30 days", tag: "Brain fog, bad breath & fatigue.", n: "75%", l: "oral health" },
  { hash: "v5-karthikayan", av: "K", photo: IMG.patKarthikayan, name: "Karthikayan", meta: "30 · Male · 30 days", tag: "Severe bloating, cravings & acne.", n: "90%", l: "bloating drop" },
  { hash: "v5-shweta", av: "Sw", photo: IMG.patShweta, name: "Shweta", meta: "36 · Female · 30 days", tag: "Constipation, fasting headaches & mood.", n: "80%", l: "irritability drop" },
];

const COMPARE_ROWS = [
  { q: "Survives stomach acid?", pro: "Rarely, most strains die first", post: "Micro-encapsulated to arrive intact" },
  { q: "Needs an existing microbiome?", pro: "Yes, relies on your bacteria", post: "No, acts as the finished metabolite" },
  { q: "Has to colonise first?", pro: "Yes, results vary", post: "No, works on arrival, in days" },
  { q: "Consistent dose to dose?", pro: "Drifts with heat, storage, time", post: "Defined 500 mg, every time" },
  { q: "Honest evidence?", pro: "Often broad & strain-agnostic", post: "Registered RCT, limits disclosed" },
];

const CHAT_COMPARE_ROWS = [
  { q: "Can you survive the stomach?", pro: "Honestly? Most of us don’t make it. Stomach acid is brutal.", post: "I’m not alive, so there’s nothing to kill. I arrive in one piece." },
  { q: "Do you need a healthy gut to start working?", pro: "It really helps. I need friends there to settle in.", post: "Nope. I work on my own, from day one." },
  { q: "What about colonising the gut?", pro: "I have to move in, multiply and hope it works out. No promises.", post: "I skip the house-hunting. I’m already the finished product." },
  { q: "Do you need the fridge?", pro: "Often, yes. Indian summers and I don’t get along.", post: "Heat-tolerant. I’m happy in your bag." },
];

const PROBIOTIC_QUESTIONS = [
  {
    q: "Can you survive stomach acid?",
    pro: "Survival varies by strain and formulation. Stomach acid can reduce the number of live organisms that reach the gut.",
    post: "GTB™ is delivered in a pH-targeted capsule designed to protect it through digestion and release in the colon.",
  },
  {
    q: "Do you need an existing microbiome to work?",
    pro: "Effects depend on the strain, the person, and the product’s intended use.",
    post: "GTB™ is a butyrate precursor; it does not need to establish a live colony to be delivered.",
  },
  {
    q: "Do you have to colonise the gut first?",
    pro: "Some strains may temporarily colonise, but persistence and effects vary.",
    post: "GTB™ is not a live culture, so colonisation is not part of its delivery mechanism.",
  },
  {
    q: "How consistent is each dose?",
    pro: "Viability and storage requirements vary by strain, product, and formulation. Follow the label.",
    post: "Each Biome Balance capsule contains a defined 500 mg of GTB™. Follow the storage directions on the label.",
  },
  {
    q: "What if I have a sensitive stomach?",
    pro: "People respond differently, and some may notice temporary digestive symptoms. Check the product label.",
    post: "Tolerance varies from person to person. Follow the directions on the label and ask a healthcare professional if unsure.",
  },
];

const RESULTS_TIMELINE = [
  { time: "Week 1", copy: "Meals sit lighter. Less ‘why did I eat that?’", detail: "Proposed Week 1 milestone. Validate this timing and outcome against the GTB study before launch." },
  { time: "Week 2", copy: "Things start moving on schedule.", detail: "Proposed Week 2 milestone. Validate this timing and outcome against the GTB study before launch." },
  { time: "Week 4", copy: "Energy that lasts past lunch.", detail: "Proposed Week 4 milestone. Validate this timing and outcome against the GTB study before launch." },
  { time: "Week 8+", copy: "This just feels like normal now.", detail: "Proposed Week 8+ milestone. Validate this timing and outcome against the GTB study before launch." },
];

const REVIEWS = [
  { stars: "★★★★★", p: "“The bloating eased in the first week, and I finally stopped feeling foggy by mid-afternoon.”", av: "R", nm: "Riya M.", city: "Mumbai" },
  { stars: "★★★★★", p: "“What sold me was the honesty, they show the actual trial and its limits. Rare in this space.”", av: "A", nm: "Arjun S.", city: "Bengaluru" },
  { stars: "★★★★★", p: "“One capsule, no 12-step routine. My digestion is finally predictable again.”", av: "N", nm: "Neha K.", city: "Delhi" },
];

const BLOG_CARDS = [
  { img: IMG.blogCapsules, tag: "Start here", h: "What is a postbiotic, and why does it matter more than a probiotic?", p: "The metabolites that do the real work, explained plainly.", min: "6 min", date: "June 2026" },
  { img: IMG.blogLeaf, tag: "Honest take", h: "Probiotics vs Postbiotics, the comparison the industry avoids.", p: "Survival rates, timelines, consistency. Side by side, with sources.", min: "8 min", date: "May 2026" },
  { img: IMG.blogTexture, tag: "Protocol", h: "30 days on Biome Balance, what to expect, week by week.", p: "A realistic timeline based on our stewardship cohort data.", min: "5 min", date: "April 2026" },
];

const CLUB_POINTS = [
  "A doctor-guided, 90-day postbiotic protocol tailored to your gut.",
  "Your Biome Balance, delivered monthly, never run out.",
  "Weekly check-ins and the science in plain English.",
  "Direct access to our medical team when you need a real answer.",
];

/* Rotating homepage hero. The first concept follows the supplied reference;
   the remaining concepts reuse approved product language and existing images. */
const HERO_SLIDES = [
  {
    kicker: "A daily postbiotic · Made in India",
    lead: "Bloating by 5 PM.",
    accent: "",
    copy: "Your gut makes its own fuel, called butyrate. Busy days and low-fibre meals can leave many people running low. Biome Balance is a simple daily postbiotic designed to deliver it to the colon.",
    image: IMG.homeHero,
    alt: "Biome Balance postbiotic supplement",
    badge: "One daily capsule · 500 mg GTB™",
    points: [["1", "active ingredient"], ["500 mg", "per capsule"], ["Daily", "simple routine"],],
  },
  {
    kicker: "Gut-brain support · Made in India",
    lead: "Drained by 2 PM.",
    accent: "",
    copy: "The gut and brain communicate in both directions. Thirdbiome GTB™ is a proprietary postbiotic designed to support gut health as part of a steady daily routine.",
    image: IMG.goalGutbrain,
    alt: "Gut-brain health support with Biome Balance",
    badge: "Proprietary postbiotic · GTB™",
    points: [["1", "active ingredient"], ["500 mg", "per capsule"], ["Daily", "simple routine"],],
  },
  {
    kicker: "Gut health · Evidence-led",
    lead: "Constipated despite trying everything.",
    accent: "",
    copy: "Biome Balance provides one clearly labelled postbiotic in a simple daily capsule. See the product details and the clinical evidence behind the formulation.",
    image: IMG.goalDigestion,
    alt: "Biome Balance supporting digestive comfort",
    badge: "CTRI-registered clinical trial",
    points: [["45 days", "registered trial"], ["500 mg", "GTB™ per capsule"], ["1", "daily formula"],],
  },
  {
    kicker: "A considered daily system · Made in India",
    lead: "Eating “healthy” but still not feeling great.",
    accent: "",
    copy: "Your gut makes butyrate naturally. Biome Balance is designed to deliver a butyrate precursor through a colon-targeted capsule, with one active ingredient and a defined dose.",
    image: IMG.goalMetabolic,
    alt: "Biome Balance for a consistent gut health routine",
    badge: "One ingredient · Clearly labelled",
    points: [["1", "active ingredient"], ["500 mg", "defined dose"], ["Made in India", "Third Biome"],],
  },
  {
    kicker: "Thirdbiome GTB™ · Proprietary postbiotic",
    lead: "Tried probiotics. Still not feeling the difference?",
    accent: "",
    copy: "Thirdbiome GTB™ is formulated to pass through digestion and release in the colon. Explore how the delivery system works and read the trial details, including its limitations.",
    image: IMG.goalImmunity,
    alt: "Thirdbiome GTB postbiotic and gut health support",
    badge: "See the evidence · CTRI registered",
    points: [["+74%", "stool butyrate · GTB arm"], ["45 days", "trial period"], ["1", "proprietary active"],],
  },
];

export default function Home() {
  const { add, busy } = useCart();
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const heroSlide = HERO_SLIDES[heroSlideIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener?.("change", updatePreference);
    return () => preference.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setHeroSlideIndex((index) => (index + 1) % HERO_SLIDES.length);
      }
    }, 25000);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  /* sticky adds a single one-time unit, so it must show the one-time price */
  const price = PLANS.find((p) => p.key === "onetime").price;

  /* finder chips */
  const [goalsOn, setGoalsOn] = useState(() => new Set());
  const toggleGoal = (g) => setGoalsOn((prev) => {
    const next = new Set(prev);
    next.has(g) ? next.delete(g) : next.add(g);
    return next;
  });
  const selectedSymptoms = SYMPTOM_CHIPS.filter((symptom) => goalsOn.has(symptom.label));
  const symptomCount = selectedSymptoms.length;

  /* system carousel */
  const caroRef = useRef(null);
  const caroStep = (dir) => {
    const caro = caroRef.current;
    if (!caro) return;
    const card = caro.querySelector(".ccard");
    const w = card ? card.getBoundingClientRect().width + 16 : 320;
    caro.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  /* journal teasers from the backend blog; hard-coded cards as fallback */
  const [livePosts, setLivePosts] = useState(null);
  useEffect(() => {
    let cancelled = false;
    getBlogs()
      .then((res) => {
        if (cancelled) return;
        const list = (res?.data || [])
          .filter((p) => p.status === "published")
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);
        if (list.length) setLivePosts(list);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  /* subscribe freebie */
  const [freebieSent, setFreebieSent] = useState(false);
  const [freebieEmail, setFreebieEmail] = useState("");
  const submitFreebie = async (e) => {
    e.preventDefault();
    try {
      await contactService.submitContact({ name: "Newsletter", email: freebieEmail, subject: "Newsletter signup", message: "Homepage newsletter opt-in" });
    } catch (err) { /* keep front-end success even if the call fails */ }
    setFreebieSent(true);
  };

  return (
    <>
      <Seo description="Thirdbiome GTB proprietary postbiotic, reaches your colon intact, works from the first dose. One ingredient, clinically studied. Made in India." />
      {/* HERO (left copy / right product photo) */}
      <section className="sheet hero" id="hero" data-screen-label="Hero">
        <div className="hero__copy">
          <div className="hero__copy-content" key={heroSlideIndex}>
            <span className="eyebrow">{heroSlide.kicker}</span>
            <h1>{heroSlide.lead}{heroSlide.accent && <> <em>{heroSlide.accent}</em></>}</h1>
            <p className="hero__sub">{heroSlide.copy}</p>
            <div className="hero__cta">
              <a className="btn btn--dark" href="#shop">Try the postbiotic <Arr /></a>
              <a className="btn btn--ghost" href="#postbiotic">Wait, what's a postbiotic?</a>
            </div>
            <div className="hero__indicators" aria-label="Homepage messages">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.lead}
                  type="button"
                  className={`hero__indicator${index === heroSlideIndex ? " is-active" : ""}`}
                  aria-label={`Show message ${index + 1}: ${slide.lead}`}
                  aria-pressed={index === heroSlideIndex}
                  onClick={() => setHeroSlideIndex(index)}
                />
              ))}
            </div>
            <div className="hero__meta">
              {heroSlide.points.map(([value, label]) => (
                <div className="m" key={`${value}-${label}`}><b>{value}</b><span>{label}</span></div>
              ))}
            </div>
            <div className="welcome-offer-callout welcome-offer-callout--desktop">
              <span className="welcome-offer-pill__tag"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7H8.5a2.5 2.5 0 1 1 2.5-2.5V7Zm0 0h3.5A2.5 2.5 0 1 0 13 4.5V7Z" /></svg>Welcome offer</span>
              <button className="welcome-offer-pill" type="button" aria-haspopup="dialog" onClick={() => window.dispatchEvent(new Event("t3b:open-welcome-offer"))}>
                <span className="welcome-offer-pill__text">Unlock your first-order offer</span>
                <span className="welcome-offer-pill__arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
        <div className="hero__stage">
          <span className="blob"></span>
          <div className="hero__badge tag tag--glass">{heroSlide.badge}</div>
          <Shot key={heroSlideIndex} className="hero__shot" eager src={heroSlide.image} alt={heroSlide.alt} />
        </div>
        <div className="hero__indicators hero__indicators--mobile" aria-label="Homepage messages">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.lead}
              type="button"
              className={`hero__indicator${index === heroSlideIndex ? " is-active" : ""}`}
              aria-label={`Show message ${index + 1}: ${slide.lead}`}
              aria-pressed={index === heroSlideIndex}
              onClick={() => setHeroSlideIndex(index)}
            />
          ))}
        </div>
        <div className="hero-stats hero-stats--mobile" aria-label="Product highlights">
          <div className="hero-stats__row">
            {heroSlide.points.map(([value, label]) => (
              <div className="hero-stats__item" key={`${value}-${label}`}><b>{value}</b><span>{label}</span></div>
            ))}
          </div>
        </div>
        <div className="welcome-offer-callout welcome-offer-callout--mobile">
          <span className="welcome-offer-pill__tag"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7H8.5a2.5 2.5 0 1 1 2.5-2.5V7Zm0 0h3.5A2.5 2.5 0 1 0 13 4.5V7Z" /></svg>Welcome offer</span>
          <button className="welcome-offer-pill" type="button" aria-haspopup="dialog" onClick={() => window.dispatchEvent(new Event("t3b:open-welcome-offer"))}>
            <span className="welcome-offer-pill__text">Unlock your first-order offer</span>
            <span className="welcome-offer-pill__arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      {/* TICKER */}
      <Ticker items={[
        <><b>300+</b> T3B Club members · 4 cohorts</>,
        <>Free shipping over <b>₹999</b></>,
        <>US FDA-registered <b>facility</b></>,
        <>COD <b>across India</b></>,
        <>Registered, <b>double-blinded RCT</b></>,
        <>Proprietary <b>postbiotic</b></>,
      ]} />

      {/* USP / TRUST STRIP (static, scannable, no click needed) */}
      <section className="sheet v5-usp" data-screen-label="Trust USPs">
        <div className="v5-usp__row">
          <div className="v5-usp__i">
            <span className="v5-usp__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" /><path d="m9 12 2 2 4-4" /></svg></span>
            <div><div className="v5-usp__t">One ingredient</div><div className="v5-usp__s">500 mg GTB™ per capsule</div></div>
          </div>
          <div className="v5-usp__i">
            <span className="v5-usp__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></svg></span>
            <div><div className="v5-usp__t">Free shipping ₹999+ · COD</div><div className="v5-usp__s">Across India</div></div>
          </div>
          <div className="v5-usp__i">
            <span className="v5-usp__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="9" r="6" /><path d="M9 14l-2 7 5-3 5 3-2-7" /></svg></span>
            <div><div className="v5-usp__t">US FDA-registered facility</div><div className="v5-usp__s">WHO-GMP</div></div>
          </div>
          <div className="v5-usp__i">
            <span className="v5-usp__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg></span>
            <div><div className="v5-usp__t">30-day promise</div><div className="v5-usp__s">Easy returns</div></div>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="sheet sheet--pad" id="shop" data-screen-label="Shop">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Shop by goal</span>
              <h2 style={{ marginTop: 14 }}>Designed around your biological systems</h2>
            </div>
            <p>Foundational postbiotic support, calibrated to the systems that shape long-term gut health.</p>
            <Link className="eyebrow dot-dark" to="/products/biome-balance" style={{ alignSelf: "center" }}>Shop all →</Link>
          </div>
          <div className="pgrid">
            {SHOP_CARDS.map((c) => (
              <Link className="pcard" to="/products/biome-balance" data-reveal="" key={c.name}>
                <div className="pcard__media"><span className="tag tag--glass pcard__tag">{c.tag}</span><Shot className="imgfill" src={c.img} alt={c.name} /></div>
                <h3>{c.name}</h3>
                <p>{c.sub}</p>
                <div className="pcard__price" style={{ fontSize: ".92rem", color: "var(--green-d)" }}>Biome Balance →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POSTBIOTIC EXPLAINER */}
      <section className="sheet sheet--pad postbiotic-frame" id="postbiotic" data-screen-label="What is a postbiotic">
        <div className="wrap explain" data-reveal="">
          <div>
            <span className="eyebrow">What's a postbiotic?</span>
            <h2 style={{ marginTop: 14 }}>So what's a postbiotic, anyway?</h2>
          </div>
          <div className="explain__def">
            <p className="lead2">Your gut bacteria are tiny chefs.</p>
            <p>Postbiotics are the meal they cook: the useful stuff that feeds and protects your gut lining.</p>
            <p>Probiotics send in more chefs and hope they show up for work. Postbiotics skip straight to the meal.</p>
            <div className="explain__actions">
              <a className="btn btn--out" href="#science">Tell me the whole story <Arr /></a>
              <a className="btn btn--dark" href="#shop">Enough said, let's gut out of here! <Arr /></a>
            </div>
          </div>
        </div>
      </section>

      {/* PLAYFUL COMPARISON · PDF CHAT CARDS */}
      <section className="sheet sheet--pad" data-screen-label="Probiotic vs postbiotic chat cards">
        <div className="wrap">
          <div className="chat-compare__head">
            <span className="eyebrow">Gut health · Two approaches</span>
            <h2>Probiotic vs postbiotic</h2>
            <p>Probiotics are a good idea. Postbiotics are the upgrade. Let’s let them talk it out.</p>
          </div>
          <div className="chat-compare" data-reveal="">
            {CHAT_COMPARE_ROWS.map((row) => (
              <article className="chat-compare__card" key={row.q}>
                <h3 className="chat-compare__question">{row.q}</h3>
                <div className="chat-compare__messages">
                  <p className="chat-compare__message chat-compare__pro"><span>Probiotic ☹</span>{row.pro}</p>
                  <p className="chat-compare__message chat-compare__post"><span>Postbiotic ☺</span>{row.post}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="chat-compare__closer">→ <Link to="/products/biome-balance">Try the postbiotic</Link></p>
        </div>
      </section>

      {/* GUT SCORE INTRO (BEFORE YOU BUY ANYTHING) */}
      <section className="gut-intro-section" data-screen-label="Gut Score Intro">
        <div className="gut-intro-wrap" data-reveal="">
          <div className="gut-intro-box">
            <span className="gut-intro-eyebrow">GUT SCORE · 2 MINUTES</span>
            <h2 className="gut-intro-title">
              Before you buy anything, understand your starting point.
            </h2>
            <p className="gut-intro-desc">
              Six quick questions. A score out of 100, the patterns we spot, and simple things to try first. Not a diagnosis.
            </p>
            <Link to="/quiz" className="gut-intro-btn">
              Take the Gut Score
            </Link>
          </div>
        </div>
      </section>

      {/* FINDER */}
      <section data-screen-label="Finder">
        <div className="finder" data-reveal="">
          <span className="eyebrow">The 30-second finder</span>
          <h2>Where does your gut show up in your day? Tap all that apply.</h2>
          <div className="finder__goals" id="goals">
            {SYMPTOM_CHIPS.map(({ label }) => (
              <button type="button" className={`goal${goalsOn.has(label) ? " on" : ""}`} key={label} onClick={() => toggleGoal(label)} aria-pressed={goalsOn.has(label)}>{label}</button>
            ))}
          </div>
          <div className="finder__feedback" aria-live="polite">
            {selectedSymptoms.length > 0 && (
              <div className="finder__responses">
                {selectedSymptoms.map((symptom) => (
                  <div className="finder__response" key={symptom.label}>
                    <span>{symptom.label}</span>
                    <p>{symptom.reply}</p>
                  </div>
                ))}
              </div>
            )}
            {symptomCount >= 3 ? (
              <div className="finder__foot">
                <p className="finder__count"><strong>You picked {symptomCount}.</strong> Your gut’s been busy. Want the short version?</p>
                <a className="btn btn--white" href="#shop">Show me what’s going on <Arr /></a>
              </div>
            ) : (
              <p className="finder__count finder__count--light">Lucky you. Stick around anyway, it gets fun.</p>
            )}
          </div>
        </div>
      </section>

      {/* CAROUSEL */}
      <section className="sheet sheet--pad" id="system" data-screen-label="System">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">A daily system, precisely applied</span>
              <h2 style={{ marginTop: 14 }}>One ingredient. Several jobs.</h2>
            </div>
            <div className="shead__nav">
              <button onClick={() => caroStep(-1)}>← Prev</button>
              <button onClick={() => caroStep(1)}>Next →</button>
            </div>
          </div>
          <div className="caro" ref={caroRef}>
            {SYSTEM_CARDS.map((c) => (
              <article className="ccard" data-reveal="" key={c.h}>
                <div className="ph--media" style={{ position: "absolute", inset: 0 }}><Shot className="imgfill" src={c.img} alt={c.h} /></div>
                <span className="tag tag--dark ccard__tag">{c.tag}</span>
                <div className="ccard__body"><h3>{c.h}</h3><p>{c.p}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / THREE STOPS ROAD TRIP */}
      <section className="sheet sheet--pad roadtrip-section" id="how-it-works" data-screen-label="How it works">
        <div className="wrap" data-reveal="">
          <div className="roadtrip-container">
            <div className="roadtrip-header">
              <span className="roadtrip-eyebrow">How it works</span>
              <h2>One capsule. Three stops. A very short road trip.</h2>
            </div>

            <div className="roadtrip-grid">
              <article className="roadtrip-card">
                <span className="roadtrip-step">Stop 1</span>
                <h3>Survives the stomach</h3>
                <p>
                  Stomach acid is tough. Our capsule is tougher. A protective coat gets Third Biome GTB™ through in one piece.
                </p>
              </article>

              <article className="roadtrip-card">
                <span className="roadtrip-step">Stop 2</span>
                <h3>Opens where it counts</h3>
                <p>
                  It opens in your lower gut, the part doing the heavy lifting of digestion. No detours, no stops for chai.
                </p>
              </article>

              <article className="roadtrip-card">
                <span className="roadtrip-step">Stop 3</span>
                <h3>Refuels your gut</h3>
                <p>
                  It hands your gut the fuel it's been running low on. A well-fuelled gut supports calmer, more regular days.
                </p>
              </article>
            </div>

            <div className="roadtrip-footer">
              <Link to="/evidence" className="roadtrip-link">
                The full science, with sources →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FROSTED-GLASS SCIENCE */}
      <section className="sheet glasssci" id="science" data-screen-label="Delivery science">
        <div className="glasssci__bg"><Shot src={IMG.microbes} alt="" style={{ width: "100%", height: "100%", display: "block" }} /></div>
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
                <div className="anno__k">Outer capsule</div>
                <p>A pH-targeted shell shields GTB™ from stomach acid through the digestive tract.</p>
              </div>
              <div className="cap" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}><span className="cap__t"></span><span className="cap__b"></span></div>
              <div className="anno anno--br">
                <div className="anno__k">Inner core</div>
                <p>Releases butyrate at the colon, exactly where your gut lining needs it most.</p>
              </div>
            </div>
            <div className="gpanel__body" style={{ paddingTop: 0 }}><Link className="btn btn--dark" to="/evidence">View the study <Arr /></Link></div>
          </div>
        </div>
      </section>

      {/* STAT DUO */}
      <section data-screen-label="Outcomes">
        <div className="duo">
          <article className="scard" data-reveal="">
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><Shot src={IMG.rweStewardship} alt="" style={{ width: "100%", height: "100%", display: "block" }} /></div>
            <div className="scard__body">
              <h3>Real-world stewardship</h3>
              <p>Tracked across our 30-day Club cohorts, documented week by week.</p>
              <div className="scard__glass"><div className="lbl">Reported less bloating</div><div className="big">87%</div></div>
            </div>
          </article>
          <article className="scard" data-reveal="">
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><Shot src={IMG.rweCalmer} alt="" style={{ width: "100%", height: "100%", display: "block" }} /></div>
            <div className="scard__body">
              <h3>Felt calmer digestion</h3>
              <p>Nine in ten members noticed a shift by the second week.</p>
              <div className="scard__glass"><div className="lbl">By week 2</div><div className="big">9/10</div></div>
            </div>
          </article>
        </div>
      </section>

      {/* RESULTS TIMELINE */}
      <section className="sheet sheet--pad" id="results-timeline" data-screen-label="Results timeline">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Results timeline</span>
              <h2 style={{ marginTop: 14 }}>Good things take (a little) time.</h2>
            </div>
            <p>Here’s roughly what to expect. Your gut, your pace.</p>
          </div>
          <ol className="results-timeline">
            {RESULTS_TIMELINE.map((item, index) => (
              <li className={`results-timeline__item${activeTimelineIndex === index ? " is-active" : ""}`} key={item.time}>
                <span className="results-timeline__time">{item.time}</span>
                <button className="results-timeline__row" type="button" aria-label={`Show ${item.time} timeline note`} aria-pressed={activeTimelineIndex === index} onClick={() => setActiveTimelineIndex(index)}>
                  <span>{item.copy}</span><span className="results-timeline__chevron" aria-hidden="true">{activeTimelineIndex === index ? "−" : "+"}</span>
                </button>
                {activeTimelineIndex === index && <p className="results-timeline__detail" aria-live="polite">{item.detail}</p>}
              </li>
            ))}
          </ol>
          <p className="results-timeline__note">Draft timeline: the timings and outcomes above are placeholders. Each row must be checked against the GTB study before launch.</p>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="sheet sheet--pad" data-screen-label="Highlights">
        <div className="wrap v5-hlights">
          <span className="eyebrow">The science, in numbers</span>
          <h2 style={{ fontSize: "clamp(2rem,4.4vw,3.4rem)", margin: "10px 0 clamp(22px,3vw,36px)" }}>Seven things worth knowing.</h2>
          <div className="hl-grid">
            <div className="hlc hlc--dark"><span className="hlc__badge">Science fact</span><div className="hlc__n">70<span style={{ fontSize: ".5em" }}>%</span></div><div className="hlc__what">of colon cell energy from butyrate</div><div className="hlc__div"></div><h3>Your gut lining runs on one fuel. Most people are running on empty.</h3><p>Colonocytes, the cells lining your gut, rely on butyrate for ~70% of their energy. GTB™ delivers it directly, bypassing stomach acid entirely.</p><div className="hlc__foot">Clinical literature on colonocyte metabolism</div></div>
            <div className="hlc hlc--light"><span className="hlc__badge">Real world evidence</span><div className="hlc__n">87<span style={{ fontSize: ".5em" }}>%</span></div><div className="hlc__what">reported bloating reduction</div><div className="hlc__div"></div><h3>In 30 days, members didn’t just feel better, they understood why.</h3><p>Tracked across T3B Club stewardship cohorts. Real people, real gut protocols, documented week by week.</p><div className="hlc__foot">T3B Club 30-day cohort · Urban India · 2025-2026</div></div>
            <div className="hlc hlc--green"><span className="hlc__badge">Delivery technology</span><div className="hlc__n">100<span style={{ fontSize: ".4em" }}>%</span></div><div className="hlc__what">stomach-acid protected</div><div className="hlc__div"></div><h3>Most gut supplements never reach your gut. This one is engineered to.</h3><p>Precision microencapsulation releases only at the colon, where your gut lining needs it. No degradation. Full potency.</p><div className="hlc__foot">Lipase-mediated hydrolysis · proprietary</div></div>
            <div className="hlc hlc--leaf"><span className="hlc__badge">30-day stewardship</span><div className="hlc__n" style={{ fontSize: "clamp(3rem,6vw,4.5rem)" }}>Week 2</div><div className="hlc__what">when members first feel a shift</div><div className="hlc__div"></div><h3>Gut repair doesn’t happen overnight. But you’ll know it’s working.</h3><p>The first real shift arrives around day 10-14. By day 30, over 70% choose to continue their protocol.</p><div className="hlc__foot">T3B Club stewardship cohort</div></div>
            <div className="hlc hlc--gray"><span className="hlc__badge">Mechanism of action</span><div className="hlc__n">3</div><div className="hlc__what">pathways · 1 molecule</div><div className="hlc__div"></div><h3>One ingredient. Three measurable actions inside your gut.</h3><p>TNF-alpha inhibition (inflammation), tight junction synthesis (leaky gut), and GLP-1 activation (metabolic balance), one daily capsule.</p><div className="hlc__foot">Published research on Glycerol Tributyrate · 2025</div></div>
            <div className="hlc hlc--dark hlc--wide"><div className="hlc__body"><span className="hlc__badge">India’s first</span><div className="hlc__div"></div><h3 style={{ fontSize: "clamp(1.1rem,1.8vw,1.5rem)" }}>India didn’t have a postbiotic brand. We built one, with proprietary technology to prove it.</h3><p>Third Biome is India’s first precision postbiotic ecosystem. FSSAI-approved. Proprietary GTB technology. Clinically designed.</p></div><div className="hlc__stats"><div className="hlcstat"><span className="n">16</span><span className="l">SKUs in pipeline</span></div><div className="hlcstat"><span className="n">1st</span><span className="l">postbiotic brand in India</span></div><div className="hlcstat"><span className="n">+74%</span><span className="l">stool butyrate, GTB arm (RCT)</span></div></div></div>
          </div>
          <div style={{ textAlign: "center", marginTop: "clamp(20px,3vw,32px)" }}><Link className="btn" to="/evidence">See full evidence →</Link></div>
        </div>
      </section>

      {/* BIG QUOTE */}
      <section className="sheet bigq" data-screen-label="Philosophy">
        <div className="wrap">
          <span className="eyebrow dot-dark">Feels considered. Built to last.</span>
          <h2>A system-level approach to gut health, designed for <em>consistency</em>, not intensity.</h2>
        </div>
      </section>

      {/* GENERATIONAL STATEMENT */}
      <section className="sheet sheet--pad" data-screen-label="Generational">
        <div className="wrap statement statement--split" data-reveal="">
          <div className="statement__copy">
            <span className="eyebrow">Why now</span>
            <h2 style={{ marginTop: 16 }}>Gut care <em>evolves</em> with each generation.</h2>
            <p>You don't eat like your grandparents did, the diet, the pace, the food groups, it's all changed. But your gut still runs on ancient wiring. It needs a modern, measurable tool to keep up.</p>
            <div style={{ marginTop: 28 }}><a className="btn btn--dark" href="#science">See how it works <Arr /></a></div>
          </div>
          <div className="statement__media">
            <video src={gutMotion} autoPlay loop muted playsInline aria-label="A glowing gut pulsing, translucent green filaments drifting" />
          </div>
        </div>
      </section>

      {/* EDITORIAL SPLIT */}
      <section id="story" data-screen-label="Our story">
        <div className="split">
          <div className="split__media"><Shot className="imgfill" src={IMG.linen} alt="Founders / lab" /></div>
          <div className="split__copy" data-reveal="">
            <span className="eyebrow">Our story · Made in India</span>
            <h2>We'd rather be right than loud.</h2>
            <p>Gut health is full of hype, strain counts no one can verify, claims with no mechanism. We're building the opposite: a brand you can fact-check, ingredient by ingredient.</p>
            <ul className="split__list">
              <li>US FDA-registered, WHO-GMP facility</li>
              <li>CTRI-registered, double-blinded RCT</li>
              <li>One ingredient</li>
              <li>Proprietary technology</li>
            </ul>
            <div style={{ marginTop: 26 }}><Link className="btn btn--dark" to="/about">Our approach <Arr /></Link></div>
          </div>
        </div>
      </section>

      {/* HOW WE HELPED */}
      <section className="sheet sheet--pad" data-screen-label="How we helped">
        <div className="wrap">
          <div className="v5-helped">
            <span className="eyebrow">Real guts, real results</span>
            <h2>How we help <em>consumers.</em></h2>
            <div className="v5-patgrid v5-patgrid--scroll">
              <div className="v5-patgrid__track">
                {[...PATIENTS, ...PATIENTS].map((p, i) => (
                  <Link className="v5-pcard" to={`/case-studies#${p.hash}`} key={p.hash + i}><div className="v5-pcard__av">{p.photo ? <img src={p.photo} alt={p.name} /> : p.av}</div><div className="v5-pcard__name">{p.name}</div><div className="v5-pcard__meta">{p.meta}</div><div className="v5-pcard__tag">{p.tag}</div><div className="v5-pcard__stat"><span className="n">{p.n}</span><span className="l">{p.l}</span></div></Link>
                ))}
              </div>
            </div>
            <div className="v5-helped__foot"><Link className="btn btn--white" to="/case-studies">Read all case studies →</Link><p className="v5-helped__disc">All cases are single-participant, self-reported, and do not establish causality.</p></div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="sheet sheet--pad" data-screen-label="Probiotic vs postbiotic">
        <div className="wrap">
          <div className="difference-head">
            <span className="eyebrow">Probiotic vs postbiotic</span>
            <h2>Understanding the Difference Between Probiotics and Postbiotics.</h2>
          </div>
          <div className="ctable difference-table" data-reveal="">
            <div className="crow crow--head"><div>Question</div><div className="pro">Probiotic</div><div className="post">Postbiotic · GTB™</div></div>
            {COMPARE_ROWS.map((r) => (
              <div className="crow" key={r.q}><div className="q">{r.q}</div><div className="pro">{r.pro}</div><div className="post"><span className="mk">✓</span>{r.post}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* GUT AS A GARDEN (PRE / PRO / POSTBIOTICS) */}
      <section className="sheet sheet--pad garden-section" data-screen-label="Gut as a Garden">
        <div className="wrap" data-reveal="">
          <div className="garden-container">
            <div className="garden-header">
              <span className="garden-eyebrow">First came probiotics. Then prebiotics. Now meet postbiotics.</span>
              <h2>Think of your gut as a garden.</h2>
            </div>

            <div className="garden-grid">
              {/* Card 1: Prebiotics */}
              <article className="garden-card">
                <span className="garden-card__step">1 · FEED</span>
                <h3 className="garden-card__title">Prebiotics</h3>
                <p className="garden-card__desc">
                  Food for the good bacteria in your gut, like fertiliser for a garden. Found in fibre: dal, oats, bananas, onions.
                </p>
              </article>

              {/* Card 2: Probiotics */}
              <article className="garden-card">
                <span className="garden-card__step">2 · INTRODUCE</span>
                <h3 className="garden-card__title">Probiotics</h3>
                <p className="garden-card__desc">
                  Live good bacteria you swallow, like planting new seedlings and hoping they settle in.
                </p>
              </article>

              {/* Card 3: Postbiotics (Highlighted) */}
              <article className="garden-card garden-card--highlight">
                <span className="garden-card__step">3 · DELIVER</span>
                <h3 className="garden-card__title">Postbiotics</h3>
                <p className="garden-card__desc">
                  The helpful stuff good bacteria make or leave behind, like the fruit the garden grows. No growing needed.
                </p>
              </article>
            </div>

            {/* Conversation Snippet */}
            <div className="garden-chat">
              {/* User Bubble */}
              <div className="garden-chat__row garden-chat__row--user">
                <span className="garden-chat__sender">YOU</span>
                <div className="garden-chat__bubble-wrap">
                  <div className="garden-chat__bubble garden-chat__bubble--user">
                    So which one is Biome Balance?
                  </div>
                  <div className="garden-chat__avatar-user">You</div>
                </div>
              </div>

              {/* Tibbi Bubble */}
              <div className="garden-chat__row garden-chat__row--tibby">
                <span className="garden-chat__sender">TIBBI</span>
                <div className="garden-chat__bubble-wrap">
                  <div className="garden-chat__avatar-tibby">
                    <img src={mascotImg} alt="Tibbi" />
                  </div>
                  <div className="garden-chat__bubble garden-chat__bubble--tibby">
                    It's on team "deliver". It carries butyrate, one of the most useful things good bacteria make, straight to where your gut needs it.
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="garden-footer">
              <Link to="/journal" className="garden-guide-link">
                Pre, pro, postbiotic: the full guide →
              </Link>
              <button
                type="button"
                className="btn btn--white garden-chat-btn"
                onClick={() => window.dispatchEvent(new Event("t3b:open-tibby-chat"))}
              >
                Ask Tibbi anything
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REAL GUTS, REAL PEOPLE / CHECK-INS */}
      <section className="sheet sheet--pad checkins-section" id="reviews" data-screen-label="Reviews">
        <div className="wrap" data-reveal="">
          <div className="checkins-container">
            <div className="checkins-header">
              <span className="checkins-eyebrow">Real guts, real people</span>
              <h2>Three people. Their check-ins. Zero stock photos.</h2>
            </div>

            <div className="checkins-grid">
              {/* Card 1: Karthikayan */}
              <article className="checkin-card">
                <div className="checkin-card__head">
                  <div className="checkin-avatar">
                    <img src={IMG.patKarthikayan} alt="Karthikayan" />
                  </div>
                  <div>
                    <h3 className="checkin-name">Karthikayan, 30</h3>
                    <div className="checkin-tag">Bloating, Cravings · 30 Days</div>
                  </div>
                </div>
                <p className="checkin-quote">
                  Rated his bloating <strong>10 out of 10</strong> at the start. By day 30, he rated it a <strong>1</strong>.
                </p>
              </article>

              {/* Card 2: Aravind */}
              <article className="checkin-card">
                <div className="checkin-card__head">
                  <div className="checkin-avatar">
                    <img src={IMG.patAravind} alt="Aravind" />
                  </div>
                  <div>
                    <h3 className="checkin-name">Aravind, 46</h3>
                    <div className="checkin-tag">Gas, Bloating · 4 Weeks</div>
                  </div>
                </div>
                <p className="checkin-quote">
                  Noticed the <strong>gas and bloating ease first</strong>, before anything else changed.
                </p>
              </article>

              {/* Card 3: Shweta */}
              <article className="checkin-card">
                <div className="checkin-card__head">
                  <div className="checkin-avatar">
                    <img src={IMG.patShweta} alt="Shweta" />
                  </div>
                  <div>
                    <h3 className="checkin-name">Shweta, 36</h3>
                    <div className="checkin-tag">Irregular, Moody · 30 Days</div>
                  </div>
                </div>
                <p className="checkin-quote">
                  Reported feeling <strong>far less irritable</strong> by the end of the month.
                </p>
              </article>
            </div>

            <div className="checkins-footer">
              <p className="checkins-disclaimer">
                Each story is one person, self-reported. Your gut is its own story.
              </p>
              <Link className="btn btn--dark checkins-more-btn" to="/case-studies">
                Read more stories <Arr />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CLUB */}
      <section data-screen-label="T3B Club">
        <div className="club" data-reveal="">
          <div>
            <span className="eyebrow">Membership</span>
            <h2>The T3B Club</h2>
            <ul>
              {CLUB_POINTS.map((pt) => (
                <li key={pt}><Check size={20} /> {pt}</li>
              ))}
            </ul>
          </div>
          <div className="club__card">
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.8)" }}>Join the club</span>
            <div className="price" style={{ marginTop: 12 }}>₹2,878<span style={{ fontSize: "1rem", color: "rgba(255,255,255,.6)", fontWeight: 500 }}> / 3 months</span></div>
            <div className="per">₹32/day · save 20% vs one-off</div>
            <Link className="btn btn--white" to="/products/biome-balance" style={{ marginTop: 22, width: "100%" }}>Start my protocol</Link>
          </div>
        </div>
      </section>

      {/* BLOG + MEET TEASER */}
      <section className="sheet sheet--pad" data-screen-label="Journal">
        <div className="wrap">
          <div className="v5-blogteas">
            <div className="v5-bloghead"><div><span className="eyebrow">Letters from the lab</span><h2>Gut science,<br />plainly written.</h2></div><Link className="v5-bloglink" to="/journal">Read the journal →</Link></div>
            <div className="v5-bloggrid">
              {livePosts ? livePosts.map((p) => (
                <Link className="v5-blogcard" to={`/journal/${p.slug}`} key={p.slug}><div className="v5-blogcard__thumb" style={{ backgroundImage: `url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: 130 }}></div><div className="v5-blogcard__body"><div className="v5-blogcard__tag">{p.category}</div><h3>{p.title}</h3><p>{p.excerpt}</p><div className="v5-blogcard__meta"><span>{(String(p.readTime||"").match(/\d+/)||[""])[0] + " min"}</span><span>{new Date(p.date).toLocaleDateString("en-GB",{month:"long",year:"numeric"})}</span></div></div></Link>
              )) : BLOG_CARDS.map((b) => (
                <Link className="v5-blogcard" to="/journal" key={b.h}><div className="v5-blogcard__thumb" style={{ backgroundImage: `url(${b.img})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: 130 }}></div><div className="v5-blogcard__body"><div className="v5-blogcard__tag">{b.tag}</div><h3>{b.h}</h3><p>{b.p}</p><div className="v5-blogcard__meta"><span>{b.min}</span><span>{b.date}</span></div></div></Link>
              ))}
            </div>
          </div>
          <div className="v5-meetteas" style={{ marginTop: "clamp(24px,3vw,40px)" }}>
            <div className="v5-meetteas__l"><span className="eyebrow">Who we are</span><div className="v5-meetteas__stat">India’s 1st<span>postbiotic brand</span></div></div>
            <div className="v5-meetteas__r"><div><h2>We’d rather be right than loud.</h2><p>Formulated by doctors. CTRI-registered trial. US FDA-registered facility. We publish our limits, not just our wins.</p><div className="v5-meetteas__creds"><span>US FDA-registered</span><span>WHO-GMP</span><span>FSSAI</span><span>Proprietary tech</span></div></div><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Link className="btn btn--dark" to="/about">Meet Third Biome →</Link><Link className="btn" to="/evidence">See the evidence</Link></div></div>
          </div>
        </div>
      </section>

      {/* MEMBER & SCIENTIST STORIES / VIDEO CAROUSEL */}
      <StoriesSection />

      {/* CONVERSATIONAL FAQ (SUNNY & TIBBY) */}
      <ConversationalFaq />

      {/* GUT SCORE BANNER */}
      <section className="sheet sheet--pad gut-score-section" data-screen-label="Gut Score">
        <div className="wrap" data-reveal="">
          <div className="gut-score-banner">
            <h2 className="gut-score-banner__title">
              Your gut doesn't need more noise.<br />
              It needs a better starting point.
            </h2>
            <div className="gut-score-banner__actions">
              <Link to="/quiz" className="gut-score-banner__btn gut-score-banner__btn--score">
                Take the Gut Score
              </Link>
              <Link to="/products/biome-balance" className="gut-score-banner__btn gut-score-banner__btn--shop">
                Start feeling lighter · Shop now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SUBSCRIBE FREEBIE */}
      <section className="sheet sheet--pad" data-screen-label="Subscribe">
        <div className="wrap">
          <div className="v5-subfree">
            <div>
              <span className="eyebrow">Free guide + monthly letter</span>
              <h2>Get The Beginner’s Guide to <em>Postbiotics</em>, free.</h2>
              <p>Plain-English gut science, the GTB™ mechanism explained, a 30-day protocol starter, and ₹200 off your first order.</p>
              <div className="v5-freebie" style={{ marginTop: 18 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /></svg><div><b>Free: The Beginner’s Guide to Postbiotics</b><span>PDF · 18 pages · plain English</span></div></div>
            </div>
            <div>
              {!freebieSent && (
                <>
                  <form className="v5-subfree__form" id="subfreeForm" onSubmit={submitFreebie}>
                    <input type="email" placeholder="you@example.com" required value={freebieEmail} onChange={(e) => setFreebieEmail(e.target.value)} />
                    <button className="btn btn--dark" type="submit">Get it free →</button>
                  </form>
                </>
              )}
              <div className={`v5-subfree__success${freebieSent ? " on" : ""}`} id="subfreeSucc"><h3 style={{ color: "var(--leaf)", fontSize: "1.3rem", marginBottom: 8 }}>You're on the list ✓</h3><p style={{ color: "rgba(255,255,255,.65)" }}>We'll be in touch.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY BUY BAR */}
      <StickyBuy anchorId="hero" price={price} sub="One-time" mobileOnly buttonLabel="Try it" />
    </>
  );
}
