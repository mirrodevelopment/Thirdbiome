/**
 * "If probiotics are the seeds, postbiotics are the harvest" — the
 * probiotic / prebiotic / postbiotic analogy cards + an at-a-glance
 * 4-way comparison table. Reused on the Science page and the PDP.
 */

const ANALOGY = [
  {
    tier: "Probiotics",
    title: "The seeds",
    body: "Live bacteria. Most die in your stomach acid. The ones that survive may or may not colonise. Inconsistent outcomes.",
  },
  {
    tier: "Prebiotics",
    title: "The fertilizer",
    body: "Fiber that feeds the bacteria — assuming the right bacteria are still in there. Helps the soil. Slow, indirect, dependent.",
  },
  {
    tier: "Postbiotics",
    title: "The harvest",
    body: "The active compound itself — butyrate, the molecule your gut lining actually uses. Delivered. Stable. Direct.",
    dark: true,
    badge: "What The Third Biome delivers",
  },
];

const ROWS = [
  ["What it is", "Live bacteria", "Fiber that feeds bacteria", "The active compound itself (butyrate)"],
  ["Mechanism", "Must survive stomach + colonise", "Stimulates resident bacteria", "Direct signalling to gut cells"],
  ["Onset of action", "Slow · 4–8 weeks if at all", "Slow · depends on existing flora", "Fast · within days to 2 weeks"],
  ["Stability", "Low · heat & acid sensitive", "High", "High · shelf-stable, microencapsulated"],
  ["Safety profile", "Risk for immunocompromised", "May cause bloating/gas", "Extremely safe · non-living"],
];

export function PostbioticsExplained() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="head reveal">
          <div className="eyebrow">Postbiotics, explained</div>
          <h2>
            If probiotics are the seeds, postbiotics are the{" "}
            <span className="emi uline">harvest.</span>
          </h2>
          <p className="lead">
            Everything probiotics are <i>supposed</i> to do, postbiotics actually
            deliver — directly to your gut lining, without needing to survive your
            stomach acid first.
          </p>
        </div>

        <div className="analogy">
          {ANALOGY.map((c) => (
            <div className={`acard reveal${c.dark ? " acard--dark" : ""}`} key={c.tier}>
              <div className="acard__dot" />
              <div className="acard__tier">{c.tier}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              {c.badge && <span className="acard__badge">{c.badge}</span>}
            </div>
          ))}
        </div>

        <div className="cmpwrap reveal">
          <div className="cmp-title">Why postbiotics outperform probiotics — at a glance</div>
          <div className="cmp-scroll">
            <table className="cmp">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Probiotics</th>
                  <th>Prebiotics</th>
                  <th className="post">Postbiotics (The Third Biome)</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([f, pro, pre, post]) => (
                  <tr key={f}>
                    <th scope="row">{f}</th>
                    <td>{pro}</td>
                    <td>{pre}</td>
                    <td className="post">{post}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
