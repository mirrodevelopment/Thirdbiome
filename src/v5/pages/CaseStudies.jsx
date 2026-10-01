import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Seo from "../components/Seo";

/* Filter categories */
const FILTERS = [
  { cat: "all", label: "All" },
  { cat: "digestion", label: "Digestion" },
  { cat: "energy", label: "Energy" },
  { cat: "brain", label: "Gut-Brain" },
  { cat: "skin", label: "Skin" },
  { cat: "womens", label: "Women's health" },
];

/* Patient cards */
const CARDS = [
  {
    id: "aravind",
    cats: "digestion brain",
    av: "A",
    avStyle: undefined,
    name: "Aravind",
    meta: "46 · Male · 4 weeks",
    tags: ["Gas & bloating", "Nausea", "Fatigue"],
    stats: [
      { n: "44%", l: "Gas ↓" },
      { n: "42%", l: "Nausea ↓" },
      { n: "33%", l: "Bloating ↓" },
    ],
  },
  {
    id: "subashan",
    cats: "digestion energy",
    av: "S",
    avStyle: { background: "#4a7a52" },
    name: "Subashan",
    meta: "21 · Male · 3 weeks",
    tags: ["High-protein diet", "Bloating", "Energy"],
    stats: [
      { n: "~100%", l: "Energy ↑" },
      { n: "Gone", l: "Bloating" },
      { n: "Better", l: "Bowel" },
    ],
  },
  {
    id: "alex",
    cats: "digestion brain",
    av: "Al",
    avStyle: { background: "var(--green-br)" },
    name: "Alex",
    meta: "40 · Male · 1 month",
    tags: ["Gas & urgency", "Anxiety", "Sleep"],
    stats: [
      { n: "100%", l: "Pain gone" },
      { n: "100%", l: "Urgency gone" },
      { n: "71%", l: "Gas ↓" },
    ],
  },
  {
    id: "deepan",
    cats: "digestion skin brain",
    av: "D",
    avStyle: { background: "#385c40" },
    name: "Deepan",
    meta: "20 · Male · 3 weeks",
    tags: ["Urgency", "Sugar cravings", "Acne"],
    stats: [
      { n: "57%", l: "Cravings ↓" },
      { n: "50%", l: "Gas ↓" },
      { n: "Better", l: "Urgency" },
    ],
  },
  {
    id: "chakradhar",
    cats: "digestion brain energy",
    av: "C",
    avStyle: { background: "#234f2b" },
    name: "Chakradhar",
    meta: "25 · Male · 30 days",
    tags: ["Brain fog", "Bad breath", "Fatigue"],
    stats: [
      { n: "75%", l: "Oral health" },
      { n: "67%", l: "Fatigue ↓" },
      { n: "60%", l: "Brain fog ↓" },
    ],
  },
  {
    id: "karthikayan",
    cats: "digestion skin brain energy",
    av: "K",
    avStyle: { background: "var(--leaf)", color: "var(--forest)" },
    name: "Karthikayan",
    meta: "30 · Male · 30 days",
    tags: ["Bloating", "Cravings", "Acne"],
    stats: [
      { n: "100%", l: "Cravings gone" },
      { n: "90%", l: "Bloating ↓" },
      { n: "80%", l: "Mood ↑" },
    ],
  },
  {
    id: "shweta",
    cats: "digestion brain womens energy",
    av: "Sw",
    avStyle: { background: "rgba(95,163,67,.7)" },
    name: "Shweta",
    meta: "36 · Female · 30 days",
    tags: ["Constipation", "Headaches", "Mood"],
    stats: [
      { n: "80%", l: "Irritability ↓" },
      { n: "80%", l: "Fatigue ↓" },
      { n: "63%", l: "Constipation ↓" },
    ],
  },
];

