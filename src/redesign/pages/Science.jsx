import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Botanicals } from "../components/Botanicals";
import { PostbioticsExplained } from "../components/sections/PostbioticsExplained";
import { GtbTechnology } from "../components/sections/GtbTechnology";
import { IMG } from "../data/products";

const JOBS = [
  ["bolt", "Fuels colonocytes", <>Butyrate is the <b>primary energy source</b> for the cells lining your large intestine — not enterocytes, colonocytes.</>],
  ["lining", "Seals the lining", <>Regulates <b>tight-junction proteins</b> that hold the gut wall together — the real mechanism behind “leaky gut.”</>],
  ["heart", "Calms immune signals", <>Works via <b>HDAC inhibition and SCFA signalling</b>; modulates IL-10 and Treg pathways that keep gut inflammation in check.</>],
  ["activity", "Supports metabolism", <>Linked to <b>insulin sensitivity (GLUT4)</b> — relevant to metabolic health and PMOS (the new name for PCOS/PCOD).</>],
];

const FACTS = [
  ["62%", "of urban Indians report chronic digestive symptoms"],
  ["~32 m²", "surface area of the gut mucosa (≈ half a badminton court)"],
  ["~70%", "of the body’s immune cells reside in gut-associated tissue (GALT)"],
  ["~90%", "of the body’s serotonin is produced in the gut"],
];

