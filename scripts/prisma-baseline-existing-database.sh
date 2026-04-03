#!/usr/bin/env bash
# One-time: align _prisma_migrations on a database that ALREADY matches prisma/schema.prisma
# (e.g. Supabase production). Do NOT run `migrate deploy` against that DB first — the baseline
# SQL would try to recreate existing objects and fail.
#
# Steps:
# 1) In Supabase → SQL Editor (or psql), run:
#    TRUNCATE "_prisma_migrations";
#
# 2) With DATABASE_URL pointing at that database, from repo root:
#    npx prisma migrate resolve --applied "20260403120000_baseline"
#
# 3) Verify:
#    npx prisma migrate status
#
# New empty databases: use `npx prisma migrate deploy` only (applies baseline SQL end-to-end).

set -euo pipefail
echo "Read the comments in this script — it only prints the reminder."
echo ""
echo "1) TRUNCATE \"_prisma_migrations\";  -- on target DB"
echo "2) npx prisma migrate resolve --applied \"20260403120000_baseline\""
echo "3) npx prisma migrate status"
