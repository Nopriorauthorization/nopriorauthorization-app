import { GROWTH_SYSTEM_SLUG } from "@/config/growth-funnel.config";

/** Shop slugs that should not show the “Included in Pro” badge (separate purchase path). */
export const PRO_MEMBERSHIP_EXCLUDED_SHOP_SLUGS: ReadonlySet<string> = new Set([
  GROWTH_SYSTEM_SLUG,
  "hello-gorgeous-the-book",
]);

export const PRO_BROWSE_STORAGE_KEY = "npa_pro_browse_v1";
export const PRO_BROWSE_MAX_ENTRIES = 48;
