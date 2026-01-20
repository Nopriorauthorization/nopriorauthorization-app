import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";
import { deleteFile } from "@/lib/storage/media";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const identity = await resolveDocumentIdentity(req);

    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const where = identity.userId
      ? { id, userId: identity.userId }
      : { id, anonId: identity.anonId };

    // Get comparison to retrieve photo paths
    const comparison = await prisma.photoComparison.findUnique({ where });

    if (!comparison) {
      return NextResponse.json({ error: "Comparison not found" }, { status: 404 });
    }

    // Delete from database
    await prisma.photoComparison.delete({ where });

    // Delete photos from storage
    try {
      await Promise.all([
        deleteFile(comparison.beforePhoto),
        deleteFile(comparison.afterPhoto),
      ]);
    } catch (error) {
      console.error("Failed to delete photo files:", error);
      // Continue even if file deletion fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comparison:", error);
    return NextResponse.json(
      { error: "Failed to delete comparison" },
      { status: 500 }
    );
  }
}
