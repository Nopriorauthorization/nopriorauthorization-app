// =============================================================================
// POST /api/awareness/events - Track a user event
// GET /api/awareness/events - Get recent events
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { trackEvent } from "@/lib/awareness/service";
import { prisma } from "@/lib/db";
import { TrackEventRequest, UserEventType } from "@/lib/awareness/types";

const VALID_EVENT_TYPES: UserEventType[] = [
  "LAB_UPLOAD",
  "LAB_DECODED",
  "FAMILY_ADDED",
  "FAMILY_UPDATED",
  "CHAT_USED",
  "INSIGHT_VIEWED",
  "DOCUMENT_UPLOADED",
  "DOCUMENT_DECODED",
  "BLUEPRINT_UPDATED",
  "MASCOT_VISITED",
  "TOOL_USED",
  "PROVIDER_ADDED",
  "APPOINTMENT_ADDED",
];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, source, metadata } = body as TrackEventRequest;

    // Validate event type
    if (!type || !VALID_EVENT_TYPES.includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid event type" },
        { status: 400 }
      );
    }

    // Validate source
    if (!source || typeof source !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid source" },
        { status: 400 }
      );
    }

    const eventId = await trackEvent(session.user.id, {
      type,
      source,
      metadata,
    });

    return NextResponse.json({
      success: true,
      eventId,
    });
  } catch (error) {
    console.error("Error tracking event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track event" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const source = searchParams.get("source");

    const where: any = { userId: session.user.id };
    if (source) {
      where.source = source;
    }

    const events = await prisma.userEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
