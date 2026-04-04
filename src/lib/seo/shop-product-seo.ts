import type { ShopProduct } from "@/lib/shop/products";

const BRAND = "No Prior Authorization";

/**
 * Keyword-rich suffix for `<title>` — complements product title for buyer-intent queries.
 */
export function getProductMetaKeywordSuffix(product: ShopProduct): string {
  const slug = product.slug;
  const cat = product.category;

  if (/botox|filler|injector|neurotoxin|dermal|lash|brow|wax|microneedling|chemical-peel|consent-/.test(slug)) {
    if (/lash|brow|wax/.test(slug)) return "Med spa lash & brow templates";
    if (/microneedling|chemical-peel|peel/.test(slug)) return "Med spa treatment templates";
    return "Botox & med spa injectable templates";
  }
  if (/glp1|glp-1|weight-loss|semaglutide/.test(slug)) return "Weight loss & GLP-1 marketing templates";
  if (/^iv-|iv-therapy|iv-story/.test(slug)) return "IV therapy marketing templates";
  if (/peptide/.test(slug)) return "Peptide therapy marketing templates";
  if (/hormone/.test(slug)) return "Hormone therapy marketing templates";
  if (/social|canva|calendar|promo-pack|membership-pack|review-testimonial|myths-facts|seasonal-marketing|story-templates/.test(slug))
    return "Med spa social media templates";
  if (/google|reputation|star-system|before-after|vendor|pricing-menu|startup-checklist|welcome-packet/.test(slug))
    return "Med spa business & ops templates";
  if (/hipaa|disclaimer|legal|compliance|insurance-legal/.test(slug)) return "Med spa legal & compliance templates";
  if (/playbook|injectors-playbook|strategy/.test(slug)) return "Med spa playbook templates";
  if (/cheat-sheet/.test(slug)) return "Clinical cheat sheets for med spas";
  if (cat === "Clinical Forms") return "Med spa clinical form templates";
  if (cat === "Bundles") return "Med spa template bundles";
  if (cat === "Playbooks") return "Med spa training playbooks";
  return "Med spa marketing templates";
}

export function buildProductMetaTitle(product: ShopProduct): string {
  const suffix = getProductMetaKeywordSuffix(product);
  return `${product.title} | ${suffix} | ${BRAND}`;
}

/**
 * Meta description: prefer shortDescription, ensure useful length for SERP.
 */
export function buildProductMetaDescription(product: ShopProduct): string {
  const base = product.shortDescription.trim();
  const tail = " Instant download after purchase — browse the shop for bundles and the Growth System.";
  if (base.length >= 120) return base.length > 165 ? `${base.slice(0, 160).trim()}…` : base;
  const combined = `${base} ${tail}`;
  return combined.length > 165 ? `${combined.slice(0, 160).trim()}…` : combined;
}
