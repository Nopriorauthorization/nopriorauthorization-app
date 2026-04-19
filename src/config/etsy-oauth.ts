import { NPA_SITE_URL } from "./npa-brand.config";

/**
 * Canonical Etsy OAuth redirect — **register this exact URL** in Etsy Developer → Your Apps
 * (unless `ETSY_OAUTH_REDIRECT_URI` overrides it in env).
 *
 * - HTTPS, apex host (no `www`), path `/api/etsy/callback`, no trailing slash.
 */
export const NPA_ETSY_OAUTH_REDIRECT_URI =
  `${NPA_SITE_URL}/api/etsy/callback` as const;
