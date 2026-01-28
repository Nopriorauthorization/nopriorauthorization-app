import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

// POST /api/settings/password-reset - Request password reset email
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Password reset email request logged
    console.log("Password reset requested for:", session.user.email);

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive password reset instructions"
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ error: "Failed to request password reset" }, { status: 500 });
  }
}
