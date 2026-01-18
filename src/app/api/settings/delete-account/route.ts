import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

// POST /api/settings/delete-account - Request account deletion
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { accountDeletionRequestedAt: new Date() },
    });

    // TODO: Implement account deletion job
    // This would typically:
    // 1. Queue a deletion job for 30 days from now
    // 2. Send confirmation email
    // 3. Allow user to cancel within 30-day grace period
    // 4. Perform cascading deletion of all user data
    console.log("Account deletion requested for:", session.user.email);

    return NextResponse.json({ 
      success: true, 
      message: "Account deletion scheduled for 30 days from now - contact support to cancel" 
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json({ error: "Failed to request account deletion" }, { status: 500 });
  }
}
