import crypto from "crypto";

/** Magnet id → filename in delivery-assets/forms (not served from public/) */
export const LEAD_MAGNET_FILES: Record<string, string> = {
  "skin-analysis": "NPA-Skin-Analysis-Free-Cheat-Sheet.html",
  "vitamin-injection": "NPA-Vitamin-Injection-Manual-Free.html",
};

function getSecret(): string {
  return (
    process.env.LEAD_MAGNET_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV === "development" ? "dev-lead-magnet-secret-change-me" : "")
  );
}

/**
 * Signed, stateless token for email-gated HTML downloads. Expires after `ttlSeconds`.
 */
export function createLeadMagnetToken(
  magnet: string,
  email: string,
  ttlSeconds = 7 * 24 * 60 * 60,
): string | null {
  const secret = getSecret();
  if (!secret || !LEAD_MAGNET_FILES[magnet]) return null;

  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = JSON.stringify({
    magnet,
    email: email.trim().toLowerCase(),
    exp,
  });
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return Buffer.from(payload, "utf8").toString("base64url") + "." + sig;
}

export function verifyLeadMagnetToken(
  token: string,
): { magnet: string; email: string; exp: number } | null {
  const secret = getSecret();
  if (!secret) return null;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return null;
  }

  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  let parsed: { magnet?: string; email?: string; exp?: number };
  try {
    parsed = JSON.parse(payload) as { magnet?: string; email?: string; exp?: number };
  } catch {
    return null;
  }
  if (
    typeof parsed.magnet !== "string" ||
    typeof parsed.email !== "string" ||
    typeof parsed.exp !== "number"
  ) {
    return null;
  }
  if (!LEAD_MAGNET_FILES[parsed.magnet]) return null;
  if (parsed.exp < Math.floor(Date.now() / 1000)) return null;

  return { magnet: parsed.magnet, email: parsed.email, exp: parsed.exp };
}
