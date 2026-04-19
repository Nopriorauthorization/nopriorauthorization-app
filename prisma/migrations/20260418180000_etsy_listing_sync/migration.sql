-- Etsy batch publisher: idempotent listing sync per product slug
CREATE TABLE "EtsyListingSync" (
    "id" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "etsyListingId" INTEGER,
    "syncStatus" TEXT NOT NULL DEFAULT 'pending',
    "lastError" TEXT,
    "listingUrl" TEXT,
    "idempotencyKey" TEXT,
    "metadata" JSONB,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EtsyListingSync_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EtsyListingSync_productSlug_key" ON "EtsyListingSync"("productSlug");
CREATE UNIQUE INDEX "EtsyListingSync_idempotencyKey_key" ON "EtsyListingSync"("idempotencyKey");
CREATE INDEX "EtsyListingSync_syncStatus_idx" ON "EtsyListingSync"("syncStatus");
CREATE INDEX "EtsyListingSync_etsyListingId_idx" ON "EtsyListingSync"("etsyListingId");
