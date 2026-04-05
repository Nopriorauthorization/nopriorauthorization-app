/** Study-guide products sold outside the main `/shop` catalog (Square checkout + token delivery). */

export const STUDY_GUIDE_NCLEX_SLUG = "study-guide-nclex-complete-bundle" as const;

/** Eight separate HTML files in `delivery-assets/forms/` (served via token as `/forms/...`). */
export const STUDY_GUIDE_NCLEX_TEMPLATES = [
  {
    title: "NCLEX Lab Values — Complete Reference",
    designId: "nclex-01-lab-values",
    editUrl: "/forms/NPA-NCLEX-01-Lab-Values.html",
  },
  {
    title: "NCLEX Pharmacology — Quick Reference",
    designId: "nclex-02-pharmacology",
    editUrl: "/forms/NPA-NCLEX-02-Pharmacology.html",
  },
  {
    title: "NCLEX Cardiac Rhythms & EKG",
    designId: "nclex-03-cardiac",
    editUrl: "/forms/NPA-NCLEX-03-Cardiac-Rhythms.html",
  },
  {
    title: "NCLEX Acid-Base Balance",
    designId: "nclex-04-acid-base",
    editUrl: "/forms/NPA-NCLEX-04-Acid-Base.html",
  },
  {
    title: "NCLEX Priority Setting & Delegation",
    designId: "nclex-05-priority",
    editUrl: "/forms/NPA-NCLEX-05-Priority-Delegation.html",
  },
  {
    title: "NCLEX Infection Control & Isolation",
    designId: "nclex-06-infection",
    editUrl: "/forms/NPA-NCLEX-06-Infection-Control.html",
  },
  {
    title: "NCLEX OB & Maternity Nursing",
    designId: "nclex-07-ob",
    editUrl: "/forms/NPA-NCLEX-07-OB-Maternity.html",
  },
  {
    title: "NCLEX Mental Health & Therapeutic Communication",
    designId: "nclex-08-mental-health",
    editUrl: "/forms/NPA-NCLEX-08-Mental-Health.html",
  },
] as const;

export const STUDY_GUIDE_NCLEX = {
  slug: STUDY_GUIDE_NCLEX_SLUG,
  title: "NCLEX Complete Study Bundle — 8 Cheat Sheets",
  priceCents: 4900,
  /** Large preview (public); regenerate from sheet 1 after visual changes. */
  previewImageSrc: "/study-guides/nclex-complete-bundle-preview.png",
  /** First sheet — used for preview screenshots / tooling. */
  previewSourceFormPath: "/forms/NPA-NCLEX-01-Lab-Values.html" as const,
  shortDescription:
    "Eight print-ready HTML cheat sheets — lab values, pharmacology, EKG, acid–base, priority, infection control, OB, and mental health. Open after purchase, print or save as PDF.",
} as const;

export function formatStudyGuideUsd(priceCents: number): string {
  return `$${(priceCents / 100).toFixed(priceCents % 100 === 0 ? 0 : 2)}`;
}
