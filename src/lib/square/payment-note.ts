/**
 * Square payment_note encoding for NPA checkout.
 * Single: npa:slug
 * Multi (main + bumps, one charge): npa:multi:slug1|slug2|slug3
 */
export function buildSquarePaymentNote(slugs: string[]): string {
  const clean = slugs.map((s) => s.trim()).filter(Boolean);
  if (clean.length === 0) {
    return "npa:unknown-product";
  }
  if (clean.length === 1) {
    return `npa:${clean[0]}`;
  }
  return `npa:multi:${clean.join("|")}`;
}

/** One-click post-purchase charge; webhook updates CheckoutAttempt by postCheckoutToken. */
export function buildUpsellOneClickNote(postCheckoutToken: string, upsellSlug: string): string {
  const t = postCheckoutToken.trim();
  const s = upsellSlug.trim();
  return `npa:upsell|${t}|${s}`;
}

export function parseUpsellOneClickNote(note: string): { token: string; slug: string } | null {
  const n = note.trim();
  const m = n.match(/^npa:upsell\|([^|]+)\|(.+)$/);
  if (!m?.[1] || !m[2]) return null;
  return { token: m[1].trim(), slug: m[2].trim() };
}

export function parseSquarePaymentNote(note: string): string[] {
  const n = note.trim();
  if (n.startsWith("npa:upsell|")) {
    return [];
  }
  const multi = n.match(/^npa:multi:(.+)$/);
  if (multi?.[1]) {
    return multi[1]
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const single = n.match(/^npa:(.+)$/);
  if (single?.[1] && !single[1].includes("|")) {
    return [single[1].trim()].filter(Boolean);
  }
  return [];
}
