export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

interface ChatMessage {
  role: string;
  content: string;
  timestamp?: string;
}

interface HealthTopic {
  topic: string;
  category: string;
  chatCount: number;
  lastDiscussed: string;
}

// Extract health topics from chat sessions
function extractHealthTopics(chatSessions: any[]): HealthTopic[] {
  const categoryKeywords: Record<string, string[]> = {
    "Mental Health": ["anxiety", "depression", "stress", "mental health", "therapy", "counseling", "mood", "panic", "ptsd"],
    "Pain Management": ["pain", "chronic pain", "back pain", "headache", "migraine", "arthritis", "fibromyalgia"],
    "Medications": ["medication", "prescription", "pill", "drug", "pharmacy", "dosage", "side effects", "refill"],
    "Diagnosis": ["diagnosis", "diagnosed", "condition", "disease", "disorder", "syndrome", "test results"],
    "Treatment Options": ["treatment", "surgery", "procedure", "therapy", "physical therapy", "surgery", "operation"],
    "Lab Results": ["lab", "blood test", "results", "bloodwork", "labs", "test", "screening"],
    "Nutrition": ["diet", "nutrition", "food", "eating", "weight", "vitamin", "supplement"],
    "Exercise": ["exercise", "fitness", "workout", "physical activity", "gym", "walking", "running"],
    "Appointments": ["appointment", "doctor", "visit", "consultation", "follow-up", "checkup"],
    "Insurance": ["insurance", "coverage", "claim", "copay", "deductible", "prior auth", "authorization"]
  };

  const topicMap = new Map<string, { category: string; count: number; lastDate: Date }>();

  chatSessions.forEach((session) => {
    const messages = Array.isArray(session.messages) ? session.messages : [];
    const userMessages = messages
      .filter((m: ChatMessage) => m.role === "user")
      .map((m: ChatMessage) => m.content.toLowerCase());

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      keywords.forEach((keyword) => {
        const matchingMessages = userMessages.filter((msg: string) => msg.includes(keyword));
        if (matchingMessages.length > 0) {
          const existing = topicMap.get(keyword);
          if (existing) {
            existing.count += matchingMessages.length;
            if (session.updatedAt > existing.lastDate) {
              existing.lastDate = session.updatedAt;
            }
          } else {
            topicMap.set(keyword, {
              category,
              count: matchingMessages.length,
              lastDate: session.updatedAt
            });
          }
        }
      });
    });
  });

  // Convert to array and sort by count
  return Array.from(topicMap.entries())
    .map(([topic, data]) => ({
      topic,
      category: data.category,
      chatCount: data.count,
      lastDiscussed: data.lastDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    }))
    .sort((a, b) => b.chatCount - a.chatCount)
    .slice(0, 8);
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const anonId = cookieStore.get("anon_id")?.value || cookieStore.get("npa_uid")?.value;

    if (!anonId) {
      return NextResponse.json(
        { error: "No user identified" },
        { status: 401 }
      );
    }

    // Get or create user memory
    let userMemory = await prisma.userMemory.findFirst({
      where: { anonId }
    });

    if (!userMemory) {
      userMemory = await prisma.userMemory.create({
        data: {
          anonId,
          vaultName: null,
          goals: Prisma.JsonNull,
          preferences: Prisma.JsonNull,
          topicsDiscussed: Prisma.JsonNull
        }
      });
    }

    // Find user by userMemory (if linked)
    const user = userMemory.userId
      ? await prisma.user.findUnique({
          where: { id: userMemory.userId }
        })
      : null;

    // Fetch chat sessions (only if user exists)
    const chatSessions = user
      ? await prisma.chatSession.findMany({
          where: {
            userId: user.id
          },
          orderBy: {
            updatedAt: "desc"
          }
        })
      : [];

    // Extract health topics from chats
    const healthTopics = extractHealthTopics(chatSessions);

    // Async update topicsDiscussed in background (fire-and-forget)
    if (healthTopics.length > 0) {
      prisma.userMemory.update({
        where: { id: userMemory.id },
        data: {
          topicsDiscussed: healthTopics as any
        }
      }).catch((err) => console.error("Failed to update topics:", err));
    }

    // Fetch documents (only if user exists)
    const documents = user
      ? await prisma.document.findMany({
          where: {
            userId: user.id
          },
          orderBy: {
            docDate: "desc"
          },
          take: 5
        })
      : [];

    const snapshot = {
      vaultName: userMemory.vaultName || "My Sacred Vault",
      goals: userMemory.goals,
      preferences: userMemory.preferences,
      healthTopics,
      chatSummary: {
        totalChats: chatSessions.length,
        topicsIdentified: healthTopics.length
      },
      recentDocuments: documents.map((doc) => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        docDate: doc.docDate
      }))
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
