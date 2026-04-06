import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUpsellSlugAfterPurchase } from "@/config/post-purchase-upsell.config";
import { STUDY_GUIDE_NCLEX, STUDY_GUIDE_NCLEX_SLUG } from "@/config/study-guides.config";
import { getShopProductBySlug } from "@/lib/shop/products";
import { PostPurchaseClient } from "./PostPurchaseClient";

export const metadata: Metadata = {
  title: "Thank you — complete your library | No Prior Authorization",
  robots: { index: false, follow: true },
};

export default function PostPurchasePage({
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

  const upsellSlug = getUpsellSlugAfterPurchase(p);
  const upsellProduct =
    upsellSlug && upsellSlug !== p ? getShopProductBySlug(upsellSlug) : undefined;
  const upsell =
    upsellProduct &&
    ({
      slug: upsellProduct.slug,
      title: upsellProduct.title,
      shortDescription: upsellProduct.shortDescription,
      priceDisplay: upsellProduct.priceDisplay,
      previewImage: upsellProduct.previewImages[0] ?? null,
    } as const);

  return (
    <PostPurchaseClient
      purchasedSlug={p}
      purchasedTitle={shopProduct?.title ?? STUDY_GUIDE_NCLEX.title}
      upsell={upsell ?? null}
    />
  );
}
