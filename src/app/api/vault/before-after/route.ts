import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);

    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, anonId } = identity;
    const where = userId ? { userId } : { anonId };

    const comparisons = await prisma.photoComparison.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comparisons });
  } catch (error) {
    console.error("Error loading comparisons:", error);
    return NextResponse.json(
      { error: "Failed to load comparisons" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);

    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { beforePhotoId, afterPhotoId, title, notes, category } = await req.json();

    if (!beforePhotoId || !afterPhotoId) {
      return NextResponse.json(
        { error: "Both before and after photo IDs are required" },
        { status: 400 }
      );
    }

    const comparison = await prisma.photoComparison.create({
      data: {
        userId: identity.userId || null,
        anonId: identity.anonId || null,
        beforePhoto: beforePhotoId,
        afterPhoto: afterPhotoId,
        title,
        notes,
        category,
        daysBetween: null, // Calculate from photo metadata later
      },
    });

    return NextResponse.json({ success: true, comparison });
  } catch (error) {
    console.error("Error creating comparison:", error);
    return NextResponse.json(
      { error: "Failed to create comparison" },
      { status: 500 }
    );
  }
}
