import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";
import { createSignedUrl, deleteFile } from "@/lib/storage/media";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET - Fetch a specific voice memo
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const identity = await resolveDocumentIdentity(req);

    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const where = identity.userId
      ? { id, userId: identity.userId }
      : { id, anonId: identity.anonId };

    const memo = await prisma.voiceMemo.findUnique({ where });

    if (!memo) {
      return NextResponse.json({ error: "Voice memo not found" }, { status: 404 });
    }

    // Generate fresh signed URL
    try {
      const signedUrl = await createSignedUrl(memo.audioUrl, 900);
      return NextResponse.json({ memo: { ...memo, audioUrl: signedUrl } });
    } catch (error) {
      console.error("Failed to generate signed URL:", error);
      return NextResponse.json({ memo }); // Return with path if URL generation fails
    }
  } catch (error) {
    console.error("Error fetching voice memo:", error);
    return NextResponse.json(
      { error: "Failed to fetch voice memo" },
      { status: 500 }
    );
  }
}

// PATCH - Update voice memo (title or transcript)
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const identity = await resolveDocumentIdentity(req);

    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { title, transcript } = body;

    const where = identity.userId
      ? { id, userId: identity.userId }
      : { id, anonId: identity.anonId };

    const updatedMemo = await prisma.voiceMemo.update({
      where,
      data: {
        ...(title !== undefined && { title }),
        ...(transcript !== undefined && { transcript }),
      },
    });

    return NextResponse.json({ success: true, memo: updatedMemo });
  } catch (error) {
    console.error("Error updating voice memo:", error);
    return NextResponse.json(
      { error: "Failed to update voice memo" },
      { status: 500 }
    );
  }
}

// DELETE - Delete voice memo
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

    // Get memo to retrieve audio path
    const memo = await prisma.voiceMemo.findUnique({ where });

    if (!memo) {
      return NextResponse.json({ error: "Voice memo not found" }, { status: 404 });
    }

    // Delete from database
    await prisma.voiceMemo.delete({ where });

    // Delete audio file from storage
    try {
      await deleteFile(memo.audioUrl);
    } catch (error) {
      console.error("Failed to delete audio file:", error);
      // Continue even if file deletion fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting voice memo:", error);
    return NextResponse.json(
      { error: "Failed to delete voice memo" },
      { status: 500 }
    );
  }
}
