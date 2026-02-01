-- NPA Phase 1 & 2: Identity Foundation & Vault Storage
-- Migration: npa_identity_vault_foundation
-- Created: 2026-02-01

-- Create UserStatus enum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- Add NPA ID columns to User table
ALTER TABLE "User" ADD COLUMN "npaId" TEXT;
ALTER TABLE "User" ADD COLUMN "npaIdAlias" TEXT;
ALTER TABLE "User" ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- Create unique index for NPA ID
CREATE UNIQUE INDEX "User_npaId_key" ON "User"("npaId");

-- Create IdentityAuditAction enum
CREATE TYPE "IdentityAuditAction" AS ENUM (
  'ACCOUNT_CREATED',
  'NPA_ID_GENERATED',
  'LOGIN',
  'LOGIN_FAILED',
  'LOGOUT',
  'PASSWORD_CHANGED',
  'PASSWORD_RESET_REQUESTED',
  'PASSWORD_RESET_COMPLETED',
  'PROFILE_UPDATED',
  'ACCOUNT_SUSPENDED',
  'ACCOUNT_REACTIVATED',
  'ACCOUNT_DELETED'
);

-- Create IdentityAuditLog table
CREATE TABLE "IdentityAuditLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "npaId" TEXT,
  "action" "IdentityAuditAction" NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "IdentityAuditLog_pkey" PRIMARY KEY ("id")
);

-- Create indexes for IdentityAuditLog
CREATE INDEX "IdentityAuditLog_userId_idx" ON "IdentityAuditLog"("userId");
CREATE INDEX "IdentityAuditLog_npaId_idx" ON "IdentityAuditLog"("npaId");
CREATE INDEX "IdentityAuditLog_action_idx" ON "IdentityAuditLog"("action");
CREATE INDEX "IdentityAuditLog_createdAt_idx" ON "IdentityAuditLog"("createdAt");

-- Add foreign key for IdentityAuditLog
ALTER TABLE "IdentityAuditLog" ADD CONSTRAINT "IdentityAuditLog_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================
-- NPA PHASE 2: VAULT STORAGE
-- ============================================

-- Create DocumentSource enum
CREATE TYPE "DocumentSource" AS ENUM (
  'EPIC_MYCHART',
  'CERNER',
  'ATHENA',
  'ALLSCRIPTS',
  'MEDITECH',
  'NEXTGEN',
  'ECW',
  'PATIENT_UPLOAD',
  'PROVIDER_UPLOAD',
  'INSURANCE',
  'LAB_DIRECT',
  'IMAGING_CENTER',
  'PHARMACY',
  'OTHER'
);

-- Create VaultDocumentCategory enum
CREATE TYPE "VaultDocumentCategory" AS ENUM (
  'LAB_RESULT',
  'IMAGING_REPORT',
  'IMAGING_SCAN',
  'VISIT_SUMMARY',
  'DISCHARGE_SUMMARY',
  'MEDICATION_LIST',
  'ALLERGY_LIST',
  'IMMUNIZATION_RECORD',
  'PROCEDURE_NOTE',
  'OPERATIVE_REPORT',
  'PATHOLOGY_REPORT',
  'REFERRAL',
  'INSURANCE_CARD',
  'INSURANCE_EOB',
  'CCDA_CCD',
  'CARE_PLAN',
  'CONSENT_FORM',
  'ADVANCE_DIRECTIVE',
  'OTHER'
);

-- Create VaultDocument table
CREATE TABLE "VaultDocument" (
  "id" TEXT NOT NULL,
  "npaId" TEXT NOT NULL,
  "userId" TEXT,
  "title" TEXT NOT NULL,
  "category" "VaultDocumentCategory" NOT NULL DEFAULT 'OTHER',
  "source" "DocumentSource" NOT NULL DEFAULT 'PATIENT_UPLOAD',
  "sourceSystem" TEXT,
  "dateOfCare" TIMESTAMP(3),
  "dateReceived" TIMESTAMP(3),
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "storagePath" TEXT NOT NULL,
  "originalFilename" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "extractedText" TEXT,
  "isDeleted" BOOLEAN NOT NULL DEFAULT false,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "VaultDocument_pkey" PRIMARY KEY ("id")
);

