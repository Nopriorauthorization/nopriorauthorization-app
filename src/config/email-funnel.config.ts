/**
 * 7-email lead magnet funnel — subjects, delays, and HTML bodies.
 * Edit copy here; logic lives in `src/lib/email-funnel/`.
 */

export const FUNNEL_TAG_LEAD = "lead";
export const FUNNEL_TAG_BUYER = "buyer";
export const FUNNEL_TAG_GROWTH_SYSTEM_BUYER = "growth_system_buyer";
export const FUNNEL_TAG_MEMBER = "member";

export type EmailFunnelStepId =
  | "delivery"
  | "authority"
  | "quick_win"
  | "product_push"
  | "growth_system"
  | "objections"
  | "membership";

export type FunnelEmailContext = {
  origin: string;
  unsubscribeUrl: string;
  email: string;
};

/** Days after this email before the next one sends (0 after final step). */
export type EmailFunnelStepConfig = {
  id: EmailFunnelStepId;
  /** Days to wait after this email before sending the next (ignored after step 7). */
  daysUntilNext: number;
  subject: string;
  buildHtml: (ctx: FunnelEmailContext) => string;
};

function shell(inner: string, ctx: FunnelEmailContext, preheader?: string): string {
  const pre = preheader
    ? `<span style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${preheader}</span>`
    : "";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;background:#f5f3f1;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
${pre}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3f1;padding:24px 12px"><tr><td align="center">
<table width="100%" style="max-width:560px;background:#fff;border-radius:8px;border:1px solid rgba(26,26,26,0.08)"><tr><td style="padding:28px 24px 20px;border-bottom:3px solid #D4537E">
<p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#D4537E;font-family:system-ui,sans-serif">No Prior Authorization</p>
</td></tr><tr><td style="padding:24px;font-size:16px;line-height:1.65;color:#333">
${inner}
</td></tr><tr><td style="padding:16px 24px 24px;border-top:1px solid #eee;font-size:12px;color:#888;font-family:system-ui,sans-serif;line-height:1.5">
<p style="margin:0 0 8px">You're receiving this because you requested free templates at nopriorauthorization.com.</p>
<p style="margin:0"><a href="${ctx.unsubscribeUrl}" style="color:#D4537E;font-weight:600">Unsubscribe</a> from this sequence anytime.</p>
</td></tr></table>
<p style="margin:16px 0 0;font-size:11px;color:#aaa;font-family:system-ui,sans-serif">${ctx.origin}</p>
</td></tr></table></body></html>`;
}

export const EMAIL_FUNNEL_STEPS: EmailFunnelStepConfig[] = [
  {
    id: "delivery",
    daysUntilNext: 2,
    subject: "Your 10 free med spa templates are inside",
    buildHtml: (ctx) =>
      shell(
        `<p style="margin:0 0 16px">Hi — thanks for joining. Here's what we promised: a practical starting point so you're not staring at a blank Canva file (or an empty front desk folder).</p>
<p style="margin:0 0 16px"><strong>Start here:</strong></p>
<ul style="margin:0 0 16px;padding-left:20px">
<li><a href="${ctx.origin}/shop/resources" style="color:#D4537E">Free resources hub</a> — audit, cheat sheets, and education</li>
<li><a href="${ctx.origin}/shop" style="color:#D4537E">Template shop</a> — consent bundles, social packs, playbooks (instant download)</li>
<li><a href="${ctx.origin}/how-to-get-more-med-spa-clients" style="color:#D4537E">Growth guide</a> — systems for visibility &amp; bookings</li>
</ul>
<p style="margin:0">Everything we publish is built inside a working med spa first. If it doesn't hold up in real chairs and real DMs, it doesn't ship.</p>`,
        ctx,
        "Free templates + where to go next",
      ),
  },
  {
    id: "authority",
    daysUntilNext: 2,
    subject: "Why most med spa marketing sounds the same (and how to break out)",
    buildHtml: (ctx) =>
      shell(
        `<p style="margin:0 0 16px">Quick truth: patients don't reward "pretty." They reward <em>clear, consistent, and trustworthy</em> — especially for injectables, weight loss, and IV.</p>
<p style="margin:0 0 16px">The practices that win treat marketing like operations: repeatable language, consent-aligned messaging, and social that matches what happens in the suite.</p>
<p style="margin:0 0 16px">That's the bar we build to at NPA — clinical tone where it matters, conversion where it helps, and no cookie-cutter fluff.</p>
<p style="margin:0"><a href="${ctx.origin}/about" style="color:#D4537E;font-weight:600">Read our story →</a></p>`,
        ctx,
      ),
  },
  {
    id: "quick_win",
    daysUntilNext: 3,
    subject: "One quick win for your Google presence this week",
    buildHtml: (ctx) =>
      shell(
        `<p style="margin:0 0 16px">If you only do one thing this week: make sure your Google Business Profile matches what your website and front desk say — services, hours, and the exact city you want to rank in.</p>
<p style="margin:0 0 16px">Mismatch is silent revenue leakage. Alignment is free leverage.</p>
<p style="margin:0"><a href="${ctx.origin}/audit" style="color:#D4537E;font-weight:600">Run the free digital audit →</a> &nbsp;·&nbsp; <a href="${ctx.origin}/shop/google-domination-playbook" style="color:#D4537E;font-weight:600">See the Google playbook →</a></p>`,
        ctx,
      ),
  },
  {
    id: "product_push",
    daysUntilNext: 2,
    subject: "Templates that save you real hours (not more tabs)",
    buildHtml: (ctx) =>
      shell(
        `<p style="margin:0 0 16px">When you're ready to buy individual depth — consent bundles, social systems, journey kits — the shop is organized by how practices actually work, not random PDF dumps.</p>
<p style="margin:0 0 16px">Instant checkout, instant email delivery, editable HTML you brand in minutes.</p>
<p style="margin:0"><a href="${ctx.origin}/shop" style="color:#D4537E;font-weight:600">Browse the shop →</a></p>`,
        ctx,
      ),
  },
  {
    id: "growth_system",
    daysUntilNext: 3,
    subject: "The Growth System: everything in one cart",
    buildHtml: (ctx) =>
      shell(
        `<p style="margin:0 0 16px">If you've been stacking smaller bundles, there's a simpler path: the <strong>NPA Growth System</strong> — 300+ templates covering clinical, social, and ops in one purchase.</p>
<p style="margin:0 0 16px">Same delivery flow as every other product; largest library we bundle for owners who want the full stack.</p>
<p style="margin:0"><a href="${ctx.origin}/shop/growth-system" style="color:#D4537E;font-weight:600">See the Growth System →</a></p>`,
        ctx,
      ),
  },
  {
    id: "objections",
    daysUntilNext: 2,
    subject: "\"Is this really for my practice?\"",
    buildHtml: (ctx) =>
      shell(
        `<p style="margin:0 0 16px">Common questions we hear:</p>
<ul style="margin:0 0 16px;padding-left:20px">
<li><strong>Compliance:</strong> templates are built with FTC/FDA/HIPAA awareness — you still customize for your state and attorney.</li>
<li><strong>Format:</strong> browser-editable HTML; save as PDF for print or upload where you need.</li>
<li><strong>Support:</strong> reply to any delivery email — we answer within 24 hours.</li>
</ul>
<p style="margin:0"><a href="${ctx.origin}/faq" style="color:#D4537E;font-weight:600">FAQ →</a> &nbsp;·&nbsp; <a href="${ctx.origin}/shop" style="color:#D4537E;font-weight:600">Shop →</a></p>`,
        ctx,
      ),
  },
  {
    id: "membership",
    daysUntilNext: 0,
    subject: "Ongoing drops: NPA Pro Membership",
    buildHtml: (ctx) =>
      shell(
        `<p style="margin:0 0 16px">Prefer fresh assets every month instead of one-time bundles? <strong>NPA Pro Membership</strong> is built for owners who want new templates, forms, and packs on a steady rhythm.</p>
<p style="margin:0 0 16px">Cancel anytime — see details on the membership page.</p>
<p style="margin:0"><a href="${ctx.origin}/membership" style="color:#D4537E;font-weight:600">View membership →</a></p>`,
        ctx,
      ),
  },
];

export function getFunnelStep(stepNumber1Based: number): EmailFunnelStepConfig | undefined {
  return EMAIL_FUNNEL_STEPS[stepNumber1Based - 1];
}
