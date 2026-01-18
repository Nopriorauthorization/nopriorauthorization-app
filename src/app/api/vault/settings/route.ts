import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { vaultName } = await request.json();

    if (!vaultName || typeof vaultName !== "string") {
      return NextResponse.json(
        { error: "vaultName is required" },
        { status: 400 }
      );
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upsert UserMemory with vaultName
    const updatedMemory = await prisma.userMemory.upsert({
      where: { userId: user.id },
      update: {
        vaultName: vaultName.trim(),
      },
      create: {
        userId: user.id,
        vaultName: vaultName.trim(),
        goals: [],
        preferences: {},
        topicsDiscussed: [],
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
