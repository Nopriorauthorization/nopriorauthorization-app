import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

// Simple rate limiting: track requests per user
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // 10 requests
const RATE_WINDOW = 60 * 1000; // per minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { vaultName } = await request.json();

    // Validation
    if (!vaultName || typeof vaultName !== "string") {
      return NextResponse.json(
        { error: "vaultName is required" },
        { status: 400 }
      );
    }

    const trimmedName = vaultName.trim();

    if (trimmedName.length === 0) {
      return NextResponse.json(
        { error: "vaultName cannot be empty" },
        { status: 400 }
      );
    }

    if (trimmedName.length > 50) {
      return NextResponse.json(
        { error: "vaultName must be 50 characters or less" },
        { status: 400 }
      );
    }

    // Check if this is a rename (user already has a vaultName)
    const existingMemory = await prisma.userMemory.findUnique({
      where: { userId: user.id },
      select: { vaultName: true },
    });

    const isRename = existingMemory?.vaultName !== null;

    // Upsert UserMemory with vaultName
    const updatedMemory = await prisma.userMemory.upsert({
      where: { userId: user.id },
      update: {
        vaultName: trimmedName,
      },
      create: {
        userId: user.id,
        vaultName: trimmedName,
        goals: [],
        preferences: {},
        topicsDiscussed: [],
      },
    });

    // Log analytics event
    await prisma.analytics.create({
      data: {
        event: isRename ? "vault_name_renamed" : "vault_name_saved",
        userId: user.id,
        metadata: {
          vaultName: trimmedName,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      vaultName: updatedMemory.vaultName,
    });
  } catch (error) {
    console.error("Error saving vault name:", error);
    return NextResponse.json(
      { error: "Failed to save vault name" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        memory: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      vaultName: user.memory?.vaultName || null,
    });
  } catch (error) {
    console.error("Error fetching vault settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch vault settings" },
      { status: 500 }
    );
  }
}
