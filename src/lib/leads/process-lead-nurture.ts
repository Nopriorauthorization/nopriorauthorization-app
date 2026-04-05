import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { FREE_TEMPLATES_LEAD_SOURCE } from "@/config/free-templates-lead-magnet.config";
import { buildNurtureEmailForStep } from "@/lib/leads/free-templates-emails";
import { marketingSiteOrigin } from "@/lib/leads/marketing-site-origin";
import { addDays } from "@/lib/email-funnel/send-step";

/**
 * Sends due nurture emails for `leads` (free-templates flow). Cron should call this hourly.
 */
export async function processDueLeadNurtureEmails(maxBatch = 40): Promise<{
  processed: number;
  sent: number;
  errors: number;
}> {
  const now = new Date();
  const due = await prisma.lead.findMany({
    where: {
      source: FREE_TEMPLATES_LEAD_SOURCE,
      optedIn: true,
      nurtureEmailsSent: { lt: 3 },
      nextNurtureAt: { lte: now },
    },
    orderBy: { nextNurtureAt: "asc" },
    take: maxBatch,
  });

  const origin = marketingSiteOrigin();
  let sent = 0;
  let errors = 0;

  for (const lead of due) {
    const step = lead.nurtureEmailsSent;
    const unsubscribeUrl = `${origin}/api/leads/unsubscribe?token=${encodeURIComponent(lead.unsubscribeToken)}`;
    const { subject, html } = buildNurtureEmailForStep(step, {
      firstName: lead.firstName,
      unsubscribeUrl,
    });

    const result = await sendEmail({
      to: lead.email,
      subject,
      html,
      headers: {
        "X-Lead-Nurture": String(step + 1),
        "X-Lead-Id": lead.id,
      },
    });

    if (!result.success) {
      errors += 1;
      continue;
    }

    const nextAt =
      step === 0 ? addDays(new Date(), 2) : step === 1 ? addDays(new Date(), 4) : null;

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        nurtureEmailsSent: step + 1,
        nextNurtureAt: nextAt,
      },
    });

    await prisma.analytics.create({
      data: {
        event: "lead_nurture_sent",
        metadata: {
          email: lead.email,
          source: lead.source,
          nurtureStep: step + 1,
        },
      },
    });

    sent += 1;
  }

  return { processed: due.length, sent, errors };
}
