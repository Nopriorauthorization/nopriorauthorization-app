import { PRO_MEMBERSHIP_EXCLUDED_SHOP_SLUGS } from "@/config/pro-membership-layer.config";
import { getShopProductBySlug } from "@/lib/shop/products";

export function isShopProductIncludedInPro(slug: string): boolean {
  if (!slug.trim()) return false;
  if (PRO_MEMBERSHIP_EXCLUDED_SHOP_SLUGS.has(slug)) return false;
  return Boolean(getShopProductBySlug(slug));
}
