import { getShopProductBySlug } from "@/lib/shop/products";

/**
 * Split total cents across line items by catalog price ratio (handles rounding on last slug).
 */
export function allocatePaymentCentsAcrossSlugs(
  totalCents: number,
  slugs: string[],
): Map<string, number> {
  const map = new Map<string, number>();
  if (slugs.length === 0) return map;
  if (slugs.length === 1) {
    map.set(slugs[0]!, totalCents);
    return map;
  }

  const products = slugs.map((s) => getShopProductBySlug(s));
  const sumPrice = products.reduce((acc, p) => acc + (p?.priceCents ?? 0), 0);
  if (sumPrice <= 0) {
    const each = Math.floor(totalCents / slugs.length);
    let rem = totalCents - each * slugs.length;
    slugs.forEach((s, i) => {
      map.set(s, each + (i === slugs.length - 1 ? rem : 0));
    });
    return map;
  }

  let allocated = 0;
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i]!;
    const p = products[i];
    const price = p?.priceCents ?? 0;
    if (i === slugs.length - 1) {
      map.set(slug, Math.max(0, totalCents - allocated));
    } else {
      const share = Math.round((totalCents * price) / sumPrice);
      map.set(slug, share);
      allocated += share;
    }
  }
  return map;
}
