/**
 * NPA ID Backfill Script
 * 
 * This script assigns NPA IDs to all existing users who don't have one.
 * Run this after applying the Phase 1 migration.
 * 
 * Usage:
 *   npx ts-node scripts/backfill-npa-ids.ts
 *   
 * Or with environment variables:
 *   DATABASE_URL=... npx ts-node scripts/backfill-npa-ids.ts
 */

import { PrismaClient } from "@prisma/client";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();

/**
 * Generate a cryptographically secure NPA Health ID
 * Same implementation as in src/lib/npa-id.ts
 */
function generateNpaId(): string {
  const bytes = randomBytes(12);
  const hex = bytes.toString("hex");
  const segments = [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
  ];
  return `npa_${segments.join("_")}`;
}

/**
 * Generate human-readable alias for display
 */
function generateDisplayAlias(npaId: string): string {
  const firstSegment = npaId.split("_")[1].toUpperCase();
  return `NPA-${firstSegment}`;
}

async function main() {
  console.log("🏥 NPA ID Backfill Script");
  console.log("========================\n");

  // Find all users without NPA IDs
  const usersWithoutNpaId = await prisma.user.findMany({
    where: { npaId: null },
    select: { id: true, email: true, createdAt: true },
  });

  console.log(`Found ${usersWithoutNpaId.length} users without NPA IDs\n`);

  if (usersWithoutNpaId.length === 0) {
    console.log("✅ All users already have NPA IDs assigned.");
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const user of usersWithoutNpaId) {
    try {
      const npaId = generateNpaId();
      const npaIdAlias = generateDisplayAlias(npaId);

      await prisma.user.update({
        where: { id: user.id },
        data: { npaId, npaIdAlias },
      });

      // Log the identity event
      await prisma.identityAuditLog.create({
        data: {
          userId: user.id,
          npaId,
          action: "NPA_ID_GENERATED",
          metadata: { source: "backfill_script" },
        },
      });

      console.log(`✅ ${user.email} → ${npaIdAlias}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to assign NPA ID to ${user.email}:`, error);
      errorCount++;
    }
  }

  console.log("\n========================");
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log("========================\n");

  if (errorCount > 0) {
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