/* Expandable case detail item (.v5-cs-item), max-height accordion */
function CsItem({ id, open, onToggle, itemRef, av, avStyle, title, meta, children }) {
  const body = useRef(null);
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    el.style.maxHeight = open ? el.scrollHeight + "px" : "0px";
  }, [open]);
  return (
    <div className={`v5-cs-item${open ? " open" : ""}`} id={`v5-${id}`} ref={itemRef}>
      <div className="v5-cs-item__head" onClick={onToggle}>
        <div className="v5-cs-item__l">
          <span className="v5-cscard__av" style={avStyle}>{av}</span>
          <div>
            <div className="v5-cs-item__title">{title}</div>
            <div className="v5-cs-item__meta">{meta}</div>
          </div>
        </div>
        <span className="v5-cs-item__ic">+</span>
      </div>
      <div className="v5-cs-item__body" ref={body}>
        <div className="v5-cs-item__content">{children}</div>
      </div>
    </div>
  );
}

export default function CaseStudies() {
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState({ aravind: true });
  const itemRefs = useRef({});
  const location = useLocation();

  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  const openCase = (id) => {
    setOpen((o) => ({ ...o, [id]: true }));
    const el = itemRefs.current[id];
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80);
  };

  /* Deep-link: #v5-aravind or #aravind opens + scrolls to that case */
  useEffect(() => {
    const hash = location.hash.replace(/^#/, "").replace(/^v5-/, "");
    if (!hash || !CARDS.some((c) => c.id === hash)) return;
    setOpen((o) => ({ ...o, [hash]: true }));
    const t = setTimeout(() => {
      const el = itemRefs.current[hash];
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80);
    }, 100);
    return () => clearTimeout(t);
  }, [location.hash]);

  const detailAv = (c, extra) => ({ ...(c.avStyle || {}), ...extra });

  return (
    <>
      <Seo
        title="Case Studies"
        description="Seven documented Biome Balance cases across bloating, brain fog, energy, skin, and constipation, tracked week by week with no dietary changes."
      />
      {/* Hero */}
      <section className="sheet sheet--pad v5-page">
        <div className="wrap">
          <span className="eyebrow">Real people · Real results</span>
          <h1>How we helped <em>patients.</em></h1>
          <p>Seven documented cases across bloating, brain fog, energy, skin, and constipation, tracked week by week, no dietary changes required.</p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="sheet sheet--pad" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="wrap" style={{ paddingBlock: 0 }}>
          <div className="v5-rwe-strip" style={{ borderRadius: "var(--r)" }}>
            <div className="v5-rwe-cell"><span className="n">7</span><span className="l">participants · ages 20-46</span></div>
            <div className="v5-rwe-cell"><span className="n">3-30</span><span className="l">days per study</span></div>
            <div className="v5-rwe-cell"><span className="n">500mg</span><span className="l">GTB™ daily · no lifestyle changes</span></div>
            <div className="v5-rwe-cell"><span className="n">6</span><span className="l">symptom domains tracked</span></div>
            <div className="v5-rwe-cell"><span className="n">100%</span><span className="l">satisfaction across all cases</span></div>
          </div>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body">
        <div className="wrap">

          {/* Filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "clamp(22px,3vw,36px)" }}>
            {FILTERS.map((f, i) => (
              <button
                key={f.cat}
                className={i === 0 ? "btn btn--dark" : "btn"}
                onClick={() => setCat(f.cat)}
                style={
                  cat === f.cat
                    ? { fontSize: ".72rem", background: "var(--ink)", color: "#fff" }
                    : { fontSize: ".72rem" }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="v5-csgrid" id="v5csgrid">
            {CARDS.map((c) => (
              <div
                key={c.id}
                className="v5-cscard"
                data-cats={c.cats}
                style={cat === "all" || c.cats.includes(cat) ? undefined : { display: "none" }}
              >
                <div className="v5-cscard__head">
                  <span className="v5-cscard__av" style={c.avStyle}>{c.av}</span>
                  <div>
                    <div className="v5-cscard__name">{c.name}</div>
                    <div className="v5-cscard__meta">{c.meta}</div>
                  </div>
                </div>
                <div className="v5-cscard__tags">
                  {c.tags.map((t) => <span key={t} className="v5-cscard__tag">{t}</span>)}
                </div>
                <div className="v5-cscard__stats">
                  {c.stats.map((s) => (
                    <div key={s.l} className="v5-cscard__stat"><div className="n">{s.n}</div><div className="l">{s.l}</div></div>
                  ))}
                </div>
                <button className="v5-cscard__link" onClick={() => openCase(c.id)}>View full case →</button>
              </div>
            ))}
          </div>

          {/* Detail accordions */}
          <div className="v5-cs-detail" id="v5csDetail">

            <CsItem
              id="aravind"
              open={!!open.aravind}
              onToggle={() => toggle("aravind")}
              itemRef={(el) => (itemRefs.current.aravind = el)}
              av="A"
              title="Aravind, Gas, Bloating & Gut-Brain"
              meta="46 · Male · 4 weeks · no dietary changes"
            >
              <div className="v5-cs-quote">"Strongest improvements in upper GI, particularly gas, nausea, and bloating, indicating reduced fermentation and improved digestive efficiency."</div>
              <div className="v5-cs-top3">
                <div className="v5-cs-top"><div className="n">44%</div><div className="l">Gas / Burping (9→5)</div></div>
                <div className="v5-cs-top"><div className="n">42%</div><div className="l">Nausea (7→4)</div></div>
                <div className="v5-cs-top"><div className="n">33%</div><div className="l">Bloating (9→6)</div></div>
              </div>
              <table className="v5-cs-table"><thead><tr><th>Symptom</th><th>Before</th><th>After</th><th>%</th></tr></thead><tbody>
                <tr><td>Gas / Burping</td><td>9</td><td>5</td><td className="pct">44%</td></tr>
                <tr><td>Nausea</td><td>7</td><td>4</td><td className="pct">42%</td></tr>
                <tr><td>Cold Sensitivity</td><td>7</td><td>4</td><td className="pct">42%</td></tr>
                <tr><td>Bloating</td><td>9</td><td>6</td><td className="pct">33%</td></tr>
                <tr><td>Fatigue</td><td>7</td><td>5</td><td className="pct">28%</td></tr>
                <tr><td>Abdominal Pain</td><td>8</td><td>6</td><td className="pct">25%</td></tr>
              </tbody></table>
              <div className="v5-cs-takeaway"><b>Key takeaway:</b> Most useful for individuals with high baseline upper GI distress combined with secondary gut-brain symptoms, especially when lifestyle modification is limited.</div>
              <p className="v5-cs-disc">Single participant · self-reported · no biomarker validation · no dietary control</p>
            </CsItem>

            <CsItem
              id="subashan"
              open={!!open.subashan}
              onToggle={() => toggle("subashan")}
              itemRef={(el) => (itemRefs.current.subashan = el)}
              av="S"
              avStyle={{ background: "#4a7a52", width: "40px", height: "40px", fontSize: ".9rem" }}
              title="Subashan, Bloating & Energy on High-Protein Diet"
              meta="21 · Male · 3 weeks · high-protein diet"
            >
              <div className="v5-cs-quote">"Resolution of bloating suggests improved digestive processing. The substantial increase in perceived energy is likely secondary to improved digestion and nutrient assimilation."</div>
              <div className="v5-cs-top3">
                <div className="v5-cs-top"><div className="n">~100%</div><div className="l">Energy (5→~10)</div></div>
                <div className="v5-cs-top"><div className="n">Resolved</div><div className="l">Persistent bloating</div></div>
                <div className="v5-cs-top"><div className="n">Better</div><div className="l">Bowel evacuation</div></div>
              </div>
              <div className="v5-cs-takeaway"><b>Key takeaway:</b> Most useful for individuals on high-protein diets who experience bloating, incomplete bowel movements, and associated fatigue.</div>
              <p className="v5-cs-disc">Single participant · partial qualitative data · 3-week duration</p>
            </CsItem>

            <CsItem
              id="alex"
              open={!!open.alex}
              onToggle={() => toggle("alex")}
              itemRef={(el) => (itemRefs.current.alex = el)}
              av="Al"
              avStyle={{ background: "var(--green-br)", width: "40px", height: "40px", fontSize: ".9rem" }}
              title="Alex, Gas, Urgency & Gut-Brain"
              meta="40 · Male · 1 month · no changes"
            >
              <div className="v5-cs-quote">"Resolution of abdominal pain and urgency, combined with strong reduction in gas. Mood, anxiety and sleep improvements consistent with secondary gut-brain axis effects."</div>
              <div className="v5-cs-top3">
                <div className="v5-cs-top"><div className="n">100%</div><div className="l">Stomach pain (4→0)</div></div>
                <div className="v5-cs-top"><div className="n">100%</div><div className="l">Urgency (4→0)</div></div>
                <div className="v5-cs-top"><div className="n">71%</div><div className="l">Gas (7→2)</div></div>
              </div>
              <table className="v5-cs-table"><thead><tr><th>Symptom</th><th>Before</th><th>After</th><th>%</th></tr></thead><tbody>
                <tr><td>Stomach Pain</td><td>4</td><td>0</td><td className="pct">100%</td></tr>
                <tr><td>Urgency</td><td>4</td><td>0</td><td className="pct">100%</td></tr>
                <tr><td>Gas / Burping</td><td>7</td><td>2</td><td className="pct">71%</td></tr>
                <tr><td>Mood Irritability</td><td>4</td><td>1</td><td className="pct">75%</td></tr>
                <tr><td>Anxiety</td><td>5</td><td>2</td><td className="pct">60%</td></tr>
                <tr><td>Incomplete Evacuation</td><td>6</td><td>2</td><td className="pct">67%</td></tr>
              </tbody></table>
              <div className="v5-cs-takeaway"><b>Key takeaway:</b> Most useful for moderate digestive dysfunction with gas, bowel irregularity, urgency, and associated mood and sleep disturbances.</div>
              <p className="v5-cs-disc">Single participant · self-reported · no biomarker validation</p>
            </CsItem>

            <CsItem
              id="deepan"
              open={!!open.deepan}
              onToggle={() => toggle("deepan")}
              itemRef={(el) => (itemRefs.current.deepan = el)}
              av="D"
              avStyle={{ background: "#385c40", width: "40px", height: "40px", fontSize: ".9rem" }}
              title="Deepan, Urgency, Cravings & Multi-System"
              meta="20 · Male · 3 weeks · guided lifestyle protocol"
            >
              <div className="v5-cs-quote">"The significant drop in sugar cravings points toward modulation of gut-derived appetite signaling. Acne improvement aligns with gut-skin pathway effects."</div>
              <div className="v5-cs-top3">
                <div className="v5-cs-top"><div className="n">57%</div><div className="l">Sugar Cravings (7→3)</div></div>
                <div className="v5-cs-top"><div className="n">50%</div><div className="l">Gas (4→2)</div></div>
                <div className="v5-cs-top"><div className="n">Better</div><div className="l">Bowel urgency</div></div>
              </div>
              <div className="v5-cs-takeaway"><b>Key takeaway:</b> Useful for moderate gut instability with urgency, cravings, and digestion-linked emotional disturbance, especially with structured lifestyle guidance.</div>
              <p className="v5-cs-disc">Single participant · combined intervention · partial qualitative data</p>
            </CsItem>

            <CsItem
              id="chakradhar"
              open={!!open.chakradhar}
              onToggle={() => toggle("chakradhar")}
              itemRef={(el) => (itemRefs.current.chakradhar = el)}
              av="C"
              avStyle={{ background: "#234f2b", width: "40px", height: "40px", fontSize: ".9rem" }}
              title="Chakradhar, Brain Fog, Oral Health & Fatigue"
              meta="25 · Male · 30 days · no changes"
            >
              <div className="v5-cs-quote">"Substantial reduction in bad breath may indicate favorable changes within the oral-gut microbial environment. Complete resolution of bloating, gas, and incomplete evacuation."</div>
              <div className="v5-cs-top3">
                <div className="v5-cs-top"><div className="n">75%</div><div className="l">Bad Breath (8→2)</div></div>
                <div className="v5-cs-top"><div className="n">67%</div><div className="l">Fatigue (6→2)</div></div>
                <div className="v5-cs-top"><div className="n">60%</div><div className="l">Brain Fog (5→2)</div></div>
              </div>
              <table className="v5-cs-table"><thead><tr><th>Symptom</th><th>Before</th><th>After</th><th>%</th></tr></thead><tbody>
                <tr><td>Bad Breath / Coated Tongue</td><td>8</td><td>2</td><td className="pct">75%</td></tr>
                <tr><td>Fatigue After Rest</td><td>6</td><td>2</td><td className="pct">67%</td></tr>
                <tr><td>Brain Fog</td><td>5</td><td>2</td><td className="pct">60%</td></tr>
                <tr><td>Stomach Aches</td><td>5</td><td>0</td><td className="pct">100%</td></tr>
                <tr><td>Incomplete Evacuation</td><td>5</td><td>0</td><td className="pct">100%</td></tr>
              </tbody></table>
              <div className="v5-cs-takeaway"><b>Key takeaway:</b> Particularly beneficial for mild-to-moderate digestive symptoms, incomplete bowel evacuation, fatigue, brain fog, and oral health concerns.</div>
              <p className="v5-cs-disc">Single participant · self-reported · no dietary controls</p>
            </CsItem>

            <CsItem
              id="karthikayan"
              open={!!open.karthikayan}
              onToggle={() => toggle("karthikayan")}
              itemRef={(el) => (itemRefs.current.karthikayan = el)}
              av="K"
              avStyle={{ background: "var(--leaf)", color: "var(--forest)", width: "40px", height: "40px", fontSize: ".9rem" }}
              title="Karthikayan, Severe Bloating, Cravings & Acne"
              meta="30 · Male · 30 days · no changes · ~90% compliance"
            >
              <div className="v5-cs-quote">"Complete resolution of sugar cravings. Bloating improved from 10/10 to 1/10, one of the most substantial improvements observed in any case."</div>
              <div className="v5-cs-top3">
                <div className="v5-cs-top"><div className="n">100%</div><div className="l">Sugar Cravings (10→0)</div></div>
                <div className="v5-cs-top"><div className="n">90%</div><div className="l">Bloating (10→1)</div></div>
                <div className="v5-cs-top"><div className="n">80%</div><div className="l">Mood (5→1)</div></div>
              </div>
              <div className="v5-cs-takeaway"><b>Key takeaway:</b> Broad systemic impact, digestive comfort, food tolerance, sugar cravings, mood, cognitive clarity, and skin health, without dietary changes.</div>
              <p className="v5-cs-disc">Single participant · self-reported · ~90% compliance · no weekly tracking</p>
            </CsItem>

            <CsItem
              id="shweta"
              open={!!open.shweta}
              onToggle={() => toggle("shweta")}
              itemRef={(el) => (itemRefs.current.shweta = el)}
              av="Sw"
              avStyle={{ background: "rgba(95,163,67,.7)", width: "40px", height: "40px", fontSize: ".8rem" }}
              title="Shweta, Constipation, Headaches & Mood"
              meta="36 · Female · 30 days · no changes"
            >
              <div className="v5-cs-quote">"Fasting, which had previously triggered severe headaches, was no longer associated with headache episodes during supplementation. A particularly noteworthy observation."</div>
              <div className="v5-cs-top3">
                <div className="v5-cs-top"><div className="n">80%</div><div className="l">Irritability (10→2)</div></div>
                <div className="v5-cs-top"><div className="n">80%</div><div className="l">Fatigue (5→1)</div></div>
                <div className="v5-cs-top"><div className="n">63%</div><div className="l">Constipation (8→3)</div></div>
              </div>
              <div className="v5-cs-takeaway"><b>Key takeaway:</b> May benefit individuals experiencing constipation, gut-associated fatigue, irritability, and fasting-related headaches.</div>
              <p className="v5-cs-disc">Single participant · self-reported · causality cannot be established</p>
            </CsItem>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="sheet sheet--pad" style={{ textAlign: "center" }}>
        <div className="wrap">
          <span className="eyebrow" style={{ justifyContent: "center" }}>Start your own story</span>
          <h2 style={{ margin: "14px 0 18px", maxWidth: "18ch", marginInline: "auto" }}>One capsule.<br />Your case study starts <em>now.</em></h2>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
            <Link className="btn btn--dark" to="/products/biome-balance">Shop Biome Balance →</Link>
            <Link className="btn" to="/evidence">See the evidence</Link>
          </div>
        </div>
      </section>
    </>
  );
}
