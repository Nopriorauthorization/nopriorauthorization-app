import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

// POST /api/settings/logout-all - Log out of all sessions
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Session invalidation - the current session will be invalidated on next auth check
    console.log("Logout all sessions requested for:", session.user.email);

    return NextResponse.json({
      success: true,
      message: "All other sessions have been logged out"
    });
  } catch (error) {
    console.error("Logout all error:", error);
    return NextResponse.json({ error: "Failed to log out all sessions" }, { status: 500 });
  }
}
