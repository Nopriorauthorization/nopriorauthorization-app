import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

/**
 * NPA Phase 6: Session Management API
 * 
 * Security Hardening:
 * - Device/session management
 * - IP anomaly detection
 * - Active session visibility
 * - One-click session revocation
 */

// Helper to get request metadata
function getRequestMetadata(request: NextRequest) {
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;
  const userAgent = request.headers.get("user-agent") || null;
  return { ipAddress, userAgent };
}

// Parse user agent to get device info
function parseUserAgent(userAgent: string | null): {
  deviceType: string;
  browser: string;
  os: string;
  deviceName: string;
} {
  if (!userAgent) {
    return {
      deviceType: "unknown",
      browser: "Unknown",
      os: "Unknown",
      deviceName: "Unknown Device",
    };
  }

  // Simple parsing - in production use a library like ua-parser-js
  let deviceType = "desktop";
  if (/mobile/i.test(userAgent)) deviceType = "mobile";
  if (/tablet|ipad/i.test(userAgent)) deviceType = "tablet";

  let browser = "Unknown";
  if (/chrome/i.test(userAgent)) browser = "Chrome";
  else if (/safari/i.test(userAgent)) browser = "Safari";
  else if (/firefox/i.test(userAgent)) browser = "Firefox";
  else if (/edge/i.test(userAgent)) browser = "Edge";

  let os = "Unknown";
  if (/windows/i.test(userAgent)) os = "Windows";
  else if (/macintosh|mac os/i.test(userAgent)) os = "MacOS";
  else if (/linux/i.test(userAgent)) os = "Linux";
  else if (/android/i.test(userAgent)) os = "Android";
  else if (/iphone|ipad/i.test(userAgent)) os = "iOS";

  const deviceName = `${browser} on ${os}`;

  return { deviceType, browser, os, deviceName };
}

// GET - List active sessions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { npaId: true },
    });

    const sessions = await prisma.npaUserSession.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastActiveAt: "desc" },
    });

    // Get current session identifier from request
    const { ipAddress, userAgent } = getRequestMetadata(request);
    const currentDevice = parseUserAgent(userAgent);

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        deviceType: s.deviceType,
        deviceName: s.deviceName,
        browser: s.browser,
        os: s.os,
        ipAddress: s.ipAddress,
        location: s.location,
        isAnomaly: s.isAnomaly,
        anomalyReason: s.anomalyReason,
        createdAt: s.createdAt,
        lastActiveAt: s.lastActiveAt,
        // Mark if this is likely the current session
        isCurrent:
          s.ipAddress === ipAddress &&
          s.deviceName === currentDevice.deviceName,
      })),
      totalSessions: sessions.length,
      securityTip:
        "Review your active sessions regularly. Revoke any sessions you don't recognize.",
    });
  } catch (error) {
    console.error("Session list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST - Record new session (called during login)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ipAddress, userAgent } = getRequestMetadata(request);
    const deviceInfo = parseUserAgent(userAgent);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { npaId: true },
    });

    // Check for anomalies (simple check - in production use more sophisticated detection)
    const recentSessions = await prisma.npaUserSession.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
      },
      select: { ipAddress: true },
    });

    const uniqueIPs = new Set(recentSessions.map((s) => s.ipAddress));
    const isAnomaly = uniqueIPs.size > 5; // Flag if too many different IPs

    // Create session record
    const newSession = await prisma.npaUserSession.create({
      data: {
        userId: session.user.id,
        npaId: user?.npaId,
        sessionToken: `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        deviceType: deviceInfo.deviceType,
        deviceName: deviceInfo.deviceName,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ipAddress,
        isActive: true,
        isAnomaly,
        anomalyReason: isAnomaly ? "Multiple IP addresses in 24 hours" : null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // If anomaly detected, create audit log
    if (isAnomaly) {
      await prisma.identityAuditLog.create({
        data: {
          userId: session.user.id,
          npaId: user?.npaId,
          action: "LOGIN",
          ipAddress,
          userAgent,
          metadata: {
            anomalyDetected: true,
            reason: "Multiple IP addresses",
            uniqueIPCount: uniqueIPs.size,
          },
        },
      });
    }

    return NextResponse.json({
      sessionId: newSession.id,
      deviceName: newSession.deviceName,
      isAnomaly: newSession.isAnomaly,
      anomalyReason: newSession.anomalyReason,
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to record session" },
      { status: 500 }
    );
  }
}

// DELETE - Revoke session(s)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("id");
    const revokeAll = searchParams.get("all") === "true";

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { npaId: true },
    });

    if (revokeAll) {
      // Revoke all sessions except current
      const { ipAddress, userAgent } = getRequestMetadata(request);
      const currentDevice = parseUserAgent(userAgent);

      const result = await prisma.npaUserSession.updateMany({
        where: {
          userId: session.user.id,
          isActive: true,
          NOT: {
            AND: [
              { ipAddress },
              { deviceName: currentDevice.deviceName },
            ],
          },
        },
        data: {
          isActive: false,
          revokedAt: new Date(),
        },
      });

      await prisma.identityAuditLog.create({
        data: {
          userId: session.user.id,
          npaId: user?.npaId,
          action: "PROFILE_UPDATED",
          metadata: {
            type: "all_sessions_revoked",
            count: result.count,
          },
        },
      });

      return NextResponse.json({
        message: `Revoked ${result.count} sessions`,
        revokedCount: result.count,
      });
    }

    if (sessionId) {
      // Revoke specific session
      const targetSession = await prisma.npaUserSession.findFirst({
        where: {
          id: sessionId,
          userId: session.user.id,
        },
      });

      if (!targetSession) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }

      await prisma.npaUserSession.update({
        where: { id: sessionId },
        data: {
          isActive: false,
          revokedAt: new Date(),
        },
      });

      await prisma.identityAuditLog.create({
        data: {
          userId: session.user.id,
          npaId: user?.npaId,
          action: "PROFILE_UPDATED",
          metadata: {
            type: "session_revoked",
            sessionId,
            deviceName: targetSession.deviceName,
          },
        },
      });

      return NextResponse.json({
        message: "Session revoked",
        sessionId,
      });
    }

    return NextResponse.json(
      { error: "Specify session ID or use ?all=true" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Session revocation error:", error);
    return NextResponse.json(
      { error: "Failed to revoke session" },
      { status: 500 }
    );
  }
}
