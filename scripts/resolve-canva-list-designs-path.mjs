import fs from "fs";
import path from "path";

/**
 * 1) CANVA_LIST_DESIGNS_JSON env
 * 2) ~/Desktop/canva-list-designs.json if it exists (macOS / typical Windows)
 * 3) imports/canva-list-designs.json in repo
 */
export function resolveCanvaListDesignsPath(cwd = process.cwd()) {
  const fromEnv = process.env.CANVA_LIST_DESIGNS_JSON?.trim();
  if (fromEnv) return fromEnv;

  const home = process.env.HOME || process.env.USERPROFILE || "";
  if (home) {
    const desktop = path.join(home, "Desktop", "canva-list-designs.json");
    if (fs.existsSync(desktop)) return desktop;
  }

  return path.join(cwd, "imports", "canva-list-designs.json");
}
