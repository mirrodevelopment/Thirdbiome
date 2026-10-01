import { Link } from "react-router-dom";
import { IMG } from "../data/content";
import { Shot, AccItem } from "../components/ui";
import Seo from "../components/Seo";

export default function Science() {
  return (
    <>
      <Seo
        title="GTB™ Science & Clinical Evidence | Third Biome"
        description="Explore how Biome Balance delivers 500 mg of micro-encapsulated GTB™ directly to the colon, bypassing upper stomach acid to elevate stool butyrate by 74%."
      />

      {/* HERO SECTION */}
      <section className="sheet sheet--pad v5-page">
        <div className="wrap science-hero">
          <div className="science-hero__header">
            <h1>Direct Tributyrate Delivery.<br /><em>Verified Clinical Endpoints.</em></h1>
            <p className="science-hero__lead">
              Biome Balance delivers 500 mg of micro-encapsulated GTB™ directly to your colon —
              bypassing upper stomach acids to fuel the epithelial gut lining and elevate short-chain fatty acids.
            </p>
            <div className="science-hero__anchors">
              <a className="btn btn--dark" href="#mechanism">How it works ↓</a>
              <a className="btn" href="#study">Study summary ↓</a>
            </div>
          </div>

          {/* KEY METRICS BANNER */}
          <div className="science-metrics-grid">
            <div className="science-metric-card">
              <span className="science-metric-card__val">+74%</span>
              <span className="science-metric-card__title">Stool Butyrate Increase</span>
              <p>Documented in the 45-day randomised, double-blinded GTB clinical arm.</p>
            </div>
            <div className="science-metric-card">
              <span className="science-metric-card__val">45 Days</span>
              <span className="science-metric-card__title">Clinical Study Duration</span>
              <p>Observed improvements across digestion, daytime energy, and sleep domains.</p>
            </div>
            <div className="science-metric-card">
              <span className="science-metric-card__val">500 mg</span>
              <span className="science-metric-card__title">Micro-Encapsulated GTB™</span>
              <p>Targeted bio-available glyceryl tributyrate per daily serving.</p>
            </div>
            <div className="science-metric-card">
              <span className="science-metric-card__val">100%</span>
              <span className="science-metric-card__title">Gastric Acid Protected</span>
              <p>Zero upper GI degradation, delivering active postbiotics where needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-STEP MECHANISM OF ACTION */}
      <section className="sheet sheet--pad" id="mechanism">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Delivery Mechanism</span>
              <h2 style={{ marginTop: 14 }}>A Defined Molecule.<br /><em>A Targeted Delivery Architecture.</em></h2>
            </div>
            <p>
              Unlike live bacteria that perish in gastric acid, GTB™ utilizes specialized micro-encapsulation
              engineered to navigate the upper gastrointestinal tract and release pure butyrate in the colon.
            </p>
          </div>

          <div className="science-mechanism-cards">
            {/* Step 1 */}
            <article className="science-mech-card">
              <div className="science-mech-card__top">
                <span className="science-mech-card__step">Step 01</span>
                <span className="science-mech-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="20" cy="20" r="15" strokeDasharray="3.5 2.5" />
                    <circle cx="20" cy="20" r="8.5" />
                    <circle cx="20" cy="20" r="3.5" fill="currentColor" />
                    <path d="M20 2v3M20 35v3M2 20h3M35 20h3" />
                  </svg>
                </span>
              </div>
              <h3>Micro-Encapsulation Core</h3>
              <p>500 mg of Glyceryl Tributyrate is stabilized within a protective matrix, neutralizing volatile odors and preventing premature release in the oral cavity and esophagus.</p>
              <div className="science-mech-card__tag">500 mg GTB™</div>
            </article>

            <div className="science-mechanism-arrow" aria-hidden="true">→</div>

            {/* Step 2 */}
            <article className="science-mech-card">
              <div className="science-mech-card__top">
                <span className="science-mech-card__step">Step 02</span>
                <span className="science-mech-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 4v32M12 12c0 8 16 8 16 16M12 28c0-8 16-8 16-16" />
                    <circle cx="20" cy="20" r="16" />
                  </svg>
                </span>
              </div>
              <h3>Gastric Acid Bypass</h3>
              <p>The plant-based vegetarian HPMC capsule remains intact through low stomach pH (1.5–3.5), ensuring 100% of active butyrate passes into the lower intestine without degradation.</p>
              <div className="science-mech-card__tag">pH Resistant</div>
            </article>

            <div className="science-mechanism-arrow" aria-hidden="true">→</div>

            {/* Step 3 */}
            <article className="science-mech-card">
              <div className="science-mech-card__top">
                <span className="science-mech-card__step">Step 03</span>
                <span className="science-mech-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20a8 8 0 0 0 16 0c0-6-8-14-8-14s-8 8-8 14Z" fill="currentColor" fillOpacity=".12" />
                    <path d="M20 6v14M16 20h8M14 34h12" />
                  </svg>
                </span>
              </div>
              <h3>Colonic Release & Absorption</h3>
              <p>Colonic lipases break the ester bonds of tributyrate, liberating 3 pure butyrate molecules directly at the mucosal barrier to nourish colon epithelial cells and reinforce tight junctions.</p>
              <div className="science-mech-card__tag">Direct Fuel</div>
            </article>
          </div>

          {/* MOLECULE COMPARISON CALLOUT */}
          <div className="science-callout">
            <div className="science-callout__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
              </svg>
            </div>
            <div className="science-callout__body">
              <b>Why Tributyrate Outperforms Raw Sodium Butyrate Salts</b>
              <p>
                Standard sodium butyrate salts degrade in the stomach, carry a high sodium burden, and emit an intense odor.
                <strong> Thirdbiome GTB™</strong> binds butyric acid to a natural glycerol backbone, yielding 3x more butyrate per molecule with zero pungent scent and targeted colon delivery.
              </p>
            </div>
          </div>
          <p className="science-page__disclosure">Mechanism statements describe the formulation design and are not a promise to diagnose, treat, cure, or prevent disease.</p>
        </div>
      </section>

      {/* CLINICAL STUDY SUMMARY */}
      <section className="sheet sheet--pad" id="study">
        <div className="wrap science-study-wrap">
          <div className="science-study-info">
            <span className="eyebrow">Clinical Trial Verification</span>
            <h2 style={{ marginTop: 14 }}>Randomised, Double-Blinded Human Study.</h2>
            <p>
              The clinical documentation outlines a 45-day randomised, double-blind trial registered under
              the Clinical Trials Registry - India (CTRI). Participants consuming the daily GTB protocol demonstrated
              a marked rise in stool short-chain fatty acid concentrations.
            </p>

            <div className="science-study-badges">
              <div className="science-sbadge">
                <span className="science-sbadge__lbl">Trial Registry ID</span>
                <b>CTRI/2025/09/094597</b>
              </div>
              <div className="science-sbadge">
                <span className="science-sbadge__lbl">Trial Duration</span>
                <b>45 Days Continuous</b>
              </div>
              <div className="science-sbadge">
                <span className="science-sbadge__lbl">Primary Endpoint</span>
                <b>+74% Stool Butyrate</b>
              </div>
              <div className="science-sbadge">
                <span className="science-sbadge__lbl">Study Format</span>
                <b>Randomised, Double-Blind</b>
              </div>
            </div>

            <p className="science-page__disclosure">
              The study summary documents results in the active GTB arm over 45 days.
              Individual digestive responses vary based on baseline microbiome diversity, diet, and adherence.
            </p>

            <div style={{ marginTop: 24 }}>
              <Link className="pdp__proof" to="/evidence#clinical-trial">
                Explore the full evidence dossier <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* CLINICAL OUTCOME DASHBOARD */}
          <div className="science-study-dashboard">
            <div className="science-study-dashboard__head">
              <span className="eyebrow" style={{ color: "var(--leaf)" }}>Clinical Endpoints</span>
              <h3>Observed Study Results</h3>
            </div>

            <div className="science-endpoint-item">
              <div className="science-endpoint-item__top">
                <span>Stool Butyrate (Short-Chain Fatty Acid)</span>
                <b>+74%</b>
              </div>
              <div className="science-progress-bar">
                <div className="science-progress-bar__fill" style={{ width: "74%" }} />
              </div>
              <small>Statistically significant increase from baseline across 45-day evaluation.</small>
            </div>

            <div className="science-endpoint-item">
              <div className="science-endpoint-item__top">
                <span>Digestive Symptom Score Index</span>
                <b>Significant Improvement</b>
              </div>
              <div className="science-progress-bar">
                <div className="science-progress-bar__fill" style={{ width: "88%" }} />
              </div>
              <small>Documented relief in occasional bloating, irregularity, and abdominal heaviness.</small>
            </div>

            <div className="science-endpoint-item">
              <div className="science-endpoint-item__top">
                <span>Secondary Lifestyle Domains</span>
                <b>Enhanced Energy & Sleep</b>
              </div>
              <div className="science-progress-bar">
                <div className="science-progress-bar__fill" style={{ width: "80%" }} />
              </div>
              <small>Correlated improvements in perceived vitality and restorative rest cycles.</small>
            </div>
          </div>
        </div>
      </section>

      {/* POSTBIOTICS VS PROBIOTICS & PREBIOTICS MATRIX */}
      <section className="sheet sheet--pad" id="comparison">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">The Evolution of Gut Care</span>
              <h2 style={{ marginTop: 14 }}>Why Postbiotics Are<br /><em>The Next Scientific Frontier.</em></h2>
            </div>
            <p>
              Probiotics introduce live bacteria, and prebiotics feed them.
              <strong> Postbiotics deliver the end-benefit directly</strong> — bypass bacterial colonization to fuel cells instantly.
            </p>
          </div>

          <div className="science-compare-table-wrap">
            <table className="science-compare-table">
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>Traditional Probiotics</th>
                  <th>Prebiotic Fibers</th>
                  <th className="highlight-col">Third Biome GTB™</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Biological Nature</strong></td>
                  <td>Live bacterial cultures (CFUs)</td>
                  <td>Indigestible plant fiber sugars</td>
                  <td className="highlight-col"><strong>Pure, defined postbiotic metabolite</strong></td>
                </tr>
                <tr>
                  <td><strong>Gastric Acid Stability</strong></td>
                  <td>High die-off in stomach acid</td>
                  <td>Resistant, but causes early gas</td>
                  <td className="highlight-col"><strong>100% pH-protected targeted delivery</strong></td>
                </tr>
                <tr>
                  <td><strong>Action Mechanism</strong></td>
                  <td>Must survive & colonize (days to weeks)</td>
                  <td>Fermented by existing gut flora</td>
                  <td className="highlight-col"><strong>Direct, immediate fuel for gut lining</strong></td>
                </tr>
                <tr>
                  <td><strong>Side Effects & Gas</strong></td>
                  <td>Frequent bloating & CFU volatility</td>
                  <td>High incidence of excess gas</td>
                  <td className="highlight-col"><strong>Zero fermentation, zero bloating</strong></td>
                </tr>
                <tr>
                  <td><strong>Shelf Stability</strong></td>
                  <td>Heat-sensitive, requires refrigeration</td>
                  <td>Shelf-stable</td>
                  <td className="highlight-col"><strong>Room temperature stable, 24-mo potency</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* QUALITY & MANUFACTURING STANDARDS */}
      <section className="sheet sheet--pad" id="safety">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Purity & Manufacturing</span>
              <h2 style={{ marginTop: 14 }}>Clean Standards.<br /><em>Pharmaceutical-Grade Precision.</em></h2>
            </div>
            <p>
              Formulated under rigorous international benchmarks. Every batch undergoes comprehensive testing
              for potency, identity, and heavy metal purity.
            </p>
          </div>

          <div className="science-certs-grid">
            <div className="science-cert-card">
              <span className="science-cert-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3 2 8h20L12 3Z" />
                </svg>
              </span>
              <b>US FDA-Registered Facility</b>
              <p>Manufactured in certified cleanroom environments conforming to FDA standards.</p>
            </div>
            <div className="science-cert-card">
              <span className="science-cert-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <b>WHO-GMP Certified</b>
              <p>Strict quality assurance protocols adhering to World Health Organization standards.</p>
            </div>
            <div className="science-cert-card">
              <span className="science-cert-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22v-9" />
                  <path d="M12 13c0-4.4 3.6-8 8-8 0 4.4-3.6 8-8 8Z" />
                  <path d="M12 17c0-3.3-2.7-6-6-6 0 3.3 2.7 6 6 6Z" />
                </svg>
              </span>
              <b>100% Vegetarian HPMC</b>
              <p>Plant-derived vegetarian capsules free of gelatin, allergens, and preservatives.</p>
            </div>
            <div className="science-cert-card">
              <span className="science-cert-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 18h8M3 22h18M14 22a7 7 0 1 0-7-7h1M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
                </svg>
              </span>
              <b>Third-Party Lab Tested</b>
              <p>Independently verified for short-chain fatty acid potency and microbiological purity.</p>
            </div>
          </div>

          {/* SAFETY & USAGE ACCORDION */}
          <div className="science-faq-wrap">
            <div className="shead" style={{ marginBottom: 20 }}>
              <div>
                <span className="eyebrow">Safety & Guidance</span>
                <h3 style={{ fontSize: "1.4rem", marginTop: 8 }}>Frequently Asked Scientific Questions</h3>
              </div>
            </div>

            <div className="acc pdp__acc">
              <AccItem q="How does GTB™ differ from standard probiotic supplements?" defaultOpen>
                <p>
                  Probiotics deliver live bacterial strains that must survive acidic stomach digestion, travel to the colon, and compete to colonize.
                  GTB™ delivers pure, stabilized Tributyrate — the actual postbiotic short-chain fatty acid that healthy gut bacteria produce — giving your gut lining direct fuel without relying on uncertain bacterial survival.
                </p>
              </AccItem>
              <AccItem q="When is the best time of day to take Biome Balance?">
                <p>
                  Take one capsule daily with water, with or without food. Because GTB™ is micro-encapsulated in a pH-resistant vegetarian capsule, timing relative to meals does not impact efficacy. Establishing a consistent daily habit is the most important factor.
                </p>
              </AccItem>
              <AccItem q="Can I take Biome Balance alongside other vitamins or medications?">
                <p>
                  Yes. GTB™ is a targeted postbiotic compound and does not interact with standard multivitamins, protein powders, or digestive enzymes. However, if you are pregnant, nursing, taking prescription medications, or under medical supervision, consult your physician before starting any new regimen.
                </p>
              </AccItem>
              <AccItem q="How long does it take to see results?">
                <p>
                  In the 45-day registered clinical trial (CTRI/2025/09/094597), substantial increases in stool butyrate (+74%) and improvements in digestive comfort were measured over the 45-day continuous protocol. Most users report initial digestive ease within 2 to 3 weeks, with deeper gut-barrier resilience building over 60 to 90 days.
                </p>
              </AccItem>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CONVERSION BANNER */}
      <section className="sheet sheet--pad">
        <div className="wrap">
          <div className="science-cta-banner">
            <div className="science-cta-banner__copy">
              <span className="eyebrow" style={{ color: "var(--leaf)" }}>Start Your Protocol</span>
              <h2>Experience the Science of Biome Balance</h2>
              <p>One daily capsule. 500 mg micro-encapsulated GTB™. Backed by registered clinical data.</p>
              <div className="science-cta-banner__trust">
                <span>✓ 30-Day Money-Back Guarantee</span>
                <span>✓ Free Express Shipping Across India</span>
                <span>✓ Cancel or Pause Anytime</span>
              </div>
            </div>
            <div className="science-cta-banner__action">
              <div className="science-cta-banner__price">
                <small>3-Month Gut Reset Protocol</small>
                <b>₹1,999</b>
                <s>₹2,999</s>
              </div>
              <Link to="/products/biome-balance" className="btn btn--leaf" style={{ width: "100%", justifyContent: "center", padding: "1.1em 1.8em", fontSize: "1.05rem" }}>
                Start my gut reset →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
