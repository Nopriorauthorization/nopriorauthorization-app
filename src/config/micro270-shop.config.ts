/**
 * Micro 270 SKUs — Square checkout uses /api/shop/checkout + these slugs.
 * Fulfillment (email / download) must match your delivery pipeline for these slugs.
 */
/** Printable chapter HTML (mirrors under /micro270/cheat-sheets/); upgrade path to full bank. */
export const MICRO270_SHOP_SLUG_CHEATS = "micro270-chapter-cheat-sheets";
/** One checkout: study PDF + full hub + printable chapters + unlimited AI cram (same access as “full access”). */
export const MICRO270_SHOP_SLUG_FLAGSHIP = "micro270-complete-microbiology";
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
      slug: MICRO270_SHOP_SLUG_FLAGSHIP,
      title: "Micro 270 — Complete Microbiology (everything in one)",
      priceCents: 7900,
      templateCount: 22,
      shortDescription:
        "Study guide PDF + full 1,000-question hub + printable chapter pack + unlimited AI cram — one Square checkout, one email.",
      longDescription:
        "The consolidated microbiology path on No Prior Authorization: download the complete study guide PDF (Micro 250 / exam prep), activate the full Micro 270 interactive hub (all 20 chapters, exam-trap flags, explanations), open every chapter as a printable page under /micro270/cheat-sheets/, and use the AI cram tool without generation limits (same entitlement as “Full access”). Personal study license — see /terms. Checkout via Square; delivery link by email.",
      features: [
        "Complete study guide PDF (download from delivery)",
        "Full Micro 270 hub — 1,000 questions · 20 chapters",
        "Printable chapter paths for every topic",
        "Unlimited AI cram generations (per product terms)",
        "Secure checkout via Square",
      ],
    },
    {
      slug: MICRO270_SHOP_SLUG_CHEATS,
      title: "Micro 270 — Chapter cheat sheets (all 20 topics)",
      priceCents: 999,
      templateCount: 20,
      shortDescription:
        "Printable chapter layouts for every Micro 270 topic — perfect if you want visuals first, then upgrade to the full interactive bank later.",
      longDescription:
        "Twenty chapter-aligned printable pages (same chapter HTML as the full bank, opened from a dedicated /cheat-sheets/ path after you activate). Use Print → Save as PDF for your binder. This tier does not include the AI cram tool. Upgrade anytime with Micro 270 — Complete Question Bank ($47) or get everything at once with Complete Microbiology ($79). Checkout is via Square; delivery link arrives by email.",
      features: [
        "All 20 chapter topics — print-friendly HTML from your browser",
        "Activate once per device (cookie) from your delivery email",
        "Upgrade path: add the $47 question bank when you are ready",
        "Personal study license — see /terms",
        "Secure checkout via Square",
      ],
    },
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
