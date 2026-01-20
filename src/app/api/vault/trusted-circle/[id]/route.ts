import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// DELETE - Revoke trusted circle access
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // TODO: Implement revoke logic
    // await db.trustedCircleMember.delete({
    //   where: { 
    //     id,
    //     userId: session.user.id, // Ensure ownership
    //   },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revoking access:", error);
    return NextResponse.json(
      { error: "Failed to revoke access" },
      { status: 500 }
    );
  }
}
