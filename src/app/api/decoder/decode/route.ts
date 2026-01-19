import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSignedUrl } from "@/lib/storage/supabase";
import { resolveDocumentIdentity } from "@/lib/documents/server";
import { extractText } from "@/lib/decoder/text-extraction";
import { decodeDocument } from "@/lib/decoder/ai-decoder";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

/**
 * POST /api/decoder/decode
 * Decodes a document by extracting text and running AI analysis
 */
export async function POST(request: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(request);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { documentId } = body;

    if (!documentId || typeof documentId !== "string") {
      return NextResponse.json(
        { error: "documentId is required" },
        { status: 400 }
      );
    }

    // Fetch the document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { decode: true },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (
      (identity.userId && document.userId !== identity.userId) ||
      (identity.anonId && document.anonId !== identity.anonId)
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check if already decoded
    if (document.decode) {
      return NextResponse.json({
        success: true,
        decode: {
          id: document.decode.id,
          summary: document.decode.summary,
          keyTerms: document.decode.keyTerms,
          questions: document.decode.questions,
          nextSteps: document.decode.nextSteps,
          safetyNote: document.decode.safetyNote,
          createdAt: document.decode.createdAt,
        },
      });
    }

    // Check file size
    if (document.sizeBytes > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Download the file from storage
    const signedUrl = await createSignedUrl(document.storagePath, 900); // 15 minutes
    const response = await fetch(signedUrl);
    if (!response.ok) {
      throw new Error("Failed to download document from storage");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text
    const extractedText = await extractText(buffer, document.mimeType);

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract sufficient text from document. The document may be blank or corrupted." },
        { status: 400 }
      );
    }

    // Decode with AI
    const decoded = await decodeDocument(extractedText);

    // Save the decode result
    const documentDecode = await prisma.documentDecode.create({
      data: {
        documentId: document.id,
        summary: decoded.summary,
        keyTerms: decoded.keyTerms,
        questions: decoded.questions,
        nextSteps: decoded.nextSteps,
        safetyNote: decoded.safetyNote,
      },
    });

    return NextResponse.json({
      success: true,
      decode: {
        id: documentDecode.id,
        summary: documentDecode.summary,
        keyTerms: documentDecode.keyTerms,
        questions: documentDecode.questions,
        nextSteps: documentDecode.nextSteps,
        safetyNote: documentDecode.safetyNote,
        createdAt: documentDecode.createdAt,
      },
    });
  } catch (error) {
    console.error("Error decoding document:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to decode document" },
      { status: 500 }
    );
  }
}
