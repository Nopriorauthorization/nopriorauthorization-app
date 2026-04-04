import prisma from "@/lib/db";
import { FUNNEL_TAG_LEAD } from "@/config/email-funnel.config";
import { scheduleAfterStep, sendFunnelStep } from "./send-step";

const HARD_STOPS = new Set(["buyer", "growth_system_buyer", "member"]);

function mergeTags(existing: string[], add: string[]): string[] {
  return Array.from(new Set([...existing, ...add]));
}

export type EnrollLeadResult = {
  ok: boolean;
  skipped?: "already_customer" | "already_in_sequence" | "send_failed";
  stepId?: string;
};

/**
 * Lead magnet signup: ensure subscriber row, send email 1 when appropriate.
 */
export async function enrollLeadFromSignup(
  emailRaw: string,
  source: string,
): Promise<EnrollLeadResult> {
  const email = emailRaw.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, skipped: "send_failed" };
  }

  let sub = await prisma.emailFunnelSubscriber.findUnique({
    where: { email },
  });

  if (sub?.stopReason && HARD_STOPS.has(sub.stopReason)) {
    await prisma.analytics.create({
      data: {
        event: "email_funnel_signup_skipped",
        metadata: { email, source, reason: sub.stopReason },
      },
    });
    return { ok: true, skipped: "already_customer" };
  }

  if (!sub) {
    sub = await prisma.emailFunnelSubscriber.create({
      data: {
        email,
        tags: [FUNNEL_TAG_LEAD],
        lastSentStep: 0,
        nextSendAt: null,
        source,
      },
    });
  } else {
    const tags = mergeTags(sub.tags, [FUNNEL_TAG_LEAD]);
    sub = await prisma.emailFunnelSubscriber.update({
      where: { id: sub.id },
      data: {
        tags,
        source: source || sub.source,
        ...(sub.unsubscribedAt
          ? {
              unsubscribedAt: null,
              stopReason: null,
              lastSentStep: 0,
              nextSendAt: null,
            }
          : {}),
      },
    });
  }

  if (sub.lastSentStep >= 1 && !sub.unsubscribedAt) {
    await prisma.analytics.create({
      data: {
        event: "email_funnel_signup_duplicate",
        metadata: { email, source },
      },
    });
    return { ok: true, skipped: "already_in_sequence" };
  }

  const send = await sendFunnelStep(sub, 1);
  if (!send.ok) {
    if (send.reason === "already_sent") {
      const sched = scheduleAfterStep(1, new Date());
      await prisma.emailFunnelSubscriber.update({
        where: { id: sub.id },
        data: {
          lastSentStep: sched.lastSentStep,
          nextSendAt: sched.nextSendAt,
        },
      });
      return { ok: true, stepId: "delivery" };
    }
    console.error("[email-funnel] Step 1 failed:", send.reason, email);
    return { ok: false, skipped: "send_failed" };
  }

  const sched = scheduleAfterStep(1, new Date());
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
      metadata: { email, stepId: send.stepId, source, channel: "signup" },
    },
  });

  return { ok: true, stepId: send.stepId };
}
