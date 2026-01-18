import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

// POST /api/settings/export - Request complete data export
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { dataExportRequestedAt: new Date() },
    });

    // TODO: Implement data export job
    // This would typically:
    // 1. Queue a background job to compile all user data
    // 2. Generate a secure download link
    // 3. Email the user when ready
    console.log("Data export requested for:", session.user.email);

    return NextResponse.json({ 
      success: true, 
      message: "Data export queued - you'll receive an email within 48 hours" 
    });
  } catch (error) {
    console.error("Data export error:", error);
    return NextResponse.json({ error: "Failed to request data export" }, { status: 500 });
  }
}
