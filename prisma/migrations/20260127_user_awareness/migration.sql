-- CreateEnum
CREATE TYPE "UserEventType" AS ENUM ('LAB_UPLOAD', 'LAB_DECODED', 'FAMILY_ADDED', 'FAMILY_UPDATED', 'CHAT_USED', 'INSIGHT_VIEWED', 'DOCUMENT_UPLOADED', 'DOCUMENT_DECODED', 'BLUEPRINT_UPDATED', 'MASCOT_VISITED', 'TOOL_USED', 'PROVIDER_ADDED', 'APPOINTMENT_ADDED');

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
