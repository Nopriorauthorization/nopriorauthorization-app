import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// DELETE - Revoke trusted circle access
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const identity = await resolveDocumentIdentity(req);
    
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const where = identity.userId
      ? { id, userId: identity.userId }
      : { id, userId: identity.anonId || "" };

    await prisma.trustedCircleMember.delete({ where });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revoking access:", error);
    return NextResponse.json(
      { error: "Failed to revoke access" },
      { status: 500 }
    );
  }
}
