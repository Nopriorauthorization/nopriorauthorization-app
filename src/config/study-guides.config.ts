/** Study-guide products sold outside the main `/shop` catalog (Square checkout + token delivery). */

export const STUDY_GUIDE_NCLEX_SLUG = "study-guide-nclex-complete-bundle" as const;

export const STUDY_GUIDE_NCLEX = {
  slug: STUDY_GUIDE_NCLEX_SLUG,
  title: "NCLEX Complete Study Bundle — 8 Cheat Sheets",
  priceCents: 2500,
  /** Large preview (public); full HTML is gated in `delivery-assets/forms/`. */
  previewImageSrc: "/study-guides/nclex-complete-bundle-preview.png",
  deliveryFormPath: "/forms/NCLEX_Complete_Bundle_NPA.html" as const,
  shortDescription:
    "Lab values, pharmacology, clinical judgment, and quick-reference cards — print or save as PDF after purchase.",
} as const;
