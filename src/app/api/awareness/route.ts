// =============================================================================
// GET /api/awareness - Get user awareness state
// POST /api/awareness - Record a visit
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAwarenessState, recordVisit } from "@/lib/awareness/service";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const state = await getAwarenessState(session.user.id);

    return NextResponse.json({
      success: true,
      data: state,
    });
  } catch (error) {
    console.error("Error fetching awareness state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch awareness state" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Record the visit
    const visitInfo = await recordVisit(session.user.id);

    return NextResponse.json({
      success: true,
      data: visitInfo,
    });
  } catch (error) {
    console.error("Error recording visit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record visit" },
      { status: 500 }
    );
  }
}
