export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe/stripe";
import { getShopProductBySlug } from "@/lib/shop/products";

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

  const stripe = getStripeClient();
  const origin = req.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        product.stripePriceId
          ? { price: product.stripePriceId, quantity: 1 }
          : {
              price_data: {
                currency: "usd",
                unit_amount: product.priceCents,
                product_data: {
                  name: product.title,
                  description: `${product.templateCount} editable templates — instant digital delivery`,
                },
              },
              quantity: 1,
            },
      ],
      metadata: {
        purchase_type: "digital_product",
        product_slug: slug,
        product_title: product.title,
        template_count: String(product.templateCount),
      },
      success_url: `${origin}/shop/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop/${slug}?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[shop/checkout] Stripe error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
