import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

// GET - Fetch all voice memos
export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);

    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId ? { userId: identity.userId } : { anonId: identity.anonId };

    const memos = await prisma.voiceMemo.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ memos });
  } catch (error) {
    console.error("Error fetching voice memos:", error);
    return NextResponse.json(
      { error: "Failed to fetch voice memos" },
      { status: 500 }
    );
  }
}

// POST - Create a voice memo (audio URL is provided, transcription happens separately)
export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);

    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { audioUrl, title, duration } = await req.json();

    if (!audioUrl) {
      return NextResponse.json(
        { error: "Audio URL is required" },
        { status: 400 }
      );
    }

    const memo = await prisma.voiceMemo.create({
      data: {
        userId: identity.userId || null,
        anonId: identity.anonId || null,
        audioUrl,
        title,
        duration,
        transcript: null, // Will be added via transcribe endpoint
      },
    });

    return NextResponse.json({ success: true, memo });
  } catch (error) {
    console.error("Error creating voice memo:", error);
    return NextResponse.json(
      { error: "Failed to create voice memo" },
      { status: 500 }
    );
  }
}
