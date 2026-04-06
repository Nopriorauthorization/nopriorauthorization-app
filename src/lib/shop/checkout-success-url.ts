import type { ResolvedShopFunnel } from "@/lib/shop/funnel-types";

/**
 * Where Square redirects after payment. Post-purchase upsells require landing on
 * `/shop/post-purchase` first; thank-you / membership skip that when no upsells are configured.
 */
export function buildShopCheckoutSuccessUrl(
  origin: string,
  primarySlug: string,
  funnel: Pick<ResolvedShopFunnel, "enabled" | "postUpsellSlugs" | "finalRedirect">,
  opts?: { postCheckoutToken?: string | null },
): string {
  const enc = encodeURIComponent(primarySlug);
  const npt =
    opts?.postCheckoutToken?.trim() &&
    `&npt=${encodeURIComponent(opts.postCheckoutToken.trim())}`;
  const hasUpsells = funnel.enabled && funnel.postUpsellSlugs.length > 0;
  if (hasUpsells) {
    return `${origin}/shop/post-purchase?p=${enc}${npt || ""}`;
  }
  if (funnel.enabled && funnel.finalRedirect === "thank_you") {
    return `${origin}/shop/thank-you`;
  }
  if (funnel.enabled && funnel.finalRedirect === "membership") {
    return `${origin}/membership`;
  }
  return `${origin}/shop/post-purchase?p=${enc}${npt || ""}`;
}
