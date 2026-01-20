// Simple email utility using Resend (or configure for SendGrid/AWS SES)
// Add RESEND_API_KEY to environment variables

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const apiKey = process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.warn("No email API key configured. Email not sent.");
    return { success: false, message: "Email service not configured" };
  }

  // Using Resend API (simple and modern)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "noreply@nopriorauthorization.com",
          to,
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Email send failed:", error);
        return { success: false, message: "Failed to send email" };
      }

      return { success: true };
    } catch (error) {
      console.error("Email error:", error);
      return { success: false, message: "Email service error" };
    }
  }

  // TODO: Add SendGrid implementation if needed
  // TODO: Add AWS SES implementation if needed

  return { success: false, message: "No email provider configured" };
}

export function generateInviteEmail(params: {
  inviteeName: string;
  ownerName: string;
  inviteLink: string;
  expiresAt: Date | null;
  permissions: string[];
}) {
  const { inviteeName, ownerName, inviteLink, expiresAt, permissions } = params;

  const expiryText = expiresAt
    ? `This invitation expires on ${expiresAt.toLocaleDateString()}.`
    : "This invitation does not expire.";

  const permissionsList = permissions
    .map((p) => `<li>${p.replace(/-/g, " ")}</li>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #ec4899; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .permissions { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Trusted Circle Invitation</h1>
          </div>
          <div class="content">
            <h2>Hi ${inviteeName},</h2>
            <p><strong>${ownerName}</strong> has invited you to join their Trusted Circle on No Prior Authorization.</p>
            
            <p>This means you'll have secure access to specific parts of their health vault, helping you stay informed and provide support when needed.</p>

            <div class="permissions">
              <h3>Your Access Permissions:</h3>
              <ul>${permissionsList}</ul>
            </div>

            <p style="text-align: center;">
              <a href="${inviteLink}" class="button">Accept Invitation</a>
            </p>

            <p><strong>Important:</strong> ${expiryText}</p>

            <p>If you have any questions or didn't expect this invitation, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} No Prior Authorization. All rights reserved.</p>
            <p>This is a secure invitation. Do not share this link with anyone else.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
