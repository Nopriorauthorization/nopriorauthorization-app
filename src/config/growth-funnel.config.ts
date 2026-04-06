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

/** Premium landing copy — /shop + /shop/growth-system */
export const GROWTH_SYSTEM_SIGNATURE = {
  eyebrow: "Signature collection",
  headline: "The Growth System",
  subhead:
    "The full NPA library in one cart — not a taste test. Built for owners who want every major consent, social line, promo, and ops template without stacking five checkouts.",
  seal: "Danielle Alcala’s flagship stack",
  stats: [
    { value: "300+", label: "templates & assets" },
    { value: "4", label: "practice pillars" },
    { value: "1", label: "checkout · instant send" },
  ] as const,
  trustStrip: ["Instant email delivery", "Secure checkout", "HTML + optional Canva on select packs"] as const,
  quote: {
    text: "I went from posting once a week to daily — templates that actually look like a real med spa.",
    author: "Jessica L.",
    role: "Med spa owner, FL",
  },
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
    "Want ongoing updates? NPA Pro Membership adds new drops every month — full library access while you’re subscribed.",
} as const;

export const MEMBERSHIP_CONFIG = {
  /** Must match public/forms/NPA-Pro-Membership.html pricing */
  displayName: "NPA Pro Membership",
  hero: "Every product we make. Every month. One membership.",
  heroSubline:
    "Full library access for med spas, injectors, and aesthetic practices — new drops automatically, cancel anytime.",
  monthlyPriceCents: 4700,
  annualPriceCents: 39700,
  /** Shown as effective monthly when billed annually ($397/12 ≈ $33.08 — display as $33 in UI) */
  annualEffectiveMonthlyDisplay: "$33",
  bullets: [
    "All current playbooks, kits, and template systems",
    "New products unlock automatically while you’re subscribed",
    "Member-first access before public launches",
    "Cancel anytime — no long-term contract",
  ],
  ctaLabel: "Join Pro Membership",
  checkoutUrl: "/forms/NPA-Pro-Membership.html",
  metaTitle: "NPA Pro Membership | Full template library for med spas",
  metaDescription:
    "$47/month or $397/year — full NPA library, new drops monthly, cancel anytime. Same pricing as our membership checkout form.",
} as const;

export function formatMembershipMonthlyUsd(): string {
  return `$${(MEMBERSHIP_CONFIG.monthlyPriceCents / 100).toFixed(0)}`;
}

export function formatMembershipAnnualUsd(): string {
  const y = MEMBERSHIP_CONFIG.annualPriceCents;
  return y != null ? `$${(y / 100).toFixed(0)}` : "";
}

export function membershipAnnualSavingsVsMonthlyUsd(): number {
  const y = MEMBERSHIP_CONFIG.annualPriceCents;
  if (y == null) return 0;
  const monthlyYear = MEMBERSHIP_CONFIG.monthlyPriceCents * 12;
  return (monthlyYear - y) / 100;
}

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
