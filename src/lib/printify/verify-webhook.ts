import crypto from "crypto";

/**
 * Printify webhook HMAC (header often `x-pfy-signature`, value `sha256=<hex>`).
 */
export function verifyPrintifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
  secret: string,
): boolean {
  if (!signatureHeader || !secret) return false;
  const trimmed = signatureHeader.trim();
  const hex = trimmed.startsWith("sha256=")
    ? trimmed.slice("sha256=".length)
    : trimmed;
  if (!/^[a-f0-9]+$/i.test(hex)) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(hex, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}
