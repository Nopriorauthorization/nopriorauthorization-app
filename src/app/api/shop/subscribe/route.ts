import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { enrollLeadFromSignup } from "@/lib/email-funnel/enroll";

const SOURCE_ALIASES: Record<string, string> = {
  "free-templates-cta": "shop_email_capture",
  sticky_bar: "sticky_bar",
  resources: "shop_resources",
  homepage: "homepage",
};

export async function POST(req: NextRequest) {
  let body: { email?: string; source?: string };
  try {
    body = (await req.json()) as { email?: string; source?: string };
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const rawSource = body.source?.trim() || "shop_email_capture";
  const source = SOURCE_ALIASES[rawSource] || rawSource;

  await prisma.analytics.create({
    data: {
      event: "shop_email_subscribe",
      metadata: { email, source: rawSource },
    },
  });

  const funnel = await enrollLeadFromSignup(email, source);

  if (!funnel.ok && funnel.skipped === "send_failed") {
    return NextResponse.json(
      { ok: false, error: "Could not start sequence — try again later." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    funnel: {
      skipped: funnel.skipped ?? null,
      stepId: funnel.stepId ?? null,
    },
  });
}
