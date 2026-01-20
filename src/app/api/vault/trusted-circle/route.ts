import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

// GET - Fetch trusted circle members
export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId ? { userId: identity.userId } : { userId: identity.anonId || "" };

    const members = await prisma.trustedCircleMember.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
