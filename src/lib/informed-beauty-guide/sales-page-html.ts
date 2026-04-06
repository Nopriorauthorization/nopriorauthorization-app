import fs from "fs";
import path from "path";

const SALES_FILE = path.join(
  process.cwd(),
  "content/informed-beauty-guide/NPA-Informed-Beauty-Guide-Sales-Page.html",
);

/** Split marker — checkout UI is real React between these fragments (avoids createRoot + innerHTML wipes). */
const CHECKOUT_SPLIT_MARKER = "<!--NPA_IBG_CHECKOUT_SPLIT-->";

function buildProcessedSalesBody(): string {
  const raw = fs.readFileSync(SALES_FILE, "utf8");
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) {
    throw new Error("[informed-beauty-guide] sales page: missing <body>");
  }
  let body = bodyMatch[1];
  body = body.replace(/<script>[\s\S]*?<\/script>/gi, "");
  body = body.replace(/\bclass="container"/g, 'class="ibg-sales-container"');
  body = body.replace(
    /<a href="#checkout" class="sticky-btn">Get it for \$49 →<\/a>/,
    '<button type="button" class="sticky-btn" data-npa-ibg-scroll-checkout>Get it for $49 →</button>',
  );
  const dualCta =
    /\s*<a href="#" class="cta-btn" style="font-size:18px;padding:20px 52px;">Download The Informed Beauty Guide →<\/a>\s*<br><br>\s*<a href="#" class="cta-btn" style="font-size:18px;padding:20px 52px;background:transparent;border:2px solid #D4537E;color:#D4537E;" onmouseover="this\.style\.background='#D4537E';this\.style\.color='#fff'" onmouseout="this\.style\.background='transparent';this\.style\.color='#D4537E'">Take Control of Your Care — Starting Today →<\/a>/;
  if (!dualCta.test(body)) {
    throw new Error(
      "[informed-beauty-guide] sales page: expected dual CTA anchors — re-sync content file",
    );
  }
  body = body.replace(dualCta, `\n    ${CHECKOUT_SPLIT_MARKER}\n`);
  return body.trim();
}

/** Before / after CTA block so React can render `CheckoutButton` between (no createRoot). */
export function getInformedBeautySalesBodyParts(): { before: string; after: string } {
  const body = buildProcessedSalesBody();
  const parts = body.split(CHECKOUT_SPLIT_MARKER);
  if (parts.length !== 2) {
    throw new Error("[informed-beauty-guide] sales page: checkout split marker missing");
  }
  return { before: parts[0].trimEnd(), after: parts[1].trimStart() };
}

/**
 * Body inner HTML from the authored sales page, with scripts stripped and
 * checkout CTAs replaced by a React mount node. Copy stays word-for-word otherwise.
 * @deprecated Prefer getInformedBeautySalesBodyParts + inline React checkout.
 */
export function getInformedBeautySalesBodyHtml(): string {
  const { before, after } = getInformedBeautySalesBodyParts();
  return `${before}\n    <div id="npa-ibg-checkout-root"></div>\n${after}`;
}
