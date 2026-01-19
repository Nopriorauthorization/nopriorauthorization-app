const fs = require('fs');
const path = require('path');

const apiContent = `import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

// PUT: Update priority
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
    const existing = await prisma.priority.findFirst({
      where: { id, ...where },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Priority not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.priority.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        status: body.status,
        linkedAppointment: body.linkedAppointment,
        linkedCareTeam: body.linkedCareTeam,
        linkedCarePlan: body.linkedCarePlan,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        completedAt:
          body.status === "completed" && !existing.completedAt
            ? new Date()
            : body.status === "active"
            ? null
            : existing.completedAt,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating priority:", error);
    return NextResponse.json(
      { error: "Failed to update priority" },
      { status: 500 }
    );
  }
}

// DELETE: Remove priority
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
    const existing = await prisma.priority.findFirst({
      where: { id, ...where },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Priority not found" },
        { status: 404 }
      );
    }

    await prisma.priority.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting priority:", error);
    return NextResponse.json(
      { error: "Failed to delete priority" },
      { status: 500 }
    );
  }
}
`;

const outputPath = path.join(__dirname, '../src/app/api/vault/priority/[id]/route.ts');
const dir = path.dirname(outputPath);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, apiContent, 'utf8');
console.log('✅ Priority [id] API successfully written to', outputPath);
