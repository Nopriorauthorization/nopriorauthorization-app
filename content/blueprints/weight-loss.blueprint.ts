import type { ProductBlueprint } from "@/lib/products/blueprint";

const weightLossBlueprint: ProductBlueprint = {
  niche: "weight-loss",
  nicheLabel: "Weight Loss",
  brand: "No Prior Authorization",
  defaultTone: "bold",
  tones: ["bold", "clinical", "feminine"],
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
      id: "glp1",
      label: "GLP-1 & Semaglutide",
      keywords: [
        "glp1 templates", "semaglutide marketing", "weight loss instagram",
        "ozempic templates", "wegovy marketing", "glp1 social media",
        "weight loss clinic", "semaglutide canva", "glp1 canva",
      ],
      audience: ["Weight loss clinics", "NPs prescribing GLP-1", "Med spa owners"],
    },
    {
      id: "tirzepatide",
      label: "Tirzepatide",
      keywords: [
        "tirzepatide templates", "mounjaro marketing", "tirzepatide instagram",
        "weight loss social media", "tirzepatide clinic", "obesity treatment",
        "tirzepatide canva", "weight management", "compounding pharmacy",
      ],
      audience: ["Weight loss providers", "NPs", "Compounding clinics"],
    },
    {
      id: "nutrition",
      label: "Nutrition & Coaching",
      keywords: [
        "nutrition templates", "weight loss coaching", "meal plan templates",
        "nutrition instagram", "health coach templates", "diet templates",
        "nutrition canva", "coaching social media", "wellness templates",
      ],
      audience: ["Health coaches", "Nutritionists", "Weight loss clinics"],
    },
    {
      id: "body-contouring",
      label: "Body Contouring",
      keywords: [
        "body contouring templates", "coolsculpting marketing", "body sculpting",
        "fat reduction templates", "body contouring instagram", "emsculpt",
        "body contouring canva", "aesthetic body", "non-surgical fat loss",
      ],
      audience: ["Med spa owners", "Body contouring clinics", "Aesthetic providers"],
    },
  ],
};

export default weightLossBlueprint;
