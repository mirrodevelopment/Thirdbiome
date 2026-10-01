/* Third Biome v3 "Full Depth", homepage split-test variant B.
   Served on "/" by HomeSplit (sticky assignment); direct review URL: /home-v3.
   Converted from design_handoff_third_biome_v3_home/site/index.html + home.js.
   Chrome (nav / footer / cart drawer / popup / reveal observer) comes from the
   shared v5 Layout, this file renders ticker → subscribe-freebie only.
   All CSS lives in ../styles/v3home.css, scoped under .v3home. */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IMG } from "../data/content";
import { useCart } from "../cart/CartProvider";
import contactService from "../../services/contactService";
import "../styles/v3home.css";

/* ---------- data (copy verbatim from the v3 handoff) ---------- */

const FSTRIP = [
  { icon: <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4z" />, b: "One hero ingredient", s: "Thirdbiome GTB™ · 500 mg" },
  { icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, b: "Works from dose one", s: "No colonising required" },
  { icon: <path d="M20 6 9 17l-5-5" />, b: "Clinically studied", s: "Randomised, double-blinded" },
  { icon: <path d="M12 5v14M5 12h14" />, b: "Clean & vegetarian", s: "No filler, no fairy dust" },
];

const STMT_STATS = [
  { n: "+74%", l: "Stool butyrate · GTB arm" },
  { n: "87%", l: "Reported less bloating" },
  { n: "9/10", l: "Calmer digestion by wk 2" },
  { n: "70%+", l: "Continue past month 1" },
];

const HCARDS = [
  {
    mod: "hcard--green", badge: "Science fact",
    n: <>70<span style={{ fontSize: ".5em" }}>%</span></>, what: "of colon cell energy from one fuel",
    h3: "Your gut lining runs on one fuel. Most people are running on empty.",
    p: "Colonocytes, the cells lining your gut, rely on butyrate for ~70% of their energy. Thirdbiome GTB™ delivers it directly where it's needed, bypassing stomach acid entirely.",
    foot: "Clinical literature on colonocyte metabolism · Thirdbiome GTB™ technology",
  },
  {
    mod: "hcard--purple", badge: "Real world evidence",
    n: <>87<span style={{ fontSize: ".5em" }}>%</span></>, what: "reported bloating reduction",
    h3: "In 30 days, members didn't just feel better, they understood why.",
    p: "Tracked across our T3B Club stewardship cohorts. Real people. Real gut protocols. Documented week by week, bloating, heaviness, energy, sleep.",
    foot: "T3B Club 30-day stewardship cohort data · Urban India · 2025-2026",
  },
  {
    mod: "hcard--ink", badge: "Delivery technology",
    blob: { width: 200, height: 200, background: "radial-gradient(circle,rgba(61,208,158,.2),transparent 70%)", top: -40, right: -40 },
    n: <>100<span style={{ fontSize: ".4em" }}>%</span></>, what: "stomach-acid protected",
    h3: "Most gut supplements never reach your gut. This one is engineered to.",
    p: "Precision microencapsulation, a lipid shell that survives your stomach and releases only at the colon, where your gut lining needs it. No degradation. Full potency.",
    foot: "Lipase-mediated hydrolysis mechanism · Third Biome proprietary",
  },
  {
    mod: "hcard--yellow", badge: "30-day stewardship",
    n: <>Wk<span style={{ fontSize: ".6em" }}>2</span></>, what: "when members first notice a shift",
    h3: "Gut repair doesn't happen overnight. But you'll know it's working.",
    p: "Members report the first real shift around day 10-14. By day 30, over 70% choose to continue. Our stewardship programme tracks every week.",
    foot: "T3B Club stewardship cohort · Biome Balance with Thirdbiome GTB™",
  },
  {
    mod: "hcard--pink", badge: "Mechanism of action",
    n: "3", what: "pathways activated · 1 molecule",
    h3: "One ingredient. Three measurable actions inside your gut.",
    p: "GTB™ works via TNF-alpha inhibition (inflammation), tight junction synthesis (leaky gut), and GLP-1 activation (metabolic balance), all in a single daily capsule.",
    foot: "Published clinical research on Glycerol Tributyrate · Third Biome dossier 2025",
  },
  {
    mod: "hcard--lav", badge: "Postbiotic vs probiotic",
    nStyle: { fontSize: "clamp(2.4rem,5vw,3.6rem)", lineHeight: 1.1 },
    n: <>Days<br /><span style={{ color: "var(--ink-soft)", fontSize: ".6em" }}>not weeks</span></>,
    what: "to start acting",
    h3: "Probiotics need to survive. Postbiotics are already there.",
    p: "Probiotics must colonise your gut, a slow, unpredictable process. GTB™ bypasses all of that. It acts directly on gut cells from day one. No colonisation. No guesswork.",
    foot: "Nature Reviews Gastroenterology & Hepatology, 2022 · ISAPP, 2021",
  },
];

const ECARDS = [
  { k: "01 · The basics", h3: "What is a postbiotic?", to: "/journal" },
  { k: "02 · The mechanism", h3: "How GTB™ works", to: "/products/biome-balance" },
  { k: "03 · The proof", h3: "Our honest trial", to: "/evidence" },
];

const JCARDS = [
  {
    k: "01", icon: <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4z" />,
    h3: "Survives the journey",
    p: "A pH-targeted capsule carries GTB past stomach acid, the leg of the trip where most gut actives are lost.",
  },
  {
    k: "02", icon: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
    h3: "Releases at the colon",
    p: "Right where it matters, lipases free butyrate, the short-chain fatty acid your large-intestine cells run on.",
  },
  {
    k: "03", icon: <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />,
    h3: "Repairs & calms",
    p: "Butyrate fuels colonocytes, tightens a leaky lining, and signals immune calm via IL-10 and Treg cells.",
  },
];

const GOALS = [
  { tile: "gtile--green", pill: "Daily", cat: "Digestion", title: "Bloating & heaviness", img: IMG.goalDigestion },
  { tile: "gtile--purple", pill: "Focus", cat: "Gut-brain", title: "Brain fog & mood", img: IMG.goalGutbrain },
  { tile: "gtile--yellow", pill: "Defence", cat: "Immunity", title: "Low resilience", img: IMG.goalImmunity },
  { tile: "gtile--pink", pill: "Balance", cat: "Metabolic", title: "Cravings & PMOS", img: IMG.goalMetabolic },
];

const SYMPTOMS = [
  "I feel bloated, and heavy even when I haven't eaten much. It's always so uncomfortable!",
  "I've started having trouble focussing. Memory feels off too.",
  "I sleep poorly, and wake up feeling tired and unrested.",
  "I feel this weird anxiety out of nowhere, most often after a meal with nausea & nervousness.",
  "I've developed food sensitivities I didn't used to have.",
  "My skin has gotten worse; it just keeps breaking out.",
  "My immunity has gone for a toss, I keep getting sick.",
  "My digestion is unpredictable, I never know what will upset my stomach or cause constipation.",
  "My joints ache, muscles are sore and I am generally fatigued.",
  "I have strong sugar cravings and can't control my carbs, and even then my energy crashes within the hour.",
  "I feel like I've suddenly developed more serious PMOS symptoms, terrible PMS, bouts of depression, loss of motivation.",
  "I have a CONSTANT headache!",
  "I barely eat, but I just cannot lose weight!",
  "I keep forgetting where I left my keys!",
];

const RWE_STATS = [
  { n: <>87<span>%</span></>, l: "reported bloating reduction" },
  { n: <>9<span>/10</span></>, l: "felt calmer digestion by week 2" },
  { n: <>70<span>%+</span></>, l: "continued past month 1" },
];

/* case-study deep links reuse the anchors that exist on /case-studies (id="v5-…") */
const PATIENTS = [
  { slug: "aravind", av: "A", name: "Aravind", meta: "46 · Male · 4 weeks", tag: "Chronic gas, bloating, gut-brain symptoms. No dietary changes.", n: "44%", l: "gas reduction" },
  { slug: "subashan", av: "S", name: "Subashan", meta: "21 · Male · 3 weeks", tag: "Bloating & low energy on high-protein diet. No other changes.", n: "~100%", l: "energy increase" },
  { slug: "alex", av: "Al", name: "Alex", meta: "40 · Male · 1 month", tag: "Gas, urgency, bowel irregularity, mood & sleep disruption.", n: "71%", l: "gas · urgency resolved" },
  { slug: "deepan", av: "D", name: "Deepan", meta: "20 · Male · 3 weeks", tag: "Bowel urgency, sugar cravings, acne & emotional disturbance.", n: "57%", l: "craving reduction" },
  { slug: "chakradhar", av: "C", name: "Chakradhar", meta: "25 · Male · 30 days", tag: "Brain fog, bad breath, fatigue & incomplete evacuation.", n: "75%", l: "oral health improvement" },
  { slug: "karthikayan", av: "K", name: "Karthikayan", meta: "30 · Male · 30 days", tag: "Severe bloating, dairy sensitivity, sugar cravings & acne.", n: "90%", l: "bloating reduction" },
  { slug: "shweta", av: "Sw", name: "Shweta", meta: "36 · Female · 30 days", tag: "Chronic constipation, fasting headaches, mood & fatigue.", n: "80%", l: "irritability reduction" },
];

const QA_PANELS = [
  {
    q: "Can you survive stomach acids?",
    g: <><b>Not really.</b> More often than not, we get killed en route.</>,
    p: <><b>Always!</b> There's nothing to kill, I'm structurally stable!</>,
    faces: true,
  },
  {
    q: "Do you need an existing microbiome to start working?",
    g: <><b>It helps a LOTTT</b> if there's native bacteria, especially to make my survival more probable. Native bacteria keep less space & resources for harmful bacteria, and assist in survival and performance in so many ways that make them indispensable.</>,
    p: <><b>No, it makes no difference.</b> Since I am made up of the end products synthesised by microbiota, I don't need an existing microbiome, I work independently.</>,
  },
  {
    q: "What about colonising the gut?",
    g: <><b>I do need to colonise.</b> Building up enough numbers of every strain is necessary to provide an adequate quantity of metabolites. Success isn't guaranteed every time, the rate depends on so many variables, making it hard to guarantee results.</>,
    p: <><b>Absolutely not!</b> I am made up of maximum structures and metabolites, organic acids, peptides, secreted proteins, enzymes, bacteriocins et cetera. I am the end product, so I get right to work.</>,
  },
  {
    q: "How potent is each dose?",
    g: <><b>It varies.</b> My survival depends on a number of things, and therefore so does the performance and potency, a fair amount, batch to batch, depending on storage and where I am in my lifespan (which varies from 1-3 years).</>,
    p: <><b>Precise & consistent.</b> Since I am not alive, I cannot die, my potency remains intact. No stability concern, and I don't have to be gastro-resistant, so I perform consistently once ingested, independent of the host gut.</>,
  },
  {
    q: "What if I have a sensitive stomach?",
    g: <><b>We must ferment.</b> As live microorganisms we actively ferment and survive in your gut, but that process causes temporary gas, bloating and cramps. In severely compromised guts there's a small risk of infection too.</>,
    p: <><b>Super gentle</b> on all kinds of guts, more stable and less likely to cause gas or bloating. I'm inanimate, ready-to-use, and bypass the messy fermentation process entirely.</>,
  },
  {
    q: "How long does it take to start working?",
    g: <><b>1 to 4 weeks</b> to show noticeable improvements; chronic conditions can take up to 12 weeks. The exact timeline depends on what you're treating, the health of your microbiome, and the strains you take.</>,
    p: <><b>I hit the gut running.</b> Just 1-7 days to start noticing significant improvement. I'm made of fully-formed byproducts, so your body doesn't wait for live bacteria to wake up, find food and ferment.</>,
  },
];

const PROTOCOLS = [
  {
    k: "01 · Try it", pill: "pill--mint", pillLabel: "Starter", h3: "1 Month",
    num: "30", cap: "capsules · 30 days",
    desc: "A single 30-day bottle to feel the first shift, gas and bloating usually ease first.",
    list: ["30 capsules", "30-day promise"],
    now: "₹1,199", was: "₹1,499", btn: "btn--outline", label: "Add to bag →",
  },
  {
    feat: true, k: "02 · Most chosen", pill: "pill--green", pillLabel: "Save 20%", h3: "3 Months",
    num: "90", cap: "capsules · 3 months",
    desc: "The full protocol. Gut-brain symptoms tend to settle in the second and third month.",
    list: ["90 capsules", "Free shipping", "Best value per day"],
    now: "₹3,599", was: "₹4,497", btn: "btn--yellow", label: "Add to bag →",
  },
  {
    k: "03 · Hands-off", pill: "pill--mint", pillLabel: "Subscribe", h3: "Monthly",
    num: <>30<span style={{ fontSize: ".5em" }}>/mo</span></>, cap: "auto-delivered",
    desc: "Your Biome Balance, delivered every month. Never run out, never overthink it.",
    list: ["30 capsules / month", "Skip or cancel anytime"],
    now: "₹959", was: "₹1,199", btn: "btn--green", label: "Subscribe →",
  },
];

/* testimonial portraits pending, product/lifestyle shots stand in (v5 photo set) */
const TESTIMONIALS = [
  {
    mod: "tcard--light", idx: 0, meta: "Biome Balance user, 6 months", name: "Harpreet Kaur", nameMod: "",
    quote: "The bloating eased in the first week, and by the second month the afternoon fog I'd lived with for years had genuinely lifted. One honest capsule a day.",
    btn: "btn--green", img: IMG.lifestyle, slot: "tslot tslot--bw",
    alt: "Biome Balance in Harpreet's daily ritual, bottle in hand",
  },
  {
    mod: "tcard--dark", idx: 1, meta: "Biome Balance user, 3 months", name: "Ananya Rao", nameMod: " tcard__name--dark",
    quote: "What sold me was the honesty, they show the actual trial and its limits. My digestion is finally predictable, and I trust what I'm putting in my body.",
    btn: "btn--white", img: IMG.linen, slot: "tslot",
    alt: "Ananya's Biome Balance bottle resting on linen",
  },
  {
    mod: "tcard--dark", idx: 2, meta: "Biome Balance user, 14 months", name: "Meera Nair", nameMod: " tcard__name--dark",
    quote: "One capsule, no 12-step routine. The sugar cravings that used to run my afternoons are gone, and my energy holds steady right through the day.",
    btn: "btn--white", img: IMG.duo, slot: "tslot",
    alt: "Meera's protocol, a duo of Biome Balance bottles",
  },
];

const REVIEWS = [
  { p: "“My mornings are finally regular again, I'm not planning my day around my gut anymore.”", nm: "Riya M.", loc: "Mumbai · Verified" },
  { p: "“Didn't expect this, but I'm sleeping deeper and waking up less groggy. It's held for three months.”", nm: "Arjun S.", loc: "Bengaluru · Verified" },
  { p: "“The heavy, sluggish feeling after lunch has eased a lot. No more 4pm slump for me.”", nm: "Neha K.", loc: "Delhi · Verified" },
];

const CREDS = [
  { b: "Facility", t: "US FDA-registered, WHO-GMP" },
  { b: "Trial", t: "CTRI-registered, double-blinded RCT" },
  { b: "Active", t: "GRAS-status butyrate / tributyrin" },
  { b: "IP", t: "Proprietary technology" },
  { b: "Result", t: "+74% stool butyrate, GTB arm" },
];

const PROMISES = [
  {
    k: "01", icon: <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4z" />,
    h3: "One honest ingredient", p: "500 mg of Thirdbiome GTB™, fully labelled.",
  },
  {
    k: "02", icon: <path d="M20 6 9 17l-5-5" />,
    h3: "Clinically studied", p: "A CTRI-registered, randomised, double-blinded trial, with limits we disclose.",
  },
  {
    k: "03", icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    h3: "Works from dose one", p: "The finished compound, no colony to grow, no weeks of waiting to find out.",
  },
  {
    k: "04", icon: <path d="M6 8h12l-1 12H7L6 8zM9 8V6a3 3 0 0 1 6 0v2" />,
    h3: "Clean label", p: "Vegetarian, no needless filler. GRAS-status active, GMP-made.",
  },
  {
    k: "05", icon: <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />,
    h3: "Made in India", p: "Formulated by doctors, produced in a US FDA-registered, WHO-GMP facility.",
  },
  {
    k: "06", icon: <path d="M12 5v14M5 12h14" />,
    h3: "Built for modern life", p: "One capsule a day for the diet, pace and stress your gut wasn't built for.",
  },
];

const CLUB_FEATS = [
  { k: "A", t: "90-day guided protocol" },
  { k: "B", t: "Monthly delivery, auto-pilot" },
  { k: "C", t: "Weekly check-ins & the science, plainly" },
  { k: "D", t: "Direct line to our medical team" },
];

const FINDER_PILLS = [
  "Bloating & heaviness", "Brain fog & focus", "Poor sleep", "Skin breakouts", "Low immunity",
  "Irregular digestion", "Sugar cravings", "PMOS & mood", "Stress & anxiety",
];

const BLOG_POSTS = [
  {
    img: IMG.blogCapsules,
    tag: "Start here · The basics", tagStyle: undefined,
    h3: "What is a postbiotic, and why does it matter more than a probiotic?",
    p: "The metabolites that do the real work, explained plainly.",
    meta: ["6 min read", "June 2026"],
  },
  {
    img: IMG.blogLeaf,
    tag: "Comparison · Honest take", tagStyle: undefined,
    h3: "Probiotics vs Postbiotics, the comparison the industry doesn’t want you to see.",
    p: "Survival rates, timelines, consistency. Side by side, with sources.",
    meta: ["8 min read", "May 2026"],
  },
  {
    img: IMG.blogTexture,
    tag: "Protocol · 30 days", tagStyle: { color: "var(--pink-strong)" },
    h3: "30 days on Biome Balance, what to expect, week by week.",
    p: "A realistic timeline based on our stewardship cohort data.",
    meta: ["5 min read", "April 2026"],
  },
];

const FAQS = [
  {
    q: "Is this a probiotic?",
    a: "No. It's a postbiotic, the finished compound (butyrate, via Thirdbiome GTB™) your gut would normally make for itself. There are no live cultures to keep alive or hope will colonise.",
    open: true,
  },
  {
    q: "When will I notice something?",
    a: "Most people feel gas and bloating ease within the first week or two. Gut-brain and systemic benefits build over the season, think months, not days.",
  },
  {
    q: "Is the technology proprietary?",
    a: "The technology is proprietary. We say proprietary, nothing we can't stand behind.",
  },
  {
    q: "What exactly was in your trial?",
    a: "A registered, randomised, double-blinded RCT (CTRI/2025/09/094597) over 45 days. The GTB arm raised stool butyrate by 74%, with symptom scores significantly improving alongside.",
  },
  {
    q: "Who shouldn't take it?",
    a: "If you're pregnant, nursing, on medication, or managing a condition, check with your doctor first. It's a food-grade postbiotic, but your context matters.",
  },
];

/* shared smiley face used by the shop-by-goal tiles */
const GOAL_FACE = (
  <svg className="gtile__face" viewBox="0 0 64 64" aria-hidden="true">
    <circle className="ring" cx="32" cy="32" r="29" fill="none" strokeWidth="3" />
    <circle className="feat" cx="23" cy="27" r="3.2" />
    <circle className="feat" cx="41" cy="27" r="3.2" />
    <path className="ring" d="M21 40c4 6 18 6 22 0" fill="none" strokeWidth="3.2" strokeLinecap="round" />
  </svg>
);

const CK_SVG = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
);

