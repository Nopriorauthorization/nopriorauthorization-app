export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { STUDY_GUIDE_NCLEX_SLUG, STUDY_GUIDE_NCLEX } from "@/config/study-guides.config";
import { createCheckoutLink } from "@/lib/square/client";

/**
 * Square checkout for study-guide products (not in `/shop` product list).
 * Body: `{ "product": "nclex" }` — extensible for future guides.
 */
export async function POST(req: NextRequest) {
  let body: { product?: string };
  try {
    body = (await req.json()) as { product?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const key = body.product?.trim().toLowerCase() || "nclex";
  if (key !== "nclex") {
    return NextResponse.json({ error: "Unknown study guide product" }, { status: 400 });
  }

  const origin = req.nextUrl.origin;

  try {
    const { url } = await createCheckoutLink(
      {
        slug: STUDY_GUIDE_NCLEX_SLUG,
        title: STUDY_GUIDE_NCLEX.title,
        priceCents: STUDY_GUIDE_NCLEX.priceCents,
        templateCount: 1,
      },
      `${origin}/study-guides/thank-you`,
    );

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[study-guides/checkout] Square error:", err);
    return NextResponse.json(
      { error: "Failed to start checkout — try again or contact support." },
      { status: 500 },
    );
  }
}
