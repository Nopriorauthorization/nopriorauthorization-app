import { createHash, randomBytes } from "crypto";

const CANVA_OAUTH_AUTHORIZE_URL = "https://www.canva.com/api/oauth/authorize";
const CANVA_OAUTH_TOKEN_URL = "https://api.canva.com/rest/v1/oauth/token";
const CANVA_PROFILE_URL = "https://api.canva.com/rest/v1/users/me/profile";
const CANVA_CAPABILITIES_URL =
  "https://api.canva.com/rest/v1/users/me/capabilities";

/** List designs (metadata). Requires `design:meta:read`. */
const CANVA_DESIGNS_LIST_URL = "https://api.canva.com/rest/v1/designs";

export {
  CANVA_OAUTH_AUTHORIZE_URL,
  CANVA_OAUTH_TOKEN_URL,
  CANVA_PROFILE_URL,
  CANVA_CAPABILITIES_URL,
  CANVA_DESIGNS_LIST_URL,
};

function base64Url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generatePkcePair(): { verifier: string; challenge: string } {
  const verifier = base64Url(randomBytes(96));
  const challenge = base64Url(createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

export function generateOauthState(): string {
  return base64Url(randomBytes(48));
}

export type CanvaEnvConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string;
};

export function getCanvaEnv(): CanvaEnvConfig | null {
  const clientId = process.env.CANVA_CLIENT_ID?.trim();
  const clientSecret = process.env.CANVA_CLIENT_SECRET?.trim();
  const redirectUri = process.env.CANVA_OAUTH_REDIRECT_URI?.trim();

  if (!clientId || !clientSecret || !redirectUri) return null;

  const scopes =
    process.env.CANVA_OAUTH_SCOPES?.trim() ||
    "profile:read design:meta:read";

  return {
    clientId,
    clientSecret,
    redirectUri,
    scopes,
  };
}

export function buildAuthorizeUrl(params: {
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  codeChallenge: string;
}): string {
  const url = new URL(CANVA_OAUTH_AUTHORIZE_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("scope", params.scope);
  url.searchParams.set("state", params.state);
  url.searchParams.set("code_challenge", params.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString().replace(/\+/g, "%20");
}

export function buildBasicAuthHeader(
  clientId: string,
  clientSecret: string
): string {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}
