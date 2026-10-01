import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const RECEIPTS = [
  { k: "Facility", v: "US FDA-registered, WHO-GMP, ISO, HACCP, Halal" },
  { k: "Trial", v: "CTRI-registered, randomised, double-blinded RCT" },
  { k: "Active", v: "GRAS-status butyrate / tributyrin" },
  { k: "IP", v: "Proprietary technology" },
];

const FOUNDERS = [
  {
    av: "J",
    name: "Jayavardhini",
    role: "Founder & CEO",
    bio: "A builder who saw a category-sized problem, gut health with no real postbiotic answer in India, and decided to build the solution from scratch. Leads product vision, brand, and the T3B Club stewardship model. Firm believer in doing fewer things properly.",
  },
  {
    av: "A",
    name: "Dr. Ariarasudhan",
    role: "Clinical Lead & Co-founder",
    bio: "The clinical mind behind Thirdbiome GTB™. Designed the formulation, led the CTRI-registered RCT, and ensures every claim is backed by science he'd stake his name on. Spends most of his time on the gut-brain and gut-skin evidence base.",
  },
];

const VALUES = [
  {
    k: "01 · Honesty",
    h: "We publish our limits.",
    p: "Our RCT had no placebo arm. We say so. Our case studies are single-participant. We say so. You can fact-check everything.",
  },
  {
    k: "02 · Science",
    h: "Mechanism first, marketing second.",
    p: "We don't claim benefits we can't explain at the molecular level. Butyrate → colonocytes → tight junctions → immune calm.",
  },
  {
    k: "03 · Simplicity",
    h: "One honest ingredient.",
    p: "Thirdbiome GTB™, 500 mg. One ingredient. Less is more when less is actually better.",
  },
  {
    k: "04 · Stewardship",
    h: "We follow you through it.",
    p: "The T3B Club isn't just a subscription, it's a 30-day protocol with weekly check-ins and doctor access.",
  },
  {
    k: "05 · India",
    h: "Made here, for here.",
    p: "Formulated by Indian doctors, manufactured in an Indian facility that's US FDA-registered. Building a category India deserves.",
  },
  {
    k: "06 · Patience",
    h: "Gut repair takes a season.",
    p: "We'd rather tell you the truth about timelines than sell you a quick fix. Most feel a shift by week two. Full picture is month three.",
  },
];

const STATS = [
  { n: "16", l: "SKUs in pipeline" },
  { n: "1st", l: "postbiotic brand in India" },
  { n: "6", l: "symptom domains" },
  { n: "∞", l: "questions answered honestly" },
];

const receiptLi = {
  display: "flex",
  gap: "12px",
  padding: "11px 0",
  borderTop: "1px solid rgba(255,255,255,.1)",
  fontSize: ".88rem",
};

const receiptB = {
  fontFamily: "var(--mono)",
  fontSize: ".6rem",
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color: "var(--leaf)",
  flex: "none",
  width: "56px",
};

