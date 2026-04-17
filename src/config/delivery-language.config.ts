/**
 * Normalized delivery copy — one model per product family. Import on product pages, FAQ, membership, emails.
 */

export const DELIVERY_STANDARD = {
  id: "html_browser" as const,
  fileType: "Print-ready HTML",
  shortLine:
    "Open in any browser on desktop, tablet, or phone. Print directly or use File → Print → Save as PDF.",
  longLine:
    "Delivered as print-ready HTML files. Open in Chrome, Safari, or Edge — no special software required. Unlimited prints for your own practice.",
} as const;

export const DELIVERY_SOCIAL_CANVA = {
  id: "html_plus_canva" as const,
  fileType: "HTML + optional Canva",
  shortLine:
    "Browser-ready HTML plus optional Canva links on select packs — Canva Free is enough; Pro is not required.",
  longLine:
    "Most assets open as HTML in your browser (print or save as PDF). Social and design-forward packs may also include Canva template links where noted on the product page.",
} as const;

export const DELIVERY_STUDY_GUIDES = {
  id: "study_html" as const,
  fileType: "Print-ready HTML bundle",
  shortLine:
    "Eight separate HTML study files — open in your browser, print or save as PDF for offline study.",
  longLine:
    "Delivered as multiple print-ready HTML files (one per topic). Same flow as the shop: secure email link, open in browser, print or export PDF.",
} as const;

export const LICENSE_SHOP_STANDARD =
  "Licensed for use within your own practice or business. Unlimited printing for staff and patients. No redistribution, resale, or sharing of original files with other practices.";

export const MEMBERSHIP_INCLUSION_LINE =
  "NPA Pro Membership includes the full template library while your subscription is active. One-time purchases keep perpetual access to the products you bought.";

/** Map shop `product.category` to delivery profile. */
export function getDeliveryProfileForCategory(
  category: string
): typeof DELIVERY_STANDARD | typeof DELIVERY_SOCIAL_CANVA | typeof DELIVERY_STUDY_GUIDES {
  if (category === "Social Media") {
    return DELIVERY_SOCIAL_CANVA;
  }
  if (category === "Study guides") {
    return DELIVERY_STUDY_GUIDES;
  }
  return DELIVERY_STANDARD;
}

/** FAQ / long-form: single paragraph covering all types. */
export const DELIVERY_MASTER_FAQ_ANSWER =
  "NPA digital products are delivered as print-ready HTML you open in any modern browser — print directly or use File → Print → Save as PDF. Social Media and some design-forward packs may also include optional Canva template links (Canva Free works). NCLEX and other study bundles use the same HTML delivery across multiple files. Nothing ships in the mail.";

export const EDITING_FAQ_ANSWER =
  "Yes. Add your practice name, logo, provider details, and contact information in the browser before printing. Fields are designed to be edited without extra software.";

export const CANVA_REQUIRED_FAQ_ANSWER =
  "No. Most products need only a web browser. If a product includes optional Canva links, Canva’s free plan is sufficient unless you choose to upgrade.";
