-- CreateTable
CREATE TABLE "EmailFunnelSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastSentStep" INTEGER NOT NULL DEFAULT 0,
    "nextSendAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "stopReason" TEXT,
    "unsubscribeToken" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailFunnelSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailFunnelSend" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "resendEmailId" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "meta" JSONB,

    CONSTRAINT "EmailFunnelSend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailFunnelSubscriber_email_key" ON "EmailFunnelSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailFunnelSubscriber_unsubscribeToken_key" ON "EmailFunnelSubscriber"("unsubscribeToken");

-- CreateIndex
CREATE INDEX "EmailFunnelSubscriber_nextSendAt_idx" ON "EmailFunnelSubscriber"("nextSendAt");

-- CreateIndex
CREATE INDEX "EmailFunnelSubscriber_email_idx" ON "EmailFunnelSubscriber"("email");

-- CreateIndex
CREATE INDEX "EmailFunnelSubscriber_stopReason_idx" ON "EmailFunnelSubscriber"("stopReason");

-- CreateIndex
CREATE INDEX "EmailFunnelSend_subscriberId_idx" ON "EmailFunnelSend"("subscriberId");

-- CreateIndex
CREATE INDEX "EmailFunnelSend_stepId_idx" ON "EmailFunnelSend"("stepId");

-- CreateIndex
CREATE INDEX "EmailFunnelSend_resendEmailId_idx" ON "EmailFunnelSend"("resendEmailId");

-- AddForeignKey
ALTER TABLE "EmailFunnelSend" ADD CONSTRAINT "EmailFunnelSend_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "EmailFunnelSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
