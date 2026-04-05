import type { Lead } from "@prisma/client";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { FREE_TEMPLATES_LEAD_SOURCE } from "@/config/free-templates-lead-magnet.config";
import { buildFreeTemplatesDeliveryEmail } from "@/lib/leads/free-templates-emails";
import { marketingSiteOrigin } from "@/lib/leads/marketing-site-origin";
import { addDays } from "@/lib/email-funnel/send-step";

export type FreeTemplatesSignupResult =
  | { ok: true; lead: Lead }
  | { ok: false; error: "invalid_email" | "send_failed" };

/**
 * Upsert `leads` row (source free-templates), then send delivery email via Resend.
 */
export async function signupFreeTemplatesLead(
  firstNameRaw: string,
  emailRaw: string,
): Promise<FreeTemplatesSignupResult> {
  const email = emailRaw.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, error: "invalid_email" };
  }

  const firstName = firstNameRaw.trim() || "there";
  const origin = marketingSiteOrigin();

  let lead = await prisma.lead.findUnique({
    where: {
      email_source: {
        email,
        source: FREE_TEMPLATES_LEAD_SOURCE,
      },
    },
  });

  if (!lead) {
    lead = await prisma.lead.create({
      data: {
        firstName,
        email,
        source: FREE_TEMPLATES_LEAD_SOURCE,
        optedIn: true,
        nurtureEmailsSent: 0,
        nextNurtureAt: addDays(new Date(), 1),
      },
    });
  } else {
    const data: {
      firstName: string;
      optedIn: boolean;
      nurtureEmailsSent?: number;
      nextNurtureAt?: Date | null;
    } = {
      firstName,
      optedIn: true,
    };
    if (!lead.optedIn) {
      data.nurtureEmailsSent = 0;
      data.nextNurtureAt = addDays(new Date(), 1);
    }
    lead = await prisma.lead.update({
      where: { id: lead.id },
      data,
    });
  }

  const unsubscribeUrl = `${origin}/api/leads/unsubscribe?token=${encodeURIComponent(lead.unsubscribeToken)}`;
  const { subject, html } = buildFreeTemplatesDeliveryEmail({
    firstName: lead.firstName,
    email: lead.email,
    unsubscribeUrl,
  });

  const sent = await sendEmail({
    to: lead.email,
    subject,
    html,
    headers: {
      "X-Lead-Flow": "free-templates-delivery",
    },
  });

  if (!sent.success) {
    return { ok: false, error: "send_failed" };
  }

  return { ok: true, lead };
}
