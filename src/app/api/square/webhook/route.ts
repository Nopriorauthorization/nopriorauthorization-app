export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeCheckoutEmail } from "@/lib/checkout/email";
import { verifySquareWebhook } from "@/lib/square/client";

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

  /**
   * Square's Payments webhooks are `payment.created` and `payment.updated` (see
   * Webhook Events Reference). Completion is indicated by `payment.status === "COMPLETED"`
   * on `payment.updated`, not a separate `payment.completed` event. We still accept
   * `payment.completed` if present on older subscriptions.
   */
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

  const slugMatch = note.match(/^npa:(.+)$/);
  const productSlug = slugMatch?.[1] || "";

  if (!email) {
    console.error("[square/webhook] No buyer email — cannot deliver");
    return;
  }

  if (!productSlug) {
    console.warn(
      `[square/webhook] No product slug in payment note: "${note}". Payment ID: ${paymentId}`,
    );
  }

  const existing = await prisma.purchase.findFirst({
    where: { stripeSessionId: `sq_${paymentId}` },
  });
  if (existing) {
    console.log(`[square/webhook] Duplicate payment ${paymentId} — skipping`);
    return;
  }

  let productTitle = productSlug || "Digital Product";
  try {
    const { getVirtualDeliveryProductTitle, getDeliveryProductBySlug } = await import(
      "@/lib/delivery/catalog"
    );
    productTitle =
      getVirtualDeliveryProductTitle(productSlug) ||
      getDeliveryProductBySlug(productSlug)?.productTitle ||
      productTitle;
    const { getShopProductBySlug } = await import("@/lib/shop/products");
    const shopProduct = getShopProductBySlug(productSlug);
    if (shopProduct) productTitle = shopProduct.title;
  } catch {
    // non-critical
  }

  const { issueDeliveryToken } = await import("@/lib/delivery/token");
  const token = issueDeliveryToken({
    productSlug: productSlug || "unknown-product",
    buyerEmail: email,
    orderRef: `sq_${paymentId}`,
    expiresInDays: 365,
  });

  const origin = process.env.NEXTAUTH_URL || "https://nopriorauthorization.com";
  const deliveryUrl = `${origin}/delivery/${token}`;

  const purchase = await prisma.purchase.create({
    data: {
      stripeSessionId: `sq_${paymentId}`,
      stripePaymentId: paymentId,
      customerEmail: email,
      productSlug: productSlug || "unknown",
      productTitle,
      amountPaid: amountCents,
      deliveryToken: token,
    },
  });

  const { sendEmail } = await import("@/lib/email");
  const { generateDeliveryEmail } = await import("@/lib/email/delivery-email");
  const priceDisplay = `$${(amountCents / 100).toFixed(amountCents % 100 === 0 ? 0 : 2)}`;

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
        amountPaid: amountCents,
        squarePaymentId: paymentId,
        deliveryUrl,
      },
    },
  });

  console.log(`[square/webhook] Purchase complete: ${productSlug} → ${email}`);

  try {
    const { pauseFunnelOnPurchase } = await import("@/lib/email-funnel/purchase-hooks");
    await pauseFunnelOnPurchase(email, productSlug || "");
  } catch (e) {
    console.error("[square/webhook] Funnel pause hook error:", e);
  }

  if (productSlug) {
    await prisma.checkoutAttempt.updateMany({
      where: {
        buyerEmail: { equals: email, mode: "insensitive" },
        productSlug,
        completedAt: null,
      },
      data: { completedAt: new Date() },
    });
  }
}
