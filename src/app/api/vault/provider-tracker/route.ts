import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Fetch all provider ratings for current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Create ProviderRating model in Prisma schema
    // For now, return empty array
    return NextResponse.json({ ratings: [] });
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { providerId, rating, tags, notes, wouldRecommend } = body;

    // TODO: Create ProviderRating model and implement:
    // const newRating = await db.providerRating.create({
    //   data: {
    //     userId: session.user.id,
    //     providerId,
    //     rating,
    //     tags,
    //     notes,
    //     wouldRecommend,
    //     lastVisit: new Date(),
    //   },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting rating:", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}