export default function About() {
  return (
    <>
      <Seo title="About" description="India's first postbiotic brand, formulated by doctors, tested in a registered trial, made in a US FDA-registered facility. Built to be fact-checked." />
      <section className="sheet sheet--pad v5-page">
        <div className="wrap">
          <span className="eyebrow">India's first postbiotic brand</span>
          <h1>Meet <em>Third Biome.</em></h1>
          <p>We built the category India didn't have, formulated by doctors, tested in a registered trial, made in a US FDA-registered facility.</p>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body"><div className="wrap">

        <div className="v5-mission" data-reveal="">
          "Gut health is full of hype, strain counts no one can verify, mood claims with no mechanism. We're building the <em>opposite</em>: a brand you can fact-check."
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,4vw,52px)", alignItems: "start", marginBottom: "clamp(36px,5vw,60px)" }}>
          <div>
            <span className="eyebrow">Why we built this</span>
            <h2 style={{ fontSize: "clamp(1.8rem,3.6vw,2.8rem)", margin: "12px 0 16px" }}>We'd rather be <em>right</em> than loud.</h2>
            <p style={{ color: "var(--ink-soft)", marginBottom: "14px" }}>India's gut health market is flooded with probiotics, most competing on strain counts, most dying in your stomach before they reach where they're needed. We saw a category-sized gap and a body of published science on butyrate that no Indian brand had touched.</p>
            <p style={{ color: "var(--ink-soft)", marginBottom: "14px" }}>Thirdbiome GTB™ is the result: India's first proprietary postbiotic of its kind, designed to deliver butyrate directly to the colon using precision microencapsulation. We ran a double-blinded trial before we ran ads. We publish its limits, not just its wins.</p>
            <p style={{ color: "var(--ink-soft)" }}>No celebrity endorsements. No 12-step supplement routines. One honest capsule a day.</p>
          </div>
          <div style={{ background: "var(--forest)", borderRadius: "var(--r-lg)", padding: "clamp(22px,3vw,36px)", color: "#fff" }}>
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.5)" }}>Built to be fact-checked</span>
            <h3 style={{ fontFamily: "var(--mono)", fontSize: ".9rem", color: "var(--leaf)", margin: "12px 0 4px", letterSpacing: ".04em" }}>The receipts.</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: "10px" }}>
              {RECEIPTS.map((r, i) => (
                <li key={r.k} style={i === RECEIPTS.length - 1 ? { ...receiptLi, borderBottom: "1px solid rgba(255,255,255,.1)" } : receiptLi}>
                  <b style={receiptB}>{r.k}</b>{r.v}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Founders */}
        <span className="eyebrow">The people</span>
        <h2 style={{ fontSize: "clamp(1.8rem,3.6vw,2.8rem)", margin: "12px 0 clamp(20px,3vw,32px)" }}>Who built it.</h2>
        <div className="v5-founders">
          {FOUNDERS.map((f) => (
            <div className="v5-fcard" key={f.name}>
              <span className="v5-fcard__av">{f.av}</span>
              <div><div className="v5-fcard__name">{f.name}</div><div className="v5-fcard__role">{f.role}</div></div>
              <p>{f.bio}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <span className="eyebrow">What drives everything</span>
        <h2 style={{ fontSize: "clamp(1.8rem,3.6vw,2.8rem)", margin: "12px 0 clamp(20px,3vw,32px)" }}>Six things we stand for.</h2>
        <div className="v5-values">
          {VALUES.map((v) => (
            <div className="v5-val" key={v.k}>
              <div className="v5-val__k">{v.k}</div>
              <h3>{v.h}</h3>
              <p>{v.p}</p>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <div style={{ background: "var(--forest)", borderRadius: "var(--r-lg)", padding: "clamp(24px,4vw,48px)", margin: "clamp(28px,4vw,48px) 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(20px,3vw,36px)", alignItems: "center" }}>
          <div>
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.5)" }}>What's coming</span>
            <h2 style={{ fontSize: "clamp(1.8rem,3.6vw,2.6rem)", color: "#fff", margin: "12px 0 14px" }}>16 SKUs in the <span style={{ color: "var(--leaf)" }}>pipeline.</span></h2>
            <p style={{ color: "rgba(255,255,255,.65)" }}>Biome Balance is the first, not the last. The pipeline covers gut health, PCOS, sleep, skin, and liver support. Each product follows the same standard: one key active, a clear mechanism, real-world evidence.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {STATS.map((s) => (
              <div className="hlcstat" key={s.l}><span className="n">{s.n}</span><span className="l">{s.l}</span></div>
            ))}
          </div>
        </div>

      </div></section>

      <section className="sheet sheet--pad" style={{ textAlign: "center" }}><div className="wrap">
        <span className="eyebrow" style={{ justifyContent: "center" }}>Join the movement</span>
        <h2 style={{ margin: "14px auto 18px", maxWidth: "18ch" }}>Trust the gut.<br />Question the <em>noise.</em></h2>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
          <Link className="btn btn--dark" to="/products/biome-balance">Shop Biome Balance →</Link>
          <Link className="btn" to="/#buy">Explore T3B Club</Link>
        </div>
      </div></section>
    </>
  );
}
