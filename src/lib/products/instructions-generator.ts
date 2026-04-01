import type { DigitalProductConfig } from "./types";

export type InstructionsOutput = {
  markdown: string;
  html: string;
  text: string;
};

export function generateInstructions(
  config: DigitalProductConfig,
): InstructionsOutput {
  const md = buildMarkdown(config);
  const html = markdownToSimpleHtml(md, config);
  const text = stripHtml(md);
  return { markdown: md, html, text };
}

function buildMarkdown(config: DigitalProductConfig): string {
  const sections: string[] = [];

  sections.push(`# ${config.internalName}\n`);
  sections.push(`Thank you for your purchase from **${config.brand}**!\n`);

  sections.push(`## What's Included\n`);
  sections.push(
    `This download contains editable templates for: **${config.internalName}**.\n`,
  );
  sections.push(
    `All files are delivered digitally — no physical product will be shipped.\n`,
  );

  if (config.deliveryFiles.includeCanvaLinks) {
    sections.push(`## How to Access Your Canva Templates\n`);
    sections.push(
      `1. Click the Canva link(s) provided in your delivery.\n` +
        `2. A copy of the template opens in **your** Canva account.\n` +
        `3. Edit text, colors, and images to match your brand.\n` +
        `4. Download as PDF or PNG when finished.\n`,
    );
    sections.push(
      `> Compatible with Canva Free and Canva Pro.\n`,
    );
  } else {
    sections.push(`## How to Use Your Templates\n`);
    sections.push(
      `1. Open the HTML or PDF files from your delivery link.\n` +
        `2. Print directly from your browser, or save as PDF (File → Print → Save as PDF).\n` +
        `3. Fill in the blanks by hand, or edit digitally before printing.\n`,
    );
  }

  sections.push(`## Download & Export Tips\n`);
  sections.push(
    `- **Print quality:** use US Letter (8.5 × 11 in) at 100% scale.\n` +
      `- **Save as PDF:** most browsers support File → Print → Save as PDF.\n` +
      `- **Recommended printers:** Canva, Staples, Office Depot, or your in-office printer.\n`,
  );

  sections.push(`## Usage Terms\n`);
  sections.push(
    `These templates are licensed for your personal or single-practice use.\n` +
      `You may **not** resell, redistribute, or share the original files.\n` +
      `You **may** print unlimited copies for use within your own practice.\n`,
  );

  sections.push(`## Digital Product Disclaimer\n`);
  sections.push(
    `These templates are provided for informational and administrative workflow purposes only. ` +
      `All content must be reviewed and, where appropriate, customized by a qualified professional ` +
      `before use with patients or clients. The seller is not responsible for errors, omissions, ` +
      `or outcomes resulting from the use of this material. These templates do not constitute ` +
      `legal, medical, or compliance advice.\n`,
  );

  sections.push(`## Need Help?\n`);
  sections.push(
    `Contact us through your Etsy order page or reach out at our shop.\n` +
      `We typically respond within 24 hours.\n`,
  );

  return sections.join("\n");
}

function markdownToSimpleHtml(md: string, config: DigitalProductConfig): string {
  let html = md
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>")
    .replace(/\n{2,}/g, "\n<br>\n");

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<title>${config.internalName} — Instructions</title>
<style>
  body{font-family:'Lato',sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#1A1A1A;line-height:1.6}
  h1{font-size:22px;color:#1A1A1A;border-bottom:2px solid #D4537E;padding-bottom:8px}
  h2{font-size:16px;margin-top:24px;color:#D4537E}
  li{margin-bottom:6px}
  blockquote{border-left:3px solid #D4537E;padding-left:12px;color:#6B6B6B;font-style:italic}
</style></head><body>
${html}
</body></html>`;
}

function stripHtml(md: string): string {
  return md
    .replace(/^#{1,3}\s*/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/^> /gm, "  ")
    .replace(/^- /gm, "• ")
    .trim();
}
