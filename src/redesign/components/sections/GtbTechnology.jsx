import { Link } from "react-router-dom";
import { Botanicals } from "../Botanicals";

/**
 * "Thirdbiome GTB — Microencapsulated for the journey your gut needs."
 * Forest technology band with three numbered passage cards. Reused on the
 * Science page and the PDP. Pass `readMore={false}` to hide the CTA.
 */

const STEPS = [
  {
    step: "Protected passage",
    title: "Survives stomach acid",
    body: "The lipid microcapsule shields the GTB through the harsh stomach environment that destroys 95% of probiotics.",
  },
  {
    step: "Precision release",
    title: "Opens at the colon",
    body: "pH-triggered release in the lower intestine, exactly where the gut lining and microbiome live.",
  },
  {
    step: "Direct fuel",
    title: "Feeds the gut lining",
    body: "Butyrate supplies 70% of energy for colon cells — rebuilding the lining, calming inflammation, restoring barrier function.",
  },
];

export function GtbTechnology({ readMore = true }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="band reveal">
          <Botanicals />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="eyebrow">The technology</div>
            <h2>
              Thirdbiome GTB. <span className="emi">Microencapsulated</span> for the
              journey your gut needs.
            </h2>
            <p className="band__lead">
              Standard tributyrin breaks down in your stomach before it ever reaches
              your gut. Our patent-pending microencapsulation wraps each molecule of
              Thirdbiome GTB (microencapsulated Glycerol Tributyrate) in a protective
              shell — so the butyrate releases exactly where your gut lining needs
              it. The colon.
            </p>
            <div className="techgrid">
              {STEPS.map((s, i) => (
                <div className="techcard" key={s.title}>
                  <div className="num">{i + 1}</div>
                  <div className="step">{s.step}</div>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
            {readMore && (
              <Link className="btn" to="/science#evidence" style={{ marginTop: 28 }}>
                Read the science
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
