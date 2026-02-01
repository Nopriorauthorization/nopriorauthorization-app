import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

/**
 * GET /api/identity - Get current user's NPA identity information
 * 
 * Returns the user's NPA ID and alias for display purposes.
 * No PHI is returned.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      npaId: true,
      npaIdAlias: true,
      npaStatus: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  if (!user.npaId) {
    return NextResponse.json(
      { error: "NPA ID not assigned. Please contact support." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    npaId: user.npaIdAlias || user.npaId.substring(0, 16) + "...",
    status: user.npaStatus,
    memberSince: user.createdAt,
  });
}
