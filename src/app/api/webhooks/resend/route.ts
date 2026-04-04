export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import prisma from "@/lib/db";

type ResendWebhookBody = {
  type?: string;
  data?: {
    email_id?: string;
    click?: { link?: string };
  };
};

function extractEmailId(body: ResendWebhookBody): string | undefined {
  const id = body.data?.email_id;
  if (typeof id === "string" && id.length > 0) return id;
  return undefined;
}

/**
 * Resend webhooks (Svix-signed): email.opened, email.clicked → DB + Analytics.
 *
 * - Production (VERCEL_ENV=production): RESEND_WEBHOOK_SECRET required; invalid/missing signature → 401.
 * - Non-production: if secret set, verify; if not set, accept JSON (local testing only).
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const secret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  const isVercelProduction = process.env.VERCEL_ENV === "production";

  if (isVercelProduction && !secret) {
    return NextResponse.json(
      { error: "RESEND_WEBHOOK_SECRET is required in production" },
      { status: 503 },
    );
  }

  let body: ResendWebhookBody;

  if (secret) {
    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");
    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: "Missing Svix headers" }, { status: 401 });
    }
    try {
      const wh = new Webhook(secret);
      const verified = wh.verify(rawBody, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ResendWebhookBody;
      body = verified;
    } catch {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }
  } else {
    try {
      body = JSON.parse(rawBody) as ResendWebhookBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  }

  const type = body.type || "";
  const emailId = extractEmailId(body);

  if (!emailId) {
    return NextResponse.json({ received: true });
  }

  if (type === "email.opened") {
    await prisma.emailFunnelSend.updateMany({
      where: { resendEmailId: emailId, openedAt: null },
      data: { openedAt: new Date() },
    });
    await prisma.analytics.create({
      data: {
        event: "email_funnel_opened",
        metadata: { resendEmailId: emailId },
      },
    });
  }

  if (type === "email.clicked") {
    await prisma.emailFunnelSend.updateMany({
      where: { resendEmailId: emailId },
      data: { clickedAt: new Date() },
    });
    await prisma.analytics.create({
      data: {
        event: "email_funnel_clicked",
        metadata: {
          resendEmailId: emailId,
          link: body.data?.click?.link,
        },
      },
    });
  }

  return NextResponse.json({ received: true });
}
