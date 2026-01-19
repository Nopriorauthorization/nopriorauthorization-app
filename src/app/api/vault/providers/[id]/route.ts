import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

// PUT /api/vault/providers/[id] - Update provider
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

    // Verify provider belongs to user
    const existing = await prisma.provider.findFirst({
      where: { id: params.id, ...where },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, specialty, phone, email, address, notes, tags } = body;

    const provider = await prisma.provider.update({
      where: { id: params.id },
      data: {
        name: name !== undefined ? name : existing.name,
        specialty: specialty !== undefined ? specialty : existing.specialty,
        phone: phone !== undefined ? phone : existing.phone,
        email: email !== undefined ? email : existing.email,
        address: address !== undefined ? address : existing.address,
        notes: notes !== undefined ? notes : existing.notes,
        tags: tags !== undefined ? tags : existing.tags,
      },
    });

    return NextResponse.json({ provider });
  } catch (error) {
    console.error("Error updating provider:", error);
    return NextResponse.json(
      { error: "Failed to update provider" },
      { status: 500 }
    );
  }
}

// DELETE /api/vault/providers/[id] - Delete provider
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

    // Verify provider belongs to user
    const existing = await prisma.provider.findFirst({
      where: { id: params.id, ...where },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    await prisma.provider.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting provider:", error);
    return NextResponse.json(
      { error: "Failed to delete provider" },
      { status: 500 }
    );
  }
}
