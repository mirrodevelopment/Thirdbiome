/* Third Biome v5, shared content & product constants */
import hero from "../assets/biome-balance-hero.jpeg";
import float from "../assets/biome-balance-float.jpeg";
import homeHero from "../assets/home-hero.jpg";
import skuPostbiotics from "../assets/sku-postbiotics.jpg";
import skuClinical from "../assets/sku-clinical.jpg";
import skuResults from "../assets/sku-results.jpg";
import skuMonth from "../assets/sku-month.jpg";
import duo from "../assets/biome-balance-duo.jpeg";
import linen from "../assets/biome-balance-linen.jpeg";
import lifestyle from "../assets/biome-balance-lifestyle.jpeg";
import microbes from "../assets/microbes-bg.jpg";
import logo from "../assets/logo.png";
import blogCapsules from "../assets/blog-capsules.jpg";
import blogLeaf from "../assets/blog-leaf.jpg";
import blogTexture from "../assets/blog-texture.jpg";
import goalDigestion from "../assets/goal-digestion.jpg";
import goalGutbrain from "../assets/goal-gutbrain.jpg";
import goalImmunity from "../assets/goal-immunity.jpg";
import goalMetabolic from "../assets/goal-metabolic.jpg";
import systemJourney from "../assets/system-journey.jpg";
import systemRelease from "../assets/system-release.jpg";
import systemRepair from "../assets/system-repair.jpg";
import systemDaily from "../assets/system-daily.jpg";
import rweStewardship from "../assets/rwe-stewardship.jpg";
import rweCalmer from "../assets/rwe-calmer.jpg";
import patAravind from "../assets/patient-aravind.jpg";
import patSubashan from "../assets/patient-subashan.jpg";
import patAlex from "../assets/patient-alex.jpg";
import patDeepan from "../assets/patient-deepan.jpg";
import patChakradhar from "../assets/patient-chakradhar.jpg";
import patKarthikayan from "../assets/patient-karthikayan.jpg";
import patShweta from "../assets/patient-shweta.jpg";
import tileSigns from "../assets/tile-signs.jpg";
import tileClinical from "../assets/tile-clinical.jpg";

export const IMG = { hero, float, homeHero, duo, linen, lifestyle, microbes, logo, blogCapsules, blogLeaf, blogTexture, goalDigestion, goalGutbrain, goalImmunity, goalMetabolic, systemJourney, systemRelease, systemRepair, systemDaily, rweStewardship, rweCalmer, patAravind, patSubashan, patAlex, patDeepan, patChakradhar, patKarthikayan, patShweta, tileSigns, tileClinical, skuPostbiotics, skuClinical, skuResults, skuMonth };

/* The live Laravel catalogue has one purchasable product (id 3,
   "Third Biome™ Gut") with a single variant. All buy actions resolve
   against it; design-side plans map onto that variant until the client
   adds real one-time / 3-month variants in admin. */
export const LIVE_PRODUCT_ID = 3;
export const LIVE_VARIANT_NAME = "Join community";

export const PLANS = [
  {
    key: "subscribe",
    title: "Subscribe & save",
    desc: "₹959/mo · skip or cancel anytime",
    price: 959,
    was: 1199,
    save: "Best value",
    reco: true,
  },
  {
    key: "onetime",
    title: "One-time purchase",
    desc: "A single 30-day bottle",
    price: 1199,
    was: null,
  },
];

export const FREE_SHIP_THRESHOLD = 999;

export const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export const NAV_LINKS = [
  ["/products/biome-balance", "Shop"],
  ["/science", "Science"],
  ["/quiz", "Gut score"],
  ["/evidence", "Evidence"],
  ["/about", "About"],
  ["/journal", "Journal"],
];

export const FOOT_COLS = [
  ["Shop", [
    ["/products/biome-balance", "Biome Balance"],
    ["/t3b-club", "Protocols"],
    ["/t3b-club", "T3B Club"],
    ["/quiz", "Find your fit"],
  ]],
  ["Learn", [
    ["/#system", "How it works"],
    ["/evidence", "The evidence"],
    ["/about", "Our story"],
    ["/journal", "Journal"],
  ]],
  ["Company", [
    ["/contact", "Contact"],
    ["/account", "Track order"],
    ["/careers", "Careers"],
  ]],
];

/* =========================================================================
   PDP WELCOME OFFER CAMPAIGN CONFIGURATION (Centralized & Fully Customizable)
   Change discount amounts, copy, coupon codes, and deadlines in this single location.
   ========================================================================= */
export const PDP_WELCOME_OFFER_CONFIG = {
  // Campaign Headline & Copy (Dev Placeholders until client finalizes)
  badgeText: "Special Welcome Offer",
  discountAmount: "₹200 OFF",
  couponCode: "WELCOME200",
  headline: "Start your gut reset with ₹200 off",
  description: "Claim an exclusive first-order discount on Biome Balance. Experience the clinically tested power of GTB™ with free shipping across India.",
  ctaText: "Apply ₹200 discount & claim offer",
  successMessage: "Offer applied! Your discount code WELCOME200 is saved for checkout.",

  // Configurable Campaign Deadline (ISO 8601 string)
  // When this deadline date passes, the popup and active countdown automatically cease.
  deadline: "2026-10-31T23:59:59+05:30",

  // Auto-trigger delay in milliseconds (e.g. 6000ms = 6 seconds)
  autoTriggerDelayMs: 6000,

  // Sticky Bottom-Left Teaser Pill (shown in bottom-left corner)
  stickyPillText: "Get ₹200 off",
  stickyPillEnabled: true,
};

