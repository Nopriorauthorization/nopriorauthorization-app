import fs from "fs";
import path from "path";
import catalog from "@/lib/delivery/catalog.generated.json";
import {
  GROWTH_SYSTEM_PRODUCT,
  GROWTH_SYSTEM_SLUG,
  BUNDLE_TIER_COMPARE_AT_CENTS,
  BUNDLE_TIER_PRICE_CENTS,
} from "@/config/growth-funnel.config";
import {
  INFORMED_BEAUTY_GUIDE_SLUG,
  INFORMED_BEAUTY_PRICE_CENTS,
  INFORMED_BEAUTY_TITLE,
} from "@/config/informed-beauty-guide.config";
import type { BundleTierEmphasis, BundleTierId } from "@/lib/shop/bundle-tier-config";
import {
  getBundleTierDefinition,
  getBundleTierIdForSlug,
} from "@/lib/shop/bundle-tier-config";

export type ShopProduct = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  priceCents: number;
  priceDisplay: string;
  templateCount: number;
  category: string;
  features: string[];
  featured: boolean;
  stripePriceId: string | null;
  previewImages: string[];
  audience: string[];
  /** Set when product is on the config-driven bundle ladder */
  bundleTierId?: BundleTierId;
  bundleTierTitle?: string;
  bundleTierShortLabel?: string;
  bundleTierAnchorLabel?: string;
  bundleTierBadge?: string | null;
  bundleTierEmphasis?: BundleTierEmphasis;
  compareAtCents?: number | null;
  compareAtDisplay?: string | null;
};

type CatalogProduct = {
  productSlug: string;
  productTitle: string;
  templateCount: number;
};

const CATEGORY_MAP: Record<string, string> = {
  "botox-consent-bundle": "Clinical Forms",
  "filler-consent-bundle": "Clinical Forms",
  "weight-loss-kit": "Clinical Forms",
  "lash-aftercare-kit": "Clinical Forms",
  "peptide-patient-guide": "Clinical Forms",
  "combo-bundle": "Bundles",
  "hipaa-compliance-kit": "Compliance",
  "microneedling-consent-bundle": "Clinical Forms",
  "chemical-peel-consent-bundle": "Clinical Forms",
  "client-welcome-packet": "Practice Management",
  "medspa-startup-checklist": "Practice Management",
  "med-spa-starter-kit": "Practice Management",
  "treatment-pricing-menu": "Practice Management",
  "med-spa-legal-startup-bundle": "Legal",
  "injectors-playbook": "Playbooks",
  "facial-training-manual": "Playbooks",
  "new-injector-onboarding-kit": "Playbooks",
  "guidebook-category-strategy": "Playbooks",
  "microblading-pmu-playbook": "Playbooks",
  "treatment-menu-signage-kit": "Practice Management",
  "aftercare-card-kit": "Clinical Forms",
  "patient-communication-kit": "Practice Management",
  "google-domination-playbook": "Playbooks",
  "medspa-social-media-system": "Playbooks",
  "medspa-content-strategy-system": "Playbooks",
  "hormone-therapy-playbook": "Playbooks",
  "peptide-therapy-playbook": "Playbooks",
  "patient-loyalty-system": "Practice Management",
  "botox-patient-journey-kit": "Clinical Forms",
  "filler-patient-journey-kit": "Clinical Forms",
  "glp1-patient-journey-kit": "Clinical Forms",
  "iv-therapy-patient-journey-kit": "Clinical Forms",
  "microneedling-patient-journey-kit": "Clinical Forms",
  "chemical-peel-patient-journey-kit": "Clinical Forms",
  "hormone-patient-journey-kit": "Clinical Forms",
  "peptide-patient-journey-kit": "Clinical Forms",
  "medical-disclaimer-system": "Legal",
  "diy-google-setup-kit": "Bundles",
  "insurance-legal-compliance-guide": "Business Systems",
  "phase-2-business-bundle": "Business Systems",
  "difficult-client-scripts": "Business Systems",
  "before-after-photo-system": "Business Systems",
  "vendor-supplier-directory": "Business Systems",
  "facial-anatomy-nurse-injector": "Business Systems",
  "npa-49-star-system": "Business Systems",
  "botox-clinical-cheat-sheet": "Cheat Sheets",
  "iv-therapy-clinical-cheat-sheet": "Cheat Sheets",
  "peptide-therapy-clinical-cheat-sheet": "Cheat Sheets",
  "hormone-therapy-clinical-cheat-sheet": "Cheat Sheets",
  "glp1-clinical-cheat-sheet": "Cheat Sheets",
  "dermal-filler-clinical-cheat-sheet": "Cheat Sheets",
  "pellet-therapy-clinical-cheat-sheet": "Cheat Sheets",
  "pharmaceutical-reference-cheat-sheet": "Cheat Sheets",
  "olympia-iv-dosing-guide-cheat-sheet": "Cheat Sheets",
  "lash-extensions-clinical-cheat-sheet": "Cheat Sheets",
  "lash-lift-perm-clinical-cheat-sheet": "Cheat Sheets",
  "brow-henna-clinical-cheat-sheet": "Cheat Sheets",
  "waxing-clinical-cheat-sheet": "Cheat Sheets",
  "ipl-laser-clinical-cheat-sheet": "Cheat Sheets",
  "lip-filler-anatomy-cheat-sheet": "Cheat Sheets",
  "botox-dosing-zones-cheat-sheet": "Cheat Sheets",
  "cannula-vs-needle-cheat-sheet": "Cheat Sheets",
  "filler-product-comparison-cheat-sheet": "Cheat Sheets",
  "vascular-occlusion-protocol-cheat-sheet": "Cheat Sheets",
  "tirzepatide-vs-semaglutide-cheat-sheet": "Cheat Sheets",
  "glp1-titration-cheat-sheet": "Cheat Sheets",
  "hormone-lab-reference-cheat-sheet": "Cheat Sheets",
  "pellet-therapy-dosing-cheat-sheet": "Cheat Sheets",
  "trt-men-vs-women-cheat-sheet": "Cheat Sheets",
  "chemical-peel-reference-cheat-sheet": "Cheat Sheets",
  "fitzpatrick-classification-cheat-sheet": "Cheat Sheets",
  "microneedling-depth-cheat-sheet": "Cheat Sheets",
  "laser-wavelength-reference-cheat-sheet": "Cheat Sheets",
  "skincare-ingredient-interactions-cheat-sheet": "Cheat Sheets",
  "retail-pricing-formula-cheat-sheet": "Cheat Sheets",
  "membership-pricing-calculator-cheat-sheet": "Cheat Sheets",
  "staff-roles-cheat-sheet": "Cheat Sheets",
  "new-patient-intake-cheat-sheet": "Cheat Sheets",
  "treatment-room-setup-cheat-sheet": "Cheat Sheets",
  "injection-techniques-cheat-sheet": "Cheat Sheets",
  "consent-botox-neurotoxins": "Clinical Forms",
  "consent-dermal-filler": "Clinical Forms",
  "consent-glp1-weight-loss": "Clinical Forms",
  "consent-hormone-therapy": "Clinical Forms",
  "consent-iv-im-therapy": "Clinical Forms",
  "consent-laser-ipl": "Clinical Forms",
  "consent-lash-extensions": "Clinical Forms",
  "consent-waxing": "Clinical Forms",
  "consent-microneedling-rf": "Clinical Forms",
  "consent-photography-hipaa": "Clinical Forms",
  "botox-social-bundle": "Social Media",
  "filler-social-bundle": "Social Media",
  "complete-injector-bundle": "Social Media",
  "medspa-promo-pack": "Social Media",
  "myths-facts-injectors": "Social Media",
  "new-patient-membership-pack": "Social Media",
  "review-testimonial-pack": "Social Media",
  "seasonal-marketing-pack": "Social Media",
  "iv-therapy-social-kit": "Social Media",
  "iv-story-templates": "Social Media",
  "glp1-story-templates": "Social Media",
  "31-day-social-media-content-calendar": "Social Media",
  "peptide-canva-marketing-pack": "Social Media",
};

