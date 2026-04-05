/**
 * Loads .env then .env.local (local overrides) and runs the Prisma CLI.
 * Prisma only reads .env by default; Next.js uses .env.local — this bridges that gap.
 */
const path = require("path");
const { spawnSync } = require("child_process");
const dotenv = require("dotenv");

const root = path.join(__dirname, "..");
dotenv.config({ path: path.join(root, ".env") });
dotenv.config({ path: path.join(root, ".env.local"), override: true });

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/prisma-with-env.cjs <prisma args...>");
  console.error("Example: node scripts/prisma-with-env.cjs migrate deploy");
  process.exit(1);
}

const r = spawnSync("npx", ["prisma", ...args], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(r.status ?? 1);
