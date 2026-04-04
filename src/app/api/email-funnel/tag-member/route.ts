export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { pauseFunnelOnMembership } from "@/lib/email-funnel/purchase-hooks";

/**
 * Internal / Zapier: mark email as member and stop promo funnel.
 * Authorization: Bearer EMAIL_FUNNEL_EVENTS_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = process.env.EMAIL_FUNNEL_EVENTS_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "EMAIL_FUNNEL_EVENTS_SECRET not configured" },
      { status: 500 },
    );
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { email?: string };
  try {
    body = (await req.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email?.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  await pauseFunnelOnMembership(email);
  return NextResponse.json({ ok: true });
}
