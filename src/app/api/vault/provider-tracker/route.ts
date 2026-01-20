import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

// GET - Fetch all provider ratings for current user
export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ ratings: [] });
    }

    const where = identity.userId ? { userId: identity.userId } : { anonId: identity.anonId };

    const ratings = await prisma.providerRating.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ratings });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}

// POST - Submit a new provider rating
export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { providerId, rating, tags, notes, wouldRecommend } = body;

    // Get provider details
    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    const newRating = await prisma.providerRating.create({
      data: {
        userId: identity.userId || null,
        anonId: identity.anonId || null,
        providerId,
        providerName: provider.name,
        specialty: provider.specialty,
        rating,
        tags,
        notes,
        wouldRecommend,
        lastVisit: new Date(),
      },
    });

    return NextResponse.json({ success: true, rating: newRating });
  } catch (error) {
    console.error("Error submitting rating:", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}
