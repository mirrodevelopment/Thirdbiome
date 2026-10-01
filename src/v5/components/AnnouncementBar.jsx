/* Top announcement bar, a horizontally looping marquee of 6 claims,
   forest background, leaf-dot separators. Ported from the earlier
   redesign/v3 branch and adapted to v5 tokens (proprietary, not
   patent-pending; reuses the existing tickerScroll keyframe). */
const MESSAGES = [
  "Proprietary postbiotic",
  <><b>+74% stool butyrate</b> in a CTRI-registered trial</>,
  "Free shipping over ₹999",
  "One daily formula · 500 mg GTB™",
  "Backed by a 30-day promise",
  "Made in a US FDA-registered facility",
];

function Track() {
  return (
    <>
      {MESSAGES.map((m, i) => (
        <span className="announce__item" key={i}>
          {m}
          <span className="announce__dot" aria-hidden="true"> ✦ </span>
        </span>
      ))}
    </>
  );
}

export default function AnnouncementBar() {
  return (
    <div className="announce">
      <div className="announce__track">
        <Track />
        <Track />
      </div>
    </div>
  );
}
