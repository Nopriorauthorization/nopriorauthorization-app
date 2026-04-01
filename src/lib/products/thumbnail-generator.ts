import fs from "fs";
import path from "path";
import type { Tone } from "./blueprint";

export type ThumbnailInput = {
  headline: string;
  subtitle: string;
  badge?: string;
  tone: Tone;
  outputPath: string;
};

const TONE_STYLES: Record<
  Tone,
  {
    bg: string;
    headlineColor: string;
    subtitleColor: string;
    badgeBg: string;
    badgeColor: string;
    accentColor: string;
    fontFamily: string;
  }
> = {
  luxury: {
    bg: "#1A1A1A",
    headlineColor: "#D4537E",
    subtitleColor: "#FFFFFF",
    badgeBg: "#C9A96E",
    badgeColor: "#1A1A1A",
    accentColor: "#D4537E",
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  clinical: {
    bg: "#FFFFFF",
    headlineColor: "#1A1A1A",
    subtitleColor: "#6B6B6B",
    badgeBg: "#D4537E",
    badgeColor: "#FFFFFF",
    accentColor: "#D4537E",
    fontFamily: "'Lato', 'Helvetica Neue', sans-serif",
  },
  feminine: {
    bg: "#FBEAF0",
    headlineColor: "#D4537E",
    subtitleColor: "#1A1A1A",
    badgeBg: "#1A1A1A",
    badgeColor: "#FBEAF0",
    accentColor: "#D4537E",
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  bold: {
    bg: "#1A1A1A",
    headlineColor: "#FFFFFF",
    subtitleColor: "#D4537E",
    badgeBg: "#D4537E",
    badgeColor: "#FFFFFF",
    accentColor: "#D4537E",
    fontFamily: "'Lato', 'Helvetica Neue', sans-serif",
  },
};

function buildHtml(input: ThumbnailInput): string {
  const s = TONE_STYLES[input.tone];

  return `<!DOCTYPE html>
<html><head>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lato:wght@400;700;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: 1080px; height: 1080px;
  background: ${s.bg};
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center;
  padding: 80px 60px;
  position: relative;
  overflow: hidden;
}
.accent-top {
  position: absolute; top: 0; left: 0; right: 0;
  height: 6px; background: ${s.accentColor};
}
.accent-bottom {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 6px; background: ${s.accentColor};
}
.border-frame {
  position: absolute; top: 24px; left: 24px; right: 24px; bottom: 24px;
  border: 1.5px solid ${s.accentColor}33;
  border-radius: 4px;
}
.brand {
  font-family: ${s.fontFamily};
  font-size: 28px; letter-spacing: 0.08em;
  color: ${s.accentColor}; text-transform: uppercase;
  margin-bottom: 48px; opacity: 0.7;
}
.headline {
  font-family: ${s.fontFamily};
  font-size: 108px; font-weight: 900;
  color: ${s.headlineColor};
  line-height: 1.05; letter-spacing: -0.02em;
  margin-bottom: 28px;
}
.subtitle {
  font-family: 'Lato', sans-serif;
  font-size: 38px; font-weight: 700;
  color: ${s.subtitleColor};
  letter-spacing: 0.06em; text-transform: uppercase;
  line-height: 1.3; max-width: 800px;
  margin-bottom: 40px;
}
.badge {
  display: inline-block;
  background: ${s.badgeBg}; color: ${s.badgeColor};
  font-family: 'Lato', sans-serif;
  font-size: 22px; font-weight: 900;
  letter-spacing: 0.15em; text-transform: uppercase;
  padding: 14px 36px; border-radius: 4px;
}
.bottom-brand {
  position: absolute; bottom: 48px;
  font-family: 'Lato', sans-serif;
  font-size: 18px; letter-spacing: 0.12em;
  color: ${s.subtitleColor}44; text-transform: uppercase;
}
</style></head><body>
<div class="accent-top"></div>
<div class="accent-bottom"></div>
<div class="border-frame"></div>
<div class="brand">No Prior Authorization</div>
<div class="headline">${escHtml(input.headline)}</div>
<div class="subtitle">${escHtml(input.subtitle)}</div>
${input.badge ? `<div class="badge">${escHtml(input.badge)}</div>` : ""}
<div class="bottom-brand">nopriorauthorization.com</div>
</body></html>`;
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Generate a single thumbnail PNG from HTML/CSS via puppeteer.
 * Returns the output path on success, null if puppeteer is unavailable.
 */
export async function generateThumbnail(
  input: ThumbnailInput,
): Promise<string | null> {
  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch {
    console.log("[thumbnail] puppeteer not installed — skipping");
    return null;
  }

  const html = buildHtml(input);
  fs.mkdirSync(path.dirname(input.outputPath), { recursive: true });

  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.screenshot({
      path: input.outputPath,
      type: "png",
      clip: { x: 0, y: 0, width: 1080, height: 1080 },
    });
    return input.outputPath;
  } finally {
    await browser.close();
  }
}

/**
 * Generate thumbnail for a product config using its metadata.
 */
export async function generateProductThumbnail(opts: {
  slug: string;
  title: string;
  templateCount: number;
  category: string;
  tone?: Tone;
  outputDir: string;
}): Promise<string | null> {
  const tone = opts.tone || "luxury";

  const headline = opts.templateCount >= 300
    ? "300+"
    : `${opts.templateCount}+`;

  const subtitleParts = opts.title
    .replace(/\|/g, "")
    .replace(/Canva Editable.*$/i, "")
    .trim();

  return generateThumbnail({
    headline: `${headline}\nTEMPLATES`,
    subtitle: subtitleParts,
    badge: "CANVA EDITABLE",
    tone,
    outputPath: path.join(opts.outputDir, "thumbnail-1.png"),
  });
}
