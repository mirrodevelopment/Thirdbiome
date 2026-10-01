/**
 * Top announcement bar — a horizontally looping marquee of 6 messages
 * separated by a gold ✦ glyph (forest bg, light text). See pages.css.
 */

const MESSAGES = [
  "Patent-pending postbiotic",
  <>
    <b>+74% stool butyrate</b> in a CTRI-registered trial
  </>,
  "Free shipping over ₹999",
  "One daily formula · 500 mg GTB",
  "Backed by a 30-day promise",
  "Made in a US FDA-registered facility",
];

function Track() {
  return (
    <>
      {MESSAGES.map((m, i) => (
        <span className="announce__item" key={i}>
          {m}
          <span className="announce__dot" aria-hidden="true">
            {" "}
            <span className="spec-dot" />
            {" "}
          </span>
        </span>
      ))}
    </>
  );
}

export function AnnouncementBar() {
  return (
    <div className="announce">
      <div className="announce__track">
        <Track />
        <Track />
      </div>
    </div>
  );
}
