export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { retrieveSquarePaymentCardContext } from "@/lib/square/payments-api";

/**
 * Poll after redirect from Square while webhook persists card-on-file context.
 */
export async function GET(req: NextRequest) {
  const npt = req.nextUrl.searchParams.get("npt")?.trim() ?? "";
  const primarySlug = req.nextUrl.searchParams.get("primarySlug")?.trim() ?? "";
  if (!npt || npt.length > 80 || !primarySlug) {
    return NextResponse.json({ error: "npt and primarySlug required" }, { status: 400 });
  }

  const attempt = await prisma.checkoutAttempt.findFirst({
    where: { postCheckoutToken: npt, productSlug: primarySlug },
  });

  if (!attempt) {
    return NextResponse.json({ ready: false, canOneClick: false });
  }

  if (!attempt.completedAt) {
    return NextResponse.json({ ready: false, canOneClick: false });
  }

  let cardId = attempt.squareCardIdForUpsell;
  if (!cardId && attempt.squarePaymentId) {
    const ctx = await retrieveSquarePaymentCardContext(attempt.squarePaymentId);
    cardId = ctx.cardId;
  }

  return NextResponse.json({
    ready: true,
    canOneClick: Boolean(cardId),
  });
}
