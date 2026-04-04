export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

/**
 * One-click unsubscribe from the marketing funnel (GET link in emails).
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")?.trim();
  const origin =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    "https://nopriorauthorization.com";

  if (!token) {
    return NextResponse.redirect(
      new URL("/?funnel_unsub=missing_token", origin),
    );
  }

  const sub = await prisma.emailFunnelSubscriber.findUnique({
    where: { unsubscribeToken: token },
  });

  if (!sub) {
    return NextResponse.redirect(new URL("/?funnel_unsub=invalid", origin));
  }

  await prisma.emailFunnelSubscriber.update({
    where: { id: sub.id },
    data: {
      unsubscribedAt: new Date(),
      stopReason: "unsubscribed",
      nextSendAt: null,
    },
  });

  await prisma.analytics.create({
    data: {
      event: "email_funnel_unsubscribed",
      metadata: { email: sub.email },
    },
  });

  return NextResponse.redirect(new URL("/?funnel_unsub=ok", origin));
}
