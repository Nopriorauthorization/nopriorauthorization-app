import type { ShopProduct } from "@/lib/shop/products";

export type ShopFamily = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  /** Preferred display order (entry → premium). Missing SKUs are skipped at runtime. */
  productSlugs: string[];
};

/**
 * Collection hubs — like Etsy category pages: one story, many purchasable SKUs.
 * Edit `productSlugs` to add/remove items; unknown slugs are ignored when resolving.
 */
export const SHOP_FAMILIES: ShopFamily[] = [
  {
    slug: "weight-loss-glp1",
    title: "Weight loss & GLP-1",
    subtitle: "GLP-1 marketing, consents & patient education",
    description:
      "From quick clinical references to full story packs and journey kits — pick a single asset or stack several for a complete weight-loss program launch.",
    productSlugs: [
      "glp1-clinical-cheat-sheet",
      "consent-glp1-weight-loss",
      "glp1-patient-journey-kit",
      "glp1-story-templates",
      "weight-loss-kit",
    ],
  },
  {
    slug: "iv-therapy",
    title: "IV therapy",
    subtitle: "Drips, social content & documentation",
    description:
      "Cheat sheets at the chair, consent templates, patient journey assets, and high-volume social kits for your infusion menu.",
    productSlugs: [
      "iv-therapy-clinical-cheat-sheet",
      "consent-iv-im-therapy",
      "iv-therapy-patient-journey-kit",
      "iv-story-templates",
      "iv-therapy-social-kit",
    ],
  },
  {
    slug: "botox-filler-injectables",
    title: "Botox, filler & injectables",
    subtitle: "Consents, social bundles & journey kits",
    description:
      "Everything for neurotoxin and dermal filler lines: standalone consents, full bundles, Instagram-ready posts, and patient-facing journey PDFs.",
    productSlugs: [
      "consent-botox-neurotoxins",
      "consent-dermal-filler",
      "botox-clinical-cheat-sheet",
      "dermal-filler-clinical-cheat-sheet",
      "botox-patient-journey-kit",
      "filler-patient-journey-kit",
      "botox-consent-bundle",
      "filler-consent-bundle",
      "botox-social-bundle",
      "filler-social-bundle",
    ],
  },
  {
    slug: "social-content",
    title: "Social & content systems",
    subtitle: "Calendars, bundles & done-for-you posts",
    description:
      "When you need volume and consistency: multi-month systems, mega bundles, promo packs, and myth-busting content your audience actually saves.",
    productSlugs: [
      "31-day-social-media-content-calendar",
      "medspa-promo-pack",
      "myths-facts-injectors",
      "new-patient-membership-pack",
      "review-testimonial-pack",
      "seasonal-marketing-pack",
      "complete-injector-bundle",
      "medspa-social-media-system",
      "medspa-content-strategy-system",
      "combo-bundle",
    ],
  },
  {
    slug: "legal-compliance",
    title: "Legal & compliance",
    subtitle: "Startup legal, HIPAA & disclaimers",
    description:
      "High-stakes documentation: from opening-day legal bundles to HIPAA kits and disclaimer systems your attorney can review.",
    productSlugs: [
      "medical-disclaimer-system",
      "insurance-legal-compliance-guide",
      "hipaa-compliance-kit",
      "med-spa-legal-startup-bundle",
    ],
  },
  {
    slug: "business-reputation",
    title: "Business, Google & reputation",
    subtitle: "Operations, reviews & local visibility",
    description:
      "Run the practice like a business: Google setup, review strategy, patient comms, loyalty, and Danielle’s real-world reputation playbook.",
    productSlugs: [
      "npa-49-star-system",
      "google-domination-playbook",
      "diy-google-setup-kit",
      "phase-2-business-bundle",
      "difficult-client-scripts",
      "before-after-photo-system",
      "vendor-supplier-directory",
      "patient-communication-kit",
      "patient-loyalty-system",
      "treatment-menu-signage-kit",
      "medspa-startup-checklist",
    ],
  },
  {
    slug: "clinical-playbooks",
    title: "Playbooks & clinical training",
    subtitle: "Protocols, onboarding & premium education",
    description:
      "Deep-dive systems from consultation scripts to specialty playbooks — the tier above templates when you’re building real clinical ops.",
    productSlugs: [
      "facial-anatomy-nurse-injector",
      "injectors-playbook",
      "new-injector-onboarding-kit",
      "guidebook-category-strategy",
      "microblading-pmu-playbook",
      "hormone-therapy-playbook",
      "peptide-therapy-playbook",
    ],
  },
  {
    slug: "hormone-peptide",
    title: "Hormone & peptide services",
    subtitle: "Journeys, consents & chair-side references",
    description:
      "BHRT and peptide program assets: quick cheat sheets, patient journeys, standalone consent, the peptide patient guide, and the flagship Canva marketing pack (flyers, catalog, labels).",
    productSlugs: [
      "consent-hormone-therapy",
      "hormone-therapy-clinical-cheat-sheet",
      "hormone-patient-journey-kit",
      "peptide-therapy-clinical-cheat-sheet",
      "peptide-patient-journey-kit",
      "peptide-patient-guide",
      "peptide-canva-marketing-pack",
      "pellet-therapy-clinical-cheat-sheet",
    ],
  },
  {
    slug: "peel-microneedling-laser",
    title: "Peels, microneedling & laser",
    subtitle: "Consents, journeys & IPL reference",
    description:
      "Chemical peel and microneedling bundles, laser consent, and a clinical cheat sheet for IPL/laser days.",
    productSlugs: [
      "chemical-peel-consent-bundle",
      "microneedling-consent-bundle",
      "chemical-peel-patient-journey-kit",
      "microneedling-patient-journey-kit",
      "consent-laser-ipl",
      "consent-microneedling-rf",
      "ipl-laser-clinical-cheat-sheet",
    ],
  },
  {
    slug: "lash-brow-wax",
    title: "Lash, brow & wax",
    subtitle: "Aftercare, consents & clinical quick refs",
    description:
      "Lash aftercare kits, extension and lift cheat sheets, brow henna, waxing reference, and matching consents.",
    productSlugs: [
      "lash-aftercare-kit",
      "lash-extensions-clinical-cheat-sheet",
      "lash-lift-perm-clinical-cheat-sheet",
      "brow-henna-clinical-cheat-sheet",
      "waxing-clinical-cheat-sheet",
      "consent-lash-extensions",
      "consent-waxing",
    ],
  },
];