/* ---------- FAQ accordion item (max-height transition, per home.js) ---------- */
function V3AccItem({ q, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef(null);
  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.style.maxHeight = open ? b.scrollHeight + "px" : "0px";
  }, [open]);
  return (
    <div className={`acc__item${open ? " open" : ""}`}>
      <button className="acc__head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {q}<span className="acc__ic">+</span>
      </button>
      <div className="acc__body" ref={bodyRef}>{children}</div>
    </div>
  );
}

/* ---------- pinned hero scrub (reimplements home.js heroPin) ---------- */
const HERO_BOUNDS = [0, 0.16, 0.44, 0.7, 1.01];

function usePinnedHero(reduced) {
  const heroRef = useRef(null);
  const bottleRef = useRef(null);
  const haloRef = useRef(null);
  const [stage, setStage] = useState(reduced ? 3 : 0);

  useEffect(() => {
    if (reduced) return undefined; /* final state rendered statically, no scrub */
    const hero = heroRef.current, bottle = bottleRef.current, halo = haloRef.current;
    if (!hero) return undefined;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const total = hero.offsetHeight - vh;
      const p = total > 0 ? clamp(-hero.getBoundingClientRect().top / total, 0, 1) : 0;
      /* real bottle photo: gentle sway instead of a full 360 flip (a flat
         image can't convincingly show its back) */
      const angle = Math.sin(p * Math.PI * 2) * 8;
      const scale = 0.98 + 0.1 * clamp(p / 0.7, 0, 1);
      const bob = Math.sin(p * Math.PI) * -10;
      if (bottle) bottle.style.transform = `translateY(${bob.toFixed(0)}px) rotateY(${angle.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      if (halo) halo.style.transform = `scale(${(1 + p * 0.34).toFixed(3)})`;
      let s = 0;
      for (let i = 0; i < HERO_BOUNDS.length - 1; i++) {
        if (p >= HERO_BOUNDS[i] && p < HERO_BOUNDS[i + 1]) { s = i; break; }
      }
      setStage(s);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return { heroRef, bottleRef, haloRef, stage };
}

export default function HomeV3() {
  const { add, busy } = useCart();
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const { heroRef, bottleRef, haloRef, stage } = usePinnedHero(reduced);

  /* symptom chips + finder pills: click-to-toggle "on" (front-end only, per home.js) */
  const [sympOn, setSympOn] = useState(() => new Set());
  const [pillsOn, setPillsOn] = useState(() => new Set());
  const toggle = (setter) => (i) =>
    setter((prev) => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next; });
  const toggleSymp = toggle(setSympOn);
  const togglePill = toggle(setPillsOn);

  /* subscribe-freebie form: posts the email via contactService, then shows a
     truthful front-end success state (kept even if the call fails) */
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
    <div className="v3home">

      {/* ===================== TICKER ===================== */}
      <div className="ticker">
        <div className="wrap ticker__in">
          <span className="ticker__a">‹</span>
          <span className="ticker__t">Free shipping over ₹999 · COD across India · The postbiotic revolution</span>
          <span className="ticker__a">›</span>
        </div>
      </div>

      {/* ===================== HERO (pinned, multi-stage) ===================== */}
      <section className="hero2" id="hero" data-screen-label="Hero" ref={heroRef}>
        <div className="hero2__pin">
          <span className="hero2__blob b1"></span>
          <span className="hero2__blob b2"></span>
          <span className="hero2__blob b3"></span>
          <svg className="smiley" style={{ left: "13%", top: "20%" }} viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="30" fill="var(--pink)" />
            <circle cx="23" cy="27" r="3.4" fill="var(--ink)" /><circle cx="41" cy="27" r="3.4" fill="var(--ink)" />
            <path d="M21 40c4 6 18 6 22 0" stroke="var(--ink)" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          </svg>

          <div className="hero2__textzone" id="heroText">
            <div className={`htext${stage === 0 ? " on" : ""}`} data-stage="0">
              <span className="kicker">Clinically tested · Proprietary · Made in India</span>
              <h1>Trust the gut.<br />Question the <em>noise.</em></h1>
              <p className="hero2__sub">One proprietary postbiotic, Thirdbiome GTB™, delivered straight to your colon, where it works from the very first dose.</p>
            </div>
            <div className={`htext${stage === 1 ? " on" : ""}`} data-stage="1">
              <span className="hcap__k">01 · Survives the journey</span>
              <h2>Past stomach acid, <span className="acc-g">intact.</span></h2>
              <p>A pH-targeted capsule carries GTB through the stomach, the leg of the trip where most gut actives are lost.</p>
            </div>
            <div className={`htext${stage === 2 ? " on" : ""}`} data-stage="2">
              <span className="hcap__k">02 · Releases at the colon</span>
              <h2>Exactly where it <span className="acc-p">counts.</span></h2>
              <p>Lipases free butyrate, the short-chain fatty acid your colon's lining cells actually run on.</p>
            </div>
            <div className={`htext${stage === 3 ? " on" : ""}`} data-stage="3">
              <span className="hcap__k">03 · Repairs & calms</span>
              <h2>Seals the lining. <span className="acc-y">Settles the noise.</span></h2>
              <p>Butyrate fuels colonocytes, tightens tight junctions, and signals immune calm, from dose one.</p>
            </div>
          </div>

          <div className="hero2__foot">
            <div className="hero2__cta">
              <Link className="btn btn--green btn--lg" to="/products/biome-balance">Shop Biome Balance →</Link>
              <a className="btn btn--outline" href="#evidence">See the evidence</a>
            </div>
            <div className="hero2__rail">
              {[1, 2, 3].map((s) => <i key={s} className={stage === s ? "on" : ""}></i>)}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURE STRIP ===================== */}
      <div className="fstrip">
        <div className="wrap fstrip__in">
          {FSTRIP.map((f) => (
            <div className="fitem" key={f.b}>
              <span className="fitem__ic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{f.icon}</svg>
              </span>
              <div><b>{f.b}</b><span>{f.s}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== QUOTE (signature) ===================== */}
      <section className="section quote" data-screen-label="Quote">
        <div className="wrap">
          <p className="quote__q"><span className="quote__mark">“</span>India's first <b>proprietary</b> <i>clinically-tested</i>, <b>postbiotic solution</b>, formulated by doctors that <b>repairs the intestinal barrier.</b><span className="quote__mark">”</span></p>
          <p className="quote__sub">Or in short, your <u>personalised</u>, hi-tech <b>gut repair</b> toolkit.</p>
        </div>
      </section>

      {/* ===================== STATEMENT + STATS ===================== */}
      <section className="section stmt" data-screen-label="Statement">
        <div className="wrap">
          <span className="kicker">The premise</span>
          <h2><span className="mut">Your gut still runs on ancient wiring,</span> we give it a modern, measurable repair tool.</h2>
          <div className="stmt__stats">
            {STMT_STATS.map((s) => (
              <div className="scell" key={s.l}><div className="n">{s.n}</div><div className="l">{s.l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HIGHLIGHTS ===================== */}
      <section className="section hlights" data-screen-label="Highlights">
        <div className="wrap">
          <span className="kicker kicker--y">The science, in numbers</span>
          <h2>Seven things worth <em>knowing.</em></h2>
          <div className="hgrid">
            {HCARDS.map((c) => (
              <div className={`hcard ${c.mod}`} key={c.badge}>
                {c.blob && <div className="hcard__blob" style={c.blob}></div>}
                <span className="hcard__badge">{c.badge}</span>
                <div className="hcard__n" style={c.nStyle}>{c.n}</div>
                <div className="hcard__what">{c.what}</div>
                <div className="hcard__div"></div>
                <h3>{c.h3}</h3>
                <p>{c.p}</p>
                <div className="hcard__foot">{c.foot}</div>
              </div>
            ))}

            <div className="hcard hcard--ink hcard--wide">
              <div className="hcard__blob" style={{ width: 320, height: 320, background: "radial-gradient(circle,rgba(61,208,158,.1),transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}></div>
              <div className="hcard__body">
                <span className="hcard__badge">India's first</span>
                <div className="hcard__div"></div>
                <h3 style={{ fontSize: "clamp(1.2rem,2vw,1.6rem)" }}>India didn't have a postbiotic brand. We built one, with proprietary technology to prove it.</h3>
                <p>Third Biome is India's first precision postbiotic ecosystem. FSSAI-approved. Proprietary GTB technology. Clinically designed. Not a probiotic with a new label, a genuinely new category.</p>
              </div>
              <div className="hcard__stats">
                <div className="hstat"><span className="n">16</span><span className="l">SKUs in pipeline across gut, PCOD, sleep, skin, liver</span></div>
                <div className="hstat"><span className="n">1st</span><span className="l">postbiotic-dedicated consumer brand in India</span></div>
                <div className="hstat"><span className="n">90%</span><span className="l">of serotonin produced in the gut, we protect that ecosystem</span></div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "clamp(24px,3vw,36px)" }}>
            <Link className="btn btn--outline" to="/evidence">See the full evidence →</Link>
          </div>
        </div>
      </section>

      {/* ===================== POSTBIOTICS EXPLAINED ===================== */}
      <section className="section expl" id="how" data-screen-label="Postbiotics explained">
        <div className="wrap">
          <span className="kicker">Start here · The science, simply</span>
          <h2>Postbiotics, <span className="acc-y">explained.</span></h2>
          <div className="explgrid">
            {ECARDS.map((e) => (
              <Link className="ecard" to={e.to} key={e.k}>
                <div><div className="ecard__k">{e.k}</div><h3>{e.h3}</h3></div>
                <span className="ecard__read">Read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== THREE JOBS ===================== */}
      <section className="section jobs" data-screen-label="Three jobs">
        <div className="wrap">
          <div className="jobs__top">
            <div>
              <span className="kicker kicker--p">How Thirdbiome GTB™ works</span>
              <h2>One ingredient.<br />Three <span className="acc-p">jobs.</span></h2>
            </div>
            <p className="jobs__note">Micro-encapsulated glyceryl tributyrate, engineered for every step of the journey.</p>
          </div>
          <div className="jobsgrid">
            {JCARDS.map((j) => (
              <div className="jcard" key={j.k}>
                <div className="jcard__top">
                  <span className="jcard__k">{j.k}</span>
                  <span className="jcard__ic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{j.icon}</svg>
                  </span>
                </div>
                <h3>{j.h3}</h3><p>{j.p}</p>
              </div>
            ))}
          </div>
          <p className="jobs__foot">Butyrate can also cross the blood-brain barrier to act on microglia and BDNF, the real, evidence-backed route between a calmer gut and a clearer head. <b>The science here is strong and still growing.</b></p>
        </div>
      </section>

      {/* ===================== SCIENCE / CAPSULE (glasssci) ===================== */}
      <section className="section glasssci" data-screen-label="How it reaches your gut">
        <div className="glasssci__bg">
          <img src={IMG.microbes} alt="Gut microbes under magnification, the ecosystem GTB™ is engineered for" />
        </div>
        <div className="glasssci__grain"></div>
        <div className="wrap" data-reveal="">
          <div className="gpanel">
            <div className="gpanel__body">
              <span className="gpanel__eye">GTB™ delivery technology</span>
              <h2>Most gut actives don’t survive the trip. <em>GTB™ does.</em></h2>
              <div className="gchip">
                <span className="gchip__tag">GTB arm</span>
                <span className="gchip__txt">Raised stool butyrate</span>
                <span className="gchip__n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 19V5M5 12l7-7 7 7" /></svg>74%</span>
              </div>
              <p className="gpanel__fine">Registered, double-blinded RCT · 45 days · CTRI/2025/09/094597</p>
            </div>
            <div className="gpanel__cap">
              <div className="anno anno--out">
                <div className="anno__k">Outer shell</div>
                <p>Keeps GTB™ intact through your stomach, the part of the journey where most gut actives quietly give up.</p>
              </div>
              <span className="anno__line anno__line--out"></span>
              <div className="capsule"><span className="capsule__top"></span><span className="capsule__bot"></span></div>
              <span className="anno__line anno__line--in"></span>
              <div className="anno anno--in">
                <div className="anno__k">Inner core</div>
                <p>Opens at the colon, exactly where your gut lining needs it to.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PDP TEASER ===================== */}
      <section className="section pdpt" data-screen-label="Hero product">
        <div className="wrap pdpt__in">
          <div className="pdpt__media">
            <img src={IMG.hero} alt="Biome Balance, a 30-capsule bottle of Thirdbiome GTB™" />
          </div>
          <div>
            <span className="kicker kicker--pk">The hero product</span>
            <h2>Biome Balance</h2>
            <div className="pdpt__stars"><b>300+</b> members · 4 T3B Club cohorts</div>
            <span className="pill pill--mint pdpt__tag">One ingredient: Thirdbiome GTB™ · 500 mg / day</span>
            <p className="pdpt__desc">Foundational postbiotic gut support, no filler, no fairy dust. Just the compound your gut would make for itself, delivered exactly where it counts.</p>
            <ul className="pdpt__list">
              <li><span className="ck">{CK_SVG}</span> Repairs the gut lining & tightens tight junctions</li>
              <li><span className="ck">{CK_SVG}</span> Fuels colonocytes, the cells lining your colon</li>
              <li><span className="ck">{CK_SVG}</span> 30 capsules · 30 servings · vegetarian</li>
            </ul>
            <div className="pdpt__cta">
              <Link className="btn btn--green" to="/products/biome-balance">View product →</Link>
              <span className="pdpt__price">₹959<s>₹1,199</s></span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SHOP BY GOAL (ink) ===================== */}
      <section className="section shopgoal" id="shop" data-screen-label="Shop by goal">
        <div className="wrap">
          <div className="goalhead">
            <div>
              <span className="kicker kicker--y">Where it shows up · Shop by goal</span>
              <h2>What's your gut working against?</h2>
            </div>
            <a className="goallink" href="#finder">Take the 30-second finder →</a>
          </div>
          <div className="goalgrid">
            {GOALS.map((g) => (
              <Link className="gcard" to="/products/biome-balance" key={g.cat}>
                <div className={`gtile ${g.tile}`}>
                  <span className="pill pill--ghost gtile__pill">{g.pill}</span>
                  <img className="gtile__art" src={g.img} alt={`${g.cat} anatomy`} loading="lazy" />
                </div>
                <div className="gcard__foot">
                  <div><div className="gcard__cat">{g.cat}</div><div className="gcard__title">{g.title}</div></div>
                  <span className="gcard__arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SYMPTOMS (signature) ===================== */}
      <section className="section symp" data-screen-label="Symptoms">
        <div className="wrap">
          <h2>Let's talk through how it really affects <span className="p">your life</span>, click on any that apply:</h2>
          <div className="symp__cloud">
            {SYMPTOMS.map((s, i) => (
              <button type="button" className={`chip${sympOn.has(i) ? " on" : ""}`} onClick={() => toggleSymp(i)} key={s}>{s}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== REAL-WORLD EVIDENCE ===================== */}
      <section className="section rwe" id="evidence" data-screen-label="Real-world evidence">
        <div className="wrap">
          <span className="kicker">Real-world evidence · T3B Club stewardship</span>
          <h2 className="rwe__title">In 30 days, members didn't just feel better. <em>They understood why.</em></h2>
          <div className="rwe__stats">
            {RWE_STATS.map((s) => (
              <div className="rwestat" key={s.l}><div className="n">{s.n}</div><div className="l">{s.l}</div></div>
            ))}
          </div>
          <p className="rwe__note">Tracked across our T3B Club 30-day stewardship cohorts, real people on real gut protocols, documented week by week for bloating, heaviness, energy and sleep. Not a marketing survey; a stewardship record.<span>Urban India · 2025-2026 · self-reported, limits disclosed</span></p>
        </div>
      </section>

      {/* ===================== HOW WE HELPED ===================== */}
      <section className="section helped" data-screen-label="How we helped">
        <div className="wrap">
          <span className="kicker">Real guts, real results</span>
          <h2>How we helped <em>patients.</em></h2>
          <div className="patgrid">
            {PATIENTS.map((p) => (
              <Link className="pat-card" to={`/case-studies#v5-${p.slug}`} key={p.slug}>
                <div className="pat-card__av">{p.av}</div>
                <div className="pat-card__name">{p.name}</div>
                <div className="pat-card__meta">{p.meta}</div>
                <div className="pat-card__tag">{p.tag}</div>
                <div className="pat-card__stat"><span className="n">{p.n}</span><span className="l">{p.l}</span></div>
              </Link>
            ))}
          </div>
          <div className="helped__foot">
            <Link className="btn btn--yellow" to="/case-studies">Read all case studies →</Link>
            <p className="helped__disc">All cases are single-participant, self-reported, and do not establish causality. No dietary changes were made in 5 of 7 cases.</p>
          </div>
        </div>
      </section>

      {/* ===================== EVOLVED BAND (signature) ===================== */}
      <section className="section evolved" data-screen-label="Evolved solution">
        <div className="wrap">
          <h2>Probiotics may be a <i>good</i> solution; <span className="p">Postbiotics</span> are an <i>evolved</i> solution.</h2>
          <p className="evolved__sub">Let's have a little chat, probiotic vs postbiotic.</p>
        </div>
      </section>

      {/* ===================== PROBIOTICS VS POSTBIOTICS (signature Q&A) ===================== */}
      <section className="section pvs" data-screen-label="Probiotics vs Postbiotics">
        <div className="wrap">
          <h2><span className="g">Probiotics</span> <span className="v">vs</span> <span className="p">Postbiotics</span></h2>
          <p className="pvs__sub">What exactly is different?</p>
        </div>
      </section>

      <section className="qa" data-screen-label="Probiotic vs postbiotic Q&A">
        <div className="wrap">
          {QA_PANELS.map((panel) => (
            <div className="qa__panel" key={panel.q}>
              <h3 className="qa__q">{panel.q}</h3>
              <div className="qa__cols">
                <p className="qa__col qa__col--g">{panel.g}</p>
                <p className="qa__col qa__col--p">{panel.p}</p>
              </div>
              {panel.faces && (
                <div className="qa__faces">
                  <div className="faceitem"><span>Probiotic</span>
                    <svg className="facecircle" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="var(--green)" strokeWidth="2.5" /><circle cx="17" cy="20" r="2.4" fill="var(--green)" /><circle cx="31" cy="20" r="2.4" fill="var(--green)" /><path d="M16 33c2.6-3.4 13.4-3.4 16 0" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" /></svg>
                  </div>
                  <div className="faceitem">
                    <svg className="facecircle" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="var(--purple)" strokeWidth="2.5" /><circle cx="17" cy="20" r="2.4" fill="var(--purple)" /><circle cx="31" cy="20" r="2.4" fill="var(--purple)" /><path d="M16 29c2.6 3.4 13.4 3.4 16 0" stroke="var(--purple)" strokeWidth="2.5" strokeLinecap="round" /></svg>
                    <span>Postbiotic</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===================== PRICING / PROTOCOLS ===================== */}
      <section className="section" data-screen-label="Protocols">
        <div className="wrap">
          <div className="prhead">
            <div>
              <span className="kicker kicker--p">Commit & save · Protocols</span>
              <h2>Gut repair takes a <span className="acc-p">season.</span></h2>
            </div>
            <div className="prhead__note">Free shipping over ₹999 · COD available</div>
          </div>
          <div className="prgrid">
            {PROTOCOLS.map((c) => (
              <div className={`prcard${c.feat ? " feat" : ""}`} key={c.k}>
                <div className="prcard__top"><span className="prcard__k">{c.k}</span><span className={`pill ${c.pill}`}>{c.pillLabel}</span></div>
                <h3>{c.h3}</h3>
                <div className="prcard__count"><span className="num">{c.num}</span><span className="cap">{c.cap}</span></div>
                <p className="prcard__desc">{c.desc}</p>
                <ul className="prlist">
                  {c.list.map((li) => <li key={li}><span className="ck">✓</span> {li}</li>)}
                </ul>
                <div className="prprice"><span className="now">{c.now}</span><span className="was">{c.was}</span></div>
                <button type="button" className={`btn ${c.btn} btn--full`} disabled={busy} onClick={() => add()}>{c.label}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS (signature cards) ===================== */}
      <section className="section" data-screen-label="Testimonials" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="tgrid">
            {TESTIMONIALS.map((t) => (
              <article className={`tcard ${t.mod}`} key={t.name}>
                <div className="tcard__body">
                  <div className="tcard__top">
                    <div className="tcard__brand">The T3B Experience</div>
                    <div className="pager">
                      {["01", "02", "03", "04"].map((n, i) => (
                        <span className={i === t.idx ? "on" : ""} key={n}>{n}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="tcard__meta">{t.meta}</div>
                    <h3 className={`tcard__name${t.nameMod}`}>{t.name}</h3>
                    <p className="tcard__quote">{t.quote}</p>
                    <Link className={`btn ${t.btn}`} to="/products/biome-balance">Buy now</Link>
                  </div>
                </div>
                <img className={t.slot} src={t.img} alt={t.alt} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== REVIEWS ===================== */}
      <section className="section reviews" data-screen-label="Reviews">
        <div className="wrap">
          <div className="rvhead">
            <div>
              <span className="kicker kicker--pk">Real guts, real talk · Reviews</span>
              <h2>Quiet wins, in their words.</h2>
            </div>
            <div className="rvscore"><span className="n">300+</span><div><div className="s">T3B Club members</div><div className="c">across 4 cohorts</div></div></div>
          </div>
          <div className="rvgrid">
            {REVIEWS.map((r) => (
              <div className="rvcard" key={r.nm}>
                <div className="stars">★★★★★</div>
                <p>{r.p}</p>
                <div className="rvcard__who"><span className="rvcard__nm">{r.nm}</span><span className="rvcard__loc">{r.loc}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STORIES (mixed media) ===================== */}
      <section className="section" data-screen-label="Stories" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stories__head">
            <span className="kicker">Real guts, real stories</span>
            <h2>From members, doctors & the lab.</h2>
          </div>
          <div className="storiesgrid">
            <div className="stile stile--note stile--g stile--tall"><p>“Six months in, eating out doesn’t wreck my stomach the way it used to.”</p><span>Riya · 6 months in</span></div>
            <div className="stile stile--quote"><p>“They published the trial and its limits before running a single ad. That’s why I trusted it.”</p><span>Arjun S. · Verified</span></div>
            <figure className="stile" style={{ overflow: "hidden" }}>
              <img src={IMG.lifestyle} alt="Biome Balance in hand, part of the daily ritual" />
            </figure>
            <div className="stile stile--note stile--y"><p>One honest ingredient, Thirdbiome GTB™, fully disclosed.</p><span>500 mg / day</span></div>
            <div className="stile stile--press"><p>“Quietly building the postbiotic category in India.”</p><span className="press">Founding Circle</span></div>
          </div>
        </div>
      </section>

      {/* ===================== BIG TYPE BAND ===================== */}
      <section className="bandx" data-screen-label="Band">
        <div className="wrap">
          <h2>Trust the gut.<br />Question the <em>noise.</em></h2>
          <p>India's first proprietary postbiotic · Made in India</p>
        </div>
      </section>

      {/* ===================== STORY / ABOUT ===================== */}
      <section className="section" id="story" data-screen-label="Our story">
        <div className="wrap story2">
          <div className="creds">
            <span className="kicker">Receipts, not hype</span>
            <h3>Built to be fact-checked.</h3>
            <ul className="creds__list">
              {CREDS.map((c) => <li key={c.b}><b>{c.b}</b> {c.t}</li>)}
            </ul>
          </div>
          <div>
            <span className="kicker kicker--p">Our story · Made in India</span>
            <h2>We'd rather be <em>right</em> than loud.</h2>
            <p>Gut health is full of hype, strain counts no one can verify, mood claims with no mechanism, "clinically proven" doing a lot of heavy lifting. We're building the opposite: a brand you can fact-check.</p>
            <p>Thirdbiome GTB™ is India's first proprietary postbiotic of its kind, formulated by doctors and made in a US FDA-registered facility. We ran a double-blinded trial before we ran ads, and we publish its limits, not just its wins.</p>
            <div className="founders">
              <div className="founder"><span className="av">J</span><div><b>Jayavardhini</b><span>Founder & CEO</span></div></div>
              <div className="founder"><span className="av">A</span><div><b>Dr. Ariarasudhan</b><span>Clinical lead</span></div></div>
            </div>
            <div className="credstrip">
              <span>US FDA-registered facility</span><span>WHO-GMP</span><span>CTRI-registered RCT</span><span>GRAS active</span><span>Proprietary</span><span>FSSAI</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MEET TEASER ===================== */}
      <section className="section" data-screen-label="Meet Third Biome">
        <div className="wrap">
          <div className="meet-teas">
            <div className="meet-teas__media">
              <span className="kicker">Aeobiome Healthcare Pvt. Ltd.</span>
              <div className="meet-teas__stat">India's <span>first</span><br />postbiotic brand.</div>
            </div>
            <div>
              <span className="kicker kicker--p">Who we are</span>
              <h2>We'd rather be <em>right</em> than loud.</h2>
              <p>Gut health is full of hype, strain counts no one can verify, mood claims with no mechanism. We built the opposite: a brand you can fact-check. One proprietary postbiotic. One CTRI-registered trial. Full transparency on limits.</p>
              <p style={{ marginTop: 12 }}>Formulated by doctors. Made in a US FDA-registered facility. Tested before we advertised.</p>
              <div className="credstrip">
                <span>US FDA-registered</span><span>WHO-GMP</span><span>FSSAI</span><span>Proprietary</span>
              </div>
              <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link className="btn btn--green" to="/about">Meet Third Biome →</Link>
                <Link className="btn btn--outline" to="/evidence">See the evidence</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PROMISE ===================== */}
      <section className="section promise" data-screen-label="Our promise">
        <div className="wrap">
          <span className="kicker">Our promise · Six things that matter</span>
          <h2>Quietly built,<br />rigorously <span className="acc-g">proven.</span></h2>
          <div className="pgrid">
            {PROMISES.map((p) => (
              <div className="pcell" key={p.k}>
                <div className="pcell__k">{p.k}</div>
                <span className="pcell__ic">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{p.icon}</svg>
                </span>
                <h3>{p.h3}</h3><p>{p.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== T3B CLUB (signature ink) ===================== */}
      <section className="section club" id="club" data-screen-label="T3B Club">
        <div className="wrap club__grid">
          <div>
            <h2>A protocol, not just a pill.</h2>
            <p>It's Third Biome's <b>membership-based, doctor-guided, 30-day postbiotic protocol</b>, for the people who want it done properly. A programme that tailors your routine and keeps you accountable for the season it takes.</p>
            <div className="club__feats">
              {CLUB_FEATS.map((f) => (
                <div className="club__feat" key={f.k}><span className="k">{f.k}</span> {f.t}</div>
              ))}
            </div>
            <div className="club__cta">
              <Link className="btn btn--yellow" to="/t3b-club">Start my protocol, ₹959/mo →</Link>
              <a className="btn btn--ghost-d" href="#finder">Find my fit first</a>
            </div>
          </div>
          <div className="club__aside">…so you know <i>exactly</i> what you can expect.</div>
        </div>
      </section>

      {/* ===================== FINDER ===================== */}
      <section className="section section--tight" id="finder" data-screen-label="Finder" style={{ paddingTop: "clamp(40px,6vw,80px)" }}>
        <div className="wrap">
          <div className="finder">
            <span className="kicker">The 30-second finder</span>
            <h2>Tap what sounds like you.</h2>
            <p className="finder__sub">We'll point you to the right starting protocol, no quiz fatigue, promise.</p>
            <div className="finder__pills">
              {FINDER_PILLS.map((p, i) => (
                <button type="button" className={`fpill${pillsOn.has(i) ? " on" : ""}`} onClick={() => togglePill(i)} key={p}>{p}</button>
              ))}
            </div>
            <div className="finder__foot">
              <Link className="btn btn--yellow" to="/products/biome-balance">See my recommendation →</Link>
              <span className="finder__hint">Select what applies to personalise it.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== GUESS (signature) ===================== */}
      <section className="section guess" data-screen-label="Guess game">
        <div className="wrap">
          <h2>Can you guess which parts of <span className="g">your life</span> <span className="p">are run by</span> <span className="i">your gut?</span></h2>
          <div><Link className="btn btn--yellow btn--lg" to="/quiz">Let's play!</Link></div>
        </div>
      </section>

      {/* ===================== BLOG TEASER ===================== */}
      <section className="section" data-screen-label="Journal">
        <div className="wrap">
          <div className="bloghead">
            <div>
              <span className="kicker kicker--y">Letters from the lab</span>
              <h2>Gut science,<br />plainly written.</h2>
            </div>
            <Link className="bloglink" to="/journal">Read the journal →</Link>
          </div>
          <div className="bloggrid">
            {BLOG_POSTS.map((b) => (
              <Link className="blog-card" to="/journal" key={b.h3}>
                <div className="blog-card__thumb" style={{ backgroundImage: `url(${b.img})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: 140 }}></div>
                <div className="blog-card__body">
                  <div className="blog-card__tag" style={b.tagStyle}>{b.tag}</div>
                  <h3>{b.h3}</h3>
                  <p>{b.p}</p>
                  <div className="blog-card__meta"><span>{b.meta[0]}</span><span>{b.meta[1]}</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="section faq" data-screen-label="FAQ">
        <div className="wrap">
          <span className="kicker kicker--p">Good questions</span>
          <h2>The honest FAQ.</h2>
          <div className="acc">
            {FAQS.map((f) => (
              <V3AccItem q={f.q} defaultOpen={!!f.open} key={f.q}><p>{f.a}</p></V3AccItem>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SUBSCRIBE FREEBIE ===================== */}
      <section className="section subfree" data-screen-label="Subscribe">
        <div className="wrap subfree__in">
          <div className="subfree__l">
            <span className="kicker kicker--p">Free guide + monthly letter</span>
            <h2>Get The Beginner's Guide to Postbiotics</h2>
            <p>Plain-English gut science, the GTB™ mechanism explained, a 30-day protocol starter, and ₹200 off your first order. No hype, no neon.</p>
            <div className="subfree__freebie">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              <div><b>Free: The Beginner's Guide to Postbiotics</b><span>PDF · 18 pages · plain English</span></div>
            </div>
          </div>
          <div>
            {!freebieSent && (
              <form className="subfree__form" id="subfreeForm" onSubmit={submitFreebie}>
                <input type="email" placeholder="you@example.com" aria-label="Email" required value={freebieEmail} onChange={(e) => setFreebieEmail(e.target.value)} />
                <button className="btn btn--ink" type="submit">Get it free →</button>
              </form>
            )}
            <div className={`subfree__success${freebieSent ? " on" : ""}`} id="subfreeSucc"><h3>You're on the list ✓</h3><p>We'll be in touch.</p></div>
          </div>
        </div>
      </section>

    </div>
  );
}
