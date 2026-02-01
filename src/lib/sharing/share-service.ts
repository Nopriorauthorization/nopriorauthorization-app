/**
 * NPA Phase 4: Consent & Permissioned Sharing Engine
 * 
 * LEGAL COMPLIANCE STATEMENT (REQUIRED):
 * "Access is granted by the patient and may be revoked at any time.
 * Shared information reflects records as provided and does not constitute medical advice."
 * 
 * ABSOLUTE RULES:
 * ✅ Patient-initiated only
 * ✅ Permission-scoped
 * ✅ Time-limited
 * ✅ Revocable instantly
 * ✅ Log every access
 * 
 * ❌ No default open access
 * ❌ No sharing more than selected
 * ❌ No silent/background access
 */

import { randomBytes } from "node:crypto";
import type { SharePermission } from "@prisma/client";

// ============================================
// SHARE TOKEN GENERATION
// ============================================

/**
 * Generate a cryptographically secure share token
 * Format: shr_[32 random hex chars]
 */
export function generateShareToken(): string {
  const bytes = randomBytes(16);
  return `shr_${bytes.toString("hex")}`;
}

/**
 * Validate share token format
 */
export function isValidShareToken(token: string): boolean {
  return /^shr_[a-f0-9]{32}$/.test(token);
}

// ============================================
// EXPIRATION HELPERS
// ============================================

export type ExpirationPreset = "24h" | "7d" | "30d" | "custom";

/**
 * Calculate expiration date from preset
 */
export function calculateExpirationDate(
  preset: ExpirationPreset,
  customDate?: Date
): Date {
  const now = new Date();

  switch (preset) {
    case "24h":
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    case "custom":
      if (!customDate) {
        throw new Error("Custom expiration requires a date");
      }
      if (customDate <= now) {
        throw new Error("Expiration date must be in the future");
      }
      return customDate;
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Default 7 days
  }
}

/**
 * Check if a share session is expired
 */
export function isExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Check if a share session has exceeded max uses
 */
export function hasExceededMaxUses(
  useCount: number,
  maxUses: number | null
): boolean {
  if (maxUses === null) return false;
  return useCount >= maxUses;
}

// ============================================
// PERMISSION HELPERS
// ============================================

/**
 * Get human-readable permission description
 */
export function getPermissionDescription(permission: SharePermission): string {
  switch (permission) {
    case "READ_ONLY":
      return "View documents only";
    case "READ_DOWNLOAD":
      return "View and download documents";
    case "UPLOAD_ALLOWED":
      return "View documents and contribute new records";
    default:
      return "View documents only";
  }
}

/**
 * Check if permission allows downloading
 */
export function canDownload(permission: SharePermission): boolean {
  return permission === "READ_DOWNLOAD" || permission === "UPLOAD_ALLOWED";
}

/**
 * Check if permission allows uploading
 */
export function canUpload(permission: SharePermission): boolean {
  return permission === "UPLOAD_ALLOWED";
}

// ============================================
// SHARE URL GENERATION
// ============================================

/**
 * Generate the full share URL
 */
export function generateShareUrl(token: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXTAUTH_URL || "https://ask-beau-tox.vercel.app";
  return `${base}/share/${token}`;
}

// ============================================
// ACCESS VALIDATION
// ============================================

export interface ShareAccessResult {
  valid: boolean;
  reason?: string;
  code?: "EXPIRED" | "REVOKED" | "MAX_USES" | "NOT_FOUND" | "INVALID_TOKEN";
}

/**
 * Validate if a share session can be accessed
 */
export function validateShareAccess(
  session: {
    isRevoked: boolean;
    expiresAt: Date;
    useCount: number;
    maxUses: number | null;
  } | null
): ShareAccessResult {
  if (!session) {
    return { valid: false, reason: "Share link not found", code: "NOT_FOUND" };
  }

  if (session.isRevoked) {
    return {
      valid: false,
      reason: "This share link has been revoked by the patient",
      code: "REVOKED",
    };
  }

  if (isExpired(session.expiresAt)) {
    return {
      valid: false,
      reason: "This share link has expired",
      code: "EXPIRED",
    };
  }

  if (hasExceededMaxUses(session.useCount, session.maxUses)) {
    return {
      valid: false,
      reason: "This share link has reached its maximum number of uses",
      code: "MAX_USES",
    };
  }

  return { valid: true };
}

// ============================================
// REQUEST METADATA EXTRACTION
// ============================================

export interface ShareRequestMetadata {
  ipAddress: string | null;
  userAgent: string | null;
}

/**
 * Extract request metadata for logging
 */
export function getShareRequestMetadata(
  request: Request
): ShareRequestMetadata {
  const headers = request.headers;

  // Get IP address (check forwarded headers for proxies)
  const ipAddress =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    null;

  const userAgent = headers.get("user-agent") || null;

  return { ipAddress, userAgent };
}

// ============================================
// COMPLIANCE STATEMENTS
// ============================================

export const SHARE_COMPLIANCE_STATEMENT =
  "Access is granted by the patient and may be revoked at any time. Shared information reflects records as provided and does not constitute medical advice.";

export const SHARE_PRIVACY_NOTICE =
  "This information is shared under patient authorization. Unauthorized use, distribution, or copying is prohibited.";

// ============================================
// FORMATTING HELPERS
// ============================================

/**
 * Format share session for API response
 */
export function formatShareSessionResponse(session: {
  id: string;
  token: string;
  title: string | null;
  permission: SharePermission;
  expiresAt: Date;
  maxUses: number | null;
  useCount: number;
  isRevoked: boolean;
  revokedAt: Date | null;
  createdAt: Date;
  lastAccessedAt: Date | null;
  showPatientName: boolean;
  patientDisplayName: string | null;
  documents?: Array<{
    id: string;
    documentId: string;
    customTitle: string | null;
    document: {
      id: string;
      title: string;
      category: string;
      documentType: string | null;
      dateOfCare: Date | null;
    };
  }>;
  _count?: {
    accessLogs: number;
    contributions: number;
  };
}) {
  return {
    id: session.id,
    token: session.token,
    shareUrl: generateShareUrl(session.token),
    title: session.title,
    permission: session.permission,
    permissionDescription: getPermissionDescription(session.permission),
    expiresAt: session.expiresAt,
    maxUses: session.maxUses,
    useCount: session.useCount,
    isActive: !session.isRevoked && !isExpired(session.expiresAt),
    isRevoked: session.isRevoked,
    revokedAt: session.revokedAt,
    createdAt: session.createdAt,
    lastAccessedAt: session.lastAccessedAt,
    showPatientName: session.showPatientName,
    patientDisplayName: session.patientDisplayName,
    documentCount: session.documents?.length || 0,
    documents: session.documents?.map((d) => ({
      id: d.id,
      documentId: d.documentId,
      title: d.customTitle || d.document.title,
      category: d.document.category,
      documentType: d.document.documentType,
      dateOfCare: d.document.dateOfCare,
    })),
    accessCount: session._count?.accessLogs || 0,
    contributionCount: session._count?.contributions || 0,
    complianceStatement: SHARE_COMPLIANCE_STATEMENT,
  };
}
