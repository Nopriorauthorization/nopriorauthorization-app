export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  STUDY_GUIDE_NCLEX_SLUG,
  STUDY_GUIDE_NCLEX,
  STUDY_GUIDE_NCLEX_TEMPLATES,
} from "@/config/study-guides.config";
import { isValidCheckoutEmail, normalizeCheckoutEmail } from "@/lib/checkout/email";
import { createCheckoutLink } from "@/lib/square/client";

/**
 * Square checkout for study-guide products (not in `/shop` product list).
 * Body: `{ "product": "nclex", "buyerEmail": "..." }` — extensible for future guides.
 */
export async function POST(req: NextRequest) {
  let body: { product?: string; buyerEmail?: string };
  try {
    body = (await req.json()) as { product?: string; buyerEmail?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const key = body.product?.trim().toLowerCase() || "nclex";
  if (key !== "nclex") {
    return NextResponse.json({ error: "Unknown study guide product" }, { status: 400 });
  }

  const emailRaw = body.buyerEmail?.trim() ?? "";
  if (!isValidCheckoutEmail(emailRaw)) {
    return NextResponse.json(
      { error: "A valid email is required to continue to checkout." },
      { status: 400 },
    );
  }
  const buyerEmail = normalizeCheckoutEmail(emailRaw);

  const origin = req.nextUrl.origin;
  const redirectUrl = `${origin}/shop/post-purchase?p=${encodeURIComponent(STUDY_GUIDE_NCLEX_SLUG)}`;

  try {
    const { url, paymentLinkId } = await createCheckoutLink(
      {
        slug: STUDY_GUIDE_NCLEX_SLUG,
        title: STUDY_GUIDE_NCLEX.title,
        priceCents: STUDY_GUIDE_NCLEX.priceCents,
        templateCount: STUDY_GUIDE_NCLEX_TEMPLATES.length,
      },
      redirectUrl,
    );

    await prisma.checkoutAttempt.create({
      data: {
        productSlug: STUDY_GUIDE_NCLEX_SLUG,
        buyerEmail,
        paymentLinkId: paymentLinkId || null,
        source: "study_guides",
      },
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[study-guides/checkout] Square error:", err);
    return NextResponse.json(
      { error: "Failed to start checkout — try again or contact support." },
      { status: 500 },
    );
  }
}
