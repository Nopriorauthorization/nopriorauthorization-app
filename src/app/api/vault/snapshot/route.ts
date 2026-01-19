import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";
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

export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId 
      ? { userId: identity.userId } 
      : { anonId: identity.anonId };

    // Get user memory for goals/preferences
    let userMemory = identity.anonId
      ? await prisma.userMemory.findFirst({ where: { anonId: identity.anonId } })
      : null;

    if (!userMemory && identity.anonId) {
      userMemory = await prisma.userMemory.create({
        data: {
          anonId: identity.anonId,
          vaultName: null,
          goals: Prisma.JsonNull,
          preferences: Prisma.JsonNull,
          topicsDiscussed: Prisma.JsonNull
        }
      });
    }

    // Fetch all user data in parallel
    const [
      chatSessions,
      documents,
      appointments,
      providers,
      decodedDocs
    ] = await Promise.all([
      prisma.chatSession.findMany({
        where,
        orderBy: { updatedAt: "desc" }
      }),
      prisma.document.findMany({
        where,
        orderBy: { docDate: "desc" },
        take: 5
      }),
      prisma.appointment.findMany({
        where: {
          ...where,
          appointmentDate: { gte: new Date() }
        },
        orderBy: { appointmentDate: "asc" },
        take: 3
      }),
      prisma.provider.findMany({
        where,
        orderBy: { createdAt: "desc" }
      }),
      prisma.documentDecode.count({
        where: {
          document: where
        }
      })
    ]);

    // Extract health topics from chats
    const healthTopics = extractHealthTopics(chatSessions);

    // Update topicsDiscussed in background (fire-and-forget)
    if (healthTopics.length > 0 && userMemory) {
      prisma.userMemory.update({
        where: { id: userMemory.id },
        data: { topicsDiscussed: healthTopics as any }
      }).catch((err) => console.error("Failed to update topics:", err));
    }

    const isEmpty = documents.length === 0 && 
                    chatSessions.length === 0 && 
                    appointments.length === 0 &&
                    providers.length === 0;

    const snapshot = {
      vaultName: userMemory?.vaultName || "My Sacred Vault",
      goals: userMemory?.goals || [],
      preferences: userMemory?.preferences || {},
      healthTopics,
      chatSummary: {
        totalChats: chatSessions.length,
        topicsIdentified: healthTopics.length
      },
      recentDocuments: documents.map((doc) => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        date: doc.docDate?.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }) || "No date"
      })),
      upcomingAppointments: appointments.map((apt) => ({
        id: apt.id,
        providerName: apt.providerName,
        specialty: apt.providerSpecialty,
        date: apt.appointmentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        time: apt.appointmentDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }),
        type: apt.appointmentType
      })),
      providers: providers.map((p) => ({
        id: p.id,
        name: p.name,
        specialty: p.specialty
      })),
      stats: {
        documents: documents.length,
        chats: chatSessions.length,
        appointments: appointments.length,
        providers: providers.length,
        decoded: decodedDocs
      },
      isEmpty
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
