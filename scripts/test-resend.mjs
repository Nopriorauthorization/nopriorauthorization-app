/**
 * Send one test email through Resend (same shape as src/lib/email.ts).
 *
 * Setup: RESEND_API_KEY (and optional EMAIL_FROM) in .env.local or env.
 *
 * Usage:
 *   node scripts/test-resend.mjs your-inbox@example.com
 *   TEST_EMAIL_TO=you@example.com node scripts/test-resend.mjs
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const apiKey = process.env.RESEND_API_KEY?.trim();
const from = process.env.EMAIL_FROM?.trim() || "noreply@nopriorauthorization.com";
const to = process.argv[2]?.trim() || process.env.TEST_EMAIL_TO?.trim();

if (!apiKey) {
  console.error("Missing RESEND_API_KEY (.env.local or environment).");
  process.exit(1);
}
if (!to) {
  console.error("Usage: node scripts/test-resend.mjs <recipient@email.com>");
  process.exit(1);
}

const html = `<!DOCTYPE html><html><body style="font-family:sans-serif">
<p><strong>Resend test</strong> — NPA shop delivery path uses the same API.</p>
<p><code>from:</code> ${from}</p>
<p>If you see this, Resend + FROM domain are working.</p>
</body></html>`;

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    from,
    to,
    subject: "NPA Resend test",
    html,
  }),
});

const text = await res.text();
if (!res.ok) {
  console.error("Resend error", res.status, text);
  process.exit(1);
}

let id;
try {
  id = JSON.parse(text).id;
} catch {
  id = text;
}
console.log("OK — sent to", to, id ? `(id: ${id})` : "");
