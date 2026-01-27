-- CreateTable: NpaIdentity
-- P0 Phase 7A: NPA Identity System
-- User-owned identity anchor - NOT a medical record number

CREATE TABLE "NpaIdentity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "npaNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NpaIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NpaIdentity_userId_key" ON "NpaIdentity"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NpaIdentity_npaNumber_key" ON "NpaIdentity"("npaNumber");

-- CreateIndex
CREATE INDEX "NpaIdentity_npaNumber_idx" ON "NpaIdentity"("npaNumber");

-- AddForeignKey
ALTER TABLE "NpaIdentity" ADD CONSTRAINT "NpaIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
