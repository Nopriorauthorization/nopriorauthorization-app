import fs from "fs";
import path from "path";

export type BundleSource = {
  slug: string;
  deliveryDir: string;
};

/**
 * Combine delivery files from multiple source products into a single bundle.
 * Each source gets its own subdirectory inside the target delivery folder.
 */
export function repackageBundle(
  sources: BundleSource[],
  targetDeliveryDir: string,
): { fileCount: number; sourceCount: number } {
  fs.mkdirSync(targetDeliveryDir, { recursive: true });

  let fileCount = 0;
  let sourceCount = 0;

  for (const src of sources) {
    if (!fs.existsSync(src.deliveryDir)) continue;

    const subDir = path.join(targetDeliveryDir, src.slug);
    fs.mkdirSync(subDir, { recursive: true });

    const files = fs
      .readdirSync(src.deliveryDir)
      .filter((f) => !f.startsWith("."));

    for (const file of files) {
      const srcPath = path.join(src.deliveryDir, file);
      const destPath = path.join(subDir, file);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        fileCount += 1;
      }
    }

    if (files.length > 0) sourceCount += 1;
  }

  return { fileCount, sourceCount };
}
