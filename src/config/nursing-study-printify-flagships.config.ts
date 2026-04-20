/**
 * Four flagship **physical** nursing-study products (Printify POD) — “Nurse in the Making” style:
 * three spiral references + one flashcard deck. Each maps to a Printify SKU key in
 * `src/lib/printify/products.ts` and a shop slug for Square checkout.
 *
 * Covers for the create script: `printify-assets/nursing-flagships/<coverDir>/cover.png`
 * (same aspect as Micro 250 notebook cover). Interior PDFs are attached in Printify dashboard
 * after products exist (same workflow as `create-micro250-notebook.mjs`).
 */
export type NursingStudyPrintifyFlagship = {
  shopSlug: string;
  /** Key in `PRINTIFY_PRODUCTS` + `PRINTIFY_INVENTORY_JSON` */
  printifySkuKey: string;
  title: string;
  priceCents: number;
  /** Printify catalog blueprint (74 = SPOKE spiral; 1138 = District card deck — same as study-kit scripts) */
  blueprintId: number;
  printProviderId: number;
  variantId: number;
  /** Subfolder under `printify-assets/nursing-flagships/` holding `cover.png` */
  coverDir: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
};

export const NURSING_STUDY_PRINTIFY_FLAGSHIPS: NursingStudyPrintifyFlagship[] = [
  {
    shopSlug: "physical-complete-microbiology-spiral",
    printifySkuKey: "NPA-NITM-MICRO-SPIRAL",
    title: "Complete Microbiology — Spiral Study Book (Print)",
    priceCents: 6800,
    blueprintId: 74,
    printProviderId: 1,
    variantId: 34240,
    coverDir: "complete-microbiology",
    shortDescription:
      "Dense micro reference in one spiral — for students who want the book in hand, not just on screen.",
    longDescription:
      "Print-on-demand spiral notebook (SPOKE / Printify). Ships in a few business days. Pair with the digital Complete Microbiology bundle on nopriorauthorization.com for full interactive access. Personal study use — see site terms.",
    features: [
      "Spiral-bound · ruled pages · NPA-branded cover",
      "Ships via Printify · tracking by email",
      "Designed to sit next to your digital Micro 270 hub",
    ],
  },
  {
    shopSlug: "physical-complete-anatomy-spiral",
    printifySkuKey: "NPA-NITM-ANATOMY-SPIRAL",
    title: "Complete Anatomy & Physiology — Spiral Study Book (Print)",
    priceCents: 6800,
    blueprintId: 74,
    printProviderId: 1,
    variantId: 34240,
    coverDir: "complete-anatomy",
    shortDescription:
      "One physical spine for A&P — same “complete course in one book” energy as the reference shops you like.",
    longDescription:
      "Print-on-demand spiral notebook. Ships via Printify. Use alongside the Anatomy & Physiology Study Hub (digital) on nopriorauthorization.com. Educational use only.",
    features: [
      "Spiral-bound · ruled · professional cover layout",
      "Printify fulfillment · email confirmations",
      "Matches your digital A&P hub content strategy",
    ],
  },
  {
    shopSlug: "physical-complete-nursing-core-spiral",
    printifySkuKey: "NPA-NITM-NURSING-SPIRAL",
    title: "Complete Nursing Core — Spiral Study Book (Print)",
    priceCents: 6800,
    blueprintId: 74,
    printProviderId: 1,
    variantId: 34240,
    coverDir: "complete-nursing-core",
    shortDescription:
      "Single “nursing pillar” print book — clinical + NCLEX-style focus in one bound reference.",
    longDescription:
      "Print-on-demand spiral notebook via Printify. Ships to your door. Combine with your digital nursing study products on NPA. Not a substitute for your program or instructor.",
    features: [
      "Spiral notebook · ruled",
      "Ships in ~3–5 business days (typical Printify)",
      "Built for the “one book on the shelf” buyer",
    ],
  },
  {
    shopSlug: "physical-nclex-essentials-flashcards",
    printifySkuKey: "NPA-NITM-NCLEX-CARDS",
    title: "NCLEX Essentials — Flashcard Deck (Print)",
    priceCents: 5200,
    blueprintId: 1138,
    printProviderId: 28,
    variantId: 87236,
    coverDir: "nclex-essentials-cards",
    shortDescription:
      "Box-style flashcard deck listing — same product family as your A&P / Micro decks (blueprint 1138).",
    longDescription:
      "Print-on-demand flashcard product via Printify (catalog blueprint 1138, same class as existing study decks in this repo). Ships to your door. Pair with digital bundles for maximum value.",
    features: [
      "Physical card deck · Printify blueprint 1138",
      "High-yield essentials positioning",
      "Ships with tracking email",
    ],
  },
];
