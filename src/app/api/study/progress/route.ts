export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId") ?? "anatomy-physiology";

  const progress = await prisma.studyProgress.findMany({
    where: { userId: user.id, courseId },
  });

  return NextResponse.json({ progress });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { courseId, lectureId, quizScores, flashcardIdx, cheatViewed } = body;

  const progress = await prisma.studyProgress.upsert({
    where: {
      userId_courseId_lectureId: {
        userId: user.id,
        courseId: courseId ?? "anatomy-physiology",
        lectureId,
      },
    },
    update: {
      ...(quizScores !== undefined && { quizScores }),
      ...(flashcardIdx !== undefined && { flashcardIdx }),
      ...(cheatViewed !== undefined && { cheatViewed }),
      lastStudied: new Date(),
    },
    create: {
      userId: user.id,
      courseId: courseId ?? "anatomy-physiology",
      lectureId,
      quizScores: quizScores ?? {},
      flashcardIdx: flashcardIdx ?? 0,
      cheatViewed: cheatViewed ?? false,
    },
  });

  return NextResponse.json({ progress });
}
