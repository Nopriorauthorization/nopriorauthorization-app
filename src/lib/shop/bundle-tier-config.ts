/**
 * Bundle upgrade ladder — tiers, slug assignments, showcase links.
 * Checkout prices + tier compare-at: `@/config/growth-funnel.config`.
 */

import {
  BUNDLE_TIER_COMPARE_AT_CENTS as FUNNEL_TIER_COMPARE_AT,
  BUNDLE_TIER_PRICE_CENTS,
  GROWTH_SYSTEM_SLUG,
} from "@/config/growth-funnel.config";

export type { BundleTierEmphasis, BundleTierId } from "@/lib/shop/bundle-tier-types";
import type { BundleTierEmphasis, BundleTierId } from "@/lib/shop/bundle-tier-types";

export { BUNDLE_TIER_PRICE_CENTS, FUNNEL_TIER_COMPARE_AT as BUNDLE_TIER_COMPARE_AT_CENTS };

export type BundleTierDefinition = {
  id: BundleTierId;
  title: string;
  shortLabel: string;
  anchorLabel: string;
  emphasis: BundleTierEmphasis;
  badge: string | null;
  summary: string;
};

export const BUNDLE_TIERS: BundleTierDefinition[] = [
  {
    id: "starter",
    title: "Starter (30 templates)",
    shortLabel: "Starter",
    anchorLabel: "30 templates · $19",
    emphasis: "none",
    badge: null,
    summary: "Entry bundles and essential stacks — start professional at the lowest tier.",
  },
  {
    id: "most_popular",
    title: "Most popular (60 templates)",
    shortLabel: "Most popular",
    anchorLabel: "60 templates · $29",
    emphasis: "recommended",
    badge: "Most popular",
    summary: "The tier busy owners pick first — more coverage without the full library.",
  },
  {
    id: "growth",
    title: "Growth (120 templates)",
    shortLabel: "Growth",
    anchorLabel: "120 templates · $57",
    emphasis: "none",
    badge: null,
    summary: "Playbooks and deeper systems — training, ops, and revenue programs.",
  },
  {
    id: "mega",
    title: "💎 Growth System (300+ templates)",
    shortLabel: "Growth System",
    anchorLabel: "300+ templates · $147",
    emphasis: "best_value",
    badge: "Best Value",
    summary: "Full library positioning — everything we bundle for serious scale (delivers mega stack).",
  },
];

export const BUNDLE_TIER_SHOWCASE_SLUG: Record<BundleTierId, string> = {
  starter: "botox-consent-bundle",
  most_popular: "weight-loss-kit",
  growth: "injectors-playbook",
  mega: GROWTH_SYSTEM_SLUG,
};

export const MEGA_UPGRADE_TARGET_SLUG = GROWTH_SYSTEM_SLUG;

export const MEGA_COMPLETE_STACK_SLUGS = new Set<string>([
  GROWTH_SYSTEM_SLUG,
  "combo-bundle",
]);

export const PRODUCT_BUNDLE_TIER: Partial<Record<string, BundleTierId>> = {
  [GROWTH_SYSTEM_SLUG]: "mega",

  "botox-consent-bundle": "starter",
  "filler-consent-bundle": "starter",
  "lash-aftercare-kit": "starter",
  "microneedling-consent-bundle": "starter",
  "chemical-peel-consent-bundle": "starter",
  "medspa-promo-pack": "starter",
  "myths-facts-injectors": "starter",
  "new-patient-membership-pack": "starter",
  "review-testimonial-pack": "starter",
  "seasonal-marketing-pack": "starter",
  "iv-story-templates": "starter",
  "glp1-story-templates": "starter",
  "hipaa-compliance-kit": "starter",
  "client-welcome-packet": "starter",
  "medspa-startup-checklist": "starter",
  "treatment-pricing-menu": "starter",
  "aftercare-card-kit": "starter",

  "weight-loss-kit": "most_popular",
  "botox-social-bundle": "most_popular",
  "filler-social-bundle": "most_popular",
  "complete-injector-bundle": "most_popular",
  "iv-therapy-social-kit": "most_popular",
  "npa-49-star-system": "most_popular",
  "iv-therapy-patient-journey-kit": "most_popular",
  "microneedling-patient-journey-kit": "most_popular",
  "chemical-peel-patient-journey-kit": "most_popular",

  "injectors-playbook": "growth",
  "new-injector-onboarding-kit": "growth",
  "google-domination-playbook": "growth",
  "hormone-therapy-playbook": "growth",
  "peptide-therapy-playbook": "growth",
  "medspa-social-media-system": "growth",
  "medspa-content-strategy-system": "growth",
  "patient-loyalty-system": "growth",
  "botox-patient-journey-kit": "growth",
  "filler-patient-journey-kit": "growth",
  "glp1-patient-journey-kit": "growth",
  "hormone-patient-journey-kit": "growth",
  "peptide-patient-journey-kit": "growth",
  "facial-anatomy-nurse-injector": "growth",
  "peptide-patient-guide": "growth",
  "peptide-canva-marketing-pack": "growth",
  "guidebook-category-strategy": "growth",
  "treatment-menu-signage-kit": "growth",
  "patient-communication-kit": "growth",
  "microblading-pmu-playbook": "growth",

  "combo-bundle": "mega",
  "diy-google-setup-kit": "mega",
  "med-spa-legal-startup-bundle": "mega",
};

export function getBundleTierDefinition(id: BundleTierId): BundleTierDefinition {
  const t = BUNDLE_TIERS.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown tier ${id}`);
  return t;
}

export function getBundleTierIdForSlug(slug: string): BundleTierId | undefined {
  return PRODUCT_BUNDLE_TIER[slug];
}

export function isOnBundleLadder(slug: string): boolean {
  return Boolean(PRODUCT_BUNDLE_TIER[slug]);
}
