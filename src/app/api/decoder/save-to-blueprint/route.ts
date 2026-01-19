import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { documentId, decodeId } = body;

    if (!documentId || !decodeId) {
      return NextResponse.json(
        { error: "documentId and decodeId are required" },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { decode: true },
    });

    if (!document || !document.decode) {
      return NextResponse.json(
        { error: "Document or decode not found" },
        { status: 404 }
      );
    }

    if (
      (identity.userId && document.userId !== identity.userId) ||
      (identity.anonId && document.anonId !== identity.anonId)
    ) {
      return NextResponse.json(
        { error: "Forbidden: You don't own this document" },
        { status: 403 }
      );
    }

    const existing = await prisma.userMemory.findFirst({
      where: identity.userId
        ? { userId: identity.userId }
        : { anonId: identity.anonId || undefined },
    });

    const newInsight = {
      id: decodeId,
      type: "decoded_document",
      documentId,
      documentTitle: document.title,
      summary: document.decode.summary,
      questions: document.decode.questions,
      nextSteps: document.decode.nextSteps,
      createdAt: new Date().toISOString(),
    };

    let userMemory: any;
    if (existing) {
      const currentGoals = typeof existing.goals === 'object' && existing.goals !== null ? existing.goals as any : {};
      const currentInsights = Array.isArray(currentGoals?.insights) ? currentGoals.insights : [];
      userMemory = await prisma.userMemory.update({
        where: { id: existing.id },
        data: { goals: { ...currentGoals, insights: [...currentInsights, newInsight] } },
      });
    } else {
      userMemory = await prisma.userMemory.create({
        data: {
          userId: identity.userId || undefined,
          anonId: identity.anonId || undefined,
          goals: { insights: [newInsight] },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Decode saved to Blueprint successfully",
      insightId: decodeId,
    });
  } catch (error: any) {
    console.error("Error saving to Blueprint:", error);
    return NextResponse.json(
      { error: "Failed to save to Blueprint", details: error.message },
      { status: 500 }
    );
  }
}
