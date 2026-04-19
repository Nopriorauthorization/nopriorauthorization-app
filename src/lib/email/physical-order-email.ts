export function generatePhysicalOrderPendingEmail(opts: {
  customerName?: string | null;
  productTitle: string;
  price: string;
  printifySubmitted: boolean;
}): string {
  const greeting = opts.customerName?.trim()
    ? `Hi ${opts.customerName.trim()}`
    : "Hi there";
  const status = opts.printifySubmitted
    ? "<p>Your order has been sent to our print partner and will ship soon.</p>"
    : "<p>Your payment is confirmed. We're finalizing fulfillment details for your physical item and will email you again when it ships.</p>";

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:24px;font-family:system-ui,sans-serif;color:#1a1a1a">
  <h1 style="font-size:20px">${greeting},</h1>
  <p>Thanks for your order: <strong>${escapeHtml(opts.productTitle)}</strong> (${escapeHtml(opts.price)}).</p>
  ${status}
  <p style="color:#666;font-size:14px">— No Prior Authorization</p>
</body></html>`;
}

export function generatePhysicalOrderShippedEmail(opts: {
  customerName?: string | null;
  productTitle: string;
  trackingNumber?: string | null;
}): string {
  const greeting = opts.customerName?.trim()
    ? `Hi ${opts.customerName.trim()}`
    : "Hi there";
  const track = opts.trackingNumber?.trim()
    ? `<p><strong>Tracking:</strong> ${escapeHtml(opts.trackingNumber.trim())}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:24px;font-family:system-ui,sans-serif;color:#1a1a1a">
  <h1 style="font-size:20px">${greeting},</h1>
  <p>Your physical order <strong>${escapeHtml(opts.productTitle)}</strong> has shipped.</p>
  ${track}
  <p style="color:#666;font-size:14px">— No Prior Authorization</p>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
