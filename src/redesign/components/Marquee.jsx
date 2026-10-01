import { Children, cloneElement, isValidElement } from "react";

/**
 * Infinite-scroll marquee: renders its children twice inside a `.marquee__track`
 * so the CSS keyframe can loop seamlessly (mirrors the duplication shell.js does).
 * Pauses on hover; freezes under reduced-motion (see pages.css).
 */
export function Marquee({ className = "", children }) {
  const arr = Children.toArray(children);
  const second = arr.map((c, i) =>
    isValidElement(c) ? cloneElement(c, { key: `dup-${i}` }) : c
  );
  return (
    <div className={`marquee ${className}`.trim()}>
      <div className="marquee__track">
        {arr}
        {second}
      </div>
    </div>
  );
}
