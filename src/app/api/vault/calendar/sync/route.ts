import { NextRequest, NextResponse } from "next/server";
import { resolveDocumentIdentity } from "@/lib/documents/server";
import prisma from "@/lib/db";
import { google } from "googleapis";
import { addDays, startOfDay } from "date-fns";

const REDIRECT_URI = process.env.NEXTAUTH_URL + "/api/vault/calendar/callback";

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
}

// GET: Fetch calendar events (read-only)
export async function GET(req: NextRequest) {
  const identity = await resolveDocumentIdentity(req);
  if (!identity || !identity.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get calendar settings
    const userMemory = await prisma.userMemory.findUnique({
      where: { userId: identity.userId },
      select: { preferences: true },
    });

    const preferences = (userMemory?.preferences as any) || {};
    const calendarSettings = preferences.calendarIntegration;

    if (!calendarSettings || !calendarSettings.connected) {
      return NextResponse.json({
        events: [],
        connected: false,
        message: "Calendar not connected",
      });
    }

    // Set up OAuth client with stored tokens
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: calendarSettings.accessToken,
      refresh_token: calendarSettings.refreshToken,
      expiry_date: calendarSettings.expiryDate,
    });

    // Fetch events from Google Calendar (next 90 days)
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const now = new Date();
    const futureDate = addDays(now, 90);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: futureDate.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];

    // Transform events to our format
    const transformedEvents = events
      .filter((event: any) => {
        // Filter only events that look like appointments
        const summary = (event.summary || "").toLowerCase();
        const description = (event.description || "").toLowerCase();
        
        // Include if it mentions health-related keywords
        const healthKeywords = [
          "doctor",
          "dr.",
          "appointment",
          "clinic",
          "hospital",
          "medical",
          "dentist",
          "therapy",
          "checkup",
          "consultation",
          "exam",
          "screening",
          "vaccination",
          "vaccine",
          "physical",
          "lab",
          "test",
          "imaging",
          "mri",
          "ct scan",
          "x-ray",
          "ultrasound",
        ];

        return healthKeywords.some(
          (keyword) =>
            summary.includes(keyword) || description.includes(keyword)
        );
      })
      .map((event: any) => {
        const start = event.start?.dateTime || event.start?.date;
        const end = event.end?.dateTime || event.end?.date;

        return {
          id: event.id,
          summary: event.summary || "Untitled Event",
          description: event.description || null,
          location: event.location || null,
          startTime: start,
          endTime: end,
          isAllDay: !event.start?.dateTime, // If only date, it's all-day
          source: "google-calendar",
          calendarEmail: calendarSettings.email,
        };
      });

    // Update last sync time
    preferences.calendarIntegration.lastSync = new Date().toISOString();
    await prisma.userMemory.update({
      where: { userId: identity.userId },
      data: { preferences },
    });

    return NextResponse.json({
      events: transformedEvents,
      connected: true,
      lastSync: preferences.calendarIntegration.lastSync,
      email: calendarSettings.email,
    });
  } catch (error: any) {
    console.error("Error syncing calendar:", error);

    // Handle token expiration
    if (error.code === 401 || error.message?.includes("invalid_grant")) {
      // Clear calendar settings
      const userMemory = await prisma.userMemory.findUnique({
        where: { userId: identity.userId },
        select: { preferences: true },
      });

      const preferences = (userMemory?.preferences as any) || {};
      preferences.calendarIntegration = {
        enabled: false,
        connected: false,
        lastSync: null,
        email: null,
        accessToken: null,
        refreshToken: null,
      };

      await prisma.userMemory.update({
        where: { userId: identity.userId },
        data: { preferences },
      });

      return NextResponse.json({
        events: [],
        connected: false,
        error: "Token expired. Please reconnect your calendar.",
      });
    }

    return NextResponse.json(
      { error: "Failed to sync calendar" },
      { status: 500 }
    );
  }
}
