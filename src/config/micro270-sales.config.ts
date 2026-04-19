/**
 * Micro 270 monetization: hub gating + Square checkout via shop PDPs.
 */
import {
  MICRO270_SHOP_SLUG_BANK,
  MICRO270_SHOP_SLUG_BUNDLE,
  MICRO270_SHOP_SLUG_CHEATS,
  MICRO270_SHOP_SLUG_FULL,
} from "@/config/micro270-shop.config";

export const MICRO270_BANK_COOKIE = "micro270_bank";

/** Unlocks /micro270/cheat-sheets/*.html only (cheat-sheet tier). */
export const MICRO270_CHEATS_COOKIE = "micro270_cheats";

export const MICRO270_CHEATS_COOKIE_VALUE = "1";

/** Cookie value when the customer has purchased the bank (or bundle/full tier). */
export const MICRO270_BANK_COOKIE_VALUE = "1";

export const micro270PricingHref = "/micro270#pricing";

/** Product detail pages — CheckoutButton → POST /api/shop/checkout → Square payment link. */
export const micro270ShopCheckout = {
  bankOnly: `/shop/${MICRO270_SHOP_SLUG_BANK}`,
  bankBundle: `/shop/${MICRO270_SHOP_SLUG_BUNDLE}`,
  fullAccess: `/shop/${MICRO270_SHOP_SLUG_FULL}`,
} as const;

/** Cookie that tracks which cram tier the customer purchased. */
export const MICRO270_TIER_COOKIE = "micro270_tier";
export const MICRO270_TIER_BUNDLE = "bundle";
export const MICRO270_TIER_FULL = "full";

/** Max cram generations per tier. 0 = no cram access. */
export const MICRO270_CRAM_LIMIT: Record<string, number> = {
  [MICRO270_SHOP_SLUG_CHEATS]: 0,
  [MICRO270_SHOP_SLUG_BANK]: 0,
  [MICRO270_SHOP_SLUG_BUNDLE]: 3,
  [MICRO270_SHOP_SLUG_FULL]: 999,
};

/** Slugs that include cram tool access. */
export const MICRO270_CRAM_SLUGS = new Set([
  MICRO270_SHOP_SLUG_BUNDLE,
  MICRO270_SHOP_SLUG_FULL,
]);
