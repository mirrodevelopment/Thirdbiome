import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { Check } from "../components/ui";
import { useCart } from "../cart/CartProvider";
import contactService from "../../services/contactService";

const STEPS = [
  { n: "01", h: "Tell us your gut", p: "A short intake on your symptoms, diet and goals, reviewed by our medical team, not an algorithm." },
  { n: "02", h: "Start your protocol", p: "Biome Balance arrives monthly. One capsule a day, calibrated for consistency over 90 days." },
  { n: "03", h: "Weekly check-ins", p: "Track how you feel week by week. We translate the science into plain English as you go." },
  { n: "04", h: "Reach a real doctor", p: "Direct access to our clinical team whenever you need a genuine answer, not a chatbot." },
];

const TIERS = [
  {
    name: "Monthly",
    price: "₹959",
    per: "Rolling · cancel anytime",
    features: [
      "30 capsules delivered monthly",
      "Weekly check-ins & the science, plainly",
      "Skip or cancel anytime",
    ],
    cta: "Choose monthly",
    btn: "btn--out",
  },
  {
    name: "90-day protocol",
    feat: true,
    flag: "Most chosen",
    price: "₹999",
    per: "Billed quarterly · save 17%",
    features: [
      "Everything in Monthly",
      "The full 90-day gut-repair timeline",
      "Free priority shipping",
      "Beginner's Guide to Postbiotics (PDF)",
    ],
    cta: "Choose 90-day",
    btn: "btn--white",
  },
  {
    name: "Annual",
    price: "₹899",
    per: "Billed yearly · save 25%",
    features: [
      "Everything in 90-day",
      "Quarterly clinical review call",
      "Early access to new SKUs",
    ],
    cta: "Choose annual",
    btn: "btn--out",
  },
];

const INCLUDED = [
  "A doctor-guided, 90-day postbiotic protocol tailored to your gut.",
  "Your Biome Balance, delivered monthly, never run out.",
  "Weekly check-ins and the science in plain English.",
  "Direct access to our medical team when you need a real answer.",
];

export default function Club() {
  const { add, busy } = useCart();
  const [joinEmail, setJoinEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (busy) return;
    add();
    const email = joinEmail.trim();
    if (email) {
      try {
        await contactService.submitContact({
          name: "",
          email,
          subject: "T3B Club membership",
          message: "Started protocol / join request from the T3B Club page.",
        });
      } catch (err) {
        /* non-blocking: cart add already succeeded */
      }
    }
    setJoined(true);
  };

  return (
    <>
      <Seo title="T3B Club" description="Not a subscription box, a doctor-guided, 90-day gut protocol. Biome Balance delivered monthly, weekly check-ins, and a medical team you can reach." />
      <section className="sheet v5-page" data-screen-label="Club hero">
        <div className="wrap">
          <span className="eyebrow">Membership · The protocol</span>
          <h1>The <em>T3B Club.</em></h1>
          <p>Not a subscription box, a doctor-guided, 90-day gut protocol. Your Biome Balance delivered monthly, weekly check-ins, and a medical team you can actually reach.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "26px" }}>
            <button className="btn btn--dark" disabled={busy} onClick={() => add()}>Start my protocol →</button>
            <Link className="btn btn--ghost" to="/quiz">Not sure? Find your fit</Link>
          </div>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body" data-screen-label="How the club works"><div className="wrap">
        <span className="eyebrow">How it works</span>
        <h2 style={{ fontSize: "clamp(1.8rem,3.6vw,2.8rem)", margin: "12px 0 clamp(22px,3vw,34px)" }}>Four steps. One season.</h2>
        <div className="v5-steps">
          {STEPS.map((s) => (
            <div className="v5-step" key={s.n}>
              <div className="v5-step__n">{s.n}</div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div></section>

      <section className="sheet sheet--pad" data-screen-label="Club pricing"><div className="wrap">
        <div className="shead"><div><span className="eyebrow">Plans</span><h2 style={{ marginTop: "14px" }}>Pick your commitment.</h2></div><p>Every plan includes the full protocol, check-ins and medical access. Cancel anytime, no lock-in.</p></div>
        <div className="v5-tiers">
          {TIERS.map((t) => (
            <div className={t.feat ? "v5-tier v5-tier--feat" : "v5-tier"} key={t.name}>
              {t.flag && <span className="v5-tier__flag">{t.flag}</span>}
              <span className="v5-tier__name">{t.name}</span>
              <div className="v5-tier__price">{t.price}<span style={{ fontSize: "1rem", fontWeight: 500, color: t.feat ? "rgba(255,255,255,.6)" : "var(--ink-soft)" }}>/mo</span></div>
              <div className="v5-tier__per">{t.per}</div>
              <ul>
                {t.features.map((f) => (
                  <li key={f}><Check size={18} /> {f}</li>
                ))}
              </ul>
              <button className={`btn ${t.btn}`} disabled={busy} onClick={() => add()}>{t.cta}</button>
            </div>
          ))}
        </div>
      </div></section>

      <section className="sheet sheet--pad" data-screen-label="What's included"><div className="wrap">
        <div className="club">
          <div>
            <span className="eyebrow">What's included</span>
            <h2>More than pills in a box.</h2>
            <ul>
              {INCLUDED.map((item) => (
                <li key={item}><Check size={20} /> {item}</li>
              ))}
            </ul>
          </div>
          <div className="club__card" id="join">
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.8)" }}>Join the club</span>
            <div className="price" style={{ marginTop: "12px" }}>₹999<span style={{ fontSize: "1rem", color: "rgba(255,255,255,.6)", fontWeight: 500 }}>/mo</span></div>
            <div className="per">90-day protocol · cancel anytime</div>
            {!joined && (
              <form id="joinForm" onSubmit={handleJoin} style={{ marginTop: "20px" }}>
                <div className="v5-field"><input className="v5-input" type="email" placeholder="you@example.com" required value={joinEmail} onChange={(e) => setJoinEmail(e.target.value)} style={{ background: "rgba(255,255,255,.1)", borderColor: "rgba(255,255,255,.2)", color: "#fff" }} /></div>
                <button className="btn btn--white" type="submit" disabled={busy} style={{ width: "100%" }}>Start my protocol</button>
              </form>
            )}
            <div id="joinOk" style={{ display: joined ? "block" : "none", marginTop: "14px", color: "var(--leaf)", fontWeight: 600 }}>You're on the list, we'll be in touch.</div>
          </div>
        </div>
      </div></section>
    </>
  );
}
