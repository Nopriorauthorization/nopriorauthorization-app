import { STUDY_GUIDE_NCLEX, STUDY_GUIDE_NCLEX_SLUG } from "@/config/study-guides.config";
import { getShopProductBySlug } from "@/lib/shop/products";

export function getCheckoutProductTitle(productSlug: string, source: string): string {
  if (source === "study_guides" || productSlug === STUDY_GUIDE_NCLEX_SLUG) {
    return STUDY_GUIDE_NCLEX.title;
  }
  return getShopProductBySlug(productSlug)?.title ?? productSlug;
}

export function getCheckoutOriginLabel(source: string): string {
  return source === "study_guides" ? "Study guides" : "Shop";
}
