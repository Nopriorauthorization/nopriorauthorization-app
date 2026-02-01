import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

/**
 * NPA Phase 6: Emergency Access Settings API
 * 
 * CORE PRINCIPLE: Emergency access is DISABLED by default.
 * Patient must EXPLICITLY opt-in and acknowledge risks.
 * 
 * GUARDRAILS:
 * - No silent access ever
 * - Patient remains root authority
 * - All access is audited
 */

// GET - Retrieve emergency access settings
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

    if (!user?.npaId) {
      return NextResponse.json({ error: "NPA ID not found" }, { status: 404 });
    }

    // Get or create settings (always disabled by default)
    let settings = await prisma.npaEmergencyAccessSettings.findUnique({
      where: { npaId: user.npaId },
    });

    if (!settings) {
      settings = await prisma.npaEmergencyAccessSettings.create({
        data: {
          npaId: user.npaId,
          userId: session.user.id,
          isEnabled: false, // DISABLED BY DEFAULT
        },
      });
    }

    return NextResponse.json({
      settings: {
        isEnabled: settings.isEnabled,
        allowedScope: settings.allowedScope,
        maxDurationMinutes: settings.maxDurationMinutes,
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
        disclaimerAccepted: !!settings.disclaimerAcceptedAt,
        enabledAt: settings.enabledAt,
        lastUpdatedAt: settings.lastUpdatedAt,
      },
      // Scope options for UI
      scopeOptions: [
        { value: "CRITICAL_ONLY", label: "Critical Only", description: "Allergies, medications, critical conditions" },
        { value: "MEDICATIONS_FULL", label: "Medications & Allergies", description: "Full medication list with allergies" },
        { value: "SUMMARY_VIEW", label: "Summary View", description: "Critical info + recent visit summaries" },
        { value: "FULL_VAULT", label: "Full Vault", description: "Complete vault access (use with caution)" },
      ],
      // Duration options for UI
      durationOptions: [
        { value: 30, label: "30 minutes" },
        { value: 60, label: "1 hour" },
        { value: 120, label: "2 hours" },
        { value: 240, label: "4 hours" },
      ],
      complianceNotice: "Emergency access allows temporary, read-only access to your critical health information when you cannot consent. All access is logged and auditable.",
    });
  } catch (error) {
    console.error("Error fetching emergency access settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PATCH - Update emergency access settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { npaId: true },
    });

    if (!user?.npaId) {
      return NextResponse.json({ error: "NPA ID not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      isEnabled,
      allowedScope,
      maxDurationMinutes,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      knownAllergies,
      currentMedications,
      criticalConditions,
      acceptDisclaimer,
    } = body;

    // Get current settings
    const currentSettings = await prisma.npaEmergencyAccessSettings.findUnique({
      where: { npaId: user.npaId },
    });

    // If enabling, require disclaimer acceptance
    if (isEnabled && !currentSettings?.disclaimerAcceptedAt && !acceptDisclaimer) {
      return NextResponse.json(
        { error: "You must acknowledge the emergency access disclaimer to enable this feature" },
        { status: 400 }
      );
    }

    // Validate scope
    const validScopes = ["CRITICAL_ONLY", "MEDICATIONS_FULL", "SUMMARY_VIEW", "FULL_VAULT"];
    if (allowedScope && !validScopes.includes(allowedScope)) {
      return NextResponse.json(
        { error: "Invalid access scope" },
        { status: 400 }
      );
    }

    // Validate duration (30 min to 4 hours)
    if (maxDurationMinutes && (maxDurationMinutes < 30 || maxDurationMinutes > 240)) {
      return NextResponse.json(
        { error: "Duration must be between 30 minutes and 4 hours" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {
      lastUpdatedAt: new Date(),
    };

    if (typeof isEnabled === "boolean") {
      updateData.isEnabled = isEnabled;
      if (isEnabled && !currentSettings?.enabledAt) {
        updateData.enabledAt = new Date();
      }
      if (!isEnabled) {
        updateData.disabledAt = new Date();
      }
    }

    if (allowedScope) updateData.allowedScope = allowedScope;
    if (maxDurationMinutes) updateData.maxDurationMinutes = maxDurationMinutes;
    if (emergencyContactName !== undefined) updateData.emergencyContactName = emergencyContactName;
    if (emergencyContactPhone !== undefined) updateData.emergencyContactPhone = emergencyContactPhone;
    if (emergencyContactRelation !== undefined) updateData.emergencyContactRelation = emergencyContactRelation;
    if (knownAllergies !== undefined) updateData.knownAllergies = knownAllergies;
    if (currentMedications !== undefined) updateData.currentMedications = currentMedications;
    if (criticalConditions !== undefined) updateData.criticalConditions = criticalConditions;
    if (acceptDisclaimer) updateData.disclaimerAcceptedAt = new Date();

    // Update or create settings
    const settings = await prisma.npaEmergencyAccessSettings.upsert({
      where: { npaId: user.npaId },
      update: updateData,
      create: {
        npaId: user.npaId,
        userId: session.user.id,
        ...updateData,
      },
    });

    // Audit log the change
    await prisma.identityAuditLog.create({
      data: {
        userId: session.user.id,
        npaId: user.npaId,
        action: isEnabled ? "ACCOUNT_REACTIVATED" : "PROFILE_UPDATED",
        metadata: {
          type: "emergency_access_settings_updated",
          isEnabled: settings.isEnabled,
          scope: settings.allowedScope,
        },
      },
    });

    return NextResponse.json({
      message: "Emergency access settings updated",
      settings: {
        isEnabled: settings.isEnabled,
        allowedScope: settings.allowedScope,
        maxDurationMinutes: settings.maxDurationMinutes,
        disclaimerAccepted: !!settings.disclaimerAcceptedAt,
      },
    });
  } catch (error) {
    console.error("Error updating emergency access settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
