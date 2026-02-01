export const dynamic = "force-dynamic";
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;
  const anonId = request.cookies.get("npa_uid")?.value ?? null;

  if (!userId && !anonId) {
    return NextResponse.json(
      { error: "No memory context found." },
      { status: 400 }
    );
  }

  if (userId) {
    await prisma.userMemory.upsert({
      where: { userId },
      update: {
        optOut: true,
        goals: [],
        preferences: {},
        topicsDiscussed: [],
      },
      create: {
        userId,
        optOut: true,
      },
    });
  } else if (anonId) {
    await prisma.userMemory.upsert({
      where: { anonId },
      update: {
        optOut: true,
        goals: [],
        preferences: {},
        topicsDiscussed: [],
      },
      create: {
        anonId,
        optOut: true,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
