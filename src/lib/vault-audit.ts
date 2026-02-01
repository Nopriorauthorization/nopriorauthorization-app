import prisma from "@/lib/db";
import type { NpaVaultAction } from "@prisma/client";
import { NextRequest } from "next/server";

/**
 * NPA Vault Document Audit Service
 * 
 * Immutable audit logging for all vault document actions.
 * Every upload, view, download, and delete is logged.
 * 
 * "This phase establishes patient ownership of health records.
 * The system must remain neutral, non-diagnostic, and patient-initiated only."
 */

interface LogVaultActionParams {
  documentId: string;
  npaId: string;
  action: NpaVaultAction;
  actorId?: string | null;
  actorNpaId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any>;
}

/**
 * Log a vault document action
 * Fire-and-forget: errors should not block the response
 */
export async function logVaultAction(
  params: LogVaultActionParams
): Promise<void> {
  try {
    await prisma.npaVaultAuditLog.create({
      data: {
        documentId: params.documentId,
        npaId: params.npaId,
        action: params.action,
        actorId: params.actorId || null,
        actorNpaId: params.actorNpaId || null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        metadata: params.metadata || undefined,
      },
    });
  } catch (error) {
    console.error("Failed to write vault audit log:", error);
  }
}

/**
 * Extract request metadata for audit logging
 */
export function getVaultRequestMetadata(req: NextRequest) {
  return {
    ipAddress:
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      null,
    userAgent: req.headers.get("user-agent") || null,
  };
}

/**
 * Log document upload event
 */
export async function logVaultUpload(
  documentId: string,
  npaId: string,
  actorId: string,
  metadata: {
    filename: string;
    category: string;
    source: string;
    sizeBytes: number;
  },
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logVaultAction({
    documentId,
    npaId,
    action: "UPLOADED",
    actorId,
    actorNpaId: npaId,
    ipAddress,
    userAgent,
    metadata,
  });
}

/**
 * Log document view event
 */
export async function logVaultView(
  documentId: string,
  npaId: string,
  actorId?: string | null,
  actorNpaId?: string | null,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logVaultAction({
    documentId,
    npaId,
    action: "VIEWED",
    actorId,
    actorNpaId,
    ipAddress,
    userAgent,
  });
}

/**
 * Log document download event
 */
export async function logVaultDownload(
  documentId: string,
  npaId: string,
  actorId?: string | null,
  actorNpaId?: string | null,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logVaultAction({
    documentId,
    npaId,
    action: "DOWNLOADED",
    actorId,
    actorNpaId,
    ipAddress,
    userAgent,
  });
}

/**
 * Log document metadata update event
 */
export async function logVaultMetadataUpdate(
  documentId: string,
  npaId: string,
  actorId: string,
  changedFields: string[],
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logVaultAction({
    documentId,
    npaId,
    action: "METADATA_UPDATED",
    actorId,
    actorNpaId: npaId,
    ipAddress,
    userAgent,
    metadata: { changedFields },
  });
}

/**
 * Log document delete event
 */
export async function logVaultDelete(
  documentId: string,
  npaId: string,
  actorId: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logVaultAction({
    documentId,
    npaId,
    action: "DELETED",
    actorId,
    actorNpaId: npaId,
    ipAddress,
    userAgent,
  });
}

/**
 * Log document share event
 */
export async function logVaultShare(
  documentId: string,
  npaId: string,
  actorId: string,
  shareLinkId: string,
  expiresAt: Date,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logVaultAction({
    documentId,
    npaId,
    action: "SHARED",
    actorId,
    actorNpaId: npaId,
    ipAddress,
    userAgent,
    metadata: { shareLinkId, expiresAt: expiresAt.toISOString() },
  });
}

/**
 * Log share revocation event
 */
export async function logVaultShareRevoked(
  documentId: string,
  npaId: string,
  actorId: string,
  shareLinkId: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await logVaultAction({
    documentId,
    npaId,
    action: "SHARE_REVOKED",
    actorId,
    actorNpaId: npaId,
    ipAddress,
    userAgent,
    metadata: { shareLinkId },
  });
}
