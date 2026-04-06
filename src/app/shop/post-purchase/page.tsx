import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUpsellSlugAfterPurchase } from "@/config/post-purchase-upsell.config";
import { STUDY_GUIDE_NCLEX, STUDY_GUIDE_NCLEX_SLUG } from "@/config/study-guides.config";
import { getShopProductBySlug } from "@/lib/shop/products";
import { resolveShopFunnelForSlug } from "@/lib/shop/funnel-resolve";
import type { FunnelFinalRedirect } from "@/lib/shop/funnel-types";
import { PostPurchaseClient, type PostPurchaseUpsellPayload } from "./PostPurchaseClient";

export const metadata: Metadata = {
  title: "Thank you — complete your library | No Prior Authorization",
  robots: { index: false, follow: true },
};

function toUpsellPayload(slug: string): PostPurchaseUpsellPayload | null {
  const shopProduct = getShopProductBySlug(slug);
  if (!shopProduct) return null;
  return {
    slug: shopProduct.slug,
    title: shopProduct.title,
    shortDescription: shopProduct.shortDescription,
    priceDisplay: shopProduct.priceDisplay,
    previewImage: shopProduct.previewImages[0] ?? null,
  };
}

export default async function PostPurchasePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const raw = searchParams.p;
  const p = typeof raw === "string" ? raw.trim() : "";
  if (!p) {
    redirect("/shop/thank-you");
  }

  const shopProduct = getShopProductBySlug(p);
  const isStudyNclex = p === STUDY_GUIDE_NCLEX_SLUG;

  if (!shopProduct && !isStudyNclex) {
    redirect("/shop/thank-you");
  }

  const funnel = await resolveShopFunnelForSlug(p);
  let upsells: PostPurchaseUpsellPayload[] = [];
  let finalRedirect: FunnelFinalRedirect = "post_purchase";

  if (funnel.enabled && funnel.postUpsellSlugs.length > 0) {
    finalRedirect = funnel.finalRedirect;
    for (const us of funnel.postUpsellSlugs) {
      if (us === p) continue;
      const payload = toUpsellPayload(us);
      if (payload) upsells.push(payload);
    }
  } else {
    const upsellSlug = getUpsellSlugAfterPurchase(p);
    if (upsellSlug && upsellSlug !== p) {
      const payload = toUpsellPayload(upsellSlug);
      if (payload) upsells = [payload];
    }
  }

  return (
    <PostPurchaseClient
      purchasedSlug={p}
      purchasedTitle={shopProduct?.title ?? STUDY_GUIDE_NCLEX.title}
      upsells={upsells}
      finalRedirect={funnel.enabled ? finalRedirect : "post_purchase"}
    />
  );
}
