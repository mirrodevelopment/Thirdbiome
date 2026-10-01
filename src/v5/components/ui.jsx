/* Third Biome v5, small shared UI primitives */
import { useEffect, useRef, useState } from "react";

/* arrow inside .btn pills */
export const Arr = () => (
  <span className="arr">
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  </span>
);

export const Check = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* replaces the design-phase <image-slot> web component */
export const Shot = ({ src, alt = "", radius, className = "", style, eager = false, ...rest }) => (
  <span
    className={`imgslot ${className}`.trim()}
    style={{ ...(radius ? { borderRadius: radius } : null), ...style }}
    {...rest}
  >
    <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} />
  </span>
);

/* reveal-on-scroll: observes every [data-reveal] under the page root.
   Re-runs on route change (key the hook by pathname in Layout). */
export function useReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.14 }
    );
    els.forEach((el) => io.observe(el));
    const failsafe = setTimeout(() => els.forEach((el) => el.classList.add("in")), 2600);
    return () => { io.disconnect(); clearTimeout(failsafe); };
  }, [dep]);
}

/* FAQ accordion item (.acc__item) */
export function AccItem({ q, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const body = useRef(null);
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    el.style.maxHeight = open ? el.scrollHeight + "px" : "0px";
  }, [open, children]);
  return (
    <div className={`acc__item${open ? " open" : ""}`}>
      <button className="acc__head" onClick={() => setOpen(!open)}>
        {q}
        <span className="acc__ic">+</span>
      </button>
      <div className="acc__body" ref={body}>{children}</div>
    </div>
  );
}

/* Q&A dialogue row (.qarow), probiotic vs postbiotic columns */
export function QARow({ q, pro, post, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const body = useRef(null);
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    el.style.maxHeight = open ? el.scrollHeight + "px" : "0px";
  }, [open]);
  return (
    <div className={`qarow${open ? " open" : ""}`}>
      <button className="qarow__q" onClick={() => setOpen(!open)}>
        {q}
        <span className="qarow__ic">+</span>
      </button>
      <div className="qarow__body" ref={body}>
        <div className="qarow__cols">
          <div className="qacol qacol--pro"><div className="qacol__tag">Probiotic</div>{pro}</div>
          <div className="qacol qacol--post"><div className="qacol__tag">Postbiotic · GTB™</div>{post}</div>
        </div>
      </div>
    </div>
  );
}

/* trust ticker marquee, items rendered twice for the seamless loop */
export function Ticker({ items }) {
  return (
    <section className="sheet ticker">
      <div className="ticker__mask">
        <div className="ticker__track">
          {[false, true].map((hidden) =>
            items.map((it, i) => (
              <span className="ticker__i" key={`${hidden}-${i}`} aria-hidden={hidden || undefined}>{it}</span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
