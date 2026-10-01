import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function Evidence() {
  return (
    <>
      <Seo
        title="The Evidence"
        description="Every Biome Balance stat with its source and its limits: our CTRI-registered RCT (+74% stool butyrate) and real T3B Club member outcomes."
      />
      <section className="sheet sheet--pad v5-page">
        <div className="wrap">
          <span className="eyebrow">The numbers, honestly</span>
          <h1>Real world <em>evidence.</em></h1>
          <p>Every stat we publish, with its source and its limits. Not a marketing deck, a stewardship record.</p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="sheet sheet--pad" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="wrap" style={{ paddingBlock: 0 }}>
          <div className="v5-rwe-strip">
            <div className="v5-rwe-cell"><span className="n">87%</span><span className="l">bloating reduction · T3B Club</span></div>
            <div className="v5-rwe-cell"><span className="n">9/10</span><span className="l">calmer digestion by week 2</span></div>
            <div className="v5-rwe-cell"><span className="n">70%+</span><span className="l">continue past month 1</span></div>
            <div className="v5-rwe-cell"><span className="n">100%</span><span className="l">satisfaction · all cohorts</span></div>
            <div className="v5-rwe-cell"><span className="n">+74%</span><span className="l">stool butyrate · GTB arm · RCT</span></div>
          </div>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body">
        <div className="wrap">

          {/* Trial info */}
          <div id="clinical-trial" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,4vw,52px)", alignItems: "start", marginBottom: "clamp(36px,5vw,60px)" }}>
            <div>
              <span className="eyebrow">The clinical trial</span>
              <h2 style={{ fontSize: "clamp(1.8rem,3.6vw,2.8rem)", margin: "12px 0 16px" }}>CTRI-registered, randomised, <em>double-blinded.</em></h2>
              <p style={{ color: "var(--ink-soft)", marginBottom: "16px" }}>Our registered, double-blinded RCT ran for 45 days. The GTB arm raised stool butyrate by 74% and showed significant improvement across digestive, energy, and sleep domains.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: ".62rem", letterSpacing: ".08em", textTransform: "uppercase", border: "1px solid var(--line)", borderRadius: "999px", padding: ".4em .7em", color: "var(--ink-soft)" }}>CTRI/2025/09/094597</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: ".62rem", letterSpacing: ".08em", textTransform: "uppercase", border: "1px solid var(--line)", borderRadius: "999px", padding: ".4em .7em", color: "var(--ink-soft)" }}>Registered RCT</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: ".62rem", letterSpacing: ".08em", textTransform: "uppercase", border: "1px solid var(--line)", borderRadius: "999px", padding: ".4em .7em", color: "var(--ink-soft)" }}>45 days</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: ".62rem", letterSpacing: ".08em", textTransform: "uppercase", border: "1px solid var(--line)", borderRadius: "999px", padding: ".4em .7em", color: "var(--ink-soft)" }}>Double-blind</span>
              </div>
            </div>
            <div style={{ background: "var(--forest)", borderRadius: "var(--r-lg)", padding: "clamp(22px,3vw,32px)", color: "#fff" }}>
              <span className="eyebrow" style={{ color: "rgba(255,255,255,.5)" }}>Trial registration</span>
              <h3 style={{ fontFamily: "var(--mono)", fontSize: ".9rem", color: "var(--leaf)", margin: "12px 0 4px", letterSpacing: ".04em" }}>CTRI/2025/09/094597</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: "10px" }}>
                <li style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 0", borderTop: "1px solid rgba(255,255,255,.1)", fontSize: ".9rem" }}><b style={{ fontFamily: "var(--mono)", fontSize: ".62rem", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--leaf)", flex: "none", width: "52px" }}>Type</b>Randomised, double-blinded RCT</li>
                <li style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 0", borderTop: "1px solid rgba(255,255,255,.1)", fontSize: ".9rem" }}><b style={{ fontFamily: "var(--mono)", fontSize: ".62rem", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--leaf)", flex: "none", width: "52px" }}>N</b>Registered, 45-day protocol</li>
                <li style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 0", borderTop: "1px solid rgba(255,255,255,.1)", fontSize: ".9rem" }}><b style={{ fontFamily: "var(--mono)", fontSize: ".62rem", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--leaf)", flex: "none", width: "52px" }}>Result</b>+74% stool butyrate, GTB arm</li>
                <li style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 0", borderTop: "1px solid rgba(255,255,255,.1)", borderBottom: "1px solid rgba(255,255,255,.1)", fontSize: ".9rem" }}><b style={{ fontFamily: "var(--mono)", fontSize: ".62rem", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--leaf)", flex: "none", width: "52px" }}>Limits</b>No placebo arm, disclosed</li>
              </ul>
            </div>
          </div>

          {/* Stat cards */}
          <span className="eyebrow">Member outcomes · T3B Club stewardship</span>
          <h2 style={{ fontSize: "clamp(1.8rem,3.6vw,2.8rem)", margin: "12px 0 clamp(22px,3vw,36px)" }}>The stats, in full.</h2>
          <div className="hl-grid" style={{ marginBottom: "clamp(36px,5vw,60px)" }}>
            <div className="hlc hlc--light"><span className="hlc__badge">Energy · 30-day</span><div className="hlc__n">30<span style={{ fontSize: ".5em" }}>%</span></div><div className="hlc__what">increase in energy levels</div><div className="hlc__div"></div><h3>Your gut was draining your energy. We fixed the source.</h3><p>When your gut lining is inflamed, your body diverts immune resources away from energy production. Members reported feeling the shift by week 2.</p><div className="hlc__foot">T3B Club 30-day tracked response</div></div>
            <div className="hlc hlc--dark"><span className="hlc__badge">Bloating · Member results</span><div className="hlc__n">90<span style={{ fontSize: ".5em" }}>%</span></div><div className="hlc__what">reduction in bloating</div><div className="hlc__div"></div><h3>The bloat wasn't about food. It was about your gut lining.</h3><p>GTB™ inhibits TNF-alpha and rebuilds tight junctions. 9 out of 10 members reported visible bloating reduction within 30 days.</p><div className="hlc__foot">T3B Club 30-day stewardship · weekly tracking</div></div>
            <div className="hlc hlc--green"><span className="hlc__badge">Satisfaction</span><div className="hlc__n">100<span style={{ fontSize: ".5em" }}>%</span></div><div className="hlc__what">satisfaction rate · all cohorts</div><div className="hlc__div"></div><h3>100% of T3B Club members said they'd recommend Biome Balance.</h3><p>Across every stewardship cohort, every single member said they would recommend Third Biome to someone they care about.</p><div className="hlc__foot">T3B Club end-of-month survey · 2025-2026</div></div>
            <div className="hlc hlc--leaf"><span className="hlc__badge">Consumer experience</span><div className="hlc__n">90<span style={{ fontSize: ".5em" }}>%</span></div><div className="hlc__what">feel a difference in 30 days</div><div className="hlc__div"></div><h3>9 in 10 members felt a measurable difference within 30 days.</h3><p>Across gut comfort, energy, and mental clarity. Because GTB™ bypasses stomach acid and acts directly on gut cells, the timeline is faster than anything they'd tried before.</p><div className="hlc__foot">T3B Club member survey · Urban India 2025-2026</div></div>
            <div className="hlc hlc--gray"><span className="hlc__badge">Science · GTB mechanism</span><div className="hlc__n">+74<span style={{ fontSize: ".5em" }}>%</span></div><div className="hlc__what">stool butyrate · GTB arm · RCT</div><div className="hlc__div"></div><h3>More of the right molecule. In exactly the right place.</h3><p>Our CTRI-registered RCT (45 days, double-blinded) showed the GTB arm raised stool butyrate by 74%, the SCFA your colon lining cells run on.</p><div className="hlc__foot">CTRI/2025/09/094597</div></div>
            <div className="hlc hlc--dark hlc--wide">
              <div className="hlc__body"><span className="hlc__badge">India's first</span><div className="hlc__div"></div><h3 style={{ fontSize: "clamp(1.1rem,1.8vw,1.5rem)" }}>India didn't have a postbiotic brand. We built one, with proprietary technology to prove it.</h3><p>Third Biome is India's first precision postbiotic ecosystem. FSSAI-approved. Proprietary GTB technology. Clinically designed.</p></div>
              <div className="hlc__stats"><div className="hlcstat"><span className="n">16</span><span className="l">SKUs in pipeline</span></div><div className="hlcstat"><span className="n">1st</span><span className="l">postbiotic brand in India</span></div><div className="hlcstat"><span className="n">90%</span><span className="l">of serotonin from gut</span></div></div>
            </div>
          </div>

          {/* Comparison table */}
          <span className="eyebrow">Postbiotic vs probiotic</span>
          <h2 style={{ fontSize: "clamp(1.8rem,3.6vw,2.8rem)", margin: "12px 0 clamp(20px,3vw,30px)" }}>Why the category is different.</h2>
          <div style={{ overflowX: "auto", borderRadius: "var(--r-lg)", border: "1px solid var(--line)" }}>
            <table className="v5-compare-tbl">
              <thead><tr><th style={{ width: "26%" }}>What matters</th><th className="th-t3b">Thirdbiome GTB™ (Postbiotic)</th><th className="th-prb">Regular probiotic</th></tr></thead>
              <tbody>
                <tr><td>How it works</td><td className="td-win">Delivers butyrate directly to gut cells, no colonisation needed <span className="wp">Direct</span></td><td className="td-lose">Live bacteria must survive, colonise, then produce metabolites <span className="lp">Indirect</span></td></tr>
                <tr><td>Survives stomach acid?</td><td className="td-win">Microencapsulation shields GTB through the stomach <span className="wp">Protected</span></td><td className="td-lose">60-90% of live bacteria die before reaching the gut <span className="lp">Lost</span></td></tr>
                <tr><td>Time to results</td><td className="td-win">Days from first dose <span className="wp">Faster</span></td><td className="td-lose">Weeks to colonise <span className="lp">Slower</span></td></tr>
                <tr><td>Consistency</td><td className="td-win">Fixed molecule, fixed dose, predictable mechanism <span className="wp">Measurable</span></td><td className="td-lose">Variable, depends on gut flora and bacterial survival <span className="lp">Unpredictable</span></td></tr>
                <tr><td>Bloating risk</td><td className="td-win">Zero, postbiotics don't ferment <span className="wp">No bloat</span></td><td className="td-lose">Bacteria ferment in gut, causing gas <span className="lp">Gas risk</span></td></tr>
                <tr><td>Refrigeration?</td><td className="td-win">Shelf-stable at room temperature <span className="wp">Stable</span></td><td className="td-lose">Often yes, cold chain required <span className="lp">Fragile</span></td></tr>
                <tr><td>Mechanisms</td><td className="td-win">TNF-alpha + tight junctions + GLP-1 <span className="wp">3 pathways</span></td><td className="td-lose">Depends on which strains survive <span className="lp">Indirect</span></td></tr>
              </tbody>
            </table>
            <div className="v5-compare-foot">Bottom line: Probiotics plant seeds. Postbiotics deliver the harvest, directly, measurably. Thirdbiome GTB™ is India's first precision postbiotic. FSSAI approved. Proprietary technology.</div>
          </div>

          <p style={{ marginTop: "clamp(20px,3vw,36px)", fontFamily: "var(--mono)", fontSize: ".64rem", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-soft)", lineHeight: "1.8", maxWidth: "72ch" }}>Disclosure: All T3B Club data is self-reported via weekly check-in questionnaires, Urban India cohorts 2025-2026. The clinical RCT (CTRI/2025/09/094597) had no placebo arm, disclosed. These statements describe ingredient mechanisms and have not been evaluated by a regulatory authority to diagnose, treat, cure, or prevent any disease.</p>
        </div>
      </section>

      <section className="sheet sheet--pad" style={{ textAlign: "center" }}>
        <div className="wrap">
          <span className="eyebrow" style={{ justifyContent: "center" }}>Start your 30 days</span>
          <h2 style={{ margin: "14px auto 18px", maxWidth: "18ch" }}>The evidence is real.<br />So is the <em>guarantee.</em></h2>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
            <Link className="btn btn--dark" to="/products/biome-balance">Shop Biome Balance →</Link>
            <Link className="btn" to="/case-studies">Read case studies</Link>
          </div>
        </div>
      </section>
    </>
  );
}
