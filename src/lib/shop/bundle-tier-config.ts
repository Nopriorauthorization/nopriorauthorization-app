/**
 * Bundle upgrade ladder — tiers, slug assignments, value anchors, showcase links.
 * Edit this file to change pricing psychology without touching UI components.
 */

export type BundleTierId = "starter" | "most_popular" | "growth" | "mega";

export type BundleTierEmphasis = "none" | "recommended" | "best_value";

export type BundleTierDefinition = {
  id: BundleTierId;
  /** Display name in comparison table */
  title: string;
  /** Short label for badges */
  shortLabel: string;
  /** Marketing anchor (not necessarily exact checkout price) */
  anchorLabel: string;
  emphasis: BundleTierEmphasis;
  /** Optional badge on PDP (e.g. MOST POPULAR) */
  badge: string | null;
  /** One-line pitch for comparison table */
  summary: string;
};

export const BUNDLE_TIERS: BundleTierDefinition[] = [
  {
    id: "starter",
    title: "Starter",
    shortLabel: "Starter",
    anchorLabel: "~$30",
    emphasis: "none",
    badge: null,
    summary: "Entry bundles and essential consent stacks — start professional without a big spend.",
  },
  {
    id: "most_popular",
    title: "Most popular",
    shortLabel: "Most popular",
    anchorLabel: "~$60",
    emphasis: "recommended",
    badge: "Most popular",
    summary: "Full kits owners buy most — social + clinical coverage for busy practices.",
  },
  {
    id: "growth",
    title: "Growth",
    shortLabel: "Growth",
    anchorLabel: "~$120",
    emphasis: "none",
    badge: null,
    summary: "Playbooks and systems — deeper ops, training, and revenue programs.",
  },
  {
    id: "mega",
    title: "Best value / Mega",
    shortLabel: "Mega",
    anchorLabel: "$300+",
    emphasis: "best_value",
    badge: "Best value",
    summary: "Maximum coverage — combo stacks or premium suites for serious scale.",
  },
];

/** Canonical product shown per tier in the comparison table (live price/title from catalog). */
export const BUNDLE_TIER_SHOWCASE_SLUG: Record<BundleTierId, string> = {
  starter: "botox-consent-bundle",
  most_popular: "weight-loss-kit",
  growth: "injectors-playbook",
  mega: "combo-bundle",
};

/**
 * Primary “mega bundle” upsell for upgrade CTAs from lower tiers.
 * (Named consistently with homepage “mega bundle”.)
 */
export const MEGA_UPGRADE_TARGET_SLUG = "combo-bundle";

/**
 * Slugs that receive the full “no need to buy anything else” line (true all-in-one positioning).
 */
export const MEGA_COMPLETE_STACK_SLUGS = new Set<string>(["combo-bundle"]);

/** Products that participate in the bundle ladder (PDP table + tier pricing UI). */
export const PRODUCT_BUNDLE_TIER: Partial<Record<string, BundleTierId>> = {
  // Starter (~$30 band)
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

  // Most popular (~$60 band)
  "weight-loss-kit": "most_popular",
  "botox-social-bundle": "most_popular",
  "filler-social-bundle": "most_popular",
  "complete-injector-bundle": "most_popular",
  "iv-therapy-social-kit": "most_popular",
  "npa-49-star-system": "most_popular",
  "iv-therapy-patient-journey-kit": "most_popular",
  "microneedling-patient-journey-kit": "most_popular",
  "chemical-peel-patient-journey-kit": "most_popular",

  // Growth (~$120 band)
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

  // Mega / best value ($300+ positioning or named mega stack)
  "combo-bundle": "mega",
  "diy-google-setup-kit": "mega",
  "med-spa-legal-startup-bundle": "mega",
};

/** Optional compare-at (cents) for strikethrough “value” anchoring — editorial, not legal MSRP. */
export const BUNDLE_COMPARE_AT_CENTS: Partial<Record<string, number>> = {
  "combo-bundle": 12000,
  "complete-injector-bundle": 12000,
  "weight-loss-kit": 9700,
  "botox-consent-bundle": 5500,
  "diy-google-setup-kit": 45000,
  "med-spa-legal-startup-bundle": 35000,
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
