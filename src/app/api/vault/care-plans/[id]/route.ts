import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

// PUT: Update care plan
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId
      ? { userId: identity.userId }
      : { anonId: identity.anonId };

    const { id } = params;
    const body = await req.json();

    // Verify ownership
    const existing = await prisma.carePlan.findFirst({
      where: { id, ...where },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Care plan not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.carePlan.update({
      where: { id },
      data: {
        title: body.title,
        goal: body.goal,
        questionsToAsk: body.questionsToAsk,
        linkedDocuments: body.linkedDocuments,
        linkedAppointments: body.linkedAppointments,
        notes: body.notes,
        targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
        status: body.status,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating care plan:", error);
    return NextResponse.json(
      { error: "Failed to update care plan" },
      { status: 500 }
    );
  }
}

// DELETE: Remove care plan
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId
      ? { userId: identity.userId }
      : { anonId: identity.anonId };

    const { id } = params;

    // Verify ownership
    const existing = await prisma.carePlan.findFirst({
      where: { id, ...where },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Care plan not found" },
        { status: 404 }
      );
    }

    await prisma.carePlan.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting care plan:", error);
    return NextResponse.json(
      { error: "Failed to delete care plan" },
      { status: 500 }
    );
  }
}
