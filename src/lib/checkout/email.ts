export function normalizeCheckoutEmail(email: string): string {
  return email.trim().toLowerCase();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidCheckoutEmail(email: string): boolean {
  const e = normalizeCheckoutEmail(email);
  return e.length > 3 && e.length < 320 && EMAIL_RE.test(e);
}
