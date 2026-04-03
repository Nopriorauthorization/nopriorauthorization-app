export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { publishToFacebookPage } from "@/lib/facebook/post-to-page";

/**
 * POST /api/social/post-facebook
 * Body: { message?: string, imageUrl?: string | null }
 * Admin only. Immediate publish to Hello Gorgeous Facebook Page (existing env credentials).
 */
export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      message?: string;
      imageUrl?: string | null;
    };
    const result = await publishToFacebookPage({
      message: body.message ?? "",
      imageUrl: body.imageUrl,
    });
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Publish failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
