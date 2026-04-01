export type BundleSize = 30 | 60 | 120 | 300;
export type Tone = "luxury" | "clinical" | "feminine" | "bold";
export type BundleType = "social-media" | "forms" | "promo" | "combo";

export type TreatmentDef = {
  id: string;
  label: string;
  keywords: string[];
  audience: string[];
};

export type ProductBlueprint = {
  niche: string;
  nicheLabel: string;
  treatments: TreatmentDef[];
  bundleSizes: BundleSize[];
  tones: Tone[];
  defaultTone: Tone;
  basePrice: Record<BundleSize, number>;
  bundleTypes: BundleType[];
  megaBundlePrice?: number;
  brand: "No Prior Authorization" | "Hello Gorgeous";
};

export const BUNDLE_SIZE_LABELS: Record<BundleSize, string> = {
  30: "30 Pack",
  60: "60 Pack",
  120: "120 Pack",
  300: "300+ Mega Bundle",
};

export const BUNDLE_TYPE_LABELS: Record<BundleType, string> = {
  "social-media": "Instagram Templates",
  forms: "Clinical Forms",
  promo: "Promo Templates",
  combo: "Complete Bundle",
};

export const TONE_BADGE: Record<Tone, string> = {
  luxury: "PREMIUM COLLECTION",
  clinical: "PROFESSIONAL GRADE",
  feminine: "DESIGNED FOR YOU",
  bold: "DONE FOR YOU",
};
