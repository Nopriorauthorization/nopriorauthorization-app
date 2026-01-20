import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// PATCH - Dismiss a red flag
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    // TODO: Implement dismiss logic
    // await db.redFlag.update({
    //   where: { id },
    //   data: { dismissed: body.dismissed },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error dismissing flag:", error);
    return NextResponse.json(
      { error: "Failed to dismiss flag" },
      { status: 500 }
    );
  }
}
