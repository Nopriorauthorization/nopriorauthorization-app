import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

// GET - Fetch all red flags for current user
export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ flags: [] });
    }

    const where = identity.userId ? { userId: identity.userId } : { anonId: identity.anonId };

    const flags = await prisma.redFlag.findMany({
      where: {
        ...where,
        dismissed: false,
      },
      orderBy: { detectedAt: "desc" },
    });

    // TODO: Implement real-time drug interaction detection
    // 1. Query user's documents for medication references
    // 2. Parse medication names from prescriptions/notes
    // 3. Check interactions using FDA API or local drug database
    // 4. Create new RedFlag entries for detected interactions
    // 5. Update severity based on interaction level

    return NextResponse.json({ flags });
  } catch (error) {
    console.error("Error fetching flags:", error);
    return NextResponse.json(
      { error: "Failed to fetch flags" },
      { status: 500 }
    );
  }
}
