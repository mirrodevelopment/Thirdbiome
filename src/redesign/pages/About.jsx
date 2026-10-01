import { Link } from "react-router-dom";
import { Botanicals } from "../components/Botanicals";
import { IMG } from "../data/products";

const monoStyle = {
  aspectRatio: "4/3",
  background: "linear-gradient(150deg,var(--forest),#0a2e20)",
  display: "grid",
  placeItems: "center",
};
const monoText = {
  fontFamily: "var(--display)",
  fontWeight: 600,
  fontSize: "3.4rem",
  color: "var(--gold)",
};

const BELIEFS = [
  ["01", "Honesty over hype", "We show the trial and its limits. We say “patent-pending,” not “patented.” We say “made in a US FDA-registered facility,” never “FDA approved.”"],
  ["02", "Evidence over speed", "A registered RCT before launch. A multi-centre trial in planning. We’d rather be slow and right than fast and forgettable."],
  ["03", "Trust over scale", "We’re building for the long term — taught by trusted voices, member by member, through the Founding Circle and the T3B Club."],
];

const FOUNDERS = [
  ["J", "Jayavardhini", "Founder & CEO", "Set out to build the postbiotic category in India the right way — putting the mechanism and the evidence in front of customers instead of behind marketing. Leads brand, product and the Founding Circle."],
  ["A", "Dr. Ariarasudhan", "Clinical Lead", "Anchors the science — from the micro-encapsulation approach to the design of the registered trial. The reason every claim on this site is checked against what the literature actually supports."],
];

const TIMELINE = [
  ["2025", "Trial registered", "Our randomised, double-blind trial is registered with the Clinical Trials Registry – India (CTRI/2025/09/094597)."],
  ["May 2026", "Fact-checked, top to bottom", "Every claim independently reviewed against the literature. The errors we found, we removed. The strong ones, we kept."],
  ["2026", "Biome Balance launches", "Our first product ships to the Founding Circle — a postbiotic formula led by 500 mg Thirdbiome GTB™."],
  ["Next", "A larger, multi-centre trial", "To move from “numerically greater” to something stronger — and to extend the protocol into new territories over months to years."],
];

export default function About() {
  return (
    <main>
      <section className="phero">
        <Botanicals />
        <div className="wrap">
          <div className="kicker reveal">About The Third Biome</div>
          <h1 className="reveal">
            Building a category,
            <br />
            <span className="em">not a hype cycle.</span>
          </h1>
          <p className="reveal">
            Third Biome (t3b) is India’s first postbiotic-dedicated consumer
            health brand. We’re choosing to grow it the slow way — evidence first,
            claims disclosed, trust compounded over years.
          </p>
        </div>
      </section>

      {/* story */}
      <section className="section">
        <div className="wrap grid-2">
          <div className="reveal">
            <div className="eyebrow">Why we exist</div>
            <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "clamp(2rem,4.4vw,3.2rem)", lineHeight: 1.04, margin: ".4rem 0 0" }}>
              The gut category was <span style={{ color: "var(--emerald)" }}>loud and unproven.</span>
            </h2>
            <p style={{ color: "var(--ink-soft)", marginTop: "1rem", lineHeight: 1.7 }}>
              Walk down any supplement aisle and you’ll find probiotics promising
              the world with strain counts you can’t verify and survival rates
              nobody measures. Meanwhile 62% of urban Indians live with chronic
              digestive symptoms.
            </p>
            <p style={{ color: "var(--ink-soft)", marginTop: "1rem", lineHeight: 1.7 }}>
              We started The Third Biome to do the opposite of the category:
              deliver
              the finished compound the gut actually uses — butyrate — and be
              radically honest about what it does, how it’s made, and the limits of
              what we’ve proven. One product. One honest formula. A registered
              trial. A promise.
            </p>
            <div style={{ marginTop: 24, fontFamily: "var(--display)", fontWeight: 600, fontSize: "1.3rem" }}>
              Trust the gut. Question the noise.
            </div>
          </div>
          <div className="reveal hero__media" style={{ aspectRatio: "4/4.6" }}>
            <img src={IMG.open} alt="Biome Balance" />
          </div>
        </div>
      </section>

      {/* beliefs */}
      <section className="section" style={{ background: "var(--sand)" }}>
        <div className="wrap">
          <div className="head reveal">
            <div className="eyebrow">What we believe</div>
            <h2>
              Three principles, <span className="em">non-negotiable.</span>
            </h2>
          </div>
          <div className="beliefs">
            {BELIEFS.map(([n, h, p]) => (
              <div className="belief reveal" key={n}>
                <div className="n">{n}</div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* founders */}
      <section className="section">
        <div className="wrap">
          <div className="head reveal">
            <div className="eyebrow">The founders</div>
            <h2>
              Science-led, <span className="em">plainly spoken.</span>
            </h2>
          </div>
          <div className="founder" style={{ marginTop: "clamp(34px,4vw,56px)" }}>
            {FOUNDERS.map(([mono, name, role, bio]) => (
              <div className="fcard reveal" key={name}>
                <div style={monoStyle}>
                  <span style={monoText}>{mono}</span>
                </div>
                <div className="fcard__body">
                  <div className="fcard__name">{name}</div>
                  <div className="fcard__role">{role}</div>
                  <p className="fcard__bio">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* timeline */}
      <section className="section" style={{ background: "var(--mist)" }}>
        <div className="wrap">
          <div className="head reveal">
            <div className="eyebrow">The honest timeline</div>
            <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "clamp(1.9rem,3.8vw,2.8rem)", margin: ".4rem 0 0" }}>
              Where we are — and aren’t.
            </h2>
          </div>
          <div className="timeline">
            {TIMELINE.map(([yr, h, p]) => (
              <div className="tline reveal" key={h}>
                <div className="yr">{yr}</div>
                <div>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section center">
        <div className="wrap">
          <h2 className="display reveal" style={{ fontSize: "clamp(2.2rem,5vw,4rem)" }}>
            Join the Founding Circle.
          </h2>
          <p className="lead reveal" style={{ margin: "1rem auto 0", maxWidth: "48ch" }}>
            Be part of the early cohort shaping the postbiotic category in India —
            with direct access to the people building it.
          </p>
          <div className="phero__cta reveal" style={{ justifyContent: "center", marginTop: 28 }}>
            <Link className="btn btn--lg" to="/t3b-club">
              Explore the T3B Club
            </Link>
            <Link className="btn btn--ghost btn--lg" to="/contact">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
