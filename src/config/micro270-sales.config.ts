/**
 * Micro 270 monetization: hub gating + checkout links.
 * Set shop URLs when PDPs / checkout pages exist.
 */
export const MICRO270_BANK_COOKIE = "micro270_bank";

/** Cookie value when the customer has purchased the bank (or bundle/full tier). */
export const MICRO270_BANK_COOKIE_VALUE = "1";

export const micro270PricingHref = "/micro270#pricing";

/** Replace with real /shop/[slug] or external checkout when live. */
export const micro270ShopCheckout = {
  bankOnly: "/shop",
  bankBundle: "/shop",
  fullAccess: "/shop",
} as const;
