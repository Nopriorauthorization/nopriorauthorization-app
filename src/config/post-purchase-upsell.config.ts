import { GROWTH_SYSTEM_SLUG } from "@/config/growth-funnel.config";
import { STUDY_GUIDE_NCLEX_SLUG } from "@/config/study-guides.config";

/**
 * After a successful purchase, offer one related product on the post-purchase page.
 * Value = upsell product slug (must exist in shop catalog for shop checkout).
 */
const UPSELL_BY_PURCHASE: Record<string, string> = {
  [STUDY_GUIDE_NCLEX_SLUG]: "new-patient-intake-cheat-sheet",
  "botox-clinical-cheat-sheet": "dermal-filler-clinical-cheat-sheet",
  "dermal-filler-clinical-cheat-sheet": "botox-clinical-cheat-sheet",
  "phase-2-business-bundle": GROWTH_SYSTEM_SLUG,
  "combo-bundle": "phase-2-business-bundle",
};

const DEFAULT_UPSELL_SLUG = GROWTH_SYSTEM_SLUG;

/**
 * Returns shop slug for the one-click upsell, or null to hide the upsell block.
 */
export function getUpsellSlugAfterPurchase(purchasedSlug: string): string | null {
  if (UPSELL_BY_PURCHASE[purchasedSlug]) {
    const next = UPSELL_BY_PURCHASE[purchasedSlug];
    if (next === purchasedSlug) return null;
    return next;
  }
  if (purchasedSlug === DEFAULT_UPSELL_SLUG) {
    return "phase-2-business-bundle";
  }
  return DEFAULT_UPSELL_SLUG;
}
