-- =============================================================================
-- Leads table + Prisma migration history (Supabase SQL Editor)
-- =============================================================================
-- Run this script once per Supabase project (local copy, staging, production)
-- so every environment has the same `leads` table and Prisma knows the
-- migration `20260406120000_leads` is already applied.
--
-- Path A — SQL only (no CLI):
--   1. Paste and run this entire file in: Supabase Dashboard → SQL → New query
--
-- Path B — DDL in SQL Editor, history via Prisma CLI (also valid):
--   1. Run only the "SECTION 1" block below (or the original migration.sql)
--   2. From your machine with DATABASE_URL pointing at that database:
--        npm run db:migrate:resolve:leads
--      (wraps: prisma migrate resolve --applied 20260406120000_leads)
--
-- Checksum below MUST match prisma/migrations/20260406120000_leads/migration.sql
-- (Prisma stores SHA-256 hex of that file in _prisma_migrations.checksum).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- SECTION 1: Idempotent schema (safe if table already exists from db push)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "leads" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'free-templates',
    "opted_in" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nurture_emails_sent" INTEGER NOT NULL DEFAULT 0,
    "next_nurture_at" TIMESTAMP(3),
    "unsubscribe_token" TEXT NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "leads_unsubscribe_token_key" ON "leads"("unsubscribe_token");

CREATE INDEX IF NOT EXISTS "leads_source_next_nurture_at_idx" ON "leads"("source", "next_nurture_at");

CREATE INDEX IF NOT EXISTS "leads_email_idx" ON "leads"("email");

CREATE UNIQUE INDEX IF NOT EXISTS "leads_email_source_key" ON "leads"("email", "source");

-- -----------------------------------------------------------------------------
-- SECTION 2: Register migration in Prisma (skip duplicate rows)
-- -----------------------------------------------------------------------------

INSERT INTO "_prisma_migrations" (
    "id",
    "checksum",
    "finished_at",
    "migration_name",
    "logs",
    "rolled_back_at",
    "started_at",
    "applied_steps_count"
)
SELECT
    gen_random_uuid()::text,
    '3215b45293570c603b5527dcf358ea52035a27d1611ad4f373cc28acf45261b5',
    NOW(),
    '20260406120000_leads',
    '',
    NULL,
    NOW(),
    0
WHERE NOT EXISTS (
    SELECT 1
    FROM "_prisma_migrations"
    WHERE "migration_name" = '20260406120000_leads'
);
