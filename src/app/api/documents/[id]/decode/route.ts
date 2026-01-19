import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

/**
 * GET /api/documents/:id/decode
 * Get the decode result for a specific document
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const identity = await resolveDocumentIdentity(request);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const documentId = params.id;

    // Fetch the document with decode
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

    if (!document.decode) {
      return NextResponse.json(
        { error: "Document has not been decoded yet" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        category: document.category,
        docDate: document.docDate,
        createdAt: document.createdAt,
      },
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
  } catch (error) {
    console.error("Error fetching decode:", error);
    return NextResponse.json(
      { error: "Failed to fetch decode" },
      { status: 500 }
    );
  }
}
