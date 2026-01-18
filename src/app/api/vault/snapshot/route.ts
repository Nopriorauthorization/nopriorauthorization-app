import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        memory: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch recent documents
    const recentDocuments = await prisma.document.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
      },
      orderBy: {
        docDate: "desc",
      },
      take: 5,
      select: {
        title: true,
        category: true,
        docDate: true,
      },
    });

    // Format snapshot data
    const memory = user.memory;
    const goals = (memory?.goals as string[]) ?? [];
    const preferences = (memory?.preferences as any) ?? {};
    const topicsDiscussed = (memory?.topicsDiscussed as string[]) ?? [];

    const snapshot = {
      goals,
      preferences,
      topicsDiscussed,
      recentDocuments: recentDocuments.map((doc) => ({
        title: doc.title,
        category: doc.category,
        date: doc.docDate
          ? new Date(doc.docDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "No date",
      })),
    };

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("Error fetching snapshot:", error);
    return NextResponse.json(
      { error: "Failed to fetch snapshot" },
      { status: 500 }
    );
  }
}