const PRICE_MAP: Record<string, number> = {
  "iv-therapy-social-kit": 4700,
  "weight-loss-kit": 5700,
  "combo-bundle": 6700,
  "med-spa-legal-startup-bundle": 19700,
  "complete-injector-bundle": 7700,
  "botox-consent-bundle": 3700,
  "filler-consent-bundle": 3700,
  "lash-aftercare-kit": 2700,
  "peptide-patient-guide": 3700,
  "hipaa-compliance-kit": 4700,
  "microneedling-consent-bundle": 2700,
  "chemical-peel-consent-bundle": 2700,
  "client-welcome-packet": 2700,
  "medspa-startup-checklist": 2700,
  "med-spa-starter-kit": 5900,
  "treatment-pricing-menu": 1900,
  "botox-social-bundle": 5700,
  "filler-social-bundle": 5700,
  "medspa-promo-pack": 2700,
  "myths-facts-injectors": 2700,
  "new-patient-membership-pack": 2700,
  "review-testimonial-pack": 2700,
  "seasonal-marketing-pack": 2700,
  "iv-story-templates": 2700,
  "glp1-story-templates": 2700,
  "31-day-social-media-content-calendar": 4700,
  "peptide-canva-marketing-pack": 6700,
  "injectors-playbook": 12700,
  "facial-training-manual": 1000,
  "new-injector-onboarding-kit": 6700,
  "guidebook-category-strategy": 4700,
  "microblading-pmu-playbook": 12700,
  "treatment-menu-signage-kit": 4700,
  "aftercare-card-kit": 3700,
  "patient-communication-kit": 4700,
  "google-domination-playbook": 12700,
  "medspa-social-media-system": 14700,
  "medspa-content-strategy-system": 14700,
  "hormone-therapy-playbook": 12700,
  "peptide-therapy-playbook": 12700,
  "patient-loyalty-system": 9700,
  "botox-patient-journey-kit": 6700,
  "filler-patient-journey-kit": 6700,
  "glp1-patient-journey-kit": 6700,
  "iv-therapy-patient-journey-kit": 5700,
  "microneedling-patient-journey-kit": 5700,
  "chemical-peel-patient-journey-kit": 5700,
  "hormone-patient-journey-kit": 6700,
  "peptide-patient-journey-kit": 6700,
  "medical-disclaimer-system": 4700,
  "diy-google-setup-kit": 29700,
  "insurance-legal-compliance-guide": 4700,
  "phase-2-business-bundle": 4700,
  "difficult-client-scripts": 4700,
  "before-after-photo-system": 4700,
  "vendor-supplier-directory": 4700,
  "facial-anatomy-nurse-injector": 6700,
  "npa-49-star-system": 5700,
  "botox-clinical-cheat-sheet": 1000,
  "iv-therapy-clinical-cheat-sheet": 1000,
  "peptide-therapy-clinical-cheat-sheet": 1000,
  "hormone-therapy-clinical-cheat-sheet": 1000,
  "glp1-clinical-cheat-sheet": 1000,
  "dermal-filler-clinical-cheat-sheet": 1000,
  "pellet-therapy-clinical-cheat-sheet": 1000,
  "pharmaceutical-reference-cheat-sheet": 1000,
  "olympia-iv-dosing-guide-cheat-sheet": 1000,
  "lash-extensions-clinical-cheat-sheet": 1000,
  "lash-lift-perm-clinical-cheat-sheet": 1000,
  "brow-henna-clinical-cheat-sheet": 1000,
  "waxing-clinical-cheat-sheet": 1000,
  "ipl-laser-clinical-cheat-sheet": 1000,
  "lip-filler-anatomy-cheat-sheet": 1000,
  "botox-dosing-zones-cheat-sheet": 1000,
  "cannula-vs-needle-cheat-sheet": 1000,
  "filler-product-comparison-cheat-sheet": 1000,
  "vascular-occlusion-protocol-cheat-sheet": 1000,
  "tirzepatide-vs-semaglutide-cheat-sheet": 1000,
  "glp1-titration-cheat-sheet": 1000,
  "hormone-lab-reference-cheat-sheet": 1000,
  "pellet-therapy-dosing-cheat-sheet": 1000,
  "trt-men-vs-women-cheat-sheet": 1000,
  "chemical-peel-reference-cheat-sheet": 1000,
  "fitzpatrick-classification-cheat-sheet": 1000,
  "microneedling-depth-cheat-sheet": 1000,
  "laser-wavelength-reference-cheat-sheet": 1000,
  "skincare-ingredient-interactions-cheat-sheet": 1000,
  "retail-pricing-formula-cheat-sheet": 1000,
  "membership-pricing-calculator-cheat-sheet": 1000,
  "staff-roles-cheat-sheet": 1000,
  "new-patient-intake-cheat-sheet": 1000,
  "treatment-room-setup-cheat-sheet": 1000,
  "injection-techniques-cheat-sheet": 1000,
  "consent-botox-neurotoxins": 1900,
  "consent-dermal-filler": 1900,
  "consent-glp1-weight-loss": 1900,
  "consent-hormone-therapy": 1900,
  "consent-iv-im-therapy": 1900,
  "consent-laser-ipl": 1900,
  "consent-lash-extensions": 1900,
  "consent-waxing": 1900,
  "consent-microneedling-rf": 1900,
  "consent-photography-hipaa": 1900,
};

