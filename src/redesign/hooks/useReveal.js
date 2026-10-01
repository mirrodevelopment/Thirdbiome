import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Reveal-on-scroll: fades/translates `.reveal` elements into `.in` as they
 * enter the viewport (mirrors shell.js). Re-runs on route change. In-view
 * elements show immediately; a 2.6s failsafe reveals everything.
 * Respects prefers-reduced-motion via CSS.
 */
export function useReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll(".reveal:not(.in)"));
    if (!reveals.length) return;

    const forceShow = (el) => {
      el.style.transition = "none";
      el.classList.add("in");
      requestAnimationFrame(() => {
        el.style.transition = "";
      });
    };

    if (!("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );

    reveals.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) forceShow(el);
      else io.observe(el);
    });

    const failsafe = setTimeout(() => {
      reveals.forEach((el) => el.classList.add("in"));
    }, 2600);

    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, [pathname]);
}
