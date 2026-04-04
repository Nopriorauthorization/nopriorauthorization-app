export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

type ResendWebhookBody = {
  type?: string;
  data?: {
    email_id?: string;
    click?: { link?: string };
  };
};

/**
 * Resend webhook: email.opened, email.clicked → analytics + EmailFunnelSend.
 * Optional: set RESEND_WEBHOOK_SECRET and verify Svix signatures in production.
 */
export async function POST(req: NextRequest) {
  // Configure webhook URL in Resend dashboard → Events. Optional: verify Svix signatures
  // using RESEND_WEBHOOK_SECRET + the `svix` package for production hardening.

  let body: ResendWebhookBody;
  try {
    body = (await req.json()) as ResendWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = body.type || "";
  const emailId = body.data?.email_id;

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
