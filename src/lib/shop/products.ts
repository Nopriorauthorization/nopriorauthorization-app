import fs from "fs";
import path from "path";
import catalog from "@/lib/delivery/catalog.generated.json";

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
  "treatment-pricing-menu": "Practice Management",
  "med-spa-legal-startup-bundle": "Legal",
  "injectors-playbook": "Playbooks",
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
  "injectors-playbook": 12700,
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
};

const FEATURED_SLUGS = new Set([
  "medspa-social-media-system",
  "medspa-content-strategy-system",
  "hormone-therapy-playbook",
  "peptide-therapy-playbook",
  "diy-google-setup-kit",
  "injectors-playbook",
  "new-injector-onboarding-kit",
  "google-domination-playbook",
  "iv-therapy-social-kit",
  "weight-loss-kit",
  "combo-bundle",
  "med-spa-legal-startup-bundle",
  "complete-injector-bundle",
  "botox-consent-bundle",
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
};

const CATEGORY_THUMBNAIL: Record<string, string> = {
  "Social Media": "/shop-previews/default/default-thumbnail.png",
  "Clinical Forms": "/shop-previews/default/clinical-forms.png",
  "Legal": "/shop-previews/default/legal.png",
  "Compliance": "/shop-previews/default/clinical-forms.png",
  "Practice Management": "/shop-previews/default/clinical-forms.png",
  "Bundles": "/shop-previews/default/default-thumbnail.png",
  "Playbooks": "/shop-previews/playbooks/npa-playbook-botox-filler.png",
};

const SLUG_THUMBNAIL: Record<string, string> = {
  "medspa-social-media-system": "/shop-previews/playbooks/npa-thumbnail-social-media-system.png",
  "medspa-content-strategy-system": "/shop-previews/playbooks/npa-thumbnail-content-strategy.png",
  "hormone-therapy-playbook": "/shop-previews/playbooks/npa-playbook-hormone-therapy.png",
  "peptide-therapy-playbook": "/shop-previews/playbooks/npa-playbook-peptide-therapy.png",
  "diy-google-setup-kit": "/shop-previews/kits/npa-thumbnail-diy-google-kit.png",
  "treatment-menu-signage-kit": "/shop-previews/kits/npa-thumbnail-treatment-menu-kit.png",
  "aftercare-card-kit": "/shop-previews/kits/npa-thumbnail-aftercare-cards.png",
  "patient-communication-kit": "/shop-previews/kits/npa-thumbnail-patient-communication.png",
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
      "Written by Ryan Kent, FNP-BC",
      "Real consultation scripts — word for word",
      "Clinical protocols you can use tomorrow",
      "Interactive HTML — works on any device",
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
      return `Premium clinical education from Ryan Kent, FNP-BC. Real scripts, real protocols, real systems — not theory.`;
    default:
      return `${count} editable templates for aesthetic professionals. Instant download, fully customizable.`;
  }
}

function buildLongDescription(slug: string, title: string, count: number, cat: string): string {
  const short = buildShortDescription(slug, title, count);
  const audienceList = AUDIENCE_MAP[cat] || ["Aesthetic professionals"];
  return `${short}\n\nDesigned for ${audienceList.join(", ").toLowerCase()}. All templates are fully editable — add your practice name, logo, and contact information. Print directly from your browser or save as PDF.\n\nIncludes ${count} templates with instant digital delivery. No physical product will be shipped.`;
}

let _products: ShopProduct[] | null = null;

export function getShopProducts(): ShopProduct[] {
  if (_products) return _products;

  const catalogProducts = (catalog as { products?: CatalogProduct[] }).products || [];

  _products = catalogProducts.map((cp) => {
    const slug = cp.productSlug;
    const priceCents = PRICE_MAP[slug] || 2700;
    const category = CATEGORY_MAP[slug] || "General";
    return {
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
  });

  _products.sort((a, b) => {
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
