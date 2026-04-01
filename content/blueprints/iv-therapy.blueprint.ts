import type { ProductBlueprint } from "@/lib/products/blueprint";

const ivTherapyBlueprint: ProductBlueprint = {
  niche: "iv-therapy",
  nicheLabel: "IV Therapy",
  brand: "No Prior Authorization",
  defaultTone: "luxury",
  tones: ["luxury", "clinical", "bold"],
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
      id: "iv-drip",
      label: "IV Drip Therapy",
      keywords: [
        "iv therapy templates", "iv drip marketing", "iv hydration instagram",
        "infusion clinic", "iv therapy social media", "iv bar templates",
        "iv therapy canva", "vitamin drip", "hydration therapy",
      ],
      audience: ["IV therapy clinics", "Med spa owners", "Mobile IV providers"],
    },
    {
      id: "vitamin-injection",
      label: "Vitamin Injection",
      keywords: [
        "vitamin injection templates", "b12 shot marketing", "vitamin shot instagram",
        "lipo shot templates", "vitamin injection social media", "wellness injection",
        "vitamin canva", "glutathione", "biotin injection",
      ],
      audience: ["Wellness clinics", "NPs", "Med spa providers"],
    },
    {
      id: "nad",
      label: "NAD+ Therapy",
      keywords: [
        "nad therapy templates", "nad plus marketing", "anti-aging iv",
        "nad instagram", "longevity clinic", "nad social media",
        "nad canva", "cellular health", "nad infusion",
      ],
      audience: ["Longevity clinics", "Anti-aging providers", "Wellness centers"],
    },
  ],
};

export default ivTherapyBlueprint;
