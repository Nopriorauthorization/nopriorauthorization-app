export function generateDeliveryEmail(params: {
  customerName?: string;
  productTitle: string;
  deliveryUrl: string;
  price: string;
}): string {
  const { customerName, productTitle, deliveryUrl, price } = params;
  const greeting = customerName ? `Hi ${customerName}` : "Hi there";

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your download is ready!</title>
</head><body style="margin:0;padding:0;background:#FAF7F5;font-family:'Lato','Helvetica Neue',sans-serif;color:#1A1A1A">
<div style="max-width:600px;margin:0 auto;padding:24px 16px">

<div style="background:#1A1A1A;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center">
  <div style="font-family:Georgia,'Playfair Display',serif;font-size:22px;color:#fff;letter-spacing:0.01em">
    No Prior <span style="color:#D4537E">Authorization</span>
  </div>
  <div style="font-size:11px;color:#888;letter-spacing:0.12em;text-transform:uppercase;margin-top:6px">
    Digital Templates
  </div>
</div>

<div style="background:#fff;padding:32px;border-radius:0 0 12px 12px;border:1px solid #E8D5DE;border-top:none">

  <h1 style="font-family:Georgia,serif;font-size:24px;color:#1A1A1A;margin:0 0 8px">${greeting},</h1>
  <p style="font-size:15px;line-height:1.6;color:#6B6B6B;margin:0 0 24px">
    Your purchase is confirmed and your templates are ready!
  </p>

  <div style="background:#FBEAF0;border-radius:8px;padding:16px 20px;margin-bottom:24px">
    <div style="font-size:11px;font-weight:700;color:#D4537E;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px">Your Order</div>
    <div style="font-size:16px;font-weight:700;color:#1A1A1A">${productTitle}</div>
    <div style="font-size:14px;color:#6B6B6B;margin-top:4px">${price}</div>
  </div>

  <div style="text-align:center;margin:28px 0">
    <a href="${deliveryUrl}" style="display:inline-block;background:#D4537E;color:#fff;font-size:16px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.02em">
      Access Your Templates
    </a>
  </div>

  <div style="border-top:1px solid #E8D5DE;padding-top:20px;margin-top:24px">
    <div style="font-size:13px;font-weight:700;color:#1A1A1A;margin-bottom:10px">How to use your templates:</div>
    <ol style="font-size:13px;color:#6B6B6B;line-height:1.8;padding-left:18px;margin:0">
      <li>Click the button above to access your templates</li>
      <li>Open any template — print directly or save as PDF</li>
      <li>Fill in details for your practice</li>
      <li>Print unlimited copies for your office</li>
    </ol>
  </div>

  <div style="margin-top:24px;font-size:12px;color:#999;line-height:1.6">
    <strong>Need help?</strong> Reply to this email or message us through the shop.
    We typically respond within 24 hours.
  </div>

</div>

<div style="text-align:center;padding:20px;font-size:11px;color:#999">
  No Prior Authorization by Hello Gorgeous Med Spa &middot; Oswego, Illinois<br>
  &copy; ${new Date().getFullYear()} All rights reserved.
</div>

</div>
</body></html>`;
}
