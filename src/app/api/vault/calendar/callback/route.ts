import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import prisma from "@/lib/db";

const REDIRECT_URI = process.env.NEXTAUTH_URL + "/api/vault/calendar/callback";

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
}

// GET: OAuth callback handler
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // userId
  const error = searchParams.get("error");

  // Handle OAuth denial
  if (error || !code || !state) {
    return NextResponse.redirect(
      new URL("/vault/settings?calendar_error=denied", req.url)
    );
  }

  try {
    const oauth2Client = getOAuth2Client();
    
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user's email from Google
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const email = userInfo.data.email;

    // Store tokens in user preferences
    const userId = state;
    const userMemory = await prisma.userMemory.findUnique({
      where: { userId },
      select: { preferences: true },
    });

    const preferences = (userMemory?.preferences as any) || {};
    preferences.calendarIntegration = {
      enabled: true,
      connected: true,
      lastSync: new Date().toISOString(),
      email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    };

    await prisma.userMemory.upsert({
      where: { userId },
      create: {
        userId,
        preferences,
      },
      update: {
        preferences,
      },
    });

    // Redirect to settings with success message
    return NextResponse.redirect(
      new URL("/vault/settings?calendar_connected=true", req.url)
    );
  } catch (error) {
    console.error("Error in calendar OAuth callback:", error);
    return NextResponse.redirect(
      new URL("/vault/settings?calendar_error=failed", req.url)
    );
  }
}
