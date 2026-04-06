import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { buildProductMetaDescription, buildProductMetaTitle } from "@/lib/seo/shop-product-seo";
import { getShopProductBySlug } from "@/lib/shop/products";
import { resolveShopFunnelForSlug } from "@/lib/shop/funnel-resolve";
import { FunnelLandingClient } from "./FunnelLandingClient";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getShopProductBySlug(params.slug);
  if (!product) return {};
  const title = `${buildProductMetaTitle(product)} — Checkout`;
  const description = buildProductMetaDescription(product);
  return {
    title,
    description,
    robots: { index: false, follow: true },
  };
}

export default async function ProductFunnelPage({ params }: { params: { slug: string } }) {
  const product = getShopProductBySlug(params.slug);
  if (!product) notFound();

  const funnel = await resolveShopFunnelForSlug(params.slug);
  if (!funnel.enabled || !funnel.useDedicatedLanding) {
    redirect(`/shop/${encodeURIComponent(params.slug)}`);
  }

  const bumpProducts = funnel.bumpSlugs
    .map((s) => getShopProductBySlug(s))
    .filter(Boolean)
    .map((p) => ({
      slug: p!.slug,
      title: p!.title,
      shortDescription: p!.shortDescription,
      priceDisplay: p!.priceDisplay,
      priceCents: p!.priceCents,
      previewImage: p!.previewImages[0] ?? null,
    }));

  return (
    <FunnelLandingClient
      primary={{
        slug: product.slug,
        title: product.title,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        priceDisplay: product.priceDisplay,
        priceCents: product.priceCents,
      }}
      bumpProducts={bumpProducts}
    />
  );
}
