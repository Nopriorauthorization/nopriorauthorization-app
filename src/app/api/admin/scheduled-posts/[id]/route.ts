export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";

/**
 * DELETE /api/admin/scheduled-posts/[id] — cancel a pending scheduled post
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.scheduledPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.status !== "pending") {
    return NextResponse.json(
      { error: "Only pending posts can be deleted" },
      { status: 400 }
    );
  }

  await prisma.scheduledPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
