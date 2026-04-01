import type { DigitalProductConfig } from "@/lib/products/types";

const config: DigitalProductConfig = {
  slug: "npa-checklist-bundle",
  internalName: "Medical Practice Compliance Checklist Bundle",
  listingTitleSeed:
    "Medical Practice Compliance Checklist Bundle | HIPAA, OSHA, Credentialing & Audit Prep Templates",
  brand: "No Prior Authorization",
  brandId: "npa",
  category: "compliance",
  audience: [
    "Med spa owners",
    "Practice managers",
    "Compliance officers",
    "New practice startups",
  ],
  keywords: [
    "compliance checklist",
    "HIPAA checklist",
    "OSHA compliance",
    "credentialing checklist",
    "medical practice audit",
    "med spa compliance",
    "practice startup checklist",
    "healthcare compliance template",
    "office readiness checklist",
    "regulatory checklist",
  ],
  tagsSeed: [
    "compliance checklist",
    "HIPAA checklist template",
    "OSHA medical office",
    "credentialing checklist",
    "med spa compliance",
    "practice audit prep",
    "medical office startup",
    "healthcare compliance",
    "regulatory template",
    "practice management",
    "office readiness",
    "compliance bundle",
    "medical admin template",
  ],
  descriptionSeed:
    "Get your practice audit-ready with this compliance checklist bundle. Covers HIPAA privacy and security requirements, OSHA workplace safety, provider credentialing tracking, and general audit preparation — all in editable templates you can customize for your clinic. Built for med spas, aesthetic practices, and independent medical offices that need clean compliance documentation without hiring a consultant.",
  canvaDesignStrategy: "use-existing-template",
  exportFormats: ["pdf"],
  deliveryFiles: {
    includeInstructions: true,
    includeCanvaLinks: false,
    includeBonusFiles: false,
  },
  etsy: {
    priceUsd: 37,
    quantity: 999,
    isDigital: true,
    shouldCreateDraft: true,
  },
};

export default config;
