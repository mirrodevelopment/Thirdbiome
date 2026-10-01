import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Botanicals } from "../components/Botanicals";
import { useCart } from "../cart/CartContext";
import { IMG } from "../data/products";

const INCLUDED = [
  ["clipboardCheck", "A 90-day protocol", "Doctor-designed and tailored to your gut, so you know exactly what to expect at week 1, 4 and 12."],
  ["clock", "Delivered monthly", "Your Biome Balance arrives on time, every month. Skip or cancel anytime — no lock-in."],
  ["message", "Weekly check-ins", "The science, plain — and gentle nudges so the protocol actually sticks past the first burst of motivation."],
  ["shield", "Direct medical access", "A real answer from our medical team when you need one — not a chatbot, not a forum."],
];

const PROTOCOL = [
  ["Weeks 1–4 · Settle", "One capsule a day. Gas and bloating tend to ease first — for many members, within the first weeks."],
  ["Weeks 5–8 · Repair", "The lining keeps fuelling and sealing. Digestion gets more predictable; energy and focus often follow."],
  ["Weeks 9–12 · Hold", "You review the change with our team and decide how to maintain it. No pressure, just the honest picture."],
];

const ARC = [
  ["Foundation", "Daily ritual, baseline gut check-in, science onboarding."],
  ["Mechanism activates", "First visible shifts. Doctor check-in. WhatsApp cohort live."],
  ["Visible shifts", "Energy, sleep, regularity. Member story spotlight."],
  ["Identity & continuity", "Continue or pause — your call. No pressure, no judgment."],
];

