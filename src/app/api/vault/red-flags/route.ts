import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Fetch all red flags for current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Implement drug interaction detection
    // 1. Parse medications from documents
    // 2. Check interactions using FDA API or local database
    // 3. Return array of flags

    // Mock data for now
    const flags = [];

    return NextResponse.json({ flags });
  } catch (error) {
    console.error("Error fetching flags:", error);
    return NextResponse.json(
      { error: "Failed to fetch flags" },
      { status: 500 }
    );
  }
}
