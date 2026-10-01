import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCart } from "../cart/CartContext";
import { PRODUCT_IMG } from "../data/products";

/* quiz-specific glyphs (24x24, stroke currentColor) */
const G = (d) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const QICON = {
  bloat: G(<><circle cx="12" cy="13" r="8" /><path d="M12 5V2" /></>),
  brain: G(<path d="M12 21C7 17 3 13 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5-4 9-9 13z" />),
  digest: G(<path d="M3 12h4l3 8 4-16 3 8h4" />),
  skin: G(<><circle cx="12" cy="12" r="9" /><path d="M9 10h.01M15 10h.01M9 15c1 1 5 1 6 0" /></>),
  clock: G(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  week: G(<><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></>),
  stress: G(<path d="M13 2L3 14h7l-1 8 10-12h-7z" />),
  cycle: G(<path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" />),
  probio: G(<path d="M10 2v6L4 18a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-10V2" />),
  diet: G(<path d="M11 2v7M8 2v6a3 3 0 0 0 6 0V2M18 2c-1.5 2-2 4-2 7v13" />),
  none: G(<><circle cx="12" cy="12" r="9" /><path d="M8 12h8" /></>),
  all: G(<path d="M3 7l3-3 3 3M6 4v16M21 17l-3 3-3-3M18 20V4" />),
  evidence: G(<path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />),
  simple: G(<path d="M5 12h14M12 5v14" />),
  repair: G(<path d="M4 12h16M4 12a8 8 0 0 1 8-8M4 12a8 8 0 0 0 8 8" />),
  fast: G(<path d="M13 2L3 14h7l-1 8 10-12h-7z" />),
};

const QUESTIONS = [
  { eyebrow: "Step one", q: "What’s your gut working against most?", opts: [
    { ic: "bloat", l: "Bloating & heaviness", d: "Gas, fullness, a heavy middle", why: "Bloating is where most members feel butyrate work first — the lining settles and gas eases." },
    { ic: "brain", l: "Brain fog & low focus", d: "That mid-afternoon haze", why: "The legit gut–brain route runs through a sealed lining and lower neuroinflammation — exactly butyrate’s lane." },
    { ic: "digest", l: "Irregular digestion", d: "Unpredictable, day to day", why: "In our case studies regularity improved in every case as the gut wall was fuelled." },
    { ic: "skin", l: "Skin & immunity", d: "Breakouts, frequent bugs", why: "~70% of immune cells sit in gut tissue — a calmer, sealed lining is the foundation." },
  ]},
  { eyebrow: "Step two", q: "How often does it show up?", opts: [
    { ic: "clock", l: "Most days", d: "It’s a constant", why: "A daily 500 mg dose gives the lining a consistent supply to repair from." },
    { ic: "week", l: "A few times a week", d: "Comes and goes", why: "Daily butyrate smooths the swings rather than chasing each flare." },
    { ic: "stress", l: "Around stress or travel", d: "Triggered by life", why: "Stress → cortisol → a weaker gut barrier. Butyrate helps hold the junctions together." },
    { ic: "cycle", l: "Cyclically", d: "Tracks my cycle", why: "The estrobolome links gut and hormones — metabolic support is squarely in butyrate’s territory." },
  ]},
  { eyebrow: "Step three", q: "What have you already tried?", opts: [
    { ic: "probio", l: "Probiotics", d: "Strains, not much change", why: "Postbiotics skip the colonising gamble — you get the finished compound, not a bet on bacteria." },
    { ic: "diet", l: "Diet changes", d: "Fibre, cutting things out", why: "Fibre feeds bacteria that make butyrate; we deliver it directly, so it isn’t left to chance." },
    { ic: "none", l: "Nothing yet", d: "Starting fresh", why: "One capsule a day is the simplest possible starting point — no 12-step routine." },
    { ic: "all", l: "A bit of everything", d: "Still searching", why: "This is the honest baseline: one biomarker that matters, limits disclosed." },
  ]},
  { eyebrow: "Step four", q: "What matters most to you?", opts: [
    { ic: "evidence", l: "Honest evidence", d: "Show me the trial", why: "A CTRI-registered RCT with +74% stool butyrate — and we disclose the limits in plain sight." },
    { ic: "simple", l: "Simplicity", d: "One thing, done well", why: "One formula, one daily dose. Nothing to manage." },
    { ic: "repair", l: "Long-term repair", d: "Fix the foundation", why: "Butyrate fuels colonocytes and seals the lining — the groundwork, not a quick mask." },
    { ic: "fast", l: "Noticeable change", d: "I want to feel it", why: "Works from dose one — most members notice gas and bloating settle within the first weeks." },
  ]},
];

export default function Quiz() {
  const { add } = useCart();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(false);

  const len = QUESTIONS.length;
  const barWidth = result ? 100 : ((step + 1) / (len + 1)) * 100;
  const label = result ? "Your match" : `0${step + 1} / 0${len}`;

  const choose = (i) => {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);
    setTimeout(() => {
      if (step < len - 1) setStep(step + 1);
      else setResult(true);
    }, 180);
  };

  const back = () => {
    if (result) setResult(false);
    else if (step > 0) setStep(step - 1);
  };

  const retake = () => {
    setStep(0);
    setAnswers([]);
    setResult(false);
  };

  const whys = answers
    .map((a, qi) => QUESTIONS[qi].opts[a]?.why)
    .filter(Boolean)
    .slice(0, 4);

  const Q = QUESTIONS[step];

  return (
    <main>
      <section className="quizpage">
        <div className="wrap quizpage__in">
          <div className="quiztop">
            <button className="quizback" disabled={!result && step === 0} onClick={back}>
              <Icon name="arrowLeft" size={16} sw={2.2} /> Back
            </button>
            <div className="quizprog">
              <span className="lbl">{label}</span>
              <div className="track">
                <span style={{ width: `${barWidth}%` }} />
              </div>
            </div>
          </div>

          <div id="qStage">
            {!result ? (
              <>
                <div className="quizq reveal in">
                  <div className="eyebrow" style={{ justifyContent: "center" }}>
                    {Q.eyebrow}
                  </div>
                  <h2>{Q.q}</h2>
                </div>
                <div className="quizopts c2">
                  {Q.opts.map((o, i) => (
                    <button
                      key={o.l}
                      className={`qopt${answers[step] === i ? " on" : ""}`}
                      onClick={() => choose(i)}
                    >
                      <span className="ic">{QICON[o.ic]}</span>
                      <span className="l">{o.l}</span>
                      <span className="d">{o.d}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="qresult reveal in">
                <div className="qresult__img">
                  <img src={PRODUCT_IMG} alt="Biome Balance" />
                </div>
                <div>
                  <div className="eyebrow">Your match · 1 of 1</div>
                  <h2>Biome Balance</h2>
                  <div className="stars" style={{ marginTop: 12 }}>
                    ★★★★★{" "}
                    <span style={{ color: "var(--ink-soft)", fontSize: ".82rem", fontWeight: 600, marginLeft: 6 }}>
                      4.8 · 212 reviews
                    </span>
                  </div>
                  <p className="lead" style={{ marginTop: 14, fontSize: "1.05rem" }}>
                    One focused formula, built for the gut lining behind everything
                    you told us. Here’s why it fits:
                  </p>
                  <div className="qresult__why">
                    <div className="lbl">Personalised for you</div>
                    <ul>
                      {whys.map((w, i) => (
                        <li key={i}>
                          <Icon name="check" size={16} sw={2.5} />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="qresult__cta">
                    <button
                      className="btn btn--lg"
                      onClick={() =>
                        add({
                          lineId: "biome-balance-sub",
                          id: "biome-balance",
                          name: "Biome Balance",
                          variant: "Subscribe & save · 30 capsules/mo",
                          price: 1199,
                          img: PRODUCT_IMG,
                        })
                      }
                    >
                      Add to cart · ₹1,199
                    </button>
                    <Link className="btn btn--ghost btn--lg" to="/products/biome-balance">
                      See full details
                    </Link>
                  </div>
                  <button className="quizback" style={{ marginTop: 18 }} onClick={retake}>
                    <Icon name="refresh" size={15} sw={2.2} /> Retake the quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
