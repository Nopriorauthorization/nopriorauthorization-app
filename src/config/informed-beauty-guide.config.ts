/**
 * Legacy identifiers for scripts and older payment notes.
 * Public landing and shop SKU: use `hello-gorgeous-book.config.ts` → `/book` and `hello-gorgeous-the-book`.
 */

export const INFORMED_BEAUTY_GUIDE_SLUG = "informed-beauty-guide" as const;

export const INFORMED_BEAUTY_TITLE = "The Informed Beauty Guide";

/** Square checkout + catalog price (USD cents). */
export const INFORMED_BEAUTY_PRICE_CENTS = 4900;

/** Gated file: `delivery-assets/forms/NPA-Informed-Beauty-Guide-PREMIUM.html` — full book + 11 sections, sticky nav, print/PDF. */
export const INFORMED_BEAUTY_DELIVERY_FORM_PATH =
  "/forms/NPA-Informed-Beauty-Guide-PREMIUM.html" as const;
