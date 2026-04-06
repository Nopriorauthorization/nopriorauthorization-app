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

export function parseSquarePaymentNote(note: string): string[] {
  const n = note.trim();
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
