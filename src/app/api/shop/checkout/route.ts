export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getShopProductBySlug } from "@/lib/shop/products";
import { createCheckoutLink } from "@/lib/square/client";

export async function POST(req: NextRequest) {
  let body: { productSlug?: string };
  try {
    body = (await req.json()) as { productSlug?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const slug = body.productSlug?.trim();
  if (!slug) {
    return NextResponse.json({ error: "productSlug is required" }, { status: 400 });
  }

  const product = getShopProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: `Unknown product: ${slug}` }, { status: 404 });
  }

  const origin = req.nextUrl.origin;

  try {
    const { url } = await createCheckoutLink(
      {
        slug: product.slug,
        title: product.title,
        priceCents: product.priceCents,
        templateCount: product.templateCount,
      },
      `${origin}/shop/thank-you`,
    );

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[shop/checkout] Square error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
