/**
 * Micro 270 SKUs — Square checkout uses /api/shop/checkout + these slugs.
 * Fulfillment (email / download) must match your delivery pipeline for these slugs.
 */
export const MICRO270_SHOP_SLUG_BANK = "micro270-question-bank";
export const MICRO270_SHOP_SLUG_BUNDLE = "micro270-bank-ai-bundle";
export const MICRO270_SHOP_SLUG_FULL = "micro270-full-access";

export type Micro270ShopProductDef = {
  slug: string;
  title: string;
  priceCents: number;
  templateCount: number;
  shortDescription: string;
  longDescription: string;
  features: string[];
};

export function getMicro270ShopProductDefs(): Micro270ShopProductDef[] {
  return [
    {
      slug: MICRO270_SHOP_SLUG_BANK,
      title: "Micro 270 — Complete Question Bank",
      priceCents: 4700,
      templateCount: 20,
      shortDescription:
        "1,000 professor-style questions across 20 chapters — interactive HTML, exam traps, explanations. One-time purchase.",
      longDescription:
        "Full Microbiology 270 question bank: 50 questions per chapter, flagged exam traps, and detailed explanations in self-contained chapter HTML. Licensed for your personal nursing-school study only — no redistribution or commercial use. See Terms of Use. After checkout you receive delivery instructions by email (same flow as other NPA digital products).",
      features: [
        "1,000 questions · 20 chapters · interactive HTML",
        "Exam-trap flags and full explanations",
        "Personal study license — see /terms",
        "Secure checkout via Square · instant digital delivery email",
      ],
    },
    {
      slug: MICRO270_SHOP_SLUG_BUNDLE,
      title: "Micro 270 Bank + AI Cram Tool (3 generations)",
      priceCents: 6700,
      templateCount: 20,
      shortDescription:
        "Complete question bank plus three AI-powered cram-sheet generations from your own notes.",
      longDescription:
        "Includes everything in the Micro 270 Complete Question Bank, plus three uses of the AI cram tool to generate professor-style Q&A from your uploaded study materials. Personal use only; no redistribution. Delivery and access details sent by email after Square checkout.",
      features: [
        "Full Micro 270 bank (as in the $47 tier)",
        "3 custom AI cram generations from your notes",
        "Personal license — see /terms",
        "Secure checkout via Square",
      ],
    },
    {
      slug: MICRO270_SHOP_SLUG_FULL,
      title: "Micro 270 Full Access — Bank + unlimited AI cram",
      priceCents: 9700,
      templateCount: 20,
      shortDescription:
        "Complete bank plus unlimited AI cram-sheet generations for any supported course.",
      longDescription:
        "Full Micro 270 question bank and unlimited AI cram generations (subject to fair use in product terms). For the serious student who wants both the curated bank and unlimited note-to-quiz generation. Personal, non-commercial use only. See /terms.",
      features: [
        "Full Micro 270 bank",
        "Unlimited AI cram generations (per posted product terms)",
        "Personal license — see /terms",
        "Secure checkout via Square",
      ],
    },
  ];
}
