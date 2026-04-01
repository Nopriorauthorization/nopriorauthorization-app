import type { DigitalProductConfig } from "@/lib/products/types";

const config: DigitalProductConfig = {
  slug: "npa-intake-template-pack",
  internalName: "Universal Patient Intake Form Pack",
  listingTitleSeed:
    "Patient Intake Form Pack | 8 Editable Templates | Medical History, Consent, HIPAA & Financial Policy",
  brand: "No Prior Authorization",
  brandId: "npa",
  category: "forms",
  audience: [
    "Med spa front desk staff",
    "Practice owners opening new clinics",
    "Nurse practitioners",
    "Office managers",
  ],
  keywords: [
    "patient intake form",
    "medical intake template",
    "new patient forms",
    "consent form template",
    "HIPAA acknowledgment",
    "financial policy form",
    "medical history template",
    "med spa intake",
    "clinic intake packet",
    "editable patient forms",
  ],
  tagsSeed: [
    "patient intake form",
    "medical intake template",
    "new patient packet",
    "consent form",
    "HIPAA acknowledgment",
    "financial policy",
    "medical history form",
    "med spa intake",
    "clinic forms",
    "editable patient form",
    "medical office template",
    "practice intake bundle",
    "healthcare admin forms",
  ],
  descriptionSeed:
    "Everything you need to onboard new patients professionally. This intake pack includes medical history, consent to treat, HIPAA acknowledgment, financial policy agreement, photo release, communication consent, cancellation policy, and a welcome letter — all editable and print-ready. Designed for med spas, aesthetic clinics, and independent medical practices that want polished intake documentation from day one.",
  canvaDesignStrategy: "use-existing-template",
  exportFormats: ["pdf"],
  deliveryFiles: {
    includeInstructions: true,
    includeCanvaLinks: false,
    includeBonusFiles: false,
  },
  etsy: {
    priceUsd: 27,
    quantity: 999,
    isDigital: true,
    shouldCreateDraft: true,
  },
};

export default config;
