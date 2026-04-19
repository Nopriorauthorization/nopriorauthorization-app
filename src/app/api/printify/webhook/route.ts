export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { generatePhysicalOrderShippedEmail } from "@/lib/email/physical-order-email";
import { verifyPrintifyWebhookSignature } from "@/lib/printify/verify-webhook";

type PrintifyWebhookBody = {
  type?: string;
  resource?: {
    id?: string;
    external_id?: string;
    tracking_number?: string;
    tracking_url?: string;
    carrier?: string;
    shipments?: Array<{ tracking_number?: string; tracking_url?: string; carrier?: string }>;
  };
};

function extractTracking(resource: PrintifyWebhookBody["resource"]): string | null {
  if (!resource || typeof resource !== "object") return null;
  const direct = resource.tracking_number?.trim();
  if (direct) return direct;
  const first = resource.shipments?.[0]?.tracking_number?.trim();
  return first || null;
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const secret = process.env.PRINTIFY_WEBHOOK_SECRET?.trim();
  const sig =
    req.headers.get("x-pfy-signature") ||
    req.headers.get("X-Pfy-Signature") ||
    req.headers.get("x-printify-signature");

  if (secret) {
    if (!verifyPrintifyWebhookSignature(rawBody, sig, secret)) {
      console.error("[printify/webhook] Invalid or missing signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    console.warn(
      "[printify/webhook] PRINTIFY_WEBHOOK_SECRET unset — signature not verified",
    );
  }

  let body: PrintifyWebhookBody;
  try {
    body = JSON.parse(rawBody) as PrintifyWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = String(body.type || "");
  if (type !== "order:shipment:created" && type !== "order:shipped") {
    return NextResponse.json({ received: true, ignored: type || "unknown" });
  }

  const resource = body.resource;
  const printifyOrderId = resource?.id?.trim();
  if (!printifyOrderId) {
    return NextResponse.json({ error: "Missing resource id" }, { status: 400 });
  }

  const trackingNumber = extractTracking(resource);
  const shippedAt = new Date();

  const purchase = await prisma.purchase.findFirst({
    where: { printifyOrderId },
  });

  if (!purchase) {
    console.warn("[printify/webhook] No purchase for Printify order", printifyOrderId);
    return NextResponse.json({ received: true, matched: false });
  }

  await prisma.purchase.update({
    where: { id: purchase.id },
    data: {
      trackingNumber: trackingNumber ?? undefined,
      shippedAt,
    },
  });

  const html = generatePhysicalOrderShippedEmail({
    customerName: purchase.customerName,
    productTitle: purchase.productTitle,
    trackingNumber,
  });

  const sent = await sendEmail({
    to: purchase.customerEmail,
    subject: `Shipped: ${purchase.productTitle}`,
    html,
  });

  if (!sent.success) {
    console.error("[printify/webhook] Shipping email failed:", sent.message);
  }

  await prisma.analytics.create({
    data: {
      event: "printify_order_shipped",
      metadata: {
        purchaseId: purchase.id,
        printifyOrderId,
        trackingNumber,
        emailSent: sent.success,
      },
    },
  });

  return NextResponse.json({ received: true, matched: true });
}
