export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { buildUpsellOneClickNote } from "@/lib/square/payment-note";
import {
  createSquareCardOnFilePayment,
  retrieveSquarePaymentCardContext,
  upsellChargeIdempotencyKey,
} from "@/lib/square/payments-api";
import { getShopProductBySlug } from "@/lib/shop/products";
import { isAllowedPostPurchaseUpsell } from "@/lib/shop/validate-post-upsell";

export async function POST(req: NextRequest) {
  let body: {
    postCheckoutToken?: string;
    primarySlug?: string;
    upsellSlug?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const postCheckoutToken = body.postCheckoutToken?.trim() ?? "";
  const primarySlug = body.primarySlug?.trim() ?? "";
  const upsellSlug = body.upsellSlug?.trim() ?? "";

  if (!postCheckoutToken || postCheckoutToken.length > 80) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
  if (!primarySlug || !upsellSlug) {
    return NextResponse.json({ error: "primarySlug and upsellSlug required" }, { status: 400 });
  }

  const allowed = await isAllowedPostPurchaseUpsell(primarySlug, upsellSlug);
  if (!allowed) {
    return NextResponse.json({ error: "Upsell not allowed for this purchase" }, { status: 403 });
  }

  const upsellProduct = getShopProductBySlug(upsellSlug);
  if (!upsellProduct) {
    return NextResponse.json({ error: "Unknown upsell product" }, { status: 400 });
  }

  const attempt = await prisma.checkoutAttempt.findFirst({
    where: {
      postCheckoutToken,
      productSlug: primarySlug,
      completedAt: { not: null },
    },
  });

  if (!attempt) {
    return NextResponse.json(
      { error: "Checkout session not found or not ready yet. Refresh in a moment or use standard checkout.", code: "NOT_READY" },
      { status: 404 },
    );
  }

  if (attempt.upsellOneClickSlugs.includes(upsellSlug)) {
    return NextResponse.json({
      ok: true,
      duplicate: true,
      message: "This add-on was already purchased in this session.",
    });
  }

  let customerId = attempt.squareCustomerIdForUpsell;
  let cardId = attempt.squareCardIdForUpsell;

  if (attempt.squarePaymentId && (!cardId || !customerId)) {
    const ctx = await retrieveSquarePaymentCardContext(attempt.squarePaymentId);
    customerId = ctx.customerId ?? customerId;
    cardId = ctx.cardId ?? cardId;
    if (cardId || customerId) {
      await prisma.checkoutAttempt.update({
        where: { id: attempt.id },
        data: {
          squareCustomerIdForUpsell: customerId,
          squareCardIdForUpsell: cardId,
        },
      });
    }
  }

  if (!cardId) {
    return NextResponse.json({
      ok: false,
      fallback: "hosted_checkout",
      message:
        "We can’t charge your saved card from this browser session (e.g. digital wallet). Use secure checkout below.",
    });
  }

  const note = buildUpsellOneClickNote(postCheckoutToken, upsellSlug);
  const idempotencyKey = upsellChargeIdempotencyKey(postCheckoutToken, upsellSlug);

  try {
    const result = await createSquareCardOnFilePayment({
      cardId,
      customerId,
      amountCents: upsellProduct.priceCents,
      note,
      idempotencyKey,
    });

    if ("error" in result) {
      console.error("[upsell-charge]", result.error);
      return NextResponse.json(
        {
          ok: false,
          fallback: "hosted_checkout",
          message: result.error,
        },
        { status: 200 },
      );
    }

    const nextSlugs = [...new Set([...attempt.upsellOneClickSlugs, upsellSlug])];
    await prisma.checkoutAttempt.update({
      where: { id: attempt.id },
      data: {
        upsellOneClickSlugs: nextSlugs,
        squarePaymentId: result.paymentId,
      },
    });

    const refreshed = await retrieveSquarePaymentCardContext(result.paymentId);
    await prisma.checkoutAttempt.update({
      where: { id: attempt.id },
      data: {
        squareCustomerIdForUpsell: refreshed.customerId ?? customerId,
        squareCardIdForUpsell: refreshed.cardId ?? cardId,
      },
    });

    if (attempt.funnelSessionId) {
      try {
        await prisma.funnelAnalyticsEvent.create({
          data: {
            sessionId: attempt.funnelSessionId,
            primarySlug,
            step: "post_upsell_one_click_success",
            revenueCents: upsellProduct.priceCents,
            metadata: { upsellSlug },
          },
        });
      } catch (e) {
        console.error("[upsell-charge] funnel analytics", e);
      }
    }

    return NextResponse.json({
      ok: true,
      paymentId: result.paymentId,
    });
  } catch (e) {
    console.error("[upsell-charge]", e);
    return NextResponse.json(
      {
        ok: false,
        fallback: "hosted_checkout",
        message: "Payment could not be completed. Use checkout below.",
      },
      { status: 200 },
    );
  }
}
