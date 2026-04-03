CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "DocumentCategory" AS ENUM ('LAB', 'IMAGING', 'VISIT_NOTE', 'DISCHARGE', 'OTHER');
CREATE TYPE "ProviderPacketTemplate" AS ENUM ('PRIMARY', 'SPECIALIST', 'URGENT');

CREATE TABLE "Document" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT,
  "anonId" TEXT,
  "title" TEXT NOT NULL,
  "category" "DocumentCategory" NOT NULL DEFAULT 'OTHER',
  "docDate" TIMESTAMPTZ,
  "storagePath" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "includeInPacketDefault" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deletedAt" TIMESTAMPTZ,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "Document_userId_idx" ON "Document" ("userId");
CREATE INDEX "Document_anonId_idx" ON "Document" ("anonId");

CREATE TABLE "DocumentShareLink" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "documentId" TEXT NOT NULL,
  "token" TEXT UNIQUE NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "revokedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE
);

CREATE INDEX "DocumentShareLink_documentId_idx" ON "DocumentShareLink" ("documentId");

CREATE TABLE "DocumentShareLinkAccess" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "shareLinkId" TEXT NOT NULL,
  "accessedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  FOREIGN KEY ("shareLinkId") REFERENCES "DocumentShareLink"("id") ON DELETE CASCADE
);

CREATE TABLE "ProviderPacket" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT,
  "anonId" TEXT,
  "template" "ProviderPacketTemplate" NOT NULL DEFAULT 'PRIMARY',
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "ProviderPacket_userId_idx" ON "ProviderPacket" ("userId");
CREATE INDEX "ProviderPacket_anonId_idx" ON "ProviderPacket" ("anonId");

CREATE TABLE "ProviderPacketLink" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "token" TEXT UNIQUE NOT NULL,
  "packetId" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "revokedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY ("packetId") REFERENCES "ProviderPacket"("id") ON DELETE CASCADE
);

CREATE INDEX "ProviderPacketLink_packetId_idx" ON "ProviderPacketLink" ("packetId");

CREATE TABLE "ProviderPacketAccessLog" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "providerPacketLinkId" TEXT NOT NULL,
  "accessedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  FOREIGN KEY ("providerPacketLinkId") REFERENCES "ProviderPacketLink"("id") ON DELETE CASCADE
);

