/**
 * Renders Informed-Beauty-Guide-Carousel-STANDALONE.html and exports 6 PNGs
 * (one per slide) for Instagram / Meta carousel posts.
 *
 * Expects: ~/Desktop/Informed-Beauty-Guide-Carousel-STANDALONE.html
 * Writes:  ~/Desktop/IBG-carousel-01.png … IBG-carousel-06.png
 *
 * Run: npx tsx scripts/marketing/screenshot-ibg-carousel.ts
 */
import fs from "fs";
import os from "os";
import path from "path";
import { pathToFileURL } from "url";

const DESKTOP = path.join(os.homedir(), "Desktop");
const HTML_NAME = "Informed-Beauty-Guide-Carousel-STANDALONE.html";
const HTML_PATH = path.join(DESKTOP, HTML_NAME);

async function main() {
  if (!fs.existsSync(HTML_PATH)) {
    console.error(
      `[ibg-carousel] Missing ${HTML_PATH}\n` +
        "Create it from your carousel (standalone wrapper) on the Desktop, then re-run.",
    );
    process.exit(1);
  }

  const puppeteer = await import("puppeteer");
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 480,
      height: 980,
      deviceScaleFactor: 2,
    });

    const url = pathToFileURL(HTML_PATH).href;
    await page.goto(url, { waitUntil: "networkidle2", timeout: 120_000 });
    await page.waitForSelector(".carousel-wrap", { timeout: 30_000 });
    await new Promise((r) => setTimeout(r, 1500));

    for (let i = 0; i < 6; i++) {
      await page.evaluate((slideIndex: number) => {
        const w = window as unknown as { goTo?: (n: number) => void };
        if (typeof w.goTo === "function") {
          w.goTo(slideIndex);
        }
      }, i);
      await new Promise((r) => setTimeout(r, 400));

      const wrap = await page.$(".carousel-wrap");
      if (!wrap) {
        console.error("[ibg-carousel] .carousel-wrap not found");
        process.exit(1);
      }

      const outName = `IBG-carousel-${String(i + 1).padStart(2, "0")}.png`;
      const outPath = path.join(DESKTOP, outName);
      await wrap.screenshot({ path: outPath, type: "png" });
      console.log(`[ibg-carousel] wrote ${outPath}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
