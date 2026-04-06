export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isValidCheckoutEmail, normalizeCheckoutEmail } from "@/lib/checkout/email";
import { getShopProductBySlug } from "@/lib/shop/products";
import { createCheckoutLink } from "@/lib/square/client";

export async function POST(req: NextRequest) {
  let body: { productSlug?: string; buyerEmail?: string };
  try {
    body = (await req.json()) as { productSlug?: string; buyerEmail?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const slug = body.productSlug?.trim();
  if (!slug) {
    return NextResponse.json({ error: "productSlug is required" }, { status: 400 });
  }

  const emailRaw = body.buyerEmail?.trim() ?? "";
  if (!isValidCheckoutEmail(emailRaw)) {
    return NextResponse.json(
      { error: "A valid email is required to continue to checkout." },
      { status: 400 },
    );
  }
  const buyerEmail = normalizeCheckoutEmail(emailRaw);

  const product = getShopProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: `Unknown product: ${slug}` }, { status: 404 });
  }

  const origin = req.nextUrl.origin;
  const redirectUrl = `${origin}/shop/post-purchase?p=${encodeURIComponent(product.slug)}`;

  try {
    const { url, paymentLinkId } = await createCheckoutLink(
      {
        slug: product.slug,
        title: product.title,
        priceCents: product.priceCents,
        templateCount: product.templateCount,
      },
      redirectUrl,
    );

    await prisma.checkoutAttempt.create({
      data: {
        productSlug: product.slug,
        buyerEmail,
        paymentLinkId: paymentLinkId || null,
        source: "shop",
      },
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[shop/checkout] Square error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
