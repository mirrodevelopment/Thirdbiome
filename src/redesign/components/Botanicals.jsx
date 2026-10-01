/**
 * Botanical leaf sprigs floating in the top-right / bottom-left of heroes.
 * Mirrors the inline SVG generated in shell.js. Float animation + opacity
 * are handled in pages.css (frozen under reduced-motion).
 */

const LEAVES = [
  [70, 206, -44],
  [70, 168, 42],
  [70, 130, -40],
  [70, 94, 38],
  [70, 60, -32],
  [70, 30, 30],
];

function Sprig() {
  return (
    <svg viewBox="0 0 140 262" aria-hidden="true">
      <path d="M70 258 C 64 200 76 150 70 14" />
      {LEAVES.map(([cx, cy, rot], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx="13"
          ry="30"
          transform={`rotate(${rot} ${cx} ${cy})`}
        />
      ))}
      <ellipse cx="70" cy="12" rx="10" ry="20" />
    </svg>
  );
}

export function Botanicals() {
  return (
    <>
      <div className="bot bot--tr" aria-hidden="true">
        <Sprig />
      </div>
      <div className="bot bot--bl" aria-hidden="true">
        <Sprig />
      </div>
    </>
  );
}