const FEATURED_SLUGS = new Set([
  INFORMED_BEAUTY_GUIDE_SLUG,
  "medspa-social-media-system",
  "medspa-content-strategy-system",
  "hormone-therapy-playbook",
  "peptide-therapy-playbook",
  "diy-google-setup-kit",
  "injectors-playbook",
  "facial-training-manual",
  "new-injector-onboarding-kit",
  "google-domination-playbook",
  "iv-therapy-social-kit",
  "weight-loss-kit",
  "combo-bundle",
  "med-spa-legal-startup-bundle",
  "complete-injector-bundle",
  "botox-consent-bundle",
  "facial-anatomy-nurse-injector",
  "npa-49-star-system",
  "peptide-canva-marketing-pack",
  "med-spa-starter-kit",
]);

const STRIPE_PRICE_IDS: Record<string, string> = {};

const AUDIENCE_MAP: Record<string, string[]> = {
  "Clinical Forms": ["Nurse injectors", "Med spa owners", "Practice managers", "NPs and PAs"],
  "Social Media": ["Aesthetic providers", "Med spa marketing teams", "Nurse practitioners", "Beauty entrepreneurs"],
  "Legal": ["Med spa owners", "Practice managers", "Attorneys advising aesthetic practices", "Startup founders"],
  "Compliance": ["Compliance officers", "Practice managers", "Med spa owners", "HIPAA coordinators"],
  "Practice Management": ["Office managers", "New practice owners", "Front desk staff", "Practice administrators"],
  "Bundles": ["Med spa owners", "Multi-service clinics", "Aesthetic suite providers"],
  "Playbooks": ["Nurse injectors", "NPs starting aesthetic practice", "Med spa owners hiring injectors", "Practice managers"],
  "Cheat Sheets": [
    "Injectors at the chair",
    "Lash and brow artists",
    "Estheticians and laser techs",
    "Busy treatment rooms",
  ],
  "Business Systems": [
    "Nurse injectors",
    "Med spa owners",
    "Esthetic entrepreneurs",
    "Solo providers scaling up",
    "Practice managers navigating insurance and compliance",
  ],
  "Patient education": [
    "Patients and clients researching aesthetic care",
    "Anyone investing in skin, injectables, or wellness",
    "People who want confident questions at consultations",
  ],
};

