import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST - Transcribe audio file using OpenAI Whisper
export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);

    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const memoId = formData.get("memoId") as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // Transcribe using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en", // Can be made dynamic based on user preference
    });

    const transcript = transcription.text;

    // If memoId is provided, update existing memo
    if (memoId) {
      const where = identity.userId
        ? { id: memoId, userId: identity.userId }
        : { id: memoId, anonId: identity.anonId };

      const updatedMemo = await prisma.voiceMemo.update({
        where,
        data: { transcript },
      });

      return NextResponse.json({ success: true, memo: updatedMemo, transcript });
    }

    // Otherwise return just the transcript
    return NextResponse.json({ success: true, transcript });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
