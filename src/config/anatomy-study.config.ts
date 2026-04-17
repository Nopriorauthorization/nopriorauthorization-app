/**
 * A&P Study Hub — monetization (Square shop + delivery token → cookie).
 * Lecture 1 (lec1) is always free; full course requires purchase.
 */

export const ANATOMY_STUDY_SHOP_SLUG = "anatomy-physiology-study-complete";

/** Cookie set after buyer clicks activate on delivery page (httpOnly). */
export const ANATOMY_STUDY_FULL_COOKIE = "anatomy_study_full";
export const ANATOMY_STUDY_FULL_COOKIE_VALUE = "1";

/** First lecture is the free preview (maps to "Introduction to A&P"). */
export const ANATOMY_FREE_LECTURE_IDS = new Set<string>(["lec1"]);

export const anatomyStudyShopHref = `/shop/${ANATOMY_STUDY_SHOP_SLUG}`;

export type AnatomyStudyShopProductDef = {
  slug: string;
  title: string;
  priceCents: number;
  templateCount: number;
  shortDescription: string;
  longDescription: string;
  features: string[];
};

export function getAnatomyStudyShopProductDef(): AnatomyStudyShopProductDef {
  return {
    slug: ANATOMY_STUDY_SHOP_SLUG,
    title: "Anatomy & Physiology — Complete Study Hub",
    priceCents: 3900,
    templateCount: 12,
    shortDescription:
      "Full digital course: 12 lecture modules with cheat sheets, 240 quiz questions, and flashcards. Lecture 1 is free to try — purchase unlocks the rest.",
    longDescription:
      "Unlock every Anatomy & Physiology module on No Prior Authorization: structured cheat sheets, multiple-choice quizzes with explanations, and flip flashcards for all twelve units (intro A&P through nervous system). Lecture 1 remains available as a free preview before you buy. Personal study use only — see site Terms. After checkout you receive a delivery link to activate access in your browser (same flow as other NPA digital study products).",
    features: [
      "12 lecture modules · cheat sheets, quizzes, flashcards",
      "Lecture 1 free forever as a preview",
      "240 quiz questions with instant feedback",
      "One-time purchase · activate via post-checkout email link",
    ],
  };
}

export function isAnatomyStudyProductSlug(slug: string): boolean {
  return slug === ANATOMY_STUDY_SHOP_SLUG;
}

/** Display price (keep in sync with `getAnatomyStudyShopProductDef().priceCents`). */
export const ANATOMY_STUDY_PRICE_DISPLAY = "$39";