/** Map from slug to the asset subdirectory name in etsy-products/store-launch/assets/ */
const ASSET_DIR_MAP: Record<string, string> = {
  "botox-consent-bundle": "botox",
  "botox-social-bundle": "botox",
  "filler-consent-bundle": "filler",
  "filler-social-bundle": "filler",
  "combo-bundle": "combo-bundle",
  "complete-injector-bundle": "complete-injector",
  "iv-therapy-social-kit": "iv-therapy",
  "iv-story-templates": "iv-therapy",
  "lash-aftercare-kit": "lash",
  "weight-loss-kit": "weight-loss",
  "glp1-story-templates": "weight-loss",
  "injectors-playbook": "playbooks",
  "facial-training-manual": "playbooks",
  "new-injector-onboarding-kit": "playbooks",
  "guidebook-category-strategy": "playbooks",
  "microblading-pmu-playbook": "playbooks",
  "treatment-menu-signage-kit": "kits",
  "aftercare-card-kit": "kits",
  "patient-communication-kit": "kits",
  "google-domination-playbook": "playbooks",
  "medspa-social-media-system": "playbooks",
  "medspa-content-strategy-system": "playbooks",
  "hormone-therapy-playbook": "playbooks",
  "peptide-therapy-playbook": "playbooks",
  "patient-loyalty-system": "kits",
  "botox-patient-journey-kit": "kits",
  "filler-patient-journey-kit": "kits",
  "glp1-patient-journey-kit": "kits",
  "iv-therapy-patient-journey-kit": "kits",
  "microneedling-patient-journey-kit": "kits",
  "chemical-peel-patient-journey-kit": "kits",
  "hormone-patient-journey-kit": "kits",
  "peptide-patient-journey-kit": "kits",
  "medical-disclaimer-system": "kits",
  "diy-google-setup-kit": "kits",
  "med-spa-starter-kit": "kits",
};

const CATEGORY_THUMBNAIL: Record<string, string> = {
  "Social Media": "/shop-previews/default/default-thumbnail.png",
  "Clinical Forms": "/shop-previews/default/clinical-forms.png",
  "Legal": "/shop-previews/default/legal.png",
  "Compliance": "/shop-previews/default/clinical-forms.png",
  "Practice Management": "/shop-previews/default/clinical-forms.png",
  "Bundles": "/shop-previews/default/default-thumbnail.png",
  "Playbooks": "/shop-previews/playbooks/npa-playbook-botox-filler.png",
  "Cheat Sheets": "/shop-previews/cheat-sheets/botox-clinical-cheat-sheet.png",
  "Business Systems": "/shop-previews/default/legal.png",
};

