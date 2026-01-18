import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

export async function GET() {
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

    // Fetch all documents
    const documents = await prisma.document.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
      },
      orderBy: {
        docDate: "desc",
      },
      select: {
        id: true,
        title: true,
        category: true,
        docDate: true,
        createdAt: true,
      },
    });

    // Fetch chat sessions (as milestones)
    const chatSessions = await prisma.chatSession.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        createdAt: true,
        messages: true,
      },
    });

    // Build timeline events
    const events: any[] = [];

    // Add documents
    documents.forEach((doc) => {
      events.push({
        id: doc.id,
        type: "document",
        title: doc.title,
        category: doc.category,
        date: doc.docDate
          ? new Date(doc.docDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : new Date(doc.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
        timestamp: doc.docDate || doc.createdAt,
      });
    });

    // Add chat milestones (first session, recent sessions)
    chatSessions.forEach((session, idx) => {
      const messages = Array.isArray(session.messages)
        ? session.messages
        : [];
      if (messages.length > 0) {
        events.push({
          id: `chat-${session.id}`,
          type: "chat",
          title: idx === chatSessions.length - 1
            ? "Started Your Circle Journey"
            : "Chat Session",
          category: "CHAT",
          date: new Date(session.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          description: `${messages.length} message${messages.length === 1 ? "" : "s"}`,
          timestamp: session.createdAt,
        });
      }
    });

    // Sort by date (most recent first)
    events.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });

    // Remove timestamp before sending
    const cleanedEvents = events.map(({ timestamp, ...event }) => event);

    return NextResponse.json({ events: cleanedEvents });
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeline" },
      { status: 500 }
    );
  }
}
