export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeCheckoutEmail } from "@/lib/checkout/email";
import { verifySquareWebhook } from "@/lib/square/client";
import {
  parseSquarePaymentNote,
  parseUpsellOneClickNote,
} from "@/lib/square/payment-note";
import { allocatePaymentCentsAcrossSlugs } from "@/lib/checkout/allocate-payment-to-slugs";
import { retrieveSquarePaymentCardContext } from "@/lib/square/payments-api";

const WEBHOOK_URL =
  process.env.SQUARE_WEBHOOK_URL ||
  "https://nopriorauthorization.com/api/square/webhook";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-square-hmacsha256-signature") || "";
  const sigKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY?.trim();

  if (sigKey && !verifySquareWebhook(body, signature, sigKey, WEBHOOK_URL)) {
    console.error("[square/webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    type?: string;
    data?: {
      type?: string;
      id?: string;
      object?: {
        payment?: {
          id?: string;
          status?: string;
          amount_money?: { amount?: number; currency?: string };
          total_money?: { amount?: number; currency?: string };
          note?: string;
          buyer_email_address?: string;
          receipt_url?: string;
          order_id?: string;
        };
      };
    };
  };

  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log(`[square/webhook] Event: ${event.type}`);

  try {
    if (shouldProcessPaymentForDelivery(event)) {
      await handlePaymentCompleted(event);
    }
  } catch (err) {
    console.error("[square/webhook] Handler error:", err);
  }

  return NextResponse.json({ received: true });
}

function extractPaymentFromEvent(event: Record<string, unknown>): Record<
  string,
  unknown
> | undefined {
  const data = event.data as Record<string, unknown> | undefined;
  const obj = data?.object as Record<string, unknown> | undefined;
  return obj?.payment as Record<string, unknown> | undefined;
}

function shouldProcessPaymentForDelivery(event: Record<string, unknown>): boolean {
  const type = String(event.type || "");
  if (type === "payment.completed") {
    return true;
  }
  const payment = extractPaymentFromEvent(event);
  if (!payment) {
    return false;
  }
  const status = String(payment.status || "");
  if (type === "payment.updated" || type === "payment.created") {
    return status === "COMPLETED";
  }
  return false;
}

function stripeSessionIdForSlug(paymentId: string, slug: string, multi: boolean): string {
  if (!multi) {
    return `sq_${paymentId}`;
  }
  return `sq_${paymentId}__${slug}`;
}

function parseProductSlugsFromNote(note: string): string[] {
  const upsell = parseUpsellOneClickNote(note);
  if (upsell) {
    return [upsell.slug];
  }
  let slugs = parseSquarePaymentNote(note);
  if (slugs.length === 0) {
    const legacy = note.match(/^npa:(.+)$/);
    const raw = legacy?.[1]?.trim() ?? "";
    if (raw && !raw.startsWith("multi:") && !raw.startsWith("upsell|")) {
      slugs = [raw];
    }
  }
  return slugs;
}

async function persistCheckoutAttemptAfterPayment(opts: {
  paymentId: string;
  upsellParsed: { token: string; slug: string } | null;
  email: string;
  primarySlug: string;
  pendingAttemptId: string | null;
}) {
  const { paymentId, upsellParsed, email, primarySlug, pendingAttemptId } = opts;
  try {
    const ctx = await retrieveSquarePaymentCardContext(paymentId);
    const base = {
      squarePaymentId: paymentId,
      squareCustomerIdForUpsell: ctx.customerId,
      squareCardIdForUpsell: ctx.cardId,
    };
    if (upsellParsed) {
      await prisma.checkoutAttempt.updateMany({
        where: { postCheckoutToken: upsellParsed.token },
        data: base,
      });
      return;
    }
    if (pendingAttemptId) {
      await prisma.checkoutAttempt.update({
        where: { id: pendingAttemptId },
        data: { ...base, completedAt: new Date() },
      });
      return;
    }
    await prisma.checkoutAttempt.updateMany({
      where: {
        buyerEmail: { equals: email, mode: "insensitive" },
        productSlug: primarySlug,
        completedAt: null,
      },
      data: { completedAt: new Date() },
    });
  } catch (e) {
    console.error("[square/webhook] persistCheckoutAttemptAfterPayment:", e);
    if (!upsellParsed) {
      if (pendingAttemptId) {
        await prisma.checkoutAttempt.update({
          where: { id: pendingAttemptId },
          data: { completedAt: new Date() },
        });
      } else {
        await prisma.checkoutAttempt.updateMany({
          where: {
            buyerEmail: { equals: email, mode: "insensitive" },
            productSlug: primarySlug,
            completedAt: null,
          },
          data: { completedAt: new Date() },
        });
      }
    }
  }
}

