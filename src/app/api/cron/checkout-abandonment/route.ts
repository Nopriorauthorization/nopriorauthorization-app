export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { processAbandonedCheckoutReminders } from "@/lib/checkout/process-abandoned";

/**
 * Vercel Cron: every 15 minutes. Sends Resend reminder ~1h after checkout link was issued.
 * Authorization: Bearer CRON_SECRET
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 },
    );
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await processAbandonedCheckoutReminders(50);
  return NextResponse.json({ ok: true, ...result });
}
