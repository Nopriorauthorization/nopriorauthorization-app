import { getPostPurchaseContact } from "@/config/post-purchase.config";

export function generateAbandonedCheckoutEmail(params: {
  productTitle: string;
  resumeUrl: string;
  originLabel: string;
}): string {
  const { productTitle, resumeUrl, originLabel } = params;
  const contact = getPostPurchaseContact();

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Complete your order</title>
</head><body style="margin:0;padding:0;background:#FAF7F5;font-family:'Lato','Helvetica Neue',sans-serif;color:#1A1A1A">
<div style="max-width:600px;margin:0 auto;padding:24px 16px">
<div style="background:#1A1A1A;border-radius:12px;padding:24px;text-align:center">
  <div style="font-family:Georgia,serif;font-size:20px;color:#fff">No Prior <span style="color:#D4537E">Authorization</span></div>
</div>
<div style="background:#fff;padding:28px;border-radius:12px;border:1px solid #E8D5DE;margin-top:12px">
  <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 12px">Still thinking about it?</h1>
  <p style="font-size:15px;line-height:1.6;color:#6B6B6B;margin:0 0 20px">
    You started checkout for <strong style="color:#1A1A1A">${originLabel}: ${productTitle}</strong> but didn&apos;t finish.
    Your cart isn&apos;t held forever — when you&apos;re ready, you can pick up where you left off.
  </p>
  <div style="text-align:center;margin:28px 0">
    <a href="${resumeUrl}" style="display:inline-block;background:#D4537E;color:#fff;font-size:15px;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none">
      Complete checkout
    </a>
  </div>
  <p style="font-size:13px;color:#999;line-height:1.6;margin:0">
    Questions? Reply to this email or write <a href="mailto:${contact.supportEmail}" style="color:#D4537E">${contact.supportEmail}</a>.
  </p>
</div>
</div>
</body></html>`;
}
