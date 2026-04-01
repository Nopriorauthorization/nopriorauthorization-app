import type { ProductBlueprint } from "@/lib/products/blueprint";

const medSpaBlueprint: ProductBlueprint = {
  niche: "med-spa",
  nicheLabel: "Med Spa",
  brand: "No Prior Authorization",
  defaultTone: "luxury",
  tones: ["luxury", "bold", "feminine", "clinical"],
  bundleSizes: [30, 60, 120],
  bundleTypes: ["social-media"],
  megaBundlePrice: 9700,
  basePrice: {
    30: 1900,
    60: 2700,
    120: 4700,
    300: 9700,
  },
  treatments: [
    {
      id: "botox",
      label: "Botox & Neurotoxin",
      keywords: [
        "botox templates", "neurotoxin marketing", "botox instagram",
        "injector templates", "botox social media", "wrinkle treatment",
        "aesthetic provider", "nurse injector", "botox canva",
      ],
      audience: ["Nurse injectors", "NPs and PAs", "Med spa owners"],
    },
    {
      id: "filler",
      label: "Dermal Filler",
      keywords: [
        "filler templates", "dermal filler marketing", "lip filler instagram",
        "filler social media", "injector content", "aesthetic templates",
        "filler canva", "cheek filler", "jawline filler",
      ],
      audience: ["Injectors", "Aesthetic providers", "Med spa marketing teams"],
    },
    {
      id: "laser",
      label: "Laser Treatment",
      keywords: [
        "laser treatment templates", "laser resurfacing marketing", "laser clinic",
        "aesthetic laser", "skin rejuvenation", "laser social media",
        "med spa laser", "fractional laser", "laser canva",
      ],
      audience: ["Laser technicians", "Med spa owners", "Aesthetic clinics"],
    },
    {
      id: "microneedling",
      label: "Microneedling",
      keywords: [
        "microneedling templates", "microneedling marketing", "microneedling instagram",
        "skin treatment", "collagen induction", "microneedling social media",
        "esthetician templates", "microneedling canva", "skin rejuvenation",
      ],
      audience: ["Estheticians", "NPs", "Med spa owners"],
    },
    {
      id: "chemical-peel",
      label: "Chemical Peel",
      keywords: [
        "chemical peel templates", "peel marketing", "chemical peel instagram",
        "skin treatment", "esthetician marketing", "peel social media",
        "chemical peel canva", "glycolic peel", "skin resurfacing",
      ],
      audience: ["Estheticians", "Dermatologists", "Med spa providers"],
    },
    {
      id: "prp",
      label: "PRP & Regenerative",
      keywords: [
        "prp templates", "platelet rich plasma", "prp marketing",
        "regenerative aesthetics", "prp facial", "vampire facial",
        "prp social media", "prp canva", "aesthetic regenerative",
      ],
      audience: ["NPs", "Aesthetic providers", "Regenerative clinics"],
    },
  ],
};

export default medSpaBlueprint;
