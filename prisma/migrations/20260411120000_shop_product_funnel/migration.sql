-- Configurable product funnels + analytics
ALTER TABLE "CheckoutAttempt" ADD COLUMN "funnelSessionId" TEXT;
ALTER TABLE "CheckoutAttempt" ADD COLUMN "selectedBumpSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[];
CREATE INDEX "CheckoutAttempt_funnelSessionId_idx" ON "CheckoutAttempt"("funnelSessionId");

CREATE TABLE "ShopProductFunnel" (
    "id" TEXT NOT NULL,
    "productSlug" TEXT,
    "categoryDefault" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "useDedicatedLanding" BOOLEAN NOT NULL DEFAULT true,
    "bumpSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "postUpsellSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "finalRedirect" TEXT NOT NULL DEFAULT 'post_purchase',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopProductFunnel_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ShopProductFunnel_productSlug_key" ON "ShopProductFunnel"("productSlug");
CREATE UNIQUE INDEX "ShopProductFunnel_categoryDefault_key" ON "ShopProductFunnel"("categoryDefault");

CREATE TABLE "FunnelAnalyticsEvent" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "primarySlug" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "revenueCents" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FunnelAnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FunnelAnalyticsEvent_sessionId_createdAt_idx" ON "FunnelAnalyticsEvent"("sessionId", "createdAt");
CREATE INDEX "FunnelAnalyticsEvent_primarySlug_step_createdAt_idx" ON "FunnelAnalyticsEvent"("primarySlug", "step", "createdAt");
