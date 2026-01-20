import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";
import { createSignedUrl } from "@/lib/storage/media";

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

    // Generate signed URLs for photos
    const comparisonsWithUrls = await Promise.all(
      comparisons.map(async (comp) => {
        try {
          const beforeUrl = await createSignedUrl(comp.beforePhoto, 900);
          const afterUrl = await createSignedUrl(comp.afterPhoto, 900);
          return { ...comp, beforePhoto: beforeUrl, afterPhoto: afterUrl };
        } catch (error) {
          console.error(`Failed to generate URLs for comparison ${comp.id}:`, error);
          return comp; // Return original if URL generation fails
        }
      })
    );

    return NextResponse.json({ comparisons: comparisonsWithUrls });
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

    const { beforePhoto, afterPhoto, title, notes, category } = await req.json();

    if (!beforePhoto || !afterPhoto) {
      return NextResponse.json(
        { error: "Both before and after photo paths are required" },
        { status: 400 }
      );
    }

    const comparison = await prisma.photoComparison.create({
      data: {
        userId: identity.userId || null,
        anonId: identity.anonId || null,
        beforePhoto, // Storage path
        afterPhoto, // Storage path
        title,
        notes,
        category,
        daysBetween: null, // Can be calculated from EXIF metadata later
      },
    });

    // Return with signed URLs
    const beforeUrl = await createSignedUrl(comparison.beforePhoto, 900);
    const afterUrl = await createSignedUrl(comparison.afterPhoto, 900);

    return NextResponse.json({
      success: true,
      comparison: {
        ...comparison,
        beforePhoto: beforeUrl,
        afterPhoto: afterUrl,
      },
    });
  } catch (error) {
    console.error("Error creating comparison:", error);
    return NextResponse.json(
      { error: "Failed to create comparison" },
      { status: 500 }
    );
  }
}
