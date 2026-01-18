import prisma from "@/lib/db";
import { NextRequest } from "next/server";

export type AuditAction =
  | "VIEW"
  | "EXPORT"
  | "SHARE"
  | "REVOKE"
  | "CONSENT_GRANTED"
  | "CONSENT_REVOKED"
  | "DELETE"
  | "UPDATE";

export type ResourceType =
  | "CLINICAL_SUMMARY"
  | "PROVIDER_PACKET"
  | "DOCUMENT"
  | "SHARE_LINK"
  | "CONSENT"
  | "USER_DATA";

interface LogAccessParams {
  actorId?: string | null;
  subjectUserId?: string | null;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any>;
}

/**
 * Log PHI access for HIPAA compliance
 * Fire-and-forget: errors should not block the response
 */
export async function logAccess(params: LogAccessParams): Promise<void> {
  try {
    await prisma.accessLog.create({
      data: {
        actorId: params.actorId || null,
        subjectUserId: params.subjectUserId || null,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        ipAddress: params.ipAddress || undefined,
        userAgent: params.userAgent || undefined,
        metadata: params.metadata || undefined,
      },
    });
  } catch (error) {
    // Log to console but do not throw
    console.error("Failed to write access log:", error);
  }
}

/**
 * Extract IP and User-Agent from NextRequest for audit logging
 */
export function getRequestMetadata(req: NextRequest) {
  return {
    ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
    userAgent: req.headers.get("user-agent") || null,
  };
}

/**
 * Log consent change
 */
export async function logConsentChange(
  userId: string,
  action: "CONSENT_GRANTED" | "CONSENT_REVOKED",
  consentType: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logAccess({
    actorId: userId,
    subjectUserId: userId,
    action,
    resourceType: "CONSENT",
    resourceId: userId,
    ipAddress,
    userAgent,
    metadata: { consentType },
  });
}
