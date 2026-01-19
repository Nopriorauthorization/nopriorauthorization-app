import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

type TimelineEvent = {
  id: string;
  type: "document" | "chat" | "milestone";
  title: string;
  category: string;
  date: string;
  description?: string;
  metadata?: Record<string, any>;
  timestamp: Date | string;
};

function extractChatTopic(messages: any[]): string {
  if (!Array.isArray(messages) || messages.length === 0) return "General conversation";
  
  // Try to find a user message to extract topic
  const userMessages = messages.filter((m: any) => m.role === "user");
  if (userMessages.length > 0) {
    const firstMsg = userMessages[0].content || "";
    // Extract first sentence or truncate
    const topic = firstMsg.split(/[.!?]/)[0].trim();
    return topic.length > 60 ? topic.substring(0, 57) + "..." : topic;
  }
  
  return "Health discussion";
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    LAB_RESULT: "🧪",
    IMAGING: "📊",
    PRESCRIPTION: "💊",
    REFERRAL: "📋",
    INSURANCE: "🏥",
    BILLING: "💳",
    OTHER: "📄",
    CHAT: "💬",
  };
  return icons[category] || "📄";
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query params for filtering
    const { searchParams } = new URL(req.url);
    const filterType = searchParams.get("type") || "all"; // all, documents, chats, milestones

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all documents with enhanced data
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
        mimeType: true,
        sizeBytes: true,
      },
    });

    // Fetch chat sessions with full context
    const chatSessions = await prisma.chatSession.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        messages: true,
      },
    });

    // Build timeline events
    const events: TimelineEvent[] = [];

    // Add documents if not filtered out
    if (filterType === "all" || filterType === "documents") {
      documents.forEach((doc) => {
        const displayDate = doc.docDate || doc.createdAt;
        events.push({
          id: doc.id,
          type: "document",
          title: doc.title,
          category: doc.category,
          date: new Date(displayDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          description: `${getCategoryIcon(doc.category)} ${doc.category.replace(/_/g, " ").toLowerCase()}`,
          metadata: {
            mimeType: doc.mimeType,
            sizeKB: Math.round(doc.sizeBytes / 1024),
            downloadUrl: `/api/documents/${doc.id}/download`,
          },
          timestamp: displayDate,
        });
      });
    }

    // Add chat sessions if not filtered out
    if (filterType === "all" || filterType === "chats") {
      chatSessions.forEach((session, idx) => {
        const messages = Array.isArray(session.messages) ? session.messages : [];
        if (messages.length > 0) {
          const topic = extractChatTopic(messages);
          const isFirstSession = idx === chatSessions.length - 1;
          
          events.push({
            id: `chat-${session.id}`,
            type: "chat",
            title: isFirstSession ? "Started Your Circle Journey 🎉" : topic,
            category: "CHAT",
            date: new Date(session.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            description: `${getCategoryIcon("CHAT")} ${messages.length} message${messages.length === 1 ? "" : "s"}`,
            metadata: {
              messageCount: messages.length,
              lastUpdated: session.updatedAt,
              chatUrl: `/chat?session=${session.id}`,
            },
            timestamp: session.createdAt,
          });
        }
      });
    }

    // Add milestones if not filtered out
    if (filterType === "all" || filterType === "milestones") {
      // Account creation milestone
      events.push({
        id: "milestone-created",
        type: "milestone",
        title: "Joined Ask Beau 💫",
        category: "MILESTONE",
        date: new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        description: "Welcome to your health journey",
        timestamp: user.createdAt,
      });

      // Document count milestones
      if (documents.length >= 5 && documents.length < 10) {
        events.push({
          id: "milestone-docs-5",
          type: "milestone",
          title: "5 Documents Uploaded 📚",
          category: "MILESTONE",
          date: new Date(documents[4].createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          description: "Building your health archive",
          timestamp: documents[4].createdAt,
        });
      } else if (documents.length >= 10) {
        events.push({
          id: "milestone-docs-10",
          type: "milestone",
          title: "10+ Documents Archived 🏆",
          category: "MILESTONE",
          date: new Date(documents[9].createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          description: "Your vault is growing strong",
          timestamp: documents[9].createdAt,
        });
      }
    }

    // Sort by date (most recent first)
    events.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });

    // Remove timestamp before sending
    const cleanedEvents = events.map(({ timestamp, ...event }) => event);

    return NextResponse.json({
      events: cleanedEvents,
      stats: {
        total: cleanedEvents.length,
        documents: documents.length,
        chats: chatSessions.length,
        milestones: cleanedEvents.filter((e) => e.type === "milestone").length,
      },
    });
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeline" },
      { status: 500 }
    );
  }
}
