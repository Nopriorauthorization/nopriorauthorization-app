import catalog from "@/lib/delivery/catalog.generated.json";

export type ShopProduct = {
  slug: string;
  title: string;
  shortDescription: string;
  priceCents: number;
  priceDisplay: string;
  templateCount: number;
  category: string;
  features: string[];
  featured: boolean;
  stripePriceId: string | null;
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
};

const FEATURED_SLUGS = new Set([
  "iv-therapy-social-kit",
  "weight-loss-kit",
  "combo-bundle",
  "med-spa-legal-startup-bundle",
  "complete-injector-bundle",
  "botox-consent-bundle",
]);

const STRIPE_PRICE_IDS: Record<string, string> = {};

function buildFeatures(slug: string, count: number): string[] {
  const base = [`${count} editable templates`, "Instant digital delivery", "Print-ready format"];
  const cat = CATEGORY_MAP[slug] || "General";
  if (cat === "Clinical Forms") base.push("HIPAA-aware documentation");
  if (cat === "Social Media") base.push("1080x1080 Instagram-ready");
  if (cat === "Legal") base.push("Attorney-review recommended");
  if (cat === "Compliance") base.push("Audit-ready documentation");
  if (cat === "Practice Management") base.push("Customizable for your practice");
  return base;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

function buildShortDescription(slug: string, title: string, count: number): string {
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
    default:
      return `${count} editable templates for aesthetic professionals. Instant download, fully customizable.`;
  }
}

let _products: ShopProduct[] | null = null;

export function getShopProducts(): ShopProduct[] {
  if (_products) return _products;

  const catalogProducts = (catalog as { products?: CatalogProduct[] }).products || [];

  _products = catalogProducts.map((cp) => {
    const slug = cp.productSlug;
    const priceCents = PRICE_MAP[slug] || 2700;
    return {
      slug,
      title: cp.productTitle,
      shortDescription: buildShortDescription(slug, cp.productTitle, cp.templateCount),
      priceCents,
      priceDisplay: formatPrice(priceCents),
      templateCount: cp.templateCount,
      category: CATEGORY_MAP[slug] || "General",
      features: buildFeatures(slug, cp.templateCount),
      featured: FEATURED_SLUGS.has(slug),
      stripePriceId: STRIPE_PRICE_IDS[slug] || null,
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
