export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";

/**
 * GET /api/admin/scheduled-posts — list recent posts (all statuses)
 * POST /api/admin/scheduled-posts — queue a scheduled Facebook post
 */
export async function GET(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

  const posts = await prisma.scheduledPost.findMany({
    orderBy: { scheduledAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      caption?: string;
      imageUrl?: string | null;
      scheduledAt?: string;
    };

    const caption = (body.caption ?? "").trim();
    const imageUrl = body.imageUrl?.trim() || null;
    if (!caption && !imageUrl) {
      return NextResponse.json(
        { error: "caption or imageUrl required" },
        { status: 400 }
      );
    }

    const scheduledAt = body.scheduledAt
      ? new Date(body.scheduledAt)
      : null;
    if (!scheduledAt || Number.isNaN(scheduledAt.getTime())) {
      return NextResponse.json(
        { error: "valid scheduledAt (ISO) required" },
        { status: 400 }
      );
    }

    const post = await prisma.scheduledPost.create({
      data: {
        platform: "facebook",
        caption: caption || "(image)",
        imageUrl,
        postType: imageUrl ? "image" : "text",
        scheduledAt,
        status: "pending",
      },
    });

    return NextResponse.json({ post });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
