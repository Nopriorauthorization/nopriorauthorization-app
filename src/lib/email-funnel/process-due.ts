import prisma from "@/lib/db";
import { scheduleAfterStep, sendFunnelStep } from "./send-step";

/**
 * Process subscribers due for the next step (cron). Returns counts.
 */
export async function processDueFunnelEmails(maxBatch = 40): Promise<{
  processed: number;
  sent: number;
  errors: number;
}> {
  const now = new Date();
  const due = await prisma.emailFunnelSubscriber.findMany({
    where: {
      unsubscribedAt: null,
      stopReason: null,
      nextSendAt: { lte: now },
      lastSentStep: { lt: 7, gte: 1 },
    },
    orderBy: { nextSendAt: "asc" },
    take: maxBatch,
  });

  let sent = 0;
  let errors = 0;

  for (const sub of due) {
    const nextStep = sub.lastSentStep + 1;
    if (nextStep > 7) continue;

    try {
      const result = await sendFunnelStep(sub, nextStep);
      if (!result.ok) {
        if (result.reason === "stopped" || result.reason === "already_sent") {
          continue;
        }
        errors += 1;
        continue;
      }

      const sched = scheduleAfterStep(nextStep, new Date());
      await prisma.emailFunnelSubscriber.update({
        where: { id: sub.id },
        data: {
          lastSentStep: sched.lastSentStep,
          nextSendAt: sched.nextSendAt,
        },
      });

      await prisma.analytics.create({
        data: {
          event: "email_funnel_step_sent",
          metadata: {
            email: sub.email,
            stepId: result.stepId,
            channel: "cron",
          },
        },
      });

      sent += 1;
    } catch (e) {
      console.error("[email-funnel] cron error", sub.email, e);
      errors += 1;
    }
  }

  return { processed: due.length, sent, errors };
}
