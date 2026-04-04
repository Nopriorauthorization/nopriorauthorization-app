export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { processDueFunnelEmails } from "@/lib/email-funnel/process-due";

/**
 * Vercel Cron: hourly. Sends next step when `nextSendAt` is due.
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

  const result = await processDueFunnelEmails(50);
  return NextResponse.json({ ok: true, ...result });
}
