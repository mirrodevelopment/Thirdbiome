import { useState } from "react";
import { Link } from "react-router-dom";
import { Arr } from "../components/ui";
import { useCart } from "../cart/CartProvider";
import { IMG } from "../data/content";

const BoxCheck = () => (
  <span className="v5-qopt__box">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  </span>
);

/* small inline glyphs, one per option, matching v5's icon convention */
const G = (d) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const ICON = {
  bloat: G(<><circle cx="12" cy="13" r="8" /><path d="M12 5V2" /></>),
  brain: G(<path d="M12 21C7 17 3 13 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5-4 9-9 13z" />),
  digest: G(<path d="M3 12h4l3 8 4-16 3 8h4" />),
  skin: G(<><circle cx="12" cy="12" r="9" /><path d="M9 10h.01M15 10h.01M9 15c1 1 5 1 6 0" /></>),
  clock: G(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  week: G(<><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></>),
  stress: G(<path d="M13 2 3 14h7l-1 8 10-12h-7z" />),
  cycle: G(<path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" />),
  probio: G(<path d="M10 2v6L4 18a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-10V2" />),
  diet: G(<path d="M11 2v7M8 2v6a3 3 0 0 0 6 0V2M18 2c-1.5 2-2 4-2 7v13" />),
  none: G(<><circle cx="12" cy="12" r="9" /><path d="M8 12h8" /></>),
  all: G(<path d="M3 7l3-3 3 3M6 4v16M21 17l-3 3-3-3M18 20V4" />),
  evidence: G(<path d="m9 11 3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />),
  simple: G(<path d="M5 12h14M12 5v14" />),
  repair: G(<path d="M4 12h16M4 12a8 8 0 0 1 8-8M4 12a8 8 0 0 0 8 8" />),
  fast: G(<path d="M13 2 3 14h7l-1 8 10-12h-7z" />),
};

const STEPS = [
  {
    q: "Question 1 of 4",
    title: "What's your gut working against most?",
    opts: [
      { ic: "bloat", l: "Bloating & heaviness", d: "Gas, fullness, a heavy middle", why: "Bloating is where most members feel butyrate work first, the lining settles and gas eases." },
      { ic: "brain", l: "Brain fog & low focus", d: "That mid-afternoon haze", why: "The legit gut-brain route runs through a sealed lining and lower neuroinflammation, exactly butyrate's lane." },
      { ic: "digest", l: "Irregular digestion", d: "Unpredictable, day to day", why: "In our case studies regularity improved in every case as the gut wall was fuelled." },
      { ic: "skin", l: "Skin & immunity", d: "Breakouts, frequent bugs", why: "~70% of immune cells sit in gut tissue, a calmer, sealed lining is the foundation." },
    ],
  },
  {
    q: "Question 2 of 4",
    title: "How often does it show up?",
    opts: [
      { ic: "clock", l: "Most days", d: "It's a constant", why: "A daily 500 mg dose gives the lining a consistent supply to repair from." },
      { ic: "week", l: "A few times a week", d: "Comes and goes", why: "Daily butyrate smooths the swings rather than chasing each flare." },
      { ic: "stress", l: "Around stress or travel", d: "Triggered by life", why: "Stress leads to cortisol leads to a weaker gut barrier. Butyrate helps hold the junctions together." },
      { ic: "cycle", l: "Cyclically", d: "Tracks my cycle", why: "The estrobolome links gut and hormones, metabolic support is squarely in butyrate's territory." },
    ],
  },
  {
    q: "Question 3 of 4",
    title: "What have you already tried?",
    opts: [
      { ic: "probio", l: "Probiotics", d: "Strains, not much change", why: "Postbiotics skip the colonising gamble, you get the finished compound, not a bet on bacteria." },
      { ic: "diet", l: "Diet changes", d: "Fibre, cutting things out", why: "Fibre feeds bacteria that make butyrate; we deliver it directly, so it isn't left to chance." },
      { ic: "none", l: "Nothing yet", d: "Starting fresh", why: "One capsule a day is the simplest possible starting point, no 12-step routine." },
      { ic: "all", l: "A bit of everything", d: "Still searching", why: "This is the honest baseline: one biomarker that matters, limits disclosed." },
    ],
  },
  {
    q: "Question 4 of 4",
    title: "What matters most to you?",
    opts: [
      { ic: "evidence", l: "Honest evidence", d: "Show me the trial", why: "A CTRI-registered RCT with +74% stool butyrate, and we disclose the limits in plain sight." },
      { ic: "simple", l: "Simplicity", d: "One thing, done well", why: "One formula, one daily dose. Nothing to manage." },
      { ic: "repair", l: "Long-term repair", d: "Fix the foundation", why: "Butyrate fuels colonocytes and seals the lining, the groundwork, not a quick mask." },
      { ic: "fast", l: "Noticeable change", d: "I want to feel it", why: "Works from dose one, most members notice gas and bloating settle within the first weeks." },
    ],
  },
];

export default function Quiz() {
  const { add, busy } = useCart();
  const total = STEPS.length;
  const [cur, setCur] = useState(0);
  const [picks, setPicks] = useState(() => STEPS.map(() => null));
  const [done, setDone] = useState(false);

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const pick = (stepIdx, optIdx) => {
    setPicks((p) => p.map((v, i) => (i === stepIdx ? optIdx : v)));
    setTimeout(() => {
      if (stepIdx < total - 1) { setCur(stepIdx + 1); toTop(); }
      else { setDone(true); toTop(); }
    }, 180);
  };
  const back = () => {
    if (done) setDone(false);
    else setCur((c) => Math.max(c - 1, 0));
    toTop();
  };
  const restart = () => {
    setDone(false);
    setPicks(STEPS.map(() => null));
    setCur(0);
    toTop();
  };

  const fillWidth = done ? "100%" : ((cur + 1) / (total + 1)) * 100 + "%";
  const whys = picks
    .map((a, qi) => (a !== null ? STEPS[qi].opts[a]?.why : null))
    .filter(Boolean);

  return (
    <>
      <section className="sheet v5-page" data-screen-label="Quiz hero">
        <div className="wrap">
          <span className="eyebrow">The 30-second finder</span>
          <h1>
            What's your gut
            <br />
            <em>working against?</em>
          </h1>
          <p>Four quick questions. No email required to see your result, just an honest, personalised starting point.</p>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body" data-screen-label="Quiz">
        <div className="wrap">
          <div className="v5-quiz">
            <div className="v5-quiz__top">
              <button className="quizback" disabled={!done && cur === 0} onClick={back} style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: ".7rem", letterSpacing: ".05em", textTransform: "uppercase", color: "var(--ink-soft)", opacity: (!done && cur === 0) ? 0.4 : 1, padding: 0 }}>
                ← Back
              </button>
            </div>
            <div className="v5-quiz__bar">
              <div className="v5-quiz__fill" id="quizFill" style={{ width: fillWidth }}></div>
            </div>

            {STEPS.map((step, si) => (
              <div key={si} className={"v5-quiz__step" + (!done && cur === si ? " on" : "")} data-step={si}>
                <div className="v5-quiz__q">{step.q}</div>
                <h2>{step.title}</h2>
                <div className="v5-quiz__opts" data-single="">
                  {step.opts.map((o, oi) => (
                    <button
                      key={o.l}
                      className={"v5-qopt" + (picks[si] === oi ? " on" : "")}
                      onClick={() => pick(si, oi)}
                    >
                      <span className="v5-qopt__ic">{ICON[o.ic]}</span>
                      <span className="v5-qopt__text">
                        <b>{o.l}</b>
                        <span className="v5-qopt__d">{o.d}</span>
                      </span>
                      <BoxCheck />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className={"v5-quiz__result" + (done ? " on" : "")} id="quizResult">
              <span className="eyebrow" style={{ justifyContent: "center" }}>
                Your match · 1 of 1
              </span>
              <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", margin: "12px 0 10px" }}>
                Start with <span style={{ color: "var(--green)" }}>Biome Balance.</span>
              </h2>
              <p style={{ color: "var(--ink-soft)", maxWidth: "48ch", margin: "0 auto 26px" }}>
                One focused formula, built for the gut lining behind everything you told us. Here's why it fits:
              </p>

              {whys.length > 0 && (
                <div style={{ maxWidth: 480, margin: "0 auto 26px", background: "var(--card)", borderRadius: "var(--r-lg)", padding: "22px 26px", textAlign: "left" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: ".64rem", letterSpacing: ".05em", textTransform: "uppercase", color: "var(--green-d)", marginBottom: 12 }}>
                    Personalised for you
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
                    {whys.map((w, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: ".92rem", color: "var(--ink-mid)", lineHeight: 1.5 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" style={{ flex: "none", marginTop: 3 }}><path d="M20 6 9 17l-5-5" /></svg>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div
                style={{
                  maxWidth: "420px",
                  margin: "0 auto",
                  background: "var(--card)",
                  borderRadius: "var(--r-lg)",
                  padding: "26px",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                  <span className="imgslot" style={{ width: 56, height: 68, borderRadius: 12, flex: "none", overflow: "hidden" }}>
                    <img src={IMG.hero} alt="Biome Balance" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.15rem" }}>Biome Balance</div>
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: ".66rem",
                        letterSpacing: ".04em",
                        textTransform: "uppercase",
                        color: "var(--green-d)",
                        marginTop: "4px",
                      }}
                    >
                      Foundational gut health · 500mg GTB™
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button className="btn btn--dark" style={{ flex: 1 }} disabled={busy} onClick={() => add()}>
                    Add to cart <Arr />
                  </button>
                  <Link className="btn btn--out" to="/products/biome-balance" style={{ flex: 1 }}>
                    See full details
                  </Link>
                </div>
              </div>
              <button className="btn btn--ghost" id="quizRestart" style={{ marginTop: "20px" }} onClick={restart}>
                Retake the quiz
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
