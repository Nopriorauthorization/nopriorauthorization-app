-- CreateTable
CREATE TABLE "UserMemory" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonId" TEXT,
    "goals" JSONB,
    "preferences" JSONB,
    "topicsDiscussed" JSONB,
    "disclaimerAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    "optOut" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMemory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMemory_userId_key" ON "UserMemory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMemory_anonId_key" ON "UserMemory"("anonId");

-- CreateIndex
CREATE INDEX "UserMemory_anonId_idx" ON "UserMemory"("anonId");

-- AddForeignKey
ALTER TABLE "UserMemory" ADD CONSTRAINT "UserMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
