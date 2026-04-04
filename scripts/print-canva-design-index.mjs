/**
 * Print Canva design id + title from imports/canva-list-designs.json
 * (or CANVA_LIST_DESIGNS_JSON) to build / fix imports/canva-design-id-map.json.
 *
 *   node scripts/print-canva-design-index.mjs
 *   node scripts/print-canva-design-index.mjs lash
 */
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { resolveCanvaListDesignsPath } from "./resolve-canva-list-designs-path.mjs";

dotenv.config({ path: ".env.local" });
dotenv.config();

const ROOT = process.cwd();
const LIST = resolveCanvaListDesignsPath(ROOT);

const needle = process.argv[2]?.toLowerCase() || "";

if (!fs.existsSync(LIST)) {
  console.error("Missing", LIST);
  process.exit(1);
}

const { designs = [] } = JSON.parse(fs.readFileSync(LIST, "utf8"));
let rows = designs
  .filter((d) => d?.urls?.edit_url)
  .map((d) => ({ id: d.id, title: (d.title || "").replace(/\n/g, " ").trim() }));

if (needle) {
  rows = rows.filter(
    (r) =>
      r.title.toLowerCase().includes(needle) ||
      String(r.id).toLowerCase().includes(needle)
  );
}

for (const r of rows) {
  console.log(`${r.id}\t${r.title}`);
}
console.error(`\n(${rows.length} rows${needle ? ` matching "${needle}"` : ""})`);
