import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

/**
 * POST /api/decoder/add-to-packet
 * Adds decoded document to Provider Packet payload
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

    if (!documentId) {
      return NextResponse.json(
        { error: "documentId is required" },
        { status: 400 }
      );
    }

    // Fetch the document and decode
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

    // Create or update provider packet with this document
    const packetPayload = {
      documents: [
        {
          id: document.id,
          title: document.title,
          category: document.category,
          docDate: document.docDate,
          createdAt: document.createdAt,
          ...(document.decode && {
            decodedSummary: document.decode.summary,
            keyTerms: document.decode.keyTerms,
            questions: document.decode.questions,
            nextSteps: document.decode.nextSteps,
          }),
        },
      ],
      generatedAt: new Date().toISOString(),
    };

    // Find existing packet or create new one
    const existingPacket = await prisma.providerPacket.findFirst({
      where: {
        ...(identity.userId ? { userId: identity.userId } : { anonId: identity.anonId }),
      },
      orderBy: { createdAt: 'desc' },
    });

    let packet;
    if (existingPacket) {
      // Add to existing packet
      const existingPayload = existingPacket.payload as any;
      const existingDocs = Array.isArray(existingPayload?.documents) ? existingPayload.documents : [];
      
      // Check if document already exists
      const docExists = existingDocs.some((doc: any) => doc.id === document.id);
      
      if (!docExists) {
        packet = await prisma.providerPacket.update({
          where: { id: existingPacket.id },
          data: {
            payload: {
              ...existingPayload,
              documents: [...existingDocs, packetPayload.documents[0]],
              updatedAt: new Date().toISOString(),
            },
          },
        });
      } else {
        packet = existingPacket;
      }
    } else {
      // Create new packet
      packet = await prisma.providerPacket.create({
        data: {
          userId: identity.userId || undefined,
          anonId: identity.anonId || undefined,
          payload: packetPayload,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Document added to Provider Packet successfully",
      packetId: packet.id,
      documentCount: (Array.isArray((packet.payload as any)?.documents) 
        ? (packet.payload as any).documents.length 
        : 1),
    });
  } catch (error) {
    console.error("Error adding to Provider Packet:", error);
    return NextResponse.json(
      { error: "Failed to add to Provider Packet" },
      { status: 500 }
    );
  }
}
