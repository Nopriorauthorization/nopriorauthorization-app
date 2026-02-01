import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";

/**
 * NPA Phase 6: Emergency Access ("Break-Glass") API
 * 
 * PUBLIC ENDPOINT - No account required for emergency responders.
 * 
 * ABSOLUTE GUARDRAILS:
 * - Patient must have OPTED IN
 * - Access is TIME-LIMITED (1-4 hours)
 * - Access is READ-ONLY
 * - Access is MINIMAL SCOPE (allergies, meds, critical history only)
 * - EVERY ACCESS IS LOGGED
 * 
 * No emergency access without full audit trail.
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

// POST - Initiate emergency access session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { npaId, accessorName, accessorRole, accessorOrg, reason } = body;
    const { ipAddress, userAgent } = getRequestMetadata(request);

    // Validate required fields
    if (!npaId) {
      return NextResponse.json(
        { error: "NPA ID is required" },
        { status: 400 }
      );
    }

    if (!reason || reason.length < 10) {
      return NextResponse.json(
        { error: "A valid reason for emergency access is required (minimum 10 characters)" },
        { status: 400 }
      );
    }

    // Find emergency access settings
    const settings = await prisma.npaEmergencyAccessSettings.findUnique({
      where: { npaId },
    });

    // Check if emergency access is enabled
    if (!settings || !settings.isEnabled) {
      // Log the denied attempt
      await prisma.analytics.create({
        data: {
          event: "emergency_access_denied",
          metadata: {
            npaId,
            reason: "not_enabled",
            accessorName,
            accessorOrg,
            ipAddress,
          },
        },
      });

      return NextResponse.json(
        { 
          error: "Emergency access is not enabled for this patient",
          message: "The patient has not opted into emergency access. Contact the patient or their emergency contact directly.",
        },
        { status: 403 }
      );
    }

    // Generate secure token
    const token = `emrg_${crypto.randomBytes(32).toString("hex")}`;
    
    // Calculate expiration based on patient settings
    const expiresAt = new Date(Date.now() + settings.maxDurationMinutes * 60 * 1000);

    // Create emergency access session
    const session = await prisma.npaEmergencyAccessSession.create({
      data: {
        settingsId: settings.id,
        npaId,
        token,
        expiresAt,
        grantedScope: settings.allowedScope,
        accessorName,
        accessorRole,
        accessorOrg,
        reasonEntered: reason,
        ipAddress,
        userAgent,
      },
    });

    // Log session start
    await prisma.npaEmergencyAccessLog.create({
      data: {
        sessionId: session.id,
        npaId,
        action: "session_started",
        ipAddress,
        userAgent,
      },
    });

    // Get emergency info based on granted scope
    const emergencyInfo: any = {
      sessionToken: token,
      expiresAt: session.expiresAt,
      grantedScope: session.grantedScope,
      emergencyContact: {
        name: settings.emergencyContactName,
        phone: settings.emergencyContactPhone,
        relation: settings.emergencyContactRelation,
      },
      criticalInfo: {
        allergies: settings.knownAllergies,
        medications: settings.currentMedications,
        conditions: settings.criticalConditions,
      },
    };

    // If scope allows, include additional data
    if (["MEDICATIONS_FULL", "SUMMARY_VIEW", "FULL_VAULT"].includes(session.grantedScope)) {
      // Get medication list documents
      const medicationDocs = await prisma.npaVaultDocument.findMany({
        where: {
          npaId,
          isDeleted: false,
          category: { in: ["MEDICATION_LIST", "ALLERGY_LIST"] },
        },
        select: {
          id: true,
          title: true,
          dateOfCare: true,
          category: true,
        },
        orderBy: { dateOfCare: "desc" },
        take: 5,
      });
      emergencyInfo.recentMedicationDocs = medicationDocs;
    }

    if (["SUMMARY_VIEW", "FULL_VAULT"].includes(session.grantedScope)) {
      // Get recent visit summaries
      const visitDocs = await prisma.npaVaultDocument.findMany({
        where: {
          npaId,
          isDeleted: false,
          category: { in: ["VISIT_SUMMARY", "DISCHARGE_SUMMARY"] },
        },
        select: {
          id: true,
          title: true,
          dateOfCare: true,
          providerName: true,
          facilityName: true,
        },
        orderBy: { dateOfCare: "desc" },
        take: 5,
      });
      emergencyInfo.recentVisitSummaries = visitDocs;
    }

    // Compliance notice
    emergencyInfo.legalNotice = "This emergency access session is being recorded. All actions are logged and auditable. This access is read-only and time-limited. Misuse may result in legal action.";

    return NextResponse.json(emergencyInfo);
  } catch (error) {
    console.error("Emergency access error:", error);
    return NextResponse.json(
      { error: "Emergency access failed" },
      { status: 500 }
    );
  }
}

// GET - Validate/use existing emergency session token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const documentId = searchParams.get("documentId");
    const { ipAddress, userAgent } = getRequestMetadata(request);

    if (!token) {
      return NextResponse.json(
        { error: "Emergency access token required" },
        { status: 400 }
      );
    }

    // Find session
    const session = await prisma.npaEmergencyAccessSession.findUnique({
      where: { token },
      include: {
        settings: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Invalid emergency access token" },
        { status: 403 }
      );
    }

    // Check if session is valid
    if (session.wasRevoked) {
      await prisma.npaEmergencyAccessLog.create({
        data: {
          sessionId: session.id,
          npaId: session.npaId,
          action: "access_denied_revoked",
          ipAddress,
          userAgent,
        },
      });
      return NextResponse.json(
        { error: "This emergency access session has been revoked" },
        { status: 403 }
      );
    }

    if (new Date() > session.expiresAt) {
      await prisma.npaEmergencyAccessLog.create({
        data: {
          sessionId: session.id,
          npaId: session.npaId,
          action: "access_denied_expired",
          ipAddress,
          userAgent,
        },
      });
      return NextResponse.json(
        { error: "This emergency access session has expired" },
        { status: 403 }
      );
    }

    // If requesting a specific document
    if (documentId) {
      // Check if scope allows document access
      if (!["SUMMARY_VIEW", "FULL_VAULT"].includes(session.grantedScope)) {
        await prisma.npaEmergencyAccessLog.create({
          data: {
            sessionId: session.id,
            npaId: session.npaId,
            action: "access_denied_scope",
            resourceType: "document",
            resourceId: documentId,
            ipAddress,
            userAgent,
          },
        });
        return NextResponse.json(
          { error: "Your emergency access scope does not permit document access" },
          { status: 403 }
        );
      }

      const document = await prisma.npaVaultDocument.findFirst({
        where: {
          id: documentId,
          npaId: session.npaId,
          isDeleted: false,
        },
      });

      if (!document) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        );
      }

      // Log document access
      await prisma.npaEmergencyAccessLog.create({
        data: {
          sessionId: session.id,
          npaId: session.npaId,
          action: "document_viewed",
          resourceType: "document",
          resourceId: documentId,
          ipAddress,
          userAgent,
        },
      });

      return NextResponse.json({
        document: {
          id: document.id,
          title: document.title,
          category: document.category,
          dateOfCare: document.dateOfCare,
          providerName: document.providerName,
          facilityName: document.facilityName,
          extractedText: document.extractedText,
          sections: document.sections,
        },
        sessionExpiresAt: session.expiresAt,
      });
    }

    // Return session status
    await prisma.npaEmergencyAccessLog.create({
      data: {
        sessionId: session.id,
        npaId: session.npaId,
        action: "session_validated",
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({
      valid: true,
      expiresAt: session.expiresAt,
      grantedScope: session.grantedScope,
      remainingMinutes: Math.floor((session.expiresAt.getTime() - Date.now()) / 60000),
      emergencyContact: {
        name: session.settings.emergencyContactName,
        phone: session.settings.emergencyContactPhone,
      },
      criticalInfo: {
        allergies: session.settings.knownAllergies,
        medications: session.settings.currentMedications,
        conditions: session.settings.criticalConditions,
      },
    });
  } catch (error) {
    console.error("Emergency session validation error:", error);
    return NextResponse.json(
      { error: "Session validation failed" },
      { status: 500 }
    );
  }
}

// DELETE - Revoke emergency access session (patient can revoke anytime)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const npaId = searchParams.get("npaId");
    const reason = searchParams.get("reason");
    const { ipAddress, userAgent } = getRequestMetadata(request);

    if (!token) {
      return NextResponse.json(
        { error: "Session token required" },
        { status: 400 }
      );
    }

    const session = await prisma.npaEmergencyAccessSession.findUnique({
      where: { token },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Update session as revoked
    await prisma.npaEmergencyAccessSession.update({
      where: { id: session.id },
      data: {
        wasRevoked: true,
        revokedAt: new Date(),
        revokedBy: npaId,
        revokedReason: reason || "Patient revoked access",
      },
    });

    // Log revocation
    await prisma.npaEmergencyAccessLog.create({
      data: {
        sessionId: session.id,
        npaId: session.npaId,
        action: "session_revoked",
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({
      message: "Emergency access session revoked",
      revokedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Emergency session revocation error:", error);
    return NextResponse.json(
      { error: "Failed to revoke session" },
      { status: 500 }
    );
  }
}
