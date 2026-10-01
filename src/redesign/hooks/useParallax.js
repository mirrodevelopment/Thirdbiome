import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll parallax: sets `--py` on `.px-img` and `[data-parallax]` elements
 * (mirrors shell.js). Disabled under prefers-reduced-motion.
 */
export function useParallax() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const els = Array.from(document.querySelectorAll(".px-img,[data-parallax]"));
    if (!els.length) return;

    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      els.forEach((el) => {
        const host = el.classList.contains("px-img") ? el.parentElement || el : el;
        const r = host.getBoundingClientRect();
        const off = (r.top + r.height / 2 - vh / 2) / vh;
        const sp =
          parseFloat(el.getAttribute("data-parallax")) ||
          (el.classList.contains("px-img") ? 0.22 : 0.14);
        el.style.setProperty("--py", (-off * sp * 180).toFixed(1) + "px");
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);
}
