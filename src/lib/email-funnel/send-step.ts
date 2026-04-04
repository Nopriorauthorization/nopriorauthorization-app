import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import type { EmailFunnelSubscriber } from "@prisma/client";
import { getFunnelStep, type EmailFunnelStepId } from "@/config/email-funnel.config";

function siteOrigin(): string {
  return (
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    process.env.VERCEL_URL?.replace(/\/$/, "") ||
    "https://nopriorauthorization.com"
  ).replace(/^http:\/\//i, "https://");
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

export type SendFunnelStepResult =
  | { ok: true; resendEmailId?: string; stepId: EmailFunnelStepId }
  | { ok: false; reason: string };

/**
 * Send a single funnel step (1–7). Caller updates subscriber schedule after success.
 * Idempotent per (subscriber, stepId) via EmailFunnelSend.
 */
export async function sendFunnelStep(
  sub: EmailFunnelSubscriber,
  stepNumber: number,
): Promise<SendFunnelStepResult> {
  if (sub.unsubscribedAt || sub.stopReason) {
    return { ok: false, reason: "stopped" };
  }

  const step = getFunnelStep(stepNumber);
  if (!step) {
    return { ok: false, reason: "invalid_step" };
  }

  const dup = await prisma.emailFunnelSend.findFirst({
    where: { subscriberId: sub.id, stepId: step.id },
  });
  if (dup) {
    return { ok: false, reason: "already_sent" };
  }

  const origin = siteOrigin();
  const unsubscribeUrl = `${origin}/api/email-funnel/unsubscribe?token=${encodeURIComponent(sub.unsubscribeToken)}`;
  const html = step.buildHtml({
    origin,
    unsubscribeUrl,
    email: sub.email,
  });

  const sent = await sendEmail({
    to: sub.email,
    subject: step.subject,
    html,
    headers: {
      "X-Funnel-Step": step.id,
      "X-Funnel-Subscriber": sub.id,
    },
  });

  if (!sent.success) {
    return { ok: false, reason: sent.message || "send_failed" };
  }

  await prisma.emailFunnelSend.create({
    data: {
      subscriberId: sub.id,
      stepId: step.id,
      resendEmailId: sent.resendEmailId ?? null,
    },
  });

  return { ok: true, resendEmailId: sent.resendEmailId, stepId: step.id };
}

/**
 * After a successful send of `stepNumber`, compute next `lastSentStep` and `nextSendAt`.
 */
export function scheduleAfterStep(stepNumber: number, sentAt: Date): {
  lastSentStep: number;
  nextSendAt: Date | null;
} {
  const step = getFunnelStep(stepNumber);
  if (!step) {
    return { lastSentStep: stepNumber, nextSendAt: null };
  }
  if (stepNumber >= 7) {
    return { lastSentStep: 7, nextSendAt: null };
  }
  const days = step.daysUntilNext;
  return {
    lastSentStep: stepNumber,
    nextSendAt: addDays(sentAt, days),
  };
}

export { addDays, siteOrigin };
