export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getShopProductBySlug } from "@/lib/shop/products";
import { resolveShopFunnelForSlug } from "@/lib/shop/funnel-resolve";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug?.trim();
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const product = getShopProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }

  const funnel = await resolveShopFunnelForSlug(slug);
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

  return NextResponse.json({
    primarySlug: product.slug,
    enabled: funnel.enabled,
    source: funnel.source,
    useDedicatedLanding: funnel.useDedicatedLanding,
    bumpSlugs: funnel.bumpSlugs,
    bumpProducts,
    postUpsellSlugs: funnel.postUpsellSlugs,
    finalRedirect: funnel.finalRedirect,
  });
}
