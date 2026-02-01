import prisma from "@/lib/db";
import type { IdentityAuditAction } from "@prisma/client";
import { NextRequest } from "next/server";

/**
 * NPA Identity Audit Service
 * 
 * Immutable audit logging for all identity-related actions.
 * Required for HIPAA compliance and NPA ID lifecycle tracking.
 * 
 * IMPORTANT: No PHI should ever be stored in these logs.
 */

interface LogIdentityActionParams {
  userId?: string | null;
  npaId?: string | null;
  action: IdentityAuditAction;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any>;
}

/**
 * Log an identity-related action
 * Fire-and-forget: errors should not block the response
 */
export async function logIdentityAction(
  params: LogIdentityActionParams
): Promise<void> {
  try {
    await prisma.identityAuditLog.create({
      data: {
        userId: params.userId || null,
        npaId: params.npaId || null,
        action: params.action,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        metadata: params.metadata || undefined,
      },
    });
  } catch (error) {
    // Log to console but do not throw - audit logging should never block user actions
    console.error("Failed to write identity audit log:", error);
  }
}

/**
 * Extract request metadata for audit logging
 */
export function getIdentityRequestMetadata(req: NextRequest) {
  return {
    ipAddress:
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      null,
    userAgent: req.headers.get("user-agent") || null,
  };
}

/**
 * Log account creation event
 */
export async function logAccountCreated(
  userId: string,
  npaId: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logIdentityAction({
    userId,
    npaId,
    action: "ACCOUNT_CREATED",
    ipAddress,
    userAgent,
    metadata: { source: "signup" },
  });
}

/**
 * Log NPA ID generation event
 */
export async function logNpaIdGenerated(
  userId: string,
  npaId: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logIdentityAction({
    userId,
    npaId,
    action: "NPA_ID_GENERATED",
    ipAddress,
    userAgent,
  });
}

/**
 * Log successful login event
 */
export async function logLogin(
  userId: string,
  npaId: string | null,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logIdentityAction({
    userId,
    npaId,
    action: "LOGIN",
    ipAddress,
    userAgent,
  });
}

/**
 * Log failed login attempt
 */
export async function logLoginFailed(
  email: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logIdentityAction({
    action: "LOGIN_FAILED",
    ipAddress,
    userAgent,
    metadata: { attemptedEmail: email.substring(0, 3) + "***" }, // Partial email for security analysis
  });
}

/**
 * Log logout event
 */
export async function logLogout(
  userId: string,
  npaId: string | null,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logIdentityAction({
    userId,
    npaId,
    action: "LOGOUT",
    ipAddress,
    userAgent,
  });
}

/**
 * Log profile update event
 */
export async function logProfileUpdated(
  userId: string,
  npaId: string | null,
  changedFields: string[],
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logIdentityAction({
    userId,
    npaId,
    action: "PROFILE_UPDATED",
    ipAddress,
    userAgent,
    metadata: { changedFields },
  });
}

/**
 * Log password change event
 */
export async function logPasswordChanged(
  userId: string,
  npaId: string | null,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logIdentityAction({
    userId,
    npaId,
    action: "PASSWORD_CHANGED",
    ipAddress,
    userAgent,
  });
}

/**
 * Log account suspension event
 */
export async function logAccountSuspended(
  userId: string,
  npaId: string | null,
  suspendedBy: string,
  reason?: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logIdentityAction({
    userId,
    npaId,
    action: "ACCOUNT_SUSPENDED",
    ipAddress,
    userAgent,
    metadata: { suspendedBy, reason: reason || null },
  });
}

/**
 * Log account reactivation event
 */
export async function logAccountReactivated(
  userId: string,
  npaId: string | null,
  reactivatedBy: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logIdentityAction({
    userId,
    npaId,
    action: "ACCOUNT_REACTIVATED",
    ipAddress,
    userAgent,
    metadata: { reactivatedBy },
  });
}
