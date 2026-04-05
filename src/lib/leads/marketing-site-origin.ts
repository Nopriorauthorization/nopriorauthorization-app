/** Base URL for links in marketing emails (matches `siteOrigin` in email-funnel/send-step). */
export function marketingSiteOrigin(): string {
  return (
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    process.env.VERCEL_URL?.replace(/\/$/, "") ||
    "https://nopriorauthorization.com"
  ).replace(/^http:\/\//i, "https://");
}
