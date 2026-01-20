import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";
import { uploadAudio, createSignedUrl } from "@/lib/storage/media";

// GET - Fetch all voice memos with fresh signed URLs
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

    // Generate fresh signed URLs for each memo
    const memosWithUrls = await Promise.all(
      memos.map(async (memo) => {
        try {
          // audioUrl field now stores the storage path, generate signed URL
          const signedUrl = await createSignedUrl(memo.audioUrl, 900); // 15 min
          return { ...memo, audioUrl: signedUrl };
        } catch (error) {
          console.error(`Failed to generate signed URL for memo ${memo.id}:`, error);
          return memo; // Return original if URL generation fails
        }
      })
    );

    return NextResponse.json({ memos: memosWithUrls });
  } catch (error) {
    console.error("Error fetching voice memos:", error);
    return NextResponse.json(
      { error: "Failed to fetch voice memos" },
      { status: 500 }
    );
  }
}

// POST - Upload and create a voice memo
export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);

    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const title = formData.get("title") as string | null;
    const duration = formData.get("duration") as string | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // Upload audio to Supabase Storage
    const userId = identity.userId || identity.anonId || "anonymous";
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    
    const { path, url } = await uploadAudio({
      userId,
      file: audioBuffer,
      mimeType: audioFile.type,
    });

    // Create database record with storage path
    const memo = await prisma.voiceMemo.create({
      data: {
        userId: identity.userId || null,
        anonId: identity.anonId || null,
        audioUrl: path, // Store path, not signed URL
        title: title || null,
        duration: duration ? parseInt(duration) : null,
        transcript: null,
      },
    });

    // Return memo with signed URL for immediate playback
    return NextResponse.json({ 
      success: true, 
      memo: { ...memo, audioUrl: url } 
    });
  } catch (error) {
    console.error("Error creating voice memo:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create voice memo" },
      { status: 500 }
    );
  }
}