-- Create indexes for VaultDocument
CREATE INDEX "VaultDocument_npaId_idx" ON "VaultDocument"("npaId");
CREATE INDEX "VaultDocument_userId_idx" ON "VaultDocument"("userId");
CREATE INDEX "VaultDocument_category_idx" ON "VaultDocument"("category");
CREATE INDEX "VaultDocument_source_idx" ON "VaultDocument"("source");
CREATE INDEX "VaultDocument_dateOfCare_idx" ON "VaultDocument"("dateOfCare");
CREATE INDEX "VaultDocument_uploadedAt_idx" ON "VaultDocument"("uploadedAt");
CREATE INDEX "VaultDocument_isDeleted_idx" ON "VaultDocument"("isDeleted");

-- Add foreign key for VaultDocument
ALTER TABLE "VaultDocument" ADD CONSTRAINT "VaultDocument_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create VaultDocumentAction enum
CREATE TYPE "VaultDocumentAction" AS ENUM (
  'UPLOADED',
  'VIEWED',
  'DOWNLOADED',
  'METADATA_UPDATED',
  'DELETED',
  'RESTORED',
  'SHARED',
  'SHARE_REVOKED'
);

-- Create VaultDocumentAuditLog table
CREATE TABLE "VaultDocumentAuditLog" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "npaId" TEXT NOT NULL,
  "action" "VaultDocumentAction" NOT NULL,
  "actorId" TEXT,
  "actorNpaId" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "VaultDocumentAuditLog_pkey" PRIMARY KEY ("id")
);

-- Create indexes for VaultDocumentAuditLog
CREATE INDEX "VaultDocumentAuditLog_documentId_idx" ON "VaultDocumentAuditLog"("documentId");
CREATE INDEX "VaultDocumentAuditLog_npaId_idx" ON "VaultDocumentAuditLog"("npaId");
CREATE INDEX "VaultDocumentAuditLog_action_idx" ON "VaultDocumentAuditLog"("action");
CREATE INDEX "VaultDocumentAuditLog_createdAt_idx" ON "VaultDocumentAuditLog"("createdAt");

-- Add foreign key for VaultDocumentAuditLog
ALTER TABLE "VaultDocumentAuditLog" ADD CONSTRAINT "VaultDocumentAuditLog_documentId_fkey" 
  FOREIGN KEY ("documentId") REFERENCES "VaultDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create VaultShareLink table
CREATE TABLE "VaultShareLink" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "npaId" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "canDownload" BOOLEAN NOT NULL DEFAULT false,
  "canUpload" BOOLEAN NOT NULL DEFAULT false,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "isRevoked" BOOLEAN NOT NULL DEFAULT false,
  "revokedAt" TIMESTAMP(3),
  "revokedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "VaultShareLink_pkey" PRIMARY KEY ("id")
);

-- Create unique index for token
CREATE UNIQUE INDEX "VaultShareLink_token_key" ON "VaultShareLink"("token");

-- Create indexes for VaultShareLink
CREATE INDEX "VaultShareLink_documentId_idx" ON "VaultShareLink"("documentId");
CREATE INDEX "VaultShareLink_npaId_idx" ON "VaultShareLink"("npaId");
CREATE INDEX "VaultShareLink_token_idx" ON "VaultShareLink"("token");
CREATE INDEX "VaultShareLink_expiresAt_idx" ON "VaultShareLink"("expiresAt");

-- Add foreign key for VaultShareLink
ALTER TABLE "VaultShareLink" ADD CONSTRAINT "VaultShareLink_documentId_fkey" 
  FOREIGN KEY ("documentId") REFERENCES "VaultDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create VaultShareLinkAccess table
CREATE TABLE "VaultShareLinkAccess" (
  "id" TEXT NOT NULL,
  "shareLinkId" TEXT NOT NULL,
  "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT,

  CONSTRAINT "VaultShareLinkAccess_pkey" PRIMARY KEY ("id")
);

-- Create indexes for VaultShareLinkAccess
CREATE INDEX "VaultShareLinkAccess_shareLinkId_idx" ON "VaultShareLinkAccess"("shareLinkId");
CREATE INDEX "VaultShareLinkAccess_accessedAt_idx" ON "VaultShareLinkAccess"("accessedAt");

-- Add foreign key for VaultShareLinkAccess
ALTER TABLE "VaultShareLinkAccess" ADD CONSTRAINT "VaultShareLinkAccess_shareLinkId_fkey" 
  FOREIGN KEY ("shareLinkId") REFERENCES "VaultShareLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
