export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
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

  if (event.type === "payment.completed") {
    try {
      await handlePaymentCompleted(event);
    } catch (err) {
      console.error("[square/webhook] Handler error:", err);
    }
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentCompleted(event: Record<string, unknown>) {
  const data = event.data as Record<string, unknown> | undefined;
  const obj = data?.object as Record<string, unknown> | undefined;
  const payment = obj?.payment as Record<string, unknown> | undefined;

  if (!payment) {
    console.error("[square/webhook] No payment object in event");
    return;
  }

  const paymentId = String(payment.id || "");
  const email = String(payment.buyer_email_address || "");
  const note = String(payment.note || "");
  const totalMoney = payment.total_money as
    | { amount?: number }
    | undefined;
  const amountCents = Number(totalMoney?.amount || 0);

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
    const { getShopProductBySlug } = await import("@/lib/shop/products");
    const product = getShopProductBySlug(productSlug);
    if (product) productTitle = product.title;
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
}
