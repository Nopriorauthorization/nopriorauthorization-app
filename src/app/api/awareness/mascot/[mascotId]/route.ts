// =============================================================================
// GET /api/awareness/mascot/[mascotId] - Get mascot-specific memory
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getMascotMemory } from "@/lib/awareness/service";
import { MascotSource } from "@/lib/awareness/types";

const VALID_MASCOTS: MascotSource[] = [
  "decode",
  "roots",
  "harmony",
  "peppi",
  "slim-t",
  "beau-tox",
  "filla-grace",
  "vault",
  "blueprint",
  "general",
];

export async function GET(
  request: NextRequest,
  { params }: { params: { mascotId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const mascotId = params.mascotId as MascotSource;

    // Handle "root" as alias for "roots"
    const normalizedMascotId = mascotId === "root" ? "roots" : mascotId;

    if (!VALID_MASCOTS.includes(normalizedMascotId as MascotSource)) {
      return NextResponse.json(
        { success: false, error: "Invalid mascot ID" },
        { status: 400 }
      );
    }

    const memory = await getMascotMemory(session.user.id, normalizedMascotId as MascotSource);

    return NextResponse.json({
      success: true,
      data: memory,
    });
  } catch (error) {
    console.error("Error fetching mascot memory:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mascot memory" },
      { status: 500 }
    );
  }
}