const SLUG_THUMBNAIL: Record<string, string> = {
  "medspa-social-media-system": "/shop-previews/playbooks/npa-thumbnail-social-media-system.png",
  "medspa-content-strategy-system": "/shop-previews/playbooks/npa-thumbnail-content-strategy.png",
  "hormone-therapy-playbook": "/shop-previews/playbooks/npa-playbook-hormone-therapy.png",
  "peptide-therapy-playbook": "/shop-previews/playbooks/npa-playbook-peptide-therapy.png",
  "peptide-canva-marketing-pack": "/shop-previews/playbooks/npa-playbook-peptide-therapy.png",
  "diy-google-setup-kit": "/shop-previews/kits/npa-thumbnail-diy-google-kit.png",
  "treatment-menu-signage-kit": "/shop-previews/kits/npa-thumbnail-treatment-menu-kit.png",
  "aftercare-card-kit": "/shop-previews/kits/npa-thumbnail-aftercare-cards.png",
  "patient-communication-kit": "/shop-previews/kits/npa-thumbnail-patient-communication.png",
  "botox-clinical-cheat-sheet": "/shop-previews/cheat-sheets/botox-clinical-cheat-sheet.png",
  "iv-therapy-clinical-cheat-sheet": "/shop-previews/cheat-sheets/iv-therapy-clinical-cheat-sheet.png",
  "peptide-therapy-clinical-cheat-sheet": "/shop-previews/cheat-sheets/peptide-therapy-clinical-cheat-sheet.png",
  "hormone-therapy-clinical-cheat-sheet": "/shop-previews/cheat-sheets/hormone-therapy-clinical-cheat-sheet.png",
  "glp1-clinical-cheat-sheet": "/shop-previews/cheat-sheets/glp1-clinical-cheat-sheet.png",
  "dermal-filler-clinical-cheat-sheet": "/shop-previews/cheat-sheets/dermal-filler-clinical-cheat-sheet.png",
  "pellet-therapy-clinical-cheat-sheet": "/shop-previews/cheat-sheets/pellet-therapy-clinical-cheat-sheet.png",
  "pharmaceutical-reference-cheat-sheet": "/shop-previews/cheat-sheets/pharmaceutical-reference-cheat-sheet.png",
  "olympia-iv-dosing-guide-cheat-sheet": "/shop-previews/cheat-sheets/olympia-iv-dosing-guide-cheat-sheet.png",
  "lash-extensions-clinical-cheat-sheet": "/shop-previews/cheat-sheets/lash-extensions-clinical-cheat-sheet.png",
  "lash-lift-perm-clinical-cheat-sheet": "/shop-previews/cheat-sheets/lash-lift-perm-clinical-cheat-sheet.png",
  "brow-henna-clinical-cheat-sheet": "/shop-previews/cheat-sheets/brow-henna-clinical-cheat-sheet.png",
  "waxing-clinical-cheat-sheet": "/shop-previews/cheat-sheets/waxing-clinical-cheat-sheet.png",
  "ipl-laser-clinical-cheat-sheet": "/shop-previews/cheat-sheets/ipl-laser-clinical-cheat-sheet.png",
  "injection-techniques-cheat-sheet": "/shop-previews/cheat-sheets/injection-techniques-cheat-sheet.png",
  "consent-botox-neurotoxins": "/shop-previews/standalone-consents/consent-botox-neurotoxins.png",
  "consent-dermal-filler": "/shop-previews/standalone-consents/consent-dermal-filler.png",
  "consent-glp1-weight-loss": "/shop-previews/standalone-consents/consent-glp1-weight-loss.png",
  "consent-hormone-therapy": "/shop-previews/standalone-consents/consent-hormone-therapy.png",
  "consent-iv-im-therapy": "/shop-previews/standalone-consents/consent-iv-im-therapy.png",
  "consent-laser-ipl": "/shop-previews/standalone-consents/consent-laser-ipl.png",
  "consent-lash-extensions": "/shop-previews/standalone-consents/consent-lash-extensions.png",
  "consent-waxing": "/shop-previews/standalone-consents/consent-waxing.png",
  "consent-microneedling-rf": "/shop-previews/standalone-consents/consent-microneedling-rf.png",
  "consent-photography-hipaa": "/shop-previews/standalone-consents/consent-photography-hipaa.png",
  "31-day-social-media-content-calendar": "/shop-previews/social-media/31-day-social-media-content-calendar.png",
  "insurance-legal-compliance-guide": "/shop-previews/business-systems/insurance-legal-compliance-guide.png",
  "phase-2-business-bundle": "/shop-previews/business-systems/phase-2-business-bundle.png",
  "difficult-client-scripts": "/shop-previews/business-systems/difficult-client-scripts.png",
  "before-after-photo-system": "/shop-previews/business-systems/before-after-photo-system.png",
  "vendor-supplier-directory": "/shop-previews/business-systems/vendor-supplier-directory.png",
  "med-spa-starter-kit": "/shop-previews/playbooks/npa-promo-med-spa-starter-kit.png",
  "facial-anatomy-nurse-injector": "/shop-previews/playbooks/npa-promo-facial-anatomy-nurse-injector.png",
  "npa-49-star-system": "/shop-previews/playbooks/npa-thumbnail-social-media-system.png",
};

const NICHE_THUMBNAIL: Record<string, string> = {
  "weight-loss": "/shop-previews/default/weight-loss.png",
  "iv-therapy": "/shop-previews/default/iv-therapy.png",
  "med-spa": "/shop-previews/default/default-thumbnail.png",
};

function discoverPreviewImages(slug: string, category: string): string[] {
  const assetDir = ASSET_DIR_MAP[slug];
  if (assetDir) {
    const publicDir = path.join(process.cwd(), "public", "shop-previews", assetDir);
    if (fs.existsSync(publicDir)) {
      const files = fs
        .readdirSync(publicDir)
        .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
        .sort()
        .map((f) => `/shop-previews/${assetDir}/${f}`);
      if (files.length > 0) return files;
    }
  }

  const slugFallback = SLUG_THUMBNAIL[slug];
  if (slugFallback) return [slugFallback];

  const nichePrefix = slug.split("-").slice(0, 2).join("-");
  const nicheFallback = NICHE_THUMBNAIL[nichePrefix];
  if (nicheFallback) return [nicheFallback];

  const catFallback = CATEGORY_THUMBNAIL[category];
  if (catFallback) return [catFallback];

  return ["/shop-previews/default/default-thumbnail.png"];
}

