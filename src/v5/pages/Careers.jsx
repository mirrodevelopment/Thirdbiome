import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const ROLES = [
  {
    subject: "Clinical%20Research%20Associate",
    title: "Clinical Research Associate",
    meta: ["Science", "Coimbatore / Hybrid", "Full-time"],
  },
  {
    subject: "Performance%20Marketing%20Lead",
    title: "Performance Marketing Lead",
    meta: ["Growth", "Remote · India", "Full-time"],
  },
  {
    subject: "Supply%20Chain%20Associate",
    title: "Supply Chain & Ops Associate",
    meta: ["Operations", "Coimbatore", "Full-time"],
  },
  {
    subject: "Brand%20%26%20Content%20Designer",
    title: "Brand & Content Designer",
    meta: ["Design", "Remote · India", "Full-time / Contract"],
  },
  {
    subject: "Member%20Care%20Specialist",
    title: "Member Care Specialist (T3B Club)",
    meta: ["Support", "Remote · India", "Full-time"],
  },
];

const PERKS = [
  {
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" />
      </svg>
    ),
    h: "Science you can stand behind",
    p: "Every claim is one you'd defend. No hype, no smoke, real mechanisms, disclosed limits.",
  },
  {
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
      </svg>
    ),
    h: "Small team, real ownership",
    p: "You'll own outcomes, not tickets. Category-defining work with founders in the room.",
  },
  {
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
    h: "Flexible & remote-friendly",
    p: "Work where you do your best thinking. Outcomes over hours, across India.",
  },
  {
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 2v20M2 12h20" />
      </svg>
    ),
    h: "Free protocol + health",
    p: "Your Biome Balance on us, plus health cover, because we take gut health seriously.",
  },
];

export default function Careers() {
  return (
    <>
      <Seo title="Careers" description="Build the category India didn't have. Science-first, honest by default, allergic to hype, roles across India at Third Biome." />
      <section className="sheet v5-page" data-screen-label="Careers hero">
        <div className="wrap">
          <span className="eyebrow">We're hiring</span>
          <h1>Build the category<br /><em>India didn't have.</em></h1>
          <p>We'd rather be right than loud, and we're looking for people who feel the same. Science-first, honest by default, allergic to hype.</p>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body" data-screen-label="Open roles"><div className="wrap">
        <div className="shead"><div><span className="eyebrow">Open roles</span><h2 style={{ marginTop: "14px" }}>Where you might fit.</h2></div><p>Roles we're hiring for across India. Remote-friendly unless noted.</p></div>
        <div className="v5-roles">
          {ROLES.map((r) => (
            <a key={r.title} className="v5-role" href={`mailto:careers@thirdbiome.com?subject=${r.subject}`}>
              <div>
                <div className="v5-role__t">{r.title}</div>
                <div className="v5-role__meta">{r.meta.map((m) => <span key={m}>{m}</span>)}</div>
              </div>
              <span className="v5-role__go btn btn--out">Apply</span>
            </a>
          ))}
        </div>
      </div></section>

      <section className="sheet sheet--pad" data-screen-label="Why work here"><div className="wrap">
        <span className="eyebrow">Why here</span>
        <h2 style={{ fontSize: "clamp(1.8rem,3.6vw,2.8rem)", margin: "12px 0 clamp(22px,3vw,34px)" }}>What you get, beyond the title.</h2>
        <div className="v5-perks">
          {PERKS.map((k) => (
            <div key={k.h} className="v5-perk">
              <div className="v5-perk__ic">{k.ic}</div>
              <h3>{k.h}</h3>
              <p>{k.p}</p>
            </div>
          ))}
        </div>
      </div></section>

      <section className="sheet sheet--pad" style={{ textAlign: "center" }} data-screen-label="Careers CTA"><div className="wrap">
        <span className="eyebrow" style={{ justifyContent: "center" }}>Nothing fits?</span>
        <h2 style={{ margin: "14px auto 18px", maxWidth: "22ch", fontSize: "clamp(1.8rem,3.6vw,2.8rem)" }}>Tell us why we should build a role around <em style={{ fontStyle: "normal", color: "var(--green)" }}>you.</em></h2>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
          <a className="btn btn--dark" href="mailto:careers@thirdbiome.com">Email careers@thirdbiome.com →</a>
          <Link className="btn" to="/about">Meet the team</Link>
        </div>
      </div></section>
    </>
  );
}
