import { createHash, randomBytes } from "crypto";

const ETSY_OAUTH_CONNECT = "https://www.etsy.com/oauth/connect";
const ETSY_TOKEN_URL = "https://api.etsy.com/v3/public/oauth/token";

export { ETSY_OAUTH_CONNECT, ETSY_TOKEN_URL };

function base64Url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** PKCE pair per RFC 7636 / Etsy Open API v3. */
export function generatePkcePair(): { verifier: string; challenge: string } {
  const verifier = base64Url(randomBytes(32));
  const challenge = base64Url(createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

export function generateOauthState(): string {
  return base64Url(randomBytes(24));
}

export type EtsyEnvConfig = {
  clientId: string;
  sharedSecret: string;
  redirectUri: string;
  scopes: string;
};

export function getEtsyEnv(): EtsyEnvConfig | null {
  const clientId = process.env.ETSY_API_KEYSTRING?.trim();
  const sharedSecret = process.env.ETSY_API_SHARED_SECRET?.trim();
  const redirectUri = process.env.ETSY_OAUTH_REDIRECT_URI?.trim();
  if (!clientId || !sharedSecret || !redirectUri) return null;
  const scopes =
    process.env.ETSY_OAUTH_SCOPES?.trim() ||
    "shops_r shops_w listings_r listings_w";
  return { clientId, sharedSecret, redirectUri, scopes };
}

/** x-api-key header value for Open API v3. */
export function formatXApiKey(clientId: string, sharedSecret: string): string {
  return `${clientId}:${sharedSecret}`;
}

/** Numeric user id prefix from access_token (before first `.`). */
export function parseUserIdFromAccessToken(accessToken: string): string | null {
  const i = accessToken.indexOf(".");
  if (i <= 0) return null;
  const id = accessToken.slice(0, i);
  return /^\d+$/.test(id) ? id : null;
}

export function buildAuthorizeUrl(params: {
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  codeChallenge: string;
}): string {
  const u = new URL(ETSY_OAUTH_CONNECT);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", params.clientId);
  u.searchParams.set("redirect_uri", params.redirectUri);
  u.searchParams.set("scope", params.scope);
  u.searchParams.set("state", params.state);
  u.searchParams.set("code_challenge", params.codeChallenge);
  u.searchParams.set("code_challenge_method", "S256");
  // Etsy docs show scopes URL-encoded with %20 separators.
  return u.toString().replace(/\+/g, "%20");
}
