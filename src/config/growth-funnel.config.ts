/**
 * Growth funnel + membership — pricing, copy, URLs.
 * Edit here; avoid hardcoding these values in components.
 */

import type { BundleTierId } from "@/lib/shop/bundle-tier-types";

/** Checkout price per bundle tier (cents) for ladder SKUs. */
export const BUNDLE_TIER_PRICE_CENTS: Record<BundleTierId, number> = {
  starter: 1900,
  most_popular: 2900,
  growth: 5700,
  mega: 14700,
};

/** Strikethrough anchor per tier (optional, cents). */
export const BUNDLE_TIER_COMPARE_AT_CENTS: Partial<Record<BundleTierId, number>> = {
  mega: 29700,
};

export const GROWTH_SYSTEM_SLUG = "growth-system" as const;

/** Delivers same templates as this catalog slug. */
export const GROWTH_SYSTEM_DELIVERY_ALIAS = "combo-bundle";

export const GROWTH_SYSTEM_PRODUCT = {
  title: "NPA Growth System",
  shortDescription:
    "Everything you need to market and run your med spa — one checkout, full template stack.",
  /** Shown on synthetic product; delivery uses alias manifest. */
  templateCountFloor: 300,
  priceCents: 14700,
  compareAtCents: 29700,
  valueAnchorLine: "$497+ value if purchased separately",
  wasPriceLabel: "$297",
  nowPriceLabel: "$147",
  ctaLabel: "Get the Growth System",
} as const;

export const GROWTH_SYSTEM_PAGE = {
  hero: "Everything you need to market and run your med spa",
  sections: [
    {
      title: "Content System",
      body: "Social packs, seasonal promos, story templates, and post-ready assets so you stay visible without living in Canva.",
    },
    {
      title: "Client Systems",
      body: "Consents, aftercare, journey kits, and patient education that match how real practices onboard and retain.",
    },
    {
      title: "Sales Tools",
      body: "Promos, reviews, membership messaging, and scripts that turn consults and DMs into booked appointments.",
    },
    {
      title: "Business Tools",
      body: "Checklists, ops templates, and reputation systems — the unglamorous layer that keeps the schedule full.",
    },
  ],
  membershipTeaser:
    "Want ongoing updates? Join Membership — new drops every month so you never run out of content or forms.",
} as const;

export const MEMBERSHIP_CONFIG = {
  hero: "Never run out of content or systems again",
  /** Short line under hero on /membership */
  heroSubline:
    "Monthly drops, new forms, and member-only packs — built for busy med spa owners who need consistency without the grind.",
  monthlyPriceCents: 1900,
  /** Reserved for future annual / price changes */
  annualPriceCents: null as number | null,
  bullets: [
    "Monthly template drops",
    "New forms and documents",
    "Promo packs and seasonal kits",
    "Exclusive updates for members",
  ],
  ctaLabel: "Join Membership",
  /** Until Stripe subs are wired; override with env in component if needed */
  checkoutUrl: "/forms/NPA-Pro-Membership.html",
  metaTitle: "NPA Membership | Ongoing templates & systems for med spas",
  metaDescription:
    "$19/month — monthly drops, new forms, promo packs, and member-only updates. Cancel anytime.",
} as const;

export const FUNNEL_COPY = {
  upgradeToGrowth:
    "Upgrade to the Growth System and get everything — one cart instead of stacking smaller bundles.",
  productMembershipUpsell:
    "Get everything plus ongoing updates with Membership — new templates and forms every month.",
  thankYouMembership:
    "Keep the momentum: Membership adds fresh templates and systems every month so you never start from zero again.",
  thankYouGrowth:
    "Missed the full stack? The Growth System bundles our largest template library for one price.",
} as const;

/** Map checkout slug → catalog slug for delivery page lookup. */
export const DELIVERY_PRODUCT_SLUG_ALIASES: Record<string, string> = {
  [GROWTH_SYSTEM_SLUG]: GROWTH_SYSTEM_DELIVERY_ALIAS,
};
