-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'PROVIDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'CORE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('LAB', 'IMAGING', 'VISIT_NOTE', 'DISCHARGE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProviderPacketTemplate" AS ENUM ('PRIMARY', 'SPECIALIST', 'URGENT');

-- CreateEnum
CREATE TYPE "VaultItemType" AS ENUM ('DOCUMENT', 'LAB', 'NOTE', 'TOOL_OUTPUT');

-- CreateEnum
CREATE TYPE "InsightPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "InsightSource" AS ENUM ('LAB', 'FAMILY', 'TOOL', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "FeatureFlagType" AS ENUM ('EMERGENCY_TOGGLE', 'SYSTEM_CONTROL', 'MASCOT_CONTROL');

-- CreateEnum
CREATE TYPE "MascotScriptStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "UserEventType" AS ENUM ('LAB_UPLOAD', 'LAB_DECODED', 'FAMILY_ADDED', 'FAMILY_UPDATED', 'CHAT_USED', 'INSIGHT_VIEWED', 'DOCUMENT_UPLOADED', 'DOCUMENT_DECODED', 'BLUEPRINT_UPDATED', 'MASCOT_VISITED', 'TOOL_USED', 'PROVIDER_ADDED', 'APPOINTMENT_ADDED');

-- CreateEnum
CREATE TYPE "NpaStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "IdentityAuditAction" AS ENUM ('ACCOUNT_CREATED', 'NPA_ID_GENERATED', 'LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'PASSWORD_CHANGED', 'PASSWORD_RESET_REQUESTED', 'PASSWORD_RESET_COMPLETED', 'PROFILE_UPDATED', 'ACCOUNT_SUSPENDED', 'ACCOUNT_REACTIVATED', 'ACCOUNT_DELETED');

-- CreateEnum
CREATE TYPE "NpaProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "NpaDocumentSource" AS ENUM ('EPIC_MYCHART', 'CERNER', 'ATHENA', 'ALLSCRIPTS', 'MEDITECH', 'NEXTGEN', 'ECW', 'PATIENT_UPLOAD', 'PROVIDER_UPLOAD', 'INSURANCE', 'LAB_DIRECT', 'IMAGING_CENTER', 'PHARMACY', 'OTHER');

-- CreateEnum
CREATE TYPE "NpaDocumentCategory" AS ENUM ('LAB_RESULT', 'IMAGING_REPORT', 'IMAGING_SCAN', 'VISIT_SUMMARY', 'DISCHARGE_SUMMARY', 'MEDICATION_LIST', 'ALLERGY_LIST', 'IMMUNIZATION_RECORD', 'PROCEDURE_NOTE', 'OPERATIVE_REPORT', 'PATHOLOGY_REPORT', 'REFERRAL', 'INSURANCE_CARD', 'INSURANCE_EOB', 'CCDA_CCD', 'CARE_PLAN', 'CONSENT_FORM', 'ADVANCE_DIRECTIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "NpaVaultAction" AS ENUM ('UPLOADED', 'VIEWED', 'DOWNLOADED', 'METADATA_UPDATED', 'DELETED', 'RESTORED', 'SHARED', 'SHARE_REVOKED');

-- CreateEnum
CREATE TYPE "SharePermission" AS ENUM ('READ_ONLY', 'READ_DOWNLOAD', 'UPLOAD_ALLOWED');

-- CreateEnum
CREATE TYPE "ShareAccessAction" AS ENUM ('LINK_VIEWED', 'DOCUMENT_VIEWED', 'DOCUMENT_DOWNLOADED', 'DOCUMENT_UPLOADED', 'ACCESS_DENIED');

-- CreateEnum
CREATE TYPE "EmergencyAccessScope" AS ENUM ('CRITICAL_ONLY', 'MEDICATIONS_FULL', 'SUMMARY_VIEW', 'FULL_VAULT');

-- CreateEnum
CREATE TYPE "ProviderRole" AS ENUM ('MD', 'DO', 'NP', 'PA', 'RN', 'LPN', 'PHARMD', 'PT', 'OT', 'LCSW', 'PHD', 'PSYD', 'DMD', 'DDS', 'DC', 'OD', 'DPM', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'PATIENT',
    "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastAccessAt" TIMESTAMP(3),
    "npaId" TEXT,
    "npaIdAlias" TEXT,
    "npaStatus" "NpaStatus" NOT NULL DEFAULT 'ACTIVE',
    "consentToShareClinicalSummary" BOOLEAN NOT NULL DEFAULT false,
    "allowProviderToProviderSharing" BOOLEAN NOT NULL DEFAULT false,
    "emailNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "defaultClinicalSummaryView" TEXT DEFAULT 'provider',
    "includeProviderNotesInShares" BOOLEAN NOT NULL DEFAULT false,
    "copyToEHRFormat" TEXT DEFAULT 'plain_text',
    "dataExportRequestedAt" TIMESTAMP(3),
    "accountDeletionRequestedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT,
    "productSlug" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "deliveryToken" TEXT,
    "deliveryEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "deliveryEmailAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messages" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "metadata" JSONB,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMemory" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonId" TEXT,
    "goals" JSONB,
    "preferences" JSONB,
    "topicsDiscussed" JSONB,
    "vaultName" TEXT,
    "disclaimerAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "optOut" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blueprint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "identityContext" JSONB,
    "healthFoundations" JSONB,
    "treatments" JSONB,
    "timeline" JSONB,
    "documents" JSONB,
    "providers" JSONB,
    "preparation" JSONB,

    CONSTRAINT "Blueprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonId" TEXT,
    "title" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL DEFAULT 'OTHER',
    "docDate" TIMESTAMP(3),
    "storagePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "includeInPacketDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentDecode" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "keyTerms" JSONB NOT NULL,
    "questions" JSONB NOT NULL,
    "nextSteps" JSONB NOT NULL,
    "safetyNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentDecode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentShareLink" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentShareLinkAccess" (
    "id" TEXT NOT NULL,
    "shareLinkId" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "DocumentShareLinkAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderPacket" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonId" TEXT,
    "template" "ProviderPacketTemplate" NOT NULL DEFAULT 'PRIMARY',
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderPacket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderPacketLink" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "packetId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderPacketLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderPacketAccessLog" (
    "id" TEXT NOT NULL,
    "providerPacketLinkId" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "ProviderPacketAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "subjectUserId" TEXT,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDisableEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "disabledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disabledBy" TEXT NOT NULL,
    "reason" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,

    CONSTRAINT "UserDisableEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentChangeLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "consentType" TEXT NOT NULL,
    "oldValue" BOOLEAN NOT NULL,
    "newValue" BOOLEAN NOT NULL,
    "changedBy" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,

    CONSTRAINT "ConsentChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilledAt" TIMESTAMP(3),
    "fulfilledBy" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancelledBy" TEXT,
    "cancellationReason" TEXT,
    "notes" TEXT,

    CONSTRAINT "DataRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonId" TEXT,
    "providerName" TEXT NOT NULL,
    "providerSpecialty" TEXT,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "appointmentType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "location" TEXT,
    "notes" TEXT,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonId" TEXT,
    "name" TEXT NOT NULL,
    "specialty" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderRating" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonId" TEXT,
    "providerId" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "specialty" TEXT,
    "rating" INTEGER NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "wouldRecommend" BOOLEAN NOT NULL DEFAULT true,
    "lastVisit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoComparison" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonId" TEXT,
    "beforePhoto" TEXT NOT NULL,
    "afterPhoto" TEXT NOT NULL,
    "title" TEXT,
    "notes" TEXT,
    "daysBetween" INTEGER,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhotoComparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceMemo" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonId" TEXT,
    "audioUrl" TEXT NOT NULL,
    "transcript" TEXT,
    "title" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceMemo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedFlag" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonId" TEXT,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "medications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dismissed" BOOLEAN NOT NULL DEFAULT false,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RedFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustedCircleMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "relationship" TEXT,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'pending',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustedCircleMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustedCircleInvite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inviteeName" TEXT NOT NULL,
    "inviteeEmail" TEXT NOT NULL,
    "relationship" TEXT,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustedCircleInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "conditionTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vault" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaultItem" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "type" "VaultItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VaultItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabResult" (
    "id" TEXT NOT NULL,
    "vaultItemId" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "flags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "parsedSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlueprintInsight" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "source" "InsightSource" NOT NULL,
    "priority" "InsightPriority" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlueprintInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "FeatureFlagType" NOT NULL DEFAULT 'EMERGENCY_TOGGLE',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "defaultValue" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlagChange" (
    "id" TEXT NOT NULL,
    "flagId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "oldValue" BOOLEAN NOT NULL,
    "newValue" BOOLEAN NOT NULL,
    "reason" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeatureFlagChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemHealthCheck" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "latency" INTEGER,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemHealthCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MascotScript" (
    "id" TEXT NOT NULL,
    "mascotId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" "MascotScriptStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scriptContent" JSONB NOT NULL,
    "audioEnabled" BOOLEAN NOT NULL DEFAULT true,
    "autoplayEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MascotScript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MascotScriptChange" (
    "id" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "reason" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MascotScriptChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "UserEventType" NOT NULL,
    "source" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVisit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastVisitAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previousVisitAt" TIMESTAMP(3),
    "totalVisits" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSecurity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vaultPasscodeHash" TEXT,
    "passcodeSetAt" TIMESTAMP(3),
    "passcodeAttempts" INTEGER NOT NULL DEFAULT 0,
    "passcodeLockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSecurity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "NpaVaultDocument" (
    "id" TEXT NOT NULL,
    "npaId" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "category" "NpaDocumentCategory" NOT NULL DEFAULT 'OTHER',
    "source" "NpaDocumentSource" NOT NULL DEFAULT 'PATIENT_UPLOAD',
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
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "hiddenAt" TIMESTAMP(3),
    "processingStatus" "NpaProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "processingError" TEXT,
    "documentType" TEXT,
    "classificationConfidence" DOUBLE PRECISION,
    "sections" JSONB,
    "providerName" TEXT,
    "facilityName" TEXT,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NpaVaultDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaVaultAuditLog" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "npaId" TEXT NOT NULL,
    "action" "NpaVaultAction" NOT NULL,
    "actorId" TEXT,
    "actorNpaId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NpaVaultAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaVaultShareLink" (
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

    CONSTRAINT "NpaVaultShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaVaultShareLinkAccess" (
    "id" TEXT NOT NULL,
    "shareLinkId" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "NpaVaultShareLinkAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaShareSession" (
    "id" TEXT NOT NULL,
    "npaId" TEXT NOT NULL,
    "userId" TEXT,
    "token" TEXT NOT NULL,
    "title" TEXT,
    "permission" "SharePermission" NOT NULL DEFAULT 'READ_ONLY',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "maxUses" INTEGER,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "showPatientName" BOOLEAN NOT NULL DEFAULT true,
    "patientDisplayName" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastAccessedAt" TIMESTAMP(3),

    CONSTRAINT "NpaShareSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaShareDocument" (
    "id" TEXT NOT NULL,
    "shareSessionId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "customTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NpaShareDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaShareAccessLog" (
    "id" TEXT NOT NULL,
    "shareSessionId" TEXT NOT NULL,
    "documentId" TEXT,
    "action" "ShareAccessAction" NOT NULL,
    "accessorName" TEXT,
    "accessorOrg" TEXT,
    "accessorEmail" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "wasSuccessful" BOOLEAN NOT NULL DEFAULT true,
    "denialReason" TEXT,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NpaShareAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaEmergencyAccessSettings" (
    "id" TEXT NOT NULL,
    "npaId" TEXT NOT NULL,
    "userId" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "allowedScope" "EmergencyAccessScope" NOT NULL DEFAULT 'CRITICAL_ONLY',
    "maxDurationMinutes" INTEGER NOT NULL DEFAULT 60,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "emergencyContactRelation" TEXT,
    "knownAllergies" TEXT,
    "currentMedications" TEXT,
    "criticalConditions" TEXT,
    "disclaimerAcceptedAt" TIMESTAMP(3),
    "enabledAt" TIMESTAMP(3),
    "disabledAt" TIMESTAMP(3),
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NpaEmergencyAccessSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaEmergencyAccessSession" (
    "id" TEXT NOT NULL,
    "settingsId" TEXT NOT NULL,
    "npaId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "grantedScope" "EmergencyAccessScope" NOT NULL,
    "accessorName" TEXT,
    "accessorRole" TEXT,
    "accessorOrg" TEXT,
    "reasonEntered" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "wasRevoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "revokedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NpaEmergencyAccessSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaEmergencyAccessLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "npaId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NpaEmergencyAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaDataExport" (
    "id" TEXT NOT NULL,
    "npaId" TEXT NOT NULL,
    "userId" TEXT,
    "exportType" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "downloadUrl" TEXT,
    "downloadExpiresAt" TIMESTAMP(3),
    "fileSizeBytes" INTEGER,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "downloadedAt" TIMESTAMP(3),

    CONSTRAINT "NpaDataExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaMfaEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "npaId" TEXT,
    "method" TEXT NOT NULL DEFAULT 'totp',
    "totpSecret" TEXT,
    "totpVerifiedAt" TIMESTAMP(3),
    "backupCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "backupCodesGeneratedAt" TIMESTAMP(3),
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "enrolledAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NpaMfaEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaUserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "npaId" TEXT,
    "sessionToken" TEXT NOT NULL,
    "deviceType" TEXT,
    "deviceName" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "ipAddress" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAnomaly" BOOLEAN NOT NULL DEFAULT false,
    "anomalyReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "NpaUserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpaProviderContribution" (
    "id" TEXT NOT NULL,
    "shareSessionId" TEXT NOT NULL,
    "npaId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "providerRole" "ProviderRole" NOT NULL DEFAULT 'OTHER',
    "providerOrg" TEXT,
    "providerEmail" TEXT,
    "providerNPI" TEXT,
    "specialty" TEXT,
    "dateOfCare" TIMESTAMP(3),
    "contributionType" TEXT NOT NULL,
    "notes" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NpaProviderContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledPost" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'facebook',
    "caption" TEXT NOT NULL,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "postType" TEXT NOT NULL DEFAULT 'text',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "fbPostId" TEXT,
    "errorMsg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduledPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_npaId_key" ON "User"("npaId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_stripeSessionId_key" ON "Purchase"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Purchase_customerEmail_idx" ON "Purchase"("customerEmail");

-- CreateIndex
CREATE INDEX "Purchase_productSlug_idx" ON "Purchase"("productSlug");

-- CreateIndex
CREATE INDEX "Purchase_createdAt_idx" ON "Purchase"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubId_key" ON "Subscription"("stripeSubId");

-- CreateIndex
CREATE INDEX "ChatSession_userId_idx" ON "ChatSession"("userId");

-- CreateIndex
CREATE INDEX "Analytics_event_idx" ON "Analytics"("event");

-- CreateIndex
CREATE INDEX "Analytics_createdAt_idx" ON "Analytics"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserMemory_userId_key" ON "UserMemory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMemory_anonId_key" ON "UserMemory"("anonId");

-- CreateIndex
CREATE INDEX "UserMemory_anonId_idx" ON "UserMemory"("anonId");

-- CreateIndex
CREATE UNIQUE INDEX "Blueprint_userId_key" ON "Blueprint"("userId");

-- CreateIndex
CREATE INDEX "Blueprint_userId_idx" ON "Blueprint"("userId");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId");

-- CreateIndex
CREATE INDEX "Document_anonId_idx" ON "Document"("anonId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentDecode_documentId_key" ON "DocumentDecode"("documentId");

-- CreateIndex
CREATE INDEX "DocumentDecode_documentId_idx" ON "DocumentDecode"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentShareLink_token_key" ON "DocumentShareLink"("token");

-- CreateIndex
CREATE INDEX "DocumentShareLink_documentId_idx" ON "DocumentShareLink"("documentId");

-- CreateIndex
CREATE INDEX "ProviderPacket_userId_idx" ON "ProviderPacket"("userId");

-- CreateIndex
CREATE INDEX "ProviderPacket_anonId_idx" ON "ProviderPacket"("anonId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderPacketLink_token_key" ON "ProviderPacketLink"("token");

-- CreateIndex
CREATE INDEX "ProviderPacketLink_packetId_idx" ON "ProviderPacketLink"("packetId");

-- CreateIndex
CREATE INDEX "AccessLog_actorId_createdAt_idx" ON "AccessLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AccessLog_subjectUserId_createdAt_idx" ON "AccessLog"("subjectUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AccessLog_resourceType_resourceId_idx" ON "AccessLog"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "AccessLog_createdAt_idx" ON "AccessLog"("createdAt");

-- CreateIndex
CREATE INDEX "UserDisableEvent_userId_idx" ON "UserDisableEvent"("userId");

-- CreateIndex
CREATE INDEX "UserDisableEvent_disabledAt_idx" ON "UserDisableEvent"("disabledAt");

-- CreateIndex
CREATE INDEX "UserDisableEvent_resolvedAt_idx" ON "UserDisableEvent"("resolvedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");

-- CreateIndex
CREATE INDEX "ConsentChangeLog_userId_changedAt_idx" ON "ConsentChangeLog"("userId", "changedAt");

-- CreateIndex
CREATE INDEX "ConsentChangeLog_consentType_idx" ON "ConsentChangeLog"("consentType");

-- CreateIndex
CREATE INDEX "ConsentChangeLog_changedAt_idx" ON "ConsentChangeLog"("changedAt");

-- CreateIndex
CREATE INDEX "DataRequest_userId_idx" ON "DataRequest"("userId");

-- CreateIndex
CREATE INDEX "DataRequest_status_idx" ON "DataRequest"("status");

-- CreateIndex
CREATE INDEX "DataRequest_requestType_idx" ON "DataRequest"("requestType");

-- CreateIndex
CREATE INDEX "DataRequest_requestedAt_idx" ON "DataRequest"("requestedAt");

-- CreateIndex
CREATE INDEX "Appointment_userId_idx" ON "Appointment"("userId");

-- CreateIndex
CREATE INDEX "Appointment_anonId_idx" ON "Appointment"("anonId");

-- CreateIndex
CREATE INDEX "Appointment_appointmentDate_idx" ON "Appointment"("appointmentDate");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE INDEX "Provider_userId_idx" ON "Provider"("userId");

-- CreateIndex
CREATE INDEX "Provider_anonId_idx" ON "Provider"("anonId");

-- CreateIndex
CREATE INDEX "ProviderRating_userId_idx" ON "ProviderRating"("userId");

-- CreateIndex
CREATE INDEX "ProviderRating_anonId_idx" ON "ProviderRating"("anonId");

-- CreateIndex
CREATE INDEX "ProviderRating_providerId_idx" ON "ProviderRating"("providerId");

-- CreateIndex
CREATE INDEX "PhotoComparison_userId_idx" ON "PhotoComparison"("userId");

-- CreateIndex
CREATE INDEX "PhotoComparison_anonId_idx" ON "PhotoComparison"("anonId");

-- CreateIndex
CREATE INDEX "PhotoComparison_category_idx" ON "PhotoComparison"("category");

-- CreateIndex
CREATE INDEX "VoiceMemo_userId_idx" ON "VoiceMemo"("userId");

-- CreateIndex
CREATE INDEX "VoiceMemo_anonId_idx" ON "VoiceMemo"("anonId");

-- CreateIndex
CREATE INDEX "VoiceMemo_createdAt_idx" ON "VoiceMemo"("createdAt");

-- CreateIndex
CREATE INDEX "RedFlag_userId_idx" ON "RedFlag"("userId");

-- CreateIndex
CREATE INDEX "RedFlag_anonId_idx" ON "RedFlag"("anonId");

-- CreateIndex
CREATE INDEX "RedFlag_dismissed_idx" ON "RedFlag"("dismissed");

-- CreateIndex
CREATE INDEX "RedFlag_severity_idx" ON "RedFlag"("severity");

-- CreateIndex
CREATE INDEX "TrustedCircleMember_userId_idx" ON "TrustedCircleMember"("userId");

-- CreateIndex
CREATE INDEX "TrustedCircleMember_email_idx" ON "TrustedCircleMember"("email");

-- CreateIndex
CREATE INDEX "TrustedCircleMember_status_idx" ON "TrustedCircleMember"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TrustedCircleInvite_token_key" ON "TrustedCircleInvite"("token");

-- CreateIndex
CREATE INDEX "TrustedCircleInvite_userId_idx" ON "TrustedCircleInvite"("userId");

-- CreateIndex
CREATE INDEX "TrustedCircleInvite_token_idx" ON "TrustedCircleInvite"("token");

-- CreateIndex
CREATE INDEX "TrustedCircleInvite_status_idx" ON "TrustedCircleInvite"("status");

-- CreateIndex
CREATE INDEX "TrustedCircleInvite_inviteeEmail_idx" ON "TrustedCircleInvite"("inviteeEmail");

-- CreateIndex
CREATE INDEX "FamilyMember_vaultId_idx" ON "FamilyMember"("vaultId");

-- CreateIndex
CREATE INDEX "FamilyMember_relationship_idx" ON "FamilyMember"("relationship");

-- CreateIndex
CREATE UNIQUE INDEX "Vault_userId_key" ON "Vault"("userId");

-- CreateIndex
CREATE INDEX "Vault_userId_idx" ON "Vault"("userId");

-- CreateIndex
CREATE INDEX "VaultItem_vaultId_idx" ON "VaultItem"("vaultId");

-- CreateIndex
CREATE INDEX "VaultItem_type_idx" ON "VaultItem"("type");

-- CreateIndex
CREATE INDEX "LabResult_vaultItemId_idx" ON "LabResult"("vaultItemId");

-- CreateIndex
CREATE INDEX "BlueprintInsight_vaultId_idx" ON "BlueprintInsight"("vaultId");

-- CreateIndex
CREATE INDEX "BlueprintInsight_source_idx" ON "BlueprintInsight"("source");

-- CreateIndex
CREATE INDEX "BlueprintInsight_priority_idx" ON "BlueprintInsight"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_key_key" ON "FeatureFlag"("key");

-- CreateIndex
CREATE INDEX "FeatureFlag_key_idx" ON "FeatureFlag"("key");

-- CreateIndex
CREATE INDEX "FeatureFlag_type_idx" ON "FeatureFlag"("type");

-- CreateIndex
CREATE INDEX "FeatureFlag_enabled_idx" ON "FeatureFlag"("enabled");

-- CreateIndex
CREATE INDEX "FeatureFlagChange_flagId_idx" ON "FeatureFlagChange"("flagId");

-- CreateIndex
CREATE INDEX "FeatureFlagChange_changedBy_idx" ON "FeatureFlagChange"("changedBy");

-- CreateIndex
CREATE INDEX "FeatureFlagChange_createdAt_idx" ON "FeatureFlagChange"("createdAt");

-- CreateIndex
CREATE INDEX "SystemHealthCheck_service_idx" ON "SystemHealthCheck"("service");

-- CreateIndex
CREATE INDEX "SystemHealthCheck_status_idx" ON "SystemHealthCheck"("status");

-- CreateIndex
CREATE INDEX "SystemHealthCheck_checkedAt_idx" ON "SystemHealthCheck"("checkedAt");

-- CreateIndex
CREATE INDEX "MascotScript_mascotId_idx" ON "MascotScript"("mascotId");

-- CreateIndex
CREATE INDEX "MascotScript_status_idx" ON "MascotScript"("status");

-- CreateIndex
CREATE INDEX "MascotScript_version_idx" ON "MascotScript"("version");

-- CreateIndex
CREATE UNIQUE INDEX "MascotScript_mascotId_version_key" ON "MascotScript"("mascotId", "version");

-- CreateIndex
CREATE INDEX "MascotScriptChange_scriptId_idx" ON "MascotScriptChange"("scriptId");

-- CreateIndex
CREATE INDEX "MascotScriptChange_changedBy_idx" ON "MascotScriptChange"("changedBy");

-- CreateIndex
CREATE INDEX "MascotScriptChange_createdAt_idx" ON "MascotScriptChange"("createdAt");

-- CreateIndex
CREATE INDEX "UserEvent_userId_idx" ON "UserEvent"("userId");

-- CreateIndex
CREATE INDEX "UserEvent_userId_createdAt_idx" ON "UserEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserEvent_type_idx" ON "UserEvent"("type");

-- CreateIndex
CREATE INDEX "UserEvent_source_idx" ON "UserEvent"("source");

-- CreateIndex
CREATE INDEX "UserEvent_createdAt_idx" ON "UserEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserVisit_userId_key" ON "UserVisit"("userId");

-- CreateIndex
CREATE INDEX "UserVisit_userId_idx" ON "UserVisit"("userId");

-- CreateIndex
CREATE INDEX "UserVisit_lastVisitAt_idx" ON "UserVisit"("lastVisitAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserSecurity_userId_key" ON "UserSecurity"("userId");

-- CreateIndex
CREATE INDEX "UserSecurity_userId_idx" ON "UserSecurity"("userId");

-- CreateIndex
CREATE INDEX "IdentityAuditLog_userId_idx" ON "IdentityAuditLog"("userId");

-- CreateIndex
CREATE INDEX "IdentityAuditLog_npaId_idx" ON "IdentityAuditLog"("npaId");

-- CreateIndex
CREATE INDEX "IdentityAuditLog_action_idx" ON "IdentityAuditLog"("action");

-- CreateIndex
CREATE INDEX "IdentityAuditLog_createdAt_idx" ON "IdentityAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "NpaVaultDocument_npaId_idx" ON "NpaVaultDocument"("npaId");

-- CreateIndex
CREATE INDEX "NpaVaultDocument_userId_idx" ON "NpaVaultDocument"("userId");

-- CreateIndex
CREATE INDEX "NpaVaultDocument_category_idx" ON "NpaVaultDocument"("category");

-- CreateIndex
CREATE INDEX "NpaVaultDocument_source_idx" ON "NpaVaultDocument"("source");

-- CreateIndex
CREATE INDEX "NpaVaultDocument_dateOfCare_idx" ON "NpaVaultDocument"("dateOfCare");

-- CreateIndex
CREATE INDEX "NpaVaultDocument_uploadedAt_idx" ON "NpaVaultDocument"("uploadedAt");

-- CreateIndex
CREATE INDEX "NpaVaultDocument_isDeleted_idx" ON "NpaVaultDocument"("isDeleted");

-- CreateIndex
CREATE INDEX "NpaVaultDocument_isHidden_idx" ON "NpaVaultDocument"("isHidden");

-- CreateIndex
CREATE INDEX "NpaVaultDocument_processingStatus_idx" ON "NpaVaultDocument"("processingStatus");

-- CreateIndex
CREATE INDEX "NpaVaultDocument_documentType_idx" ON "NpaVaultDocument"("documentType");

-- CreateIndex
CREATE INDEX "NpaVaultAuditLog_documentId_idx" ON "NpaVaultAuditLog"("documentId");

-- CreateIndex
CREATE INDEX "NpaVaultAuditLog_npaId_idx" ON "NpaVaultAuditLog"("npaId");

-- CreateIndex
CREATE INDEX "NpaVaultAuditLog_action_idx" ON "NpaVaultAuditLog"("action");

-- CreateIndex
CREATE INDEX "NpaVaultAuditLog_createdAt_idx" ON "NpaVaultAuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NpaVaultShareLink_token_key" ON "NpaVaultShareLink"("token");

-- CreateIndex
CREATE INDEX "NpaVaultShareLink_documentId_idx" ON "NpaVaultShareLink"("documentId");

-- CreateIndex
CREATE INDEX "NpaVaultShareLink_npaId_idx" ON "NpaVaultShareLink"("npaId");

-- CreateIndex
CREATE INDEX "NpaVaultShareLink_token_idx" ON "NpaVaultShareLink"("token");

-- CreateIndex
CREATE INDEX "NpaVaultShareLink_expiresAt_idx" ON "NpaVaultShareLink"("expiresAt");

-- CreateIndex
CREATE INDEX "NpaVaultShareLinkAccess_shareLinkId_idx" ON "NpaVaultShareLinkAccess"("shareLinkId");

-- CreateIndex
CREATE INDEX "NpaVaultShareLinkAccess_accessedAt_idx" ON "NpaVaultShareLinkAccess"("accessedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NpaShareSession_token_key" ON "NpaShareSession"("token");

-- CreateIndex
CREATE INDEX "NpaShareSession_npaId_idx" ON "NpaShareSession"("npaId");

-- CreateIndex
CREATE INDEX "NpaShareSession_userId_idx" ON "NpaShareSession"("userId");

-- CreateIndex
CREATE INDEX "NpaShareSession_token_idx" ON "NpaShareSession"("token");

-- CreateIndex
CREATE INDEX "NpaShareSession_expiresAt_idx" ON "NpaShareSession"("expiresAt");

-- CreateIndex
CREATE INDEX "NpaShareSession_isRevoked_idx" ON "NpaShareSession"("isRevoked");

-- CreateIndex
CREATE INDEX "NpaShareDocument_shareSessionId_idx" ON "NpaShareDocument"("shareSessionId");

-- CreateIndex
CREATE INDEX "NpaShareDocument_documentId_idx" ON "NpaShareDocument"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "NpaShareDocument_shareSessionId_documentId_key" ON "NpaShareDocument"("shareSessionId", "documentId");

-- CreateIndex
CREATE INDEX "NpaShareAccessLog_shareSessionId_idx" ON "NpaShareAccessLog"("shareSessionId");

-- CreateIndex
CREATE INDEX "NpaShareAccessLog_documentId_idx" ON "NpaShareAccessLog"("documentId");

-- CreateIndex
CREATE INDEX "NpaShareAccessLog_action_idx" ON "NpaShareAccessLog"("action");

-- CreateIndex
CREATE INDEX "NpaShareAccessLog_accessedAt_idx" ON "NpaShareAccessLog"("accessedAt");

-- CreateIndex
CREATE INDEX "NpaShareAccessLog_accessorEmail_idx" ON "NpaShareAccessLog"("accessorEmail");

-- CreateIndex
CREATE UNIQUE INDEX "NpaEmergencyAccessSettings_npaId_key" ON "NpaEmergencyAccessSettings"("npaId");

-- CreateIndex
CREATE INDEX "NpaEmergencyAccessSettings_npaId_idx" ON "NpaEmergencyAccessSettings"("npaId");

-- CreateIndex
CREATE INDEX "NpaEmergencyAccessSettings_userId_idx" ON "NpaEmergencyAccessSettings"("userId");

-- CreateIndex
CREATE INDEX "NpaEmergencyAccessSettings_isEnabled_idx" ON "NpaEmergencyAccessSettings"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "NpaEmergencyAccessSession_token_key" ON "NpaEmergencyAccessSession"("token");

-- CreateIndex
CREATE INDEX "NpaEmergencyAccessSession_settingsId_idx" ON "NpaEmergencyAccessSession"("settingsId");

-- CreateIndex
CREATE INDEX "NpaEmergencyAccessSession_npaId_idx" ON "NpaEmergencyAccessSession"("npaId");

-- CreateIndex
CREATE INDEX "NpaEmergencyAccessSession_token_idx" ON "NpaEmergencyAccessSession"("token");

-- CreateIndex
CREATE INDEX "NpaEmergencyAccessSession_expiresAt_idx" ON "NpaEmergencyAccessSession"("expiresAt");

-- CreateIndex
CREATE INDEX "NpaEmergencyAccessSession_startedAt_idx" ON "NpaEmergencyAccessSession"("startedAt");

-- CreateIndex
CREATE INDEX "NpaEmergencyAccessLog_sessionId_idx" ON "NpaEmergencyAccessLog"("sessionId");

-- CreateIndex
CREATE INDEX "NpaEmergencyAccessLog_npaId_idx" ON "NpaEmergencyAccessLog"("npaId");

-- CreateIndex
CREATE INDEX "NpaEmergencyAccessLog_action_idx" ON "NpaEmergencyAccessLog"("action");

-- CreateIndex
CREATE INDEX "NpaEmergencyAccessLog_accessedAt_idx" ON "NpaEmergencyAccessLog"("accessedAt");

-- CreateIndex
CREATE INDEX "NpaDataExport_npaId_idx" ON "NpaDataExport"("npaId");

-- CreateIndex
CREATE INDEX "NpaDataExport_userId_idx" ON "NpaDataExport"("userId");

-- CreateIndex
CREATE INDEX "NpaDataExport_status_idx" ON "NpaDataExport"("status");

-- CreateIndex
CREATE INDEX "NpaDataExport_requestedAt_idx" ON "NpaDataExport"("requestedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NpaMfaEnrollment_userId_key" ON "NpaMfaEnrollment"("userId");

-- CreateIndex
CREATE INDEX "NpaMfaEnrollment_userId_idx" ON "NpaMfaEnrollment"("userId");

-- CreateIndex
CREATE INDEX "NpaMfaEnrollment_npaId_idx" ON "NpaMfaEnrollment"("npaId");

-- CreateIndex
CREATE INDEX "NpaMfaEnrollment_isEnabled_idx" ON "NpaMfaEnrollment"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "NpaUserSession_sessionToken_key" ON "NpaUserSession"("sessionToken");

-- CreateIndex
CREATE INDEX "NpaUserSession_userId_idx" ON "NpaUserSession"("userId");

-- CreateIndex
CREATE INDEX "NpaUserSession_npaId_idx" ON "NpaUserSession"("npaId");

-- CreateIndex
CREATE INDEX "NpaUserSession_sessionToken_idx" ON "NpaUserSession"("sessionToken");

-- CreateIndex
CREATE INDEX "NpaUserSession_isActive_idx" ON "NpaUserSession"("isActive");

-- CreateIndex
CREATE INDEX "NpaUserSession_lastActiveAt_idx" ON "NpaUserSession"("lastActiveAt");

-- CreateIndex
CREATE UNIQUE INDEX "NpaProviderContribution_documentId_key" ON "NpaProviderContribution"("documentId");

-- CreateIndex
CREATE INDEX "NpaProviderContribution_shareSessionId_idx" ON "NpaProviderContribution"("shareSessionId");

-- CreateIndex
CREATE INDEX "NpaProviderContribution_npaId_idx" ON "NpaProviderContribution"("npaId");

-- CreateIndex
CREATE INDEX "NpaProviderContribution_providerEmail_idx" ON "NpaProviderContribution"("providerEmail");

-- CreateIndex
CREATE INDEX "NpaProviderContribution_providerRole_idx" ON "NpaProviderContribution"("providerRole");

-- CreateIndex
CREATE INDEX "NpaProviderContribution_specialty_idx" ON "NpaProviderContribution"("specialty");

-- CreateIndex
CREATE INDEX "NpaProviderContribution_createdAt_idx" ON "NpaProviderContribution"("createdAt");

-- CreateIndex
CREATE INDEX "ScheduledPost_status_scheduledAt_idx" ON "ScheduledPost"("status", "scheduledAt");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMemory" ADD CONSTRAINT "UserMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blueprint" ADD CONSTRAINT "Blueprint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentDecode" ADD CONSTRAINT "DocumentDecode_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentShareLink" ADD CONSTRAINT "DocumentShareLink_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentShareLinkAccess" ADD CONSTRAINT "DocumentShareLinkAccess_shareLinkId_fkey" FOREIGN KEY ("shareLinkId") REFERENCES "DocumentShareLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderPacketLink" ADD CONSTRAINT "ProviderPacketLink_packetId_fkey" FOREIGN KEY ("packetId") REFERENCES "ProviderPacket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderPacketAccessLog" ADD CONSTRAINT "ProviderPacketAccessLog_providerPacketLinkId_fkey" FOREIGN KEY ("providerPacketLinkId") REFERENCES "ProviderPacketLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDisableEvent" ADD CONSTRAINT "UserDisableEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentChangeLog" ADD CONSTRAINT "ConsentChangeLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataRequest" ADD CONSTRAINT "DataRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderRating" ADD CONSTRAINT "ProviderRating_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vault" ADD CONSTRAINT "Vault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaultItem" ADD CONSTRAINT "VaultItem_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_vaultItemId_fkey" FOREIGN KEY ("vaultItemId") REFERENCES "VaultItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlueprintInsight" ADD CONSTRAINT "BlueprintInsight_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureFlagChange" ADD CONSTRAINT "FeatureFlagChange_flagId_fkey" FOREIGN KEY ("flagId") REFERENCES "FeatureFlag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MascotScriptChange" ADD CONSTRAINT "MascotScriptChange_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "MascotScript"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSecurity" ADD CONSTRAINT "UserSecurity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityAuditLog" ADD CONSTRAINT "IdentityAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpaVaultDocument" ADD CONSTRAINT "NpaVaultDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpaVaultAuditLog" ADD CONSTRAINT "NpaVaultAuditLog_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "NpaVaultDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpaVaultShareLink" ADD CONSTRAINT "NpaVaultShareLink_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "NpaVaultDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpaVaultShareLinkAccess" ADD CONSTRAINT "NpaVaultShareLinkAccess_shareLinkId_fkey" FOREIGN KEY ("shareLinkId") REFERENCES "NpaVaultShareLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpaShareSession" ADD CONSTRAINT "NpaShareSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpaShareDocument" ADD CONSTRAINT "NpaShareDocument_shareSessionId_fkey" FOREIGN KEY ("shareSessionId") REFERENCES "NpaShareSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpaShareDocument" ADD CONSTRAINT "NpaShareDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "NpaVaultDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpaShareAccessLog" ADD CONSTRAINT "NpaShareAccessLog_shareSessionId_fkey" FOREIGN KEY ("shareSessionId") REFERENCES "NpaShareSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpaEmergencyAccessSession" ADD CONSTRAINT "NpaEmergencyAccessSession_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "NpaEmergencyAccessSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpaEmergencyAccessLog" ADD CONSTRAINT "NpaEmergencyAccessLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "NpaEmergencyAccessSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpaProviderContribution" ADD CONSTRAINT "NpaProviderContribution_shareSessionId_fkey" FOREIGN KEY ("shareSessionId") REFERENCES "NpaShareSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpaProviderContribution" ADD CONSTRAINT "NpaProviderContribution_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "NpaVaultDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
