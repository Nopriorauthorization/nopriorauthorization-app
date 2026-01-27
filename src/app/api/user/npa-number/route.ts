import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

/**
 * GET /api/user/npa-number
 * 
 * Returns the authenticated user's NPA Number.
 * 
 * Security:
 * - Requires authentication
 * - Never exposes PHI
 * - No lookup by NPA number
 * - No external access
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user and their NPA identity
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        npaIdentity: {
          select: {
            npaNumber: true,
            createdAt: true,
            revoked: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.npaIdentity) {
      return NextResponse.json(
        { error: "NPA Number not yet assigned" },
        { status: 404 }
      );
    }

    if (user.npaIdentity.revoked) {
      return NextResponse.json(
        { 
          error: "NPA Number has been revoked",
          revoked: true 
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      npaNumber: user.npaIdentity.npaNumber,
      createdAt: user.npaIdentity.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("NPA Number GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve NPA Number" },
      { status: 500 }
    );
  }
}
