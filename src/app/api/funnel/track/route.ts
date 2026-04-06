export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { FUNNEL_STEPS } from "@/lib/shop/funnel-types";

const STEP_SET = new Set<string>(FUNNEL_STEPS);

export async function POST(req: NextRequest) {
  let body: {
    sessionId?: string;
    primarySlug?: string;
    step?: string;
    revenueCents?: number;
    metadata?: Record<string, unknown>;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  const primarySlug = body.primarySlug?.trim();
  const step = body.step?.trim();

  if (!sessionId || sessionId.length > 128) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }
  if (!primarySlug || primarySlug.length > 200) {
    return NextResponse.json({ error: "primarySlug is required" }, { status: 400 });
  }
  if (!step || !STEP_SET.has(step)) {
    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  }

  const revenue =
    typeof body.revenueCents === "number" && Number.isFinite(body.revenueCents)
      ? Math.max(0, Math.round(body.revenueCents))
      : null;

  try {
    await prisma.funnelAnalyticsEvent.create({
      data: {
        sessionId,
        primarySlug,
        step,
        revenueCents: revenue,
        metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : undefined,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[funnel/track]", e);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
