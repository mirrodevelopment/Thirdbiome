/**
 * Static product/catalog data for the redesign, mirroring the design
 * prototype. In production this should be sourced from the commerce API.
 */

export const IMG = {
  single: "/assets/biome-balance-single.jpeg",
  open: "/assets/biome-balance-open.jpeg",
  float: "/assets/biome-balance-float.jpeg",
  lifestyle: "/assets/biome-balance-lifestyle.jpeg",
  duo: "/assets/biome-balance-duo.jpeg",
  hero: "/assets/biome-balance-hero.jpeg",
  linen: "/assets/biome-balance-linen.jpeg",
};

/** The single product image used site-wide for now (the chosen SKU shot). */
export const PRODUCT_IMG = IMG.lifestyle;

export const BIOME_BALANCE = {
  id: "biome-balance",
  name: "Biome Balance",
  rating: 4.8,
  reviews: 212,
  gallery: [IMG.single, IMG.open, IMG.float, IMG.lifestyle, IMG.duo],
  plans: [
    {
      id: "sub",
      name: "Subscribe & save",
      sub: "₹1,199/mo · skip or cancel anytime",
      variant: "Subscription · monthly",
      price: 1199,
      was: 1499,
      badge: "Best value",
      cartId: "biome-balance-sub",
    },
    {
      id: "once",
      name: "One bottle",
      sub: "A single 30-day bottle",
      variant: "One-time · 30 capsules",
      price: 1499,
      cartId: "biome-balance-once",
    },
    {
      id: "reset",
      name: "3-Month Reset",
      sub: "Three bottles · best for a full protocol",
      variant: "3-Month Reset · 90 capsules",
      price: 3299,
      was: 4497,
      cartId: "biome-balance-reset",
    },
  ],
};

/** Shop catalog cards. */
export const CATALOG = [
  {
    id: "biome-balance",
    name: "Biome Balance",
    for: "Foundational gut repair",
    desc: "Postbiotic formula led by Thirdbiome GTB™ — butyrate delivered to the colon.",
    price: 1499,
    was: null,
    img: IMG.single,
    status: "available",
    href: "/products/biome-balance",
    cartId: "biome-balance-once",
    variant: "One-time · 30 capsules",
  },
  {
    id: "reset",
    name: "3-Month Reset",
    for: "A full protocol",
    desc: "Three bottles of Biome Balance — the runway most guts need to settle.",
    price: 3299,
    was: 4497,
    img: IMG.duo,
    status: "available",
    href: "/products/biome-balance",
    cartId: "biome-balance-reset",
    variant: "3-Month Reset · 90 capsules",
  },
  {
    id: "club",
    name: "T3B Club",
    for: "Guided membership",
    desc: "Doctor-guided 90-day protocol, monthly delivery, and a medical team on call.",
    price: 1199,
    was: null,
    img: IMG.lifestyle,
    status: "available",
    href: "/t3b-club",
    cartId: "t3b-club-monthly",
    variant: "Monthly membership",
  },
  {
    id: "biome-calm",
    name: "Biome Calm",
    for: "Stress & sleep",
    desc: "A postbiotic + adaptogen stack for the gut–brain axis. In development.",
    img: IMG.open,
    status: "soon",
  },
  {
    id: "biome-cycle",
    name: "Biome Cycle",
    for: "PMOS & hormones",
    desc: "Targeted support for metabolic and hormonal balance. In development.",
    img: IMG.float,
    status: "soon",
  },
  {
    id: "biome-glow",
    name: "Biome Glow",
    for: "Skin & gut",
    desc: "The gut–skin axis, addressed at the source. In development.",
    img: IMG.linen,
    status: "soon",
  },
];