export default function Club() {
  const { add } = useCart();

  return (
    <main>
      <section className="phero">
        <Botanicals />
        <div className="wrap">
          <div className="kicker reveal">Membership</div>
          <h1 className="reveal">
            The T3B Club.
            <br />
            <span className="em">Gut repair, guided.</span>
          </h1>
          <p className="reveal">
            More than a subscription. A doctor-guided, 90-day postbiotic protocol —
            your Biome Balance delivered monthly, the science in plain English, and
            a real medical team when you need an answer.
          </p>
          <div className="phero__cta reveal">
            <a className="btn btn--lg" href="#tiers">
              See membership
            </a>
            <Link className="btn btn--ghost btn--lg" to="/quiz">
              Take the gut quiz
            </Link>
          </div>
        </div>
      </section>

      {/* what's included */}
      <section className="section">
        <div className="wrap">
          <div className="head reveal">
            <div className="eyebrow">What’s included</div>
            <h2>
              Everything around the <span className="em">one capsule.</span>
            </h2>
          </div>
          <div className="sci-jobs" style={{ marginTop: "clamp(34px,4vw,56px)" }}>
            {INCLUDED.map(([ic, h, p]) => (
              <div className="sci-job reveal" key={h}>
                <div className="ic">
                  <Icon name={ic} size={22} />
                </div>
                <div>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* tiers */}
      <section className="section" id="tiers" style={{ background: "var(--sand)" }}>
        <div className="wrap">
          <div className="head head--center reveal">
            <div className="eyebrow">Choose your way in</div>
            <h2>
              Two ways to <span className="em">join.</span>
            </h2>
          </div>
          <div className="tier">
            <div className="tcard reveal">
              <div className="tcard__name">Monthly Member</div>
              <div className="tcard__price">
                ₹1,199<span>/mo</span>
              </div>
              <div className="tcard__per">Save 20% vs one-off · cancel anytime</div>
              <ul>
                {[
                  "Biome Balance delivered monthly",
                  "The 90-day guided protocol",
                  "Weekly check-ins & the science, plain",
                  "Free shipping, every order",
                ].map((t) => (
                  <li key={t}>
                    <Icon name="check" size={20} sw={2.4} /> {t}
                  </li>
                ))}
              </ul>
              <button
                className="btn btn--lg"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() =>
                  add({
                    lineId: "club-monthly",
                    id: "t3b-club",
                    name: "T3B Club · Monthly",
                    variant: "Membership · delivered monthly",
                    price: 1199,
                    img: IMG.lifestyle,
                  })
                }
              >
                Start my protocol
              </button>
            </div>
            <div className="tcard feature reveal">
              <div className="tcard__badge">Founding Circle</div>
              <div className="tcard__name">Founding Member</div>
              <div className="tcard__price">
                ₹11,490<span>/yr</span>
              </div>
              <div className="tcard__per">~₹957/mo · best value · 12 months</div>
              <ul>
                {[
                  "Everything in Monthly Member",
                  "Locked-in founding price for life",
                  "First access to new formulas in development",
                  "A direct line to the founders & medical team",
                  "A say in what we build next",
                ].map((t) => (
                  <li key={t}>
                    <Icon name="check" size={20} sw={2.4} /> {t}
                  </li>
                ))}
              </ul>
              <button
                className="btn btn--lg"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() =>
                  add({
                    lineId: "club-founding",
                    id: "t3b-club",
                    name: "T3B Club · Founding Member",
                    variant: "Annual membership · 12 months",
                    price: 11490,
                    img: IMG.lifestyle,
                  })
                }
              >
                Join the Founding Circle
              </button>
            </div>
          </div>
          <p className="center" style={{ color: "var(--ink-soft)", fontSize: ".86rem", marginTop: 24 }}>
            Both backed by our 30-day promise. Membership is a commitment to your
            gut, not a contract you can’t leave.
          </p>
        </div>
      </section>

      {/* 30-day stewardship */}
      <section className="section">
        <div className="wrap">
          <div className="steward">
            <div className="reveal">
              <div className="eyebrow">T3B Club · 30-day stewardship</div>
              <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "clamp(2rem,4.4vw,3.2rem)", lineHeight: 1.04, margin: ".4rem 0 0" }}>
                Because a supplement alone is not a <span className="emi">strategy.</span>
              </h2>
              <p className="lead" style={{ marginTop: "1rem" }}>
                Every Biome Balance subscriber gets the 30-day Stewardship Playbook —
                a guided program with a WhatsApp cohort, doctor check-ins, and daily
                science tips. Built so the change actually sticks.
              </p>
              <div className="stats">
                <div className="stat"><b>500+</b><span>Cohort members</span></div>
                <div className="stat"><b>70%</b><span>Subscription renewal</span></div>
                <div className="stat"><b>4.8</b><span>Member rating</span></div>
              </div>
              <a className="btn" href="#tiers">Join Cohort 4 waitlist</a>
            </div>
            <div className="arc reveal">
              <div className="arc__lbl">The 30-day arc</div>
              {ARC.map(([h, p], i) => (
                <div className="arc__row" key={h}>
                  <div className="arc__n">{i + 1}</div>
                  <div>
                    <h4>Week {i + 1} · {h}</h4>
                    <p>{p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* protocol */}
      <section className="section">
        <div className="wrap">
          <div className="head reveal">
            <div className="eyebrow">The 90-day protocol</div>
            <h2>
              What the three months <span className="em">look like.</span>
            </h2>
          </div>
          <div className="sci-flow">
            {PROTOCOL.map(([h, p], i) => (
              <div className="sci-step reveal" key={h}>
                <div className="n">{i + 1}</div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section center" style={{ background: "var(--forest)", color: "#eaf3ec" }}>
        <div className="wrap">
          <h2 className="display reveal" style={{ fontSize: "clamp(2.2rem,5vw,4rem)", color: "#fff" }}>
            Your gut, on a plan.
          </h2>
          <p className="lead reveal" style={{ margin: "1rem auto 0", maxWidth: "46ch", color: "#bcd4c4" }}>
            Join the Club and give your gut the one thing supplements never offer:
            a guided, honest, 90-day run.
          </p>
          <div className="phero__cta reveal" style={{ justifyContent: "center", marginTop: 28 }}>
            <a className="btn btn--lg" href="#tiers">
              Become a member
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