export function getFamilyBySlug(slug: string): ShopFamily | undefined {
  return SHOP_FAMILIES.find((f) => f.slug === slug);
}

export function getFamilyByProductSlug(productSlug: string): ShopFamily | undefined {
  return SHOP_FAMILIES.find((f) => f.productSlugs.includes(productSlug));
}

/**
 * Returns products that exist in the catalog, in family order, then by price (low → high).
 */
export function resolveFamilyProducts(
  family: ShopFamily,
  allProducts: ShopProduct[],
): ShopProduct[] {
  const bySlug = new Map(allProducts.map((p) => [p.slug, p]));
  const ordered = family.productSlugs
    .map((s) => bySlug.get(s))
    .filter((p): p is ShopProduct => Boolean(p));
  return [...ordered].sort((a, b) => a.priceCents - b.priceCents);
}

export function familyProductCount(family: ShopFamily, allProducts: ShopProduct[]): number {
  return resolveFamilyProducts(family, allProducts).length;
}

export function formatFamilyFloorPrice(family: ShopFamily, allProducts: ShopProduct[]): string {
  const resolved = resolveFamilyProducts(family, allProducts);
  if (resolved.length === 0) return "—";
  const minCents = Math.min(...resolved.map((p) => p.priceCents));
  return `$${(minCents / 100).toFixed(minCents % 100 === 0 ? 0 : 2)}`;
}

/** Non-empty collections, in catalog order, capped for the shop home grid. */
export function getFeaturedFamiliesForHome(
  allProducts: ShopProduct[],
  limit = 6,
): ShopFamily[] {
  return SHOP_FAMILIES.filter((f) => familyProductCount(f, allProducts) > 0).slice(0, limit);
}
