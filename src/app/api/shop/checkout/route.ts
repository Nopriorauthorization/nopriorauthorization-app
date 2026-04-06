export const dynamic = "force-dynamic";

import { randomBytes, randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isValidCheckoutEmail, normalizeCheckoutEmail } from "@/lib/checkout/email";
import { getShopProductBySlug } from "@/lib/shop/products";
import { createCheckoutLinkBundle } from "@/lib/square/client";
import { resolveShopFunnelForSlug, validateBumpSelection } from "@/lib/shop/funnel-resolve";
import { buildShopCheckoutSuccessUrl } from "@/lib/shop/checkout-success-url";

export async function POST(req: NextRequest) {
  let body: {
    productSlug?: string;
    buyerEmail?: string;
    bumpSlugs?: string[];
    funnelSessionId?: string;
  };
  try {
    body = (await req.json()) as typeof body;
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

  const funnel = await resolveShopFunnelForSlug(slug);
  const bumpRaw = Array.isArray(body.bumpSlugs) ? body.bumpSlugs : [];
  let selectedBumps: string[] = [];

  if (funnel.enabled && funnel.bumpSlugs.length > 0 && bumpRaw.length > 0) {
    const v = validateBumpSelection(funnel.bumpSlugs, bumpRaw);
    if (!v.ok) {
      return NextResponse.json({ error: v.error }, { status: 400 });
    }
    selectedBumps = v.slugs;
  }
  if (selectedBumps.includes(product.slug)) {
    return NextResponse.json({ error: "Primary product cannot be selected as a bump" }, { status: 400 });
  }

  const lineItems = [
    {
      slug: product.slug,
      title: product.title,
      priceCents: product.priceCents,
      templateCount: product.templateCount,
    },
    ...selectedBumps.map((b) => {
      const p = getShopProductBySlug(b)!;
      return {
        slug: p.slug,
        title: p.title,
        priceCents: p.priceCents,
        templateCount: p.templateCount,
      };
    }),
  ];

  const postCheckoutToken = randomBytes(24).toString("hex");
  const origin = req.nextUrl.origin;
  const redirectUrl = buildShopCheckoutSuccessUrl(origin, product.slug, funnel, {
    postCheckoutToken,
  });

  let funnelSessionId: string | null = null;
  if (funnel.enabled) {
    const raw = body.funnelSessionId?.trim();
    funnelSessionId =
      raw && raw.length <= 128 ? raw.slice(0, 128) : randomUUID();
  }

  try {
    const { url, paymentLinkId } = await createCheckoutLinkBundle(lineItems, redirectUrl);

    await prisma.checkoutAttempt.create({
      data: {
        productSlug: product.slug,
        buyerEmail,
        paymentLinkId: paymentLinkId || null,
        source: "shop",
        funnelSessionId: funnel.enabled ? funnelSessionId : null,
        selectedBumpSlugs: funnel.enabled ? selectedBumps : [],
        postCheckoutToken,
      },
    });

    return NextResponse.json({ url, funnelSessionId: funnel.enabled ? funnelSessionId : undefined });
  } catch (err) {
    console.error("[shop/checkout] Square error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
