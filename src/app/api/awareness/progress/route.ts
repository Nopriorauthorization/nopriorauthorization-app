// =============================================================================
// GET /api/awareness/progress - Get progress snapshot for vault dashboard
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProgressSnapshot } from "@/lib/awareness/service";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const snapshot = await getProgressSnapshot(session.user.id);

    return NextResponse.json({
      success: true,
      data: snapshot,
    });
  } catch (error) {
    console.error("Error fetching progress snapshot:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
