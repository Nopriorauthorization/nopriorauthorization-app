import { getUpsellSlugAfterPurchase } from "@/config/post-purchase-upsell.config";
import { getShopProductBySlug } from "@/lib/shop/products";
import { resolveShopFunnelForSlug } from "@/lib/shop/funnel-resolve";

/**
 * Whether `upsellSlug` is an allowed post-purchase offer after buying `primarySlug`.
 */
export async function isAllowedPostPurchaseUpsell(
  primarySlug: string,
  upsellSlug: string,
): Promise<boolean> {
  if (!primarySlug || !upsellSlug || primarySlug === upsellSlug) {
    return false;
  }
  if (!getShopProductBySlug(upsellSlug)) {
    return false;
  }

  const funnel = await resolveShopFunnelForSlug(primarySlug);
  if (funnel.enabled && funnel.postUpsellSlugs.length > 0) {
    return funnel.postUpsellSlugs.includes(upsellSlug);
  }

  const cfg = getUpsellSlugAfterPurchase(primarySlug);
  return cfg === upsellSlug;
}