async function handlePaymentCompleted(event: Record<string, unknown>) {
  const payment = extractPaymentFromEvent(event);

  if (!payment) {
    console.error("[square/webhook] No payment object in event");
    return;
  }

  const paymentId = String(payment.id || "");
  const rawEmail = String(payment.buyer_email_address || "");
  const email = rawEmail ? normalizeCheckoutEmail(rawEmail) : "";
  const note = String(payment.note || "");
  const totalMoney = payment.total_money as { amount?: number } | undefined;
  const amountMoney = payment.amount_money as { amount?: number } | undefined;
  const amountCents = Number(
    totalMoney?.amount ?? amountMoney?.amount ?? 0,
  );

  const upsellParsed = parseUpsellOneClickNote(note);
  const slugs = parseProductSlugsFromNote(note);

  if (!email) {
    console.error("[square/webhook] No buyer email — cannot deliver");
    return;
  }

  if (slugs.length === 0) {
    console.warn(
      `[square/webhook] No product slug in payment note: "${note}". Payment ID: ${paymentId}`,
    );
    return;
  }

  const multi = slugs.length > 1;
  const allSessionIds = slugs.map((s) => stripeSessionIdForSlug(paymentId, s, multi));
  const existingAll = await prisma.purchase.findMany({
    where: { stripeSessionId: { in: allSessionIds } },
    select: { stripeSessionId: true },
  });
  if (existingAll.length >= slugs.length) {
    console.log(`[square/webhook] Duplicate payment ${paymentId} — skipping`);
    return;
  }

  const existingSet = new Set(existingAll.map((p) => p.stripeSessionId));
  const centsBySlug = allocatePaymentCentsAcrossSlugs(amountCents, slugs);

  let attemptForFunnel: {
    id: string;
    funnelSessionId: string | null;
    selectedBumpSlugs: string[];
    productSlug: string;
  } | null = null;

  if (upsellParsed) {
    const byToken = await prisma.checkoutAttempt.findFirst({
      where: { postCheckoutToken: upsellParsed.token },
    });
    if (byToken) {
      attemptForFunnel = {
        id: byToken.id,
        funnelSessionId: byToken.funnelSessionId,
        selectedBumpSlugs: byToken.selectedBumpSlugs,
        productSlug: byToken.productSlug,
      };
    }
  } else {
    const pending = await prisma.checkoutAttempt.findFirst({
      where: {
        buyerEmail: { equals: email, mode: "insensitive" },
        productSlug: slugs[0],
        completedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });
    if (pending) {
      attemptForFunnel = {
        id: pending.id,
        funnelSessionId: pending.funnelSessionId,
        selectedBumpSlugs: pending.selectedBumpSlugs,
        productSlug: pending.productSlug,
      };
    }
  }

  if (attemptForFunnel?.funnelSessionId) {
    try {
      const primarySlug = upsellParsed ? attemptForFunnel.productSlug : slugs[0]!;
      await prisma.funnelAnalyticsEvent.create({
        data: {
          sessionId: attemptForFunnel.funnelSessionId,
          primarySlug,
          step: "payment_complete",
          revenueCents: amountCents,
          metadata: {
            slugs,
            selectedBumpSlugs: attemptForFunnel.selectedBumpSlugs,
            upsellOneClick: Boolean(upsellParsed),
            upsellSlug: upsellParsed?.slug,
          },
        },
      });
    } catch (e) {
      console.error("[square/webhook] Funnel analytics insert failed:", e);
    }
  }

  const { getVirtualDeliveryProductTitle, getDeliveryProductBySlug } = await import(
    "@/lib/delivery/catalog"
  );
  const { getShopProductBySlug } = await import("@/lib/shop/products");
  const { issueDeliveryToken } = await import("@/lib/delivery/token");
  const { sendEmail } = await import("@/lib/email");
  const { generateDeliveryEmail } = await import("@/lib/email/delivery-email");

  const origin = process.env.NEXTAUTH_URL || "https://nopriorauthorization.com";

  for (const productSlug of slugs) {
    const sessionId = stripeSessionIdForSlug(paymentId, productSlug, multi);
    if (existingSet.has(sessionId)) {
      continue;
    }

    let productTitle = productSlug;
    productTitle =
      getVirtualDeliveryProductTitle(productSlug) ||
      getDeliveryProductBySlug(productSlug)?.productTitle ||
      productTitle;
    const shopProduct = getShopProductBySlug(productSlug);
    if (shopProduct) productTitle = shopProduct.title;

    const shareCents = centsBySlug.get(productSlug) ?? 0;
    const token = issueDeliveryToken({
      productSlug,
      buyerEmail: email,
      orderRef: sessionId,
      expiresInDays: 365,
    });

    const deliveryUrl = `${origin}/delivery/${token}`;

    const purchase = await prisma.purchase.create({
      data: {
        stripeSessionId: sessionId,
        stripePaymentId: paymentId,
        customerEmail: email,
        productSlug,
        productTitle,
        amountPaid: shareCents,
        deliveryToken: token,
      },
    });

    const priceDisplay = `$${(shareCents / 100).toFixed(shareCents % 100 === 0 ? 0 : 2)}`;
    const html = generateDeliveryEmail({
      productTitle,
      deliveryUrl,
      price: priceDisplay,
    });

    const emailResult = await sendEmail({
      to: email,
      subject: `Your ${productTitle} is ready!`,
      html,
    });

    if (emailResult.success) {
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { deliveryEmailSent: true, deliveryEmailAt: new Date() },
      });
      console.log(`[square/webhook] Delivery sent to ${email} for ${productSlug}`);
    } else {
      console.error(`[square/webhook] Email FAILED for ${email}:`, emailResult.message);
    }

    await prisma.analytics.create({
      data: {
        event: "digital_product_purchased",
        metadata: {
          provider: "square",
          productSlug,
          productTitle,
          customerEmail: email,
          amountPaid: shareCents,
          squarePaymentId: paymentId,
          deliveryUrl,
          bundleSlugs: slugs,
          upsellOneClick: Boolean(upsellParsed),
        },
      },
    });
  }

  console.log(`[square/webhook] Purchase complete: ${slugs.join(", ")} → ${email}`);

  try {
    const { pauseFunnelOnPurchase } = await import("@/lib/email-funnel/purchase-hooks");
    for (const s of slugs) {
      await pauseFunnelOnPurchase(email, s);
    }
  } catch (e) {
    console.error("[square/webhook] Funnel pause hook error:", e);
  }

  const pendingAttemptId =
    !upsellParsed && attemptForFunnel && attemptForFunnel.productSlug === slugs[0]
      ? attemptForFunnel.id
      : null;

  await persistCheckoutAttemptAfterPayment({
    paymentId,
    upsellParsed,
    email,
    primarySlug: slugs[0]!,
    pendingAttemptId,
  });
}
