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
      ? { userId: identity.userId, deletedAt: null }
      : { anonId: identity.anonId, deletedAt: null };

    const chatWhere = identity.userId ? { userId: identity.userId } : { anonId: identity.anonId };

    // Parallel data fetching
    const [documents, chatSessions, appointments, providers, decodedDocs] = await Promise.all([
      prisma.document.findMany({
        where,
        select: {
          id: true,
          category: true,
          createdAt: true,
          docDate: true,
          sizeBytes: true,
          mimeType: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.chatSession.findMany({
        where: chatWhere,
        select: {
          id: true,
          createdAt: true,
          messages: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.appointment.findMany({
        where: chatWhere,
        select: {
          id: true,
          createdAt: true,
          appointmentDate: true,
          appointmentType: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.provider.findMany({
        where: chatWhere,
        select: {
          id: true,
          specialty: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.documentDecode.findMany({
        where: {
          document: where,
        },
        select: {
          id: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Calculate category breakdown
    const categoryBreakdown = documents.reduce((acc: any, doc: any) => {
      const cat = doc.category || "OTHER";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.entries(categoryBreakdown).map(([name, count]) => ({
      name: name.replace(/_/g, " "),
      count,
      percentage: Math.round((count as number / documents.length) * 100) || 0,
    }));

    // Calculate upload frequency by month
    const uploadsByMonth: any = {};
    documents.forEach((doc: any) => {
      const date = new Date(doc.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      uploadsByMonth[monthKey] = (uploadsByMonth[monthKey] || 0) + 1;
    });

    const uploadTrend = Object.entries(uploadsByMonth)
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a: any, b: any) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months

    // Calculate chat activity
    const totalMessages = chatSessions.reduce((sum: number, session: any) => {
      const messages = Array.isArray(session.messages) ? session.messages : [];
      return sum + messages.length;
    }, 0);

    const avgMessagesPerChat = chatSessions.length > 0 
      ? Math.round(totalMessages / chatSessions.length) 
      : 0;

    // Chat activity by month
    const chatsByMonth: any = {};
    chatSessions.forEach((session: any) => {
      const date = new Date(session.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      chatsByMonth[monthKey] = (chatsByMonth[monthKey] || 0) + 1;
    });

    const chatTrend = Object.entries(chatsByMonth)
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a: any, b: any) => a.month.localeCompare(b.month))
      .slice(-12);

    // Calculate total storage used
    const totalStorageBytes = documents.reduce((sum: number, doc: any) => sum + (doc.sizeBytes || 0), 0);
    const totalStorageMB = Math.round(totalStorageBytes / (1024 * 1024) * 10) / 10;

    // File type distribution
    const fileTypes: any = {};
    documents.forEach((doc: any) => {
      if (doc.mimeType) {
        const type = doc.mimeType.split("/")[1]?.toUpperCase() || "OTHER";
        fileTypes[type] = (fileTypes[type] || 0) + 1;
      }
    });

    const fileTypeBreakdown = Object.entries(fileTypes).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count as number / documents.length) * 100) || 0,
    }));

    // Appointment type breakdown
    const appointmentTypes: any = {};
    appointments.forEach((appt: any) => {
      const type = appt.appointmentType || "General";
      appointmentTypes[type] = (appointmentTypes[type] || 0) + 1;
    });

    const appointmentTypeBreakdown = Object.entries(appointmentTypes).map(([type, count]) => ({
      type,
      count,
    }));

    // Provider specialty breakdown
    const specialties: any = {};
    providers.forEach((provider: any) => {
      const specialty = provider.specialty || "General Practice";
      specialties[specialty] = (specialties[specialty] || 0) + 1;
    });

    const specialtyBreakdown = Object.entries(specialties).map(([specialty, count]) => ({
      specialty,
      count,
    }));

    // Calculate activity score (simple metric)
    const activityScore = Math.min(
      100,
      Math.round(
        (documents.length * 2) +
        (chatSessions.length * 3) +
        (appointments.length * 5) +
        (providers.length * 4) +
        (decodedDocs.length * 10)
      )
    );

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentDocuments = documents.filter((d: any) => new Date(d.createdAt) >= thirtyDaysAgo).length;
    const recentChats = chatSessions.filter((c: any) => new Date(c.createdAt) >= thirtyDaysAgo).length;
    const recentAppointments = appointments.filter((a: any) => new Date(a.createdAt) >= thirtyDaysAgo).length;

    const isEmpty = documents.length === 0 && chatSessions.length === 0 && appointments.length === 0;

    return NextResponse.json({
      summary: {
        totalDocuments: documents.length,
        totalChats: chatSessions.length,
        totalMessages: totalMessages,
        avgMessagesPerChat,
        totalAppointments: appointments.length,
        totalProviders: providers.length,
        totalDecoded: decodedDocs.length,
        totalStorageMB,
        activityScore,
      },
      categories,
      uploadTrend,
      chatTrend,
      fileTypeBreakdown,
      appointmentTypeBreakdown,
      specialtyBreakdown,
      recentActivity: {
        documents: recentDocuments,
        chats: recentChats,
        appointments: recentAppointments,
      },
      isEmpty,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
