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

    // For now, return empty array since we need to create the PhotoComparison model
    // This will be implemented once we add the Prisma schema
    return NextResponse.json({
      comparisons: [],
      message: "Feature coming soon - Photo comparison model needs to be added to schema",
    });
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

    const { beforePhotoId, afterPhotoId } = await req.json();

    if (!beforePhotoId || !afterPhotoId) {
      return NextResponse.json(
        { error: "Both before and after photo IDs are required" },
        { status: 400 }
      );
    }

    // TODO: Create PhotoComparison in database
    // For now, return success message
    return NextResponse.json({
      success: true,
      message: "Comparison created (schema update needed)",
    });
  } catch (error) {
    console.error("Error creating comparison:", error);
    return NextResponse.json(
      { error: "Failed to create comparison" },
      { status: 500 }
    );
  }
}
