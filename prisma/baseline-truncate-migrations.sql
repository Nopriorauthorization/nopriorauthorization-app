-- ONE-TIME (production / Supabase): clear divergent migration history before baselining.
-- After this, run: npx prisma migrate resolve --applied "20260403120000_baseline"
-- Do NOT run `prisma migrate deploy` on this database until resolve completes — baseline SQL would conflict.
-- New empty databases: skip this file; use `npx prisma migrate deploy` only.

TRUNCATE "_prisma_migrations";
