Archived Prisma migration folders (pre-2026-04-03) replaced by a single baseline.

Reason: Production Supabase had divergent _prisma_migrations history vs this repo.
The baseline migration (../migrations/20260403120000_baseline/) is generated from
the current schema via: prisma migrate diff --from-empty --to-schema-datamodel

Do not re-apply these SQL files to production.
