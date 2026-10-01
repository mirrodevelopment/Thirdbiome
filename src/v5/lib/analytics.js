/* Meta Pixel / analytics helper.
   Every event carries the active homepage A/B variant (home_v5 / home_v3) so
   ad performance and the split test are readable per the split-test spec.
   Safe no-op if fbq isn't loaded (dev, adblock). */

const VARIANT_KEY = "t3b_home_variant";

export function homeVariant() {
  try {
    return localStorage.getItem(VARIANT_KEY) || "unassigned";
  } catch {
    return "unassigned";
  }
}

/* Standard Meta event (ViewContent, AddToCart, InitiateCheckout, Purchase, …) */
export function track(event, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", event, { ...params, variant: homeVariant() });
    }
  } catch {
    /* never let analytics break the app */
  }
}

/* Custom (non-standard) Meta event */
export function trackCustom(event, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("trackCustom", event, { ...params, variant: homeVariant() });
    }
  } catch { /* noop */ }
}

/* The one real, purchasable product, every buy surface references this so the
   Pixel content ids/values stay consistent. Value left null until real
   per-plan variants exist (see gap analysis); pass the charged amount when known. */
export const PIXEL_PRODUCT = {
  content_ids: ["biome-balance"],
  content_name: "Biome Balance",
  content_type: "product",
  currency: "INR",
};
