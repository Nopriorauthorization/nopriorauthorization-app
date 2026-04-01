import type { DigitalProductConfig } from "@/lib/products/types";

const config: DigitalProductConfig = {
  slug: "npa-appeal-kit",
  internalName: "Prior Authorization Appeal Letter Kit",
  listingTitleSeed:
    "Prior Authorization Appeal Letter Kit | Editable Templates | Insurance Denial Appeals for Medical Practices",
  brand: "No Prior Authorization",
  brandId: "npa",
  category: "admin-workflow",
  audience: [
    "Medical office managers",
    "Practice administrators",
    "Billing coordinators",
    "Nurse practitioners with independent practices",
  ],
  keywords: [
    "prior authorization appeal",
    "insurance denial letter",
    "appeal template",
    "medical office forms",
    "insurance appeal",
    "denial management",
    "pre-auth appeal",
    "medical billing template",
    "payer appeal letter",
    "insurance reconsideration",
  ],
  tagsSeed: [
    "prior auth appeal",
    "insurance denial template",
    "appeal letter kit",
    "medical office forms",
    "insurance appeal template",
    "denial management",
    "medical billing",
    "practice admin",
    "payer appeal",
    "authorization appeal",
    "medical practice template",
    "editable appeal form",
    "healthcare admin",
  ],
  descriptionSeed:
    "Stop losing revenue to insurance denials. This appeal letter kit gives your office editable, ready-to-send templates for the most common prior authorization denial scenarios — peer-to-peer request letters, medical necessity appeals, expedited review requests, and more. Designed for medical offices, billing teams, and independent practitioners who need professional appeal documentation without starting from scratch every time.",
  canvaDesignStrategy: "use-existing-template",
  exportFormats: ["pdf"],
  deliveryFiles: {
    includeInstructions: true,
    includeCanvaLinks: false,
    includeBonusFiles: false,
  },
  etsy: {
    priceUsd: 29,
    quantity: 999,
    isDigital: true,
    shouldCreateDraft: true,
  },
};

export default config;
