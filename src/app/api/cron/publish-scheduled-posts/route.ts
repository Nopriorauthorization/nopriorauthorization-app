export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { publishToFacebookPage } from "@/lib/facebook/post-to-page";

/**
 * Vercel Cron: every minute.
 * Secured with Authorization: Bearer CRON_SECRET (set CRON_SECRET in Vercel).
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 }
    );
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const due = await prisma.scheduledPost.findMany({
    where: {
      status: "pending",
      scheduledAt: { lte: now },
      platform: "facebook",
    },
    orderBy: { scheduledAt: "asc" },
    take: 25,
  });

  let published = 0;
  let failed = 0;

  for (const row of due) {
    try {
      const result = await publishToFacebookPage({
        message: row.caption === "(image)" ? "" : row.caption,
        imageUrl: row.imageUrl,
      });
      const fbId =
        (typeof result.post_id === "string" && result.post_id) ||
        (typeof result.id === "string" && result.id) ||
        null;

      await prisma.scheduledPost.update({
        where: { id: row.id },
        data: {
          status: "published",
          fbPostId: fbId,
          errorMsg: null,
        },
      });
      published += 1;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await prisma.scheduledPost.update({
        where: { id: row.id },
        data: {
          status: "failed",
          errorMsg: msg.slice(0, 2000),
        },
      });
      failed += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    checked: due.length,
    published,
    failed,
  });
}
