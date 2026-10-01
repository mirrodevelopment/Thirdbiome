/**
 * Inline Feather-style line icons used across the design, plus the brand
 * flower-mark logo. Stroke-based, currentColor, 24x24 viewBox by default.
 */

const PATHS = {
  check: <path d="M20 6L9 17l-5-5" />,
  shield: <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  lining: <path d="M4 12h16M4 12a8 8 0 0 1 8-8M4 12a8 8 0 0 0 8 8" />,
  bolt: <path d="M13 2L3 14h7l-1 8 10-12h-7z" />,
  heart: <path d="M12 21C7 17 3 13 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5-4 9-9 13z" />,
  activity: <path d="M3 12h4l3 8 4-16 3 8h4" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  arrowLeft: <path d="M19 12H5M12 19l-7-7 7-7" />,
  arrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  pin: (
    <>
      <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  leaf: <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6" />,
  truck: (
    <>
      <rect x="1" y="6" width="13" height="11" rx="1" />
      <path d="M14 9h4l3 3v5h-7" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  refresh: <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" />,
  clipboardCheck: (
    <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12H6z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),
  play: <path d="M8 5v14l11-7z" />,
  cart: (
    <>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </>
  ),
  brain: (
    <path d="M15.5 13a4 4 0 1 0-7-3.5M8.5 8A3.5 3.5 0 1 0 7 14.7M12 6v12a3 3 0 0 0 5.6 1.5A3 3 0 0 0 20 14a3 3 0 0 0-1-5.5" />
  ),
};

export function Icon({ name, size = 24, sw = 2, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {PATHS[name] || null}
    </svg>
  );
}

export function Logo({ size = 26 }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="var(--emerald)">
        <circle cx="20" cy="20" r="4.4" />
        {petals.map((deg) => (
          <ellipse
            key={deg}
            cx="20"
            cy="8.5"
            rx="3.6"
            ry="6.4"
            transform={`rotate(${deg} 20 20)`}
          />
        ))}
      </g>
    </svg>
  );
}

/** Five filled stars (decorative rating glyph). */
export function Stars({ label }) {
  return (
    <span className="stars" aria-label={label}>
      ★★★★★
    </span>
  );
}
