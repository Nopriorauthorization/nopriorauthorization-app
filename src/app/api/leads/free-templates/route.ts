import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { FREE_TEMPLATES_LEAD_SOURCE } from "@/config/free-templates-lead-magnet.config";
import { signupFreeTemplatesLead } from "@/lib/leads/free-templates-signup";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { firstName?: string; email?: string; source?: string };
  try {
    body = (await req.json()) as { firstName?: string; email?: string; source?: string };
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const firstName = (body.firstName ?? "").trim() || "there";
  const source = (body.source ?? FREE_TEMPLATES_LEAD_SOURCE).trim() || FREE_TEMPLATES_LEAD_SOURCE;

  if (source !== FREE_TEMPLATES_LEAD_SOURCE) {
    return NextResponse.json({ error: "Unsupported source" }, { status: 400 });
  }

  await prisma.analytics.create({
    data: {
      event: "lead_free_templates_submit",
      metadata: { email, source },
    },
  });

  const result = await signupFreeTemplatesLead(firstName, email);

  if (!result.ok) {
    if (result.error === "invalid_email") {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Could not send your email — try again in a moment." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    leadId: result.lead.id,
  });
}
