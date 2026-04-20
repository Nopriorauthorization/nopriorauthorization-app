/**
 * Printify blueprint mapping for NPA physical SKUs (Square / shop product slug → catalog blueprint).
 * Pair each SKU with a Printify `product_id` + `variant_id` via env `PRINTIFY_INVENTORY_JSON` before live orders.
 */

export type PrintifyProductRow = {
  blueprint_id: number;
  title: string;
};

/**
 * Multi-item physical kit bundles — contain more than one Printify product so they cannot be
 * auto-submitted as a single Printify order. Purchases are recorded as `fulfillmentType: "physical"`
 * and flagged for manual multi-line fulfillment.
 */
// nurse-injector-clinical-kit is cards-only → fully digital, excluded here
export const PHYSICAL_KIT_BUNDLE_SLUGS = new Set([
  "ap-survival-kit",
  "micro-270-kit",
  "pre-nursing-bundle",
  "give-me-everything-kit",
  "medspa-clinical-kit",
  "medspa-business-starter-kit",
  "give-me-everything-medspa-kit",
  "micro250-exam-prep-physical",
]);

export function isPhysicalKitBundleSlug(slug: string): boolean {
  return PHYSICAL_KIT_BUNDLE_SLUGS.has(slug);
}

export const PRINTIFY_PRODUCTS: Record<string, PrintifyProductRow> = {
  "NPA-STUDY-AP-CARDS": {
    blueprint_id: 1138,
    title: "A&P Flashcard Deck",
  },
  "NPA-STUDY-MICRO-CARDS": {
    blueprint_id: 1138,
    title: "Micro 270 Flashcard Deck",
  },
  "NPA-STUDY-AP-BOOKLET": {
    blueprint_id: 515,
    title: "A&P Cheat Sheet Booklet",
  },
  "NPA-CLINICAL-REF-CARDS": {
    blueprint_id: 812,
    title: "Clinical Reference Cards",
  },
  /** Four flagship “Nurse-in-the-Making style” nursing study POD products — see `nursing-study-printify-flagships.config.ts` */
  "NPA-NITM-MICRO-SPIRAL": {
    blueprint_id: 74,
    title: "Complete Microbiology — Spiral Study Book",
  },
  "NPA-NITM-ANATOMY-SPIRAL": {
    blueprint_id: 74,
    title: "Complete Anatomy & Physiology — Spiral Study Book",
  },
  "NPA-NITM-NURSING-SPIRAL": {
    blueprint_id: 74,
    title: "Complete Nursing Core — Spiral Study Book",
  },
  "NPA-NITM-NCLEX-CARDS": {
    blueprint_id: 1138,
    title: "NCLEX Essentials — Flashcard Deck",
  },
};

/** Optional: shop checkout slug → Printify SKU key (when slug differs from SKU). */
export const PRINTIFY_SHOP_SLUG_TO_SKU: Record<string, string> = {
  "physical-complete-microbiology-spiral": "NPA-NITM-MICRO-SPIRAL",
  "physical-complete-anatomy-spiral": "NPA-NITM-ANATOMY-SPIRAL",
  "physical-complete-nursing-core-spiral": "NPA-NITM-NURSING-SPIRAL",
  "physical-nclex-essentials-flashcards": "NPA-NITM-NCLEX-CARDS",
};

export function resolvePrintifySku(productSlug: string): string | null {
  if (PRINTIFY_PRODUCTS[productSlug]) return productSlug;
  const mapped = PRINTIFY_SHOP_SLUG_TO_SKU[productSlug];
  if (mapped && PRINTIFY_PRODUCTS[mapped]) return mapped;
  return null;
}

export function getPrintifyRowForSku(sku: string): PrintifyProductRow | null {
  return PRINTIFY_PRODUCTS[sku] ?? null;
}

export function isPrintifyPhysicalSku(productSlug: string): boolean {
  return resolvePrintifySku(productSlug) !== null || isPhysicalKitBundleSlug(productSlug);
}

export type PrintifyInventoryLine = {
  productId: string;
  variantId: number;
};

/**
 * Env: PRINTIFY_INVENTORY_JSON
 *
 * Supports two formats per entry:
 *   Single:  { "NPA-STUDY-AP-CARDS": { "productId": "...", "variantId": 12345 } }
 *   Multi:   { "ap-survival-kit": [{ "productId": "...", "variantId": 12345 }, ...] }
 *
 * Always returns an array (single-item entries are wrapped).
 * Returns null if entry is missing or malformed.
 */
export function getPrintifyInventoryLine(
  sku: string,
): PrintifyInventoryLine[] | null {
  const raw = process.env.PRINTIFY_INVENTORY_JSON?.trim();
  if (!raw) return null;
  try {
    const map = JSON.parse(raw) as Record<
      string,
      | { productId?: string; variantId?: number }
      | Array<{ productId?: string; variantId?: number }>
    >;
    const entry = map[sku];
    if (!entry) return null;

    const rows = Array.isArray(entry) ? entry : [entry];
    const lines: PrintifyInventoryLine[] = [];
    for (const row of rows) {
      if (!row?.productId || row.variantId == null) return null;
      lines.push({ productId: String(row.productId), variantId: Number(row.variantId) });
    }
    return lines.length > 0 ? lines : null;
  } catch {
    return null;
  }
}
