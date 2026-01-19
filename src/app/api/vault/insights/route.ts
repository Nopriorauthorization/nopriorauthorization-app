import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId 
      ? { userId: identity.userId } 
      : { anonId: identity.anonId };

    // Fetch user data for insights generation
    const [documents, chatSessions, appointments, providers, decodedDocs] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          category: true,
          docDate: true,
          createdAt: true
        }
      }),
      prisma.chatSession.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: 10,
        select: {
          id: true,
          messages: true,
          updatedAt: true
        }
      }),
      prisma.appointment.findMany({
        where,
        orderBy: { appointmentDate: "desc" },
        take: 10,
        select: {
          id: true,
          providerName: true,
          providerSpecialty: true,
          appointmentType: true,
          appointmentDate: true,
          status: true
        }
      }),
      prisma.provider.findMany({
        where,
        select: {
          id: true,
          name: true,
          specialty: true
        }
      }),
      prisma.documentDecode.findMany({
        where: {
          document: where
        },
        take: 5,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          document: {
            select: {
              title: true,
              docDate: true
            }
          }
        }
      })
    ]);

    const isEmpty = documents.length === 0 && 
                    chatSessions.length === 0 && 
                    appointments.length === 0;

    // Generate insights from user data
    const insights = {
      // Document insights
      documentInsights: {
        totalDocuments: documents.length,
        categories: Array.from(new Set(documents.map((d: any) => d.category))),
        recentUploads: documents.slice(0, 3).map((d: any) => ({
          title: d.title,
          category: d.category,
          date: d.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })
        }))
      },
      
      // Chat insights
      chatInsights: {
        totalConversations: chatSessions.length,
        topics: extractTopics(chatSessions),
        recentTopics: chatSessions.slice(0, 3).map((c: any) => ({
          title: "Conversation",
          date: c.updatedAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })
        }))
      },
      
      // Appointment insights
      appointmentInsights: {
        totalAppointments: appointments.length,
        upcomingCount: appointments.filter((a: any) =>
          new Date(a.appointmentDate) > new Date() && a.status !== "cancelled"
        ).length,
        specialists: Array.from(new Set(appointments.map((a: any) => a.providerSpecialty).filter(Boolean))),
        appointmentTypes: Array.from(new Set(appointments.map((a: any) => a.appointmentType)))
      },
      
      // Provider insights
      providerInsights: {
        totalProviders: providers.length,
        specialties: Array.from(new Set(providers.map((p: any) => p.specialty).filter(Boolean))),
        providers: providers.map((p: any) => ({
          name: p.name,
          specialty: p.specialty
        }))
      },
      
      // Treatment insights from decoded documents
      treatmentInsights: {
        decodedDocuments: decodedDocs.length,
        recentDecodes: decodedDocs.map((dd: any) => ({
          documentTitle: dd.document.title,
          summary: typeof dd.summary === 'string' ? dd.summary.substring(0, 200) : '',
          keyTermsCount: Array.isArray(dd.keyTerms) ? dd.keyTerms.length : 0,
          questionsCount: Array.isArray(dd.questions) ? dd.questions.length : 0
        }))
      },
      
      // Overall health summary
      summary: {
        documentsUploaded: documents.length,
        conversationsHad: chatSessions.length,
        appointmentsTracked: appointments.length,
        providersManaged: providers.length,
        documentsDecoded: decodedDocs.length
      },
      
      isEmpty
    };

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}

// Helper function to extract topics from chat sessions
function extractTopics(chatSessions: any[]): string[] {
  const topicKeywords = [
    "medication", "treatment", "diagnosis", "symptoms", "pain", "anxiety",
    "depression", "therapy", "surgery", "insurance", "appointment", "lab results",
    "blood test", "prescription", "side effects", "nutrition", "exercise"
  ];
  
  const foundTopics = new Set<string>();
  
  chatSessions.forEach(session => {
    const messages = Array.isArray(session.messages) ? session.messages : [];
    const userMessages = messages
      .filter((m: any) => m.role === "user")
      .map((m: any) => m.content.toLowerCase());
    
    const allText = userMessages.join(" ");
    
    topicKeywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        foundTopics.add(keyword);
      }
    });
  });
  
  return Array.from(foundTopics).slice(0, 10);
}
