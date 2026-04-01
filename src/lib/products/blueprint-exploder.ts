import type { DigitalProductConfig } from "./types";
import type {
  ProductBlueprint,
  BundleSize,
  BundleType,
  TreatmentDef,
} from "./blueprint";
import { BUNDLE_SIZE_LABELS, BUNDLE_TYPE_LABELS } from "./blueprint";

function buildSlug(
  niche: string,
  treatmentId: string,
  bundleType: BundleType,
  size: BundleSize,
): string {
  return `${niche}-${treatmentId}-${bundleType}-${size}`;
}

function buildTitle(
  treatment: TreatmentDef,
  bundleType: BundleType,
  size: BundleSize,
): string {
  const typeLabel = BUNDLE_TYPE_LABELS[bundleType];
  const sizeLabel = BUNDLE_SIZE_LABELS[size];
  return `${treatment.label} ${typeLabel} | ${sizeLabel} | Canva Editable for Med Spas`;
}

function buildMegaTitle(bp: ProductBlueprint): string {
  return `${bp.nicheLabel} Mega Bundle | 300+ Templates | Complete ${bp.nicheLabel} Marketing Kit`;
}

function buildDescription(
  treatment: TreatmentDef,
  bundleType: BundleType,
  size: BundleSize,
  nicheLabel: string,
): string {
  const typeLabel = BUNDLE_TYPE_LABELS[bundleType];
  return (
    `${size} done-for-you ${treatment.label.toLowerCase()} ${typeLabel.toLowerCase()} ` +
    `designed for ${nicheLabel.toLowerCase()} providers, aesthetic entrepreneurs, and clinic marketing teams. ` +
    `Edit in Canva, download, and post — no design skills needed.\n\n` +
    `Perfect for ${treatment.audience.join(", ").toLowerCase()}. ` +
    `All templates are fully editable and branded for professional use. Instant digital delivery.`
  );
}

function buildTags(
  treatment: TreatmentDef,
  bundleType: BundleType,
  size: BundleSize,
  nicheLabel: string,
): string[] {
  const tags = new Set<string>();

  for (const kw of treatment.keywords.slice(0, 7)) tags.add(kw);
  tags.add(`${nicheLabel.toLowerCase()} templates`);
  tags.add(`${size} pack`);
  tags.add("canva templates");
  tags.add("digital download");
  tags.add("instant download");
  tags.add("editable templates");

  return Array.from(tags).slice(0, 13);
}

function buildConfig(
  bp: ProductBlueprint,
  treatment: TreatmentDef,
  bundleType: BundleType,
  size: BundleSize,
): DigitalProductConfig {
  const slug = buildSlug(bp.niche, treatment.id, bundleType, size);
  return {
    slug,
    internalName: `${treatment.label} ${BUNDLE_TYPE_LABELS[bundleType]} ${BUNDLE_SIZE_LABELS[size]}`,
    listingTitleSeed: buildTitle(treatment, bundleType, size),
    brand: bp.brand,
    brandId: "npa",
    category: `${bp.nicheLabel} — ${BUNDLE_TYPE_LABELS[bundleType]}`,
    audience: treatment.audience,
    keywords: treatment.keywords,
    tagsSeed: buildTags(treatment, bundleType, size, bp.nicheLabel),
    descriptionSeed: buildDescription(treatment, bundleType, size, bp.nicheLabel),
    canvaDesignStrategy: "use-existing-template",
    exportFormats: ["png"],
    deliveryFiles: {
      includeInstructions: true,
      includeCanvaLinks: true,
      includeBonusFiles: false,
    },
    etsy: {
      priceUsd: bp.basePrice[size] / 100,
      quantity: 999,
      isDigital: true,
      shouldCreateDraft: true,
    },
  };
}

function buildMegaConfig(bp: ProductBlueprint): DigitalProductConfig {
  const totalTemplates = bp.treatments.length * 120;
  const allKeywords = bp.treatments.flatMap((t) => t.keywords);
  const uniqueKeywords = Array.from(new Set(allKeywords));
  const allAudience = Array.from(
    new Set(bp.treatments.flatMap((t) => t.audience)),
  );

  return {
    slug: `${bp.niche}-mega-bundle`,
    internalName: `${bp.nicheLabel} Mega Bundle`,
    listingTitleSeed: buildMegaTitle(bp),
    brand: bp.brand,
    brandId: "npa",
    category: `${bp.nicheLabel} — Complete Bundle`,
    audience: allAudience,
    keywords: uniqueKeywords.slice(0, 15),
    tagsSeed: [
      `${bp.nicheLabel.toLowerCase()} mega bundle`,
      `${bp.nicheLabel.toLowerCase()} templates`,
      "canva template bundle",
      "social media bundle",
      "aesthetic marketing kit",
      "med spa templates",
      "complete marketing bundle",
      "digital download",
      "instant download",
      "canva editable",
      "done for you templates",
      `${bp.nicheLabel.toLowerCase()} marketing`,
      "clinic templates",
    ].slice(0, 13),
    descriptionSeed:
      `The complete ${bp.nicheLabel.toLowerCase()} marketing toolkit — ${totalTemplates}+ templates ` +
      `covering ${bp.treatments.map((t) => t.label.toLowerCase()).join(", ")}. ` +
      `Everything you need to market your ${bp.nicheLabel.toLowerCase()} practice on social media, ` +
      `all in one bundle at a massive discount.\n\n` +
      `Perfect for ${allAudience.join(", ").toLowerCase()}. ` +
      `All templates are fully editable in Canva. Instant digital delivery.`,
    canvaDesignStrategy: "use-existing-template",
    exportFormats: ["png"],
    deliveryFiles: {
      includeInstructions: true,
      includeCanvaLinks: true,
      includeBonusFiles: true,
    },
    etsy: {
      priceUsd: (bp.megaBundlePrice || bp.basePrice[300]) / 100,
      quantity: 999,
      isDigital: true,
      shouldCreateDraft: true,
    },
  };
}

/**
 * Explode a ProductBlueprint into an array of DigitalProductConfig objects.
 * Generates: (treatments x bundleSizes x bundleTypes) + 1 mega bundle
 */
export function explodeBlueprint(
  bp: ProductBlueprint,
): DigitalProductConfig[] {
  const configs: DigitalProductConfig[] = [];

  for (const treatment of bp.treatments) {
    for (const bundleType of bp.bundleTypes) {
      for (const size of bp.bundleSizes) {
        configs.push(buildConfig(bp, treatment, bundleType, size));
      }
    }
  }

  configs.push(buildMegaConfig(bp));

  return configs;
}
