import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const identity = await resolveDocumentIdentity(request);
    const documentId = params.id;

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Find the document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    const hasAccess =
      (identity.userId && document.userId === identity.userId) ||
      (identity.anonId && document.anonId === identity.anonId);

    if (!hasAccess) {
      return NextResponse.json(
        { error: "You don't have permission to access this document" },
        { status: 403 }
      );
    }

    // TODO: Implement the actual blueprint integration
    // For now, we'll just update the document to mark it as included in the blueprint
    // You'll need to determine what "sending to blueprint" means in your application:
    // - Add to a blueprint-specific collection?
    // - Create a link in a blueprint table?
    // - Add metadata to the document?
    
    // Placeholder: Mark as included in packet by default
    await prisma.document.update({
      where: { id: documentId },
      data: { includeInPacketDefault: true },
    });

    return NextResponse.json({
      success: true,
      message: "Document sent to Blueprint successfully",
    });
  } catch (error: any) {
    console.error("Send to Blueprint error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send document to Blueprint" },
      { status: 500 }
    );
  }
}
