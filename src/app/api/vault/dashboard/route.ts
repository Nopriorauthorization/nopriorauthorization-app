import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Build where clause for user scope
    const where = identity.userId
      ? { userId: identity.userId }
      : { anonId: identity.anonId };

    // Fetch user's data in parallel
    const [
      documentCount,
      chatCount,
      appointmentCount,
      recentDocuments,
      recentChats,
      upcomingAppointments,
      decodedCount,
    ] = await Promise.all([
      prisma.document.count({ where }),
      prisma.chatSession.count({ where }),
      prisma.appointment.count({ where }),
      prisma.document.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          category: true,
          createdAt: true,
          mimeType: true,
        },
      }),
      prisma.chatSession.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          createdAt: true,
        },
      }),
      prisma.appointment.findMany({
        where: {
          ...(identity.userId ? { userId: identity.userId } : { anonId: identity.anonId }),
          appointmentDate: { gte: new Date() },
        },
        orderBy: { appointmentDate: "asc" },
        take: 3,
        select: {
          id: true,
          providerName: true,
          appointmentDate: true,
          location: true,
        },
      }),
      prisma.documentDecode.count({
        where: {
          Document: where,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        documents: documentCount,
        chats: chatCount,
        appointments: appointmentCount,
        decoded: decodedCount,
      },
      recentActivity: {
        documents: recentDocuments,
        chats: recentChats,
        appointments: upcomingAppointments,
      },
      isEmpty: documentCount === 0 && chatCount === 0 && appointmentCount === 0,
    });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard", details: error.message },
      { status: 500 }
    );
  }
}