export default function Science() {
  return (
    <main>
      <section className="phero">
        <Botanicals />
        <div className="wrap">
          <div className="kicker reveal">The science</div>
          <h1 className="reveal">
            Trust the gut.
            <br />
            <span className="em">Question the noise.</span>
          </h1>
          <p className="reveal">
            Most gut supplements sell you a story. We’d rather show you the
            mechanism, the biomarker, and the limits of what we’ve proven so far.
            Here’s the honest version.
          </p>
        </div>
      </section>

      {/* probiotic / prebiotic / postbiotic explainer + comparison */}
      <PostbioticsExplained />

      {/* GTB microencapsulation technology */}
      <GtbTechnology readMore={false} />

      {/* what butyrate does */}
      <section className="section" style={{ background: "var(--sand)" }}>
        <div className="wrap">
          <div className="head reveal">
            <div className="eyebrow">What butyrate does</div>
            <h2>
              One molecule, <span className="em">many jobs.</span>
            </h2>
          </div>
          <div className="sci-jobs">
            {JOBS.map(([ic, h, p]) => (
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

      {/* gut-brain, honest */}
      <section className="section">
        <div className="wrap grid-2">
          <div className="reveal">
            <div className="eyebrow">The gut–brain axis</div>
            <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "clamp(2rem,4.4vw,3.2rem)", lineHeight: 1.04, margin: ".4rem 0 0" }}>
              The real route — <span style={{ color: "var(--emerald)" }}>not the myth.</span>
            </h2>
            <p className="lead" style={{ marginTop: "1rem" }}>
              You’ll hear that “gut serotonin controls your mood.” It doesn’t —
              gut-made serotonin acts locally and doesn’t cross into the brain. The
              legitimate gut–brain connection is more interesting, and better
              evidenced:
            </p>
            <ul className="pdp__list" style={{ marginTop: 18 }}>
              <li>
                <Icon name="check" size={18} sw={2.5} /> Butyrate can cross the
                blood–brain barrier, acting on microglia, BDNF and
                neuroinflammation.
              </li>
              <li>
                <Icon name="check" size={18} sw={2.5} /> A leaky lining lets LPS into
                circulation → systemic and neuro-inflammation.
              </li>
              <li>
                <Icon name="check" size={18} sw={2.5} /> The vagus nerve carries ~80%
                of gut→brain signals — a fast, direct line.
              </li>
            </ul>
            <p style={{ color: "var(--ink-soft)", marginTop: 18, fontSize: ".94rem" }}>
              The science here is strong and still growing — so that’s exactly how
              we’ll talk about it.
            </p>
          </div>
          <div className="reveal hero__media" style={{ aspectRatio: "4/4.6" }}>
            <img src={IMG.lifestyle} alt="Biome Balance lifestyle" />
          </div>
        </div>
      </section>

      {/* facts */}
      <section className="section section--tight" style={{ background: "var(--mist)" }}>
        <div className="wrap">
          <div className="head reveal">
            <div className="eyebrow">The landscape</div>
            <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "clamp(1.8rem,3.6vw,2.6rem)", margin: ".4rem 0 0" }}>
              Figures we’ll stand behind.
            </h2>
          </div>
          <div className="sci-facts">
            {FACTS.map(([b, s]) => (
              <div className="sci-fact reveal" key={s}>
                <b>{b}</b>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* evidence */}
      <section className="section" id="evidence">
        <div className="wrap">
          <div className="evi reveal">
            <div className="evi__grid">
              <div>
                <span className="evi__code">CTRI/2025/09/094597</span>
                <div className="eyebrow" style={{ color: "var(--gold)", marginTop: 16 }}>
                  Our evidence
                </div>
                <h2>
                  Shown <span className="em">honestly.</span>
                </h2>
                <p>
                  A randomised, double-blind trial ran Thirdbiome GTB against a
                  probiotic and a combination formula over 45 days. The GTB arm
                  raised stool butyrate — the biomarker that matters — by 74%, with
                  IBS-SSS and GSRS scores improving alongside.
                </p>
                <p className="evi__disclose">
                  The fine print: 30 participants across 3 active arms (~10 each),
                  so we report results as <i>numerically greater</i>, not “double.”
                  There was no placebo arm — and IBS placebo response runs 30–40% —
                  so a larger, multi-centre trial is already in planning. Real-world
                  case studies show gas and bloating improve first (44–71%), with
                  regularity improving in every case; these are self-reported, and we
                  say so.
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

      {/* certifications */}
      <section className="section section--tight" style={{ background: "var(--sand)" }}>
        <div className="wrap">
          <div className="head reveal">
            <div className="eyebrow">Certifications, precisely</div>
            <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: "clamp(1.8rem,3.6vw,2.4rem)", margin: ".4rem 0 0" }}>
              No rounding up.
            </h2>
          </div>
          <div className="sci-jobs" style={{ marginTop: 30 }}>
            <div className="sci-job reveal">
              <div className="ic">
                <Icon name="shield" size={20} />
              </div>
              <div>
                <h3>Facility</h3>
                <p>
                  US FDA-registered, WHO-GMP, ISO, HACCP &amp; Halal-certified. Made
                  in a US FDA-registered facility — not “FDA approved.”
                </p>
              </div>
            </div>
            <div className="sci-job reveal">
              <div className="ic">
                <Icon name="check" size={20} />
              </div>
              <div>
                <h3>Ingredient</h3>
                <p>
                  Butyric acid / tributyrin hold GRAS status. The GTB delivery
                  format is patent-pending (PCT filing planned).
                </p>
              </div>
            </div>
            <div className="sci-job reveal">
              <div className="ic">
                <Icon name="clipboardCheck" size={20} />
              </div>
              <div>
                <h3>Company &amp; trial</h3>
                <p>
                  DPIIT-registered startup, FSSAI-compliant, with a CTRI-registered
                  randomised controlled trial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section center">
        <div className="wrap">
          <h2 className="display reveal" style={{ fontSize: "clamp(2.2rem,5vw,4rem)" }}>
            Ready when you are.
          </h2>
          <p className="lead reveal" style={{ margin: "1rem auto 0", maxWidth: "46ch" }}>
            No big promises. Just one well-made postbiotic — and a 30-day promise.
          </p>
          <div className="phero__cta reveal" style={{ justifyContent: "center", marginTop: 28 }}>
            <Link className="btn btn--lg" to="/products/biome-balance">
              Shop Biome Balance
            </Link>
            <Link className="btn btn--ghost btn--lg" to="/quiz">
              Take the gut quiz
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
