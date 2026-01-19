const fs = require('fs');
const path = require('path');

const content = `import { NextRequest, NextResponse } from "next/server";
import { resolveDocumentIdentity } from "@/lib/auth/document-identity";
import prisma from "@/lib/prisma";
import { google } from "googleapis";

// Google Calendar OAuth setup
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const REDIRECT_URI = process.env.NEXTAUTH_URL + "/api/vault/calendar/callback";

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
}

// GET: Check calendar connection status
export async function GET(req: NextRequest) {
  const identity = await resolveDocumentIdentity(req);
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user preferences
    const userMemory = await prisma.userMemory.findUnique({
      where: { userId: identity.userId },
      select: { preferences: true },
    });

    const preferences = (userMemory?.preferences as any) || {};
    const calendarSettings = preferences.calendarIntegration || {
      enabled: false,
      connected: false,
      lastSync: null,
    };

    return NextResponse.json({
      enabled: calendarSettings.enabled || false,
      connected: calendarSettings.connected || false,
      lastSync: calendarSettings.lastSync || null,
      email: calendarSettings.email || null,
    });
  } catch (error) {
    console.error("Error fetching calendar settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar settings" },
      { status: 500 }
    );
  }
}

// POST: Initiate OAuth flow or disconnect
export async function POST(req: NextRequest) {
  const identity = await resolveDocumentIdentity(req);
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = body.action; // "connect" or "disconnect"

    if (action === "disconnect") {
      // Disconnect calendar
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

      await prisma.userMemory.upsert({
        where: { userId: identity.userId },
        create: {
          userId: identity.userId,
          preferences,
        },
        update: {
          preferences,
        },
      });

      return NextResponse.json({ success: true, disconnected: true });
    }

    if (action === "connect") {
      // Generate OAuth URL
      const oauth2Client = getOAuth2Client();
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        state: identity.userId, // Pass userId in state for callback
        prompt: "consent", // Force consent screen to get refresh token
      });

      return NextResponse.json({ authUrl });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in calendar OAuth:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
`;

const outputPath = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "api",
  "vault",
  "calendar",
  "route.ts"
);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content, "utf8");

console.log(
  "✅ Calendar OAuth API successfully written to:",
  outputPath
);