function buildFeatures(slug: string, count: number): string[] {
  if (slug === "peptide-canva-marketing-pack") {
    return [
      "Three Canva-oriented suites: flyers, catalog, and vial-style labels (each opens from a hub page)",
      "Set your real Canva “use template” URL in each hub HTML (CANVA_EDIT_URL) before or after deploy",
      "Medical director and legal review recommended for patient-facing and product claims",
      "Instant digital delivery",
    ];
  }
  const base = [`${count} editable templates`, "Instant digital delivery", "Print-ready format"];
  const cat = CATEGORY_MAP[slug] || "General";
  if (cat === "Clinical Forms") base.push("HIPAA-aware documentation");
  if (cat === "Social Media") base.push("1080x1080 Instagram-ready");
  if (cat === "Legal") base.push("Attorney-review recommended");
  if (cat === "Compliance") base.push("Audit-ready documentation");
  if (cat === "Practice Management") base.push("Customizable for your practice");
  if (cat === "Bundles") base.push("Best value — multiple categories");
  if (cat === "Playbooks") {
    return [
      "Written by Danielle Alcala",
      "Real consultation scripts — word for word",
      "Clinical protocols you can use tomorrow",
      "Interactive HTML — works on any device",
      "Instant digital delivery",
    ];
  }
  if (cat === "Cheat Sheets") {
    return [
      "Added bonus: A-to-Z visit flow — scan top to bottom through chart → treatment → documentation → room reset",
      "One-page clinical quick reference",
      "Print or keep on a tablet at the chair",
      "Instant digital delivery",
      "HTML — open in any browser",
    ];
  }
  if (cat === "Business Systems") {
    if (slug === "insurance-legal-compliance-guide") {
      return [
        "Framework from Danielle Alcala — 10+ years in med spa & esthetics",
        "Not legal advice — consult a licensed attorney",
        "Cover disclaimer + footer on every page",
        "Interactive HTML — print or PDF from your browser",
        "Instant digital delivery",
      ];
    }
    if (slug === "facial-anatomy-nurse-injector") {
      return [
        "Facial anatomy built for nurse injectors — layers, vectors, danger zones",
        "Danielle Alcala — clinical voice from the treatment room",
        "Interactive HTML — print or save as PDF",
        "Educational reference — not a substitute for supervised training",
        "Instant digital delivery",
      ];
    }
    if (slug === "npa-49-star-system") {
      return [
        "Danielle Alcala — 10+ years building a real 4.9-star Google reputation",
        "Review asks, 24-hour bad-review protocol, HIPAA-safe public responses",
        "Scripts for unhappy patients, pricing complaints, fake reviews & platforms",
        "30-day review sprint + weekly reputation routine — print-ready HTML",
        "Instant digital delivery",
      ];
    }
    return [
      "Operations and systems content for med spa & esthetic businesses",
      "Interactive HTML — print or save as PDF from your browser",
      "Customize with your practice branding and policies",
      "Instant digital delivery",
    ];
  }
  return base;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

function buildShortDescription(slug: string, _title: string, count: number): string {
  const cat = CATEGORY_MAP[slug] || "General";
  switch (cat) {
    case "Clinical Forms":
      return `${count} professional clinical templates — consent forms, intake documents, and patient education materials ready to print and customize.`;
    case "Social Media":
      if (slug === "peptide-canva-marketing-pack") {
        return `Flagship Canva pack for peptide programs — patient education flyers, a multi-page therapy catalog, and editable label layouts. Brand in Canva; export for print or digital.`;
      }
      return `${count} done-for-you social media templates designed for aesthetic providers. Edit, brand, and post in minutes.`;
    case "Legal":
      return `${count} editable legal and business templates — contracts, agreements, HIPAA forms, and website policies for med spa owners.`;
    case "Compliance":
      return `${count} compliance-ready templates covering HIPAA privacy, staff training, breach protocols, and business associate agreements.`;
    case "Practice Management":
      return `${count} professional templates to streamline your practice — from intake packets to pricing menus.`;
    case "Bundles":
      return `The ultimate value pack — ${count} templates spanning clinical forms, social media, and business essentials.`;
    case "Playbooks":
      if (slug === "facial-training-manual") {
        return `Full facial training manual — consult framework, anatomy, 60-minute protocol, modalities, pre/post scripts, and staff training in one $10 download.`;
      }
      return `Premium clinical education from Danielle Alcala. Real scripts, real protocols, real systems — not theory.`;
    case "Cheat Sheets":
      return `Pocket-style reference you can print or keep on screen between patients — dosing cues, landmarks, and reminders without flipping through a full playbook.`;
    case "Business Systems":
      if (slug === "insurance-legal-compliance-guide") {
        return `Insurance, legal, and compliance roadmap for med spa and esthetic entrepreneurs — practical checklists and framing, not a substitute for an attorney.`;
      }
      if (slug === "facial-anatomy-nurse-injector") {
        return `Full facial anatomy framework for nurse injectors — danger zones, depth cues, and confidence at the needle. Educational reference, not a replacement for supervised training.`;
      }
      if (slug === "npa-49-star-system") {
        return `The complete reputation playbook for med spas and esthetic providers — how Danielle Alcala built and protects a 4.9 on Google after hundreds of reviews.`;
      }
      return `Operations and systems guide for med spa and esthetic businesses — interactive HTML you can customize, print, or keep on screen.`;
    default:
      return `${count} editable templates for aesthetic professionals. Instant download, fully customizable.`;
  }
}

function buildLongDescription(slug: string, title: string, count: number, cat: string): string {
  const short = buildShortDescription(slug, title, count);
  const audienceList = AUDIENCE_MAP[cat] || ["Aesthetic professionals"];
  if (slug === "peptide-canva-marketing-pack") {
    return `${short}\n\nYou receive three delivery links (flyers hub, catalog hub, labels hub). Each hub’s primary button uses CANVA_EDIT_URL — replace the placeholder with your Canva template link so buyers land in their own copy. Confirm label dimensions with your print vendor before production.\n\nDesigned for ${audienceList.join(", ").toLowerCase()}.\n\n${count} hub-linked deliverables. Instant digital delivery. No physical product will be shipped.`;
  }
  if (slug === "facial-training-manual") {
    return `${short}\n\nSeven sections: skin analysis and consultation framework, facial anatomy for esthetic and injectable practice, full 60-minute facial protocol, customization by skin type and condition, advanced modalities, pre/post care with client scripts, and staff training with competency and contraindication reference. Closes with a personal note from Danielle.\n\nEducational use — follow your scope of practice and facility protocols.\n\nBuilt for ${audienceList.join(", ").toLowerCase()}.\n\n${count} interactive HTML manual. Instant digital delivery. No physical product will be shipped.`;
  }
  if (cat === "Cheat Sheets") {
    return `${short}\n\nBuilt for ${audienceList.join(", ").toLowerCase()}. Open in any browser, print for the treatment room, or save as PDF. This is a quick-reference format — not a full course or playbook.\n\n${count} reference file(s). Instant digital delivery. No physical product will be shipped.`;
  }
  if (cat === "Business Systems") {
    if (slug === "insurance-legal-compliance-guide") {
      return `${short}\n\nNot legal advice — consult a licensed attorney for your state and situation. The full guide includes disclaimers on the cover and in the footer of every page.\n\nBuilt for ${audienceList.join(", ").toLowerCase()}. Open in any browser, add your branding where appropriate, print or save as PDF.\n\n${count} interactive guide file. Instant digital delivery. No physical product will be shipped.`;
    }
    if (slug === "facial-anatomy-nurse-injector") {
      return `${short}\n\nEducational use only — follow your scope of practice, supervision requirements, and facility protocols. The full guide includes disclaimers appropriate for clinical reference.\n\nBuilt for ${audienceList.join(", ").toLowerCase()}. Open in any browser, print or save as PDF.\n\n${count} interactive guide file. Instant digital delivery. No physical product will be shipped.`;
    }
    if (slug === "npa-49-star-system") {
      return `${short}\n\nIncludes HIPAA-aware guidance for public review responses (not legal advice — consult your attorney for specific situations). Open in any browser, print or save as PDF.\n\nBuilt for ${audienceList.join(", ").toLowerCase()}.\n\n${count} interactive guide file. Instant digital delivery. No physical product will be shipped.`;
    }
    return `${short}\n\nBuilt for ${audienceList.join(", ").toLowerCase()}. Open in any browser, customize for your practice, print or save as PDF.\n\n${count} interactive guide file. Instant digital delivery. No physical product will be shipped.`;
  }
  return `${short}\n\nDesigned for ${audienceList.join(", ").toLowerCase()}. All templates are fully editable — add your practice name, logo, and contact information. Print directly from your browser or save as PDF.\n\nIncludes ${count} templates with instant digital delivery. No physical product will be shipped.`;
}

let _products: ShopProduct[] | null = null;

export function getShopProducts(): ShopProduct[] {
  if (_products) return _products;

  const catalogProducts = (catalog as { products?: CatalogProduct[] }).products || [];

  const comboEntry = catalogProducts.find((c) => c.productSlug === "combo-bundle");

  _products = catalogProducts.map((cp) => {
    const slug = cp.productSlug;
    let priceCents = PRICE_MAP[slug] || 2700;
    const category = CATEGORY_MAP[slug] || "General";
    const tierId = getBundleTierIdForSlug(slug);
    if (tierId) {
      priceCents = BUNDLE_TIER_PRICE_CENTS[tierId];
    }

    const tierCompare = tierId ? BUNDLE_TIER_COMPARE_AT_CENTS[tierId] : undefined;
    let compareAtCents: number | null =
      typeof tierCompare === "number" && tierCompare > priceCents ? tierCompare : null;

    const base: ShopProduct = {
      slug,
      title: cp.productTitle,
      shortDescription: buildShortDescription(slug, cp.productTitle, cp.templateCount),
      longDescription: buildLongDescription(slug, cp.productTitle, cp.templateCount, category),
      priceCents,
      priceDisplay: formatPrice(priceCents),
      templateCount: cp.templateCount,
      category,
      features: buildFeatures(slug, cp.templateCount),
      featured: FEATURED_SLUGS.has(slug),
      stripePriceId: STRIPE_PRICE_IDS[slug] || null,
      previewImages: discoverPreviewImages(slug, category),
      audience: AUDIENCE_MAP[category] || ["Aesthetic professionals"],
    };

    if (tierId) {
      const def = getBundleTierDefinition(tierId);
      base.bundleTierId = tierId;
      base.bundleTierTitle = def.title;
      base.bundleTierShortLabel = def.shortLabel;
      base.bundleTierAnchorLabel = def.anchorLabel;
      base.bundleTierBadge = def.badge;
      base.bundleTierEmphasis = def.emphasis;
    }

    if (compareAtCents != null) {
      base.compareAtCents = compareAtCents;
      base.compareAtDisplay = formatPrice(compareAtCents);
    }

    return base;
  });

  const hasGrowthSystem = _products.some((p) => p.slug === GROWTH_SYSTEM_SLUG);
  if (!hasGrowthSystem) {
    const gsTier = getBundleTierIdForSlug(GROWTH_SYSTEM_SLUG);
    const gsDef = gsTier ? getBundleTierDefinition(gsTier) : null;
    const templateCount = Math.max(
      GROWTH_SYSTEM_PRODUCT.templateCountFloor,
      comboEntry?.templateCount ?? 0,
    );
    const gs: ShopProduct = {
      slug: GROWTH_SYSTEM_SLUG,
      title: GROWTH_SYSTEM_PRODUCT.title,
      shortDescription: GROWTH_SYSTEM_PRODUCT.shortDescription,
      longDescription: `${GROWTH_SYSTEM_PRODUCT.shortDescription}\n\n${templateCount}+ templates and assets delivered as the full NPA Growth System stack. Instant digital delivery after checkout.`,
      priceCents: GROWTH_SYSTEM_PRODUCT.priceCents,
      priceDisplay: formatPrice(GROWTH_SYSTEM_PRODUCT.priceCents),
      templateCount,
      category: "Bundles",
      features: buildFeatures("combo-bundle", templateCount),
      featured: true,
      stripePriceId: null,
      previewImages: discoverPreviewImages("combo-bundle", "Bundles"),
      audience: AUDIENCE_MAP["Bundles"] ?? ["Med spa owners", "Multi-service clinics"],
      bundleTierId: "mega",
      bundleTierTitle: gsDef?.title,
      bundleTierShortLabel: gsDef?.shortLabel,
      bundleTierAnchorLabel: gsDef?.anchorLabel,
      bundleTierBadge: gsDef?.badge ?? null,
      bundleTierEmphasis: gsDef?.emphasis ?? "best_value",
      compareAtCents: GROWTH_SYSTEM_PRODUCT.compareAtCents,
      compareAtDisplay: formatPrice(GROWTH_SYSTEM_PRODUCT.compareAtCents),
    };
    _products.push(gs);
  }

  const hasInformedBeauty = _products.some((p) => p.slug === INFORMED_BEAUTY_GUIDE_SLUG);
  if (!hasInformedBeauty) {
    const ibg: ShopProduct = {
      slug: INFORMED_BEAUTY_GUIDE_SLUG,
      title: INFORMED_BEAUTY_TITLE,
      shortDescription:
        "Take control of your aesthetic and wellness care — 11 plain-English sections on skin, injectables, GLP-1, hormones, labs, IVs, peptides, and more. Built from 10+ years in a real med spa.",
      longDescription: `${INFORMED_BEAUTY_TITLE} is a complete patient education system — not fluffy beauty tips. Danielle Alcala wrote it from thousands of real consultations so you can ask better questions, spot red flags, and understand what you’re paying for.\n\nOne download: full book plus all 11 sections in a single HTML file — sticky nav by topic, print / Save as PDF in the browser. Instant delivery after checkout. For education only — not medical advice; always work with a licensed provider for your care.`,
      priceCents: INFORMED_BEAUTY_PRICE_CENTS,
      priceDisplay: formatPrice(INFORMED_BEAUTY_PRICE_CENTS),
      templateCount: 1,
      category: "Patient education",
      features: [
        "One HTML file — sticky top nav across all 11 sections (book + cheat sheets); print or save as PDF",
        "Written by Danielle Alcala — Hello Gorgeous Med Spa & No Prior Authorization",
        "Instant download — read on phone, tablet, or print",
        "Lifetime access — refer back before every appointment",
        "Educational only — not a substitute for your own clinician",
      ],
      featured: true,
      stripePriceId: null,
      previewImages: ["/shop-previews/default/default-thumbnail.png"],
      audience: AUDIENCE_MAP["Patient education"] ?? ["Patients and clients"],
    };
    _products.push(ibg);
  }

  const PIN_FIRST = [INFORMED_BEAUTY_GUIDE_SLUG, GROWTH_SYSTEM_SLUG];
  const pinRank = (slug: string) => {
    const i = PIN_FIRST.indexOf(slug);
    return i === -1 ? 999 : i;
  };

  _products.sort((a, b) => {
    const pa = pinRank(a.slug);
    const pb = pinRank(b.slug);
    if (pa !== pb) return pa - pb;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.priceCents - a.priceCents;
  });

  return _products;
}

export function getShopProductBySlug(slug: string): ShopProduct | undefined {
  return getShopProducts().find((p) => p.slug === slug);
}

export function getShopCategories(): string[] {
  const cats = new Set(getShopProducts().map((p) => p.category));
  return ["All", ...Array.from(cats).sort()];
}
