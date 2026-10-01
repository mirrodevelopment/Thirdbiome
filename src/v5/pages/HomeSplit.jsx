/* Homepage A/B split, v5 "Corelab" (control) vs v3 "Full Depth" (variant B).
   Per the split-test spec: both variants serve on the SAME URL (/), assignment
   is sticky per visitor, and the variant dimension (home_v5 / home_v3) is
   attached to analytics. Force a variant with ?home=v5 or ?home=v3 (persists, handy for client review and QA). */
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Home from "./Home";
import HomeV3 from "./HomeV3";

const KEY = "t3b_home_variant";

function assign(search) {
  const forced = new URLSearchParams(search).get("home");
  if (forced === "v3" || forced === "v5") {
    const v = "home_" + forced;
    try { localStorage.setItem(KEY, v); } catch { /* private mode */ }
    return v;
  }
  try {
    let v = localStorage.getItem(KEY);
    if (v !== "home_v3" && v !== "home_v5") {
      v = Math.random() < 0.5 ? "home_v5" : "home_v3";
      localStorage.setItem(KEY, v);
    }
    return v;
  } catch {
    return "home_v5"; // storage unavailable → control, no flicker
  }
}

export default function HomeSplit() {
  const { search } = useLocation();
  const variant = useMemo(() => assign(search), [search]);

  useEffect(() => {
    /* variant dimension for the test readout (Meta Pixel is loaded globally) */
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", "HomeVariant", { variant });
    }
    document.documentElement.dataset.homeVariant = variant;
  }, [variant]);

  return variant === "home_v3" ? <HomeV3 /> : <Home />;
}
