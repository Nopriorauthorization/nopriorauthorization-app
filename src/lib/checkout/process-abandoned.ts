import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { generateAbandonedCheckoutEmail } from "@/lib/email/abandoned-checkout-email";
import { getCheckoutOriginLabel, getCheckoutProductTitle } from "@/lib/checkout/attempt-title";
import { getCheckoutResumeUrl } from "@/lib/checkout/resume-url";

const ABANDON_AFTER_MS = 60 * 60 * 1000;

export type AbandonedCheckoutBatchResult = {
  scanned: number;
  sent: number;
  skipped: number;
  errors: number;
};

/**
 * Send cart-abandonment emails for checkout attempts older than 1 hour with no purchase completed.
 */
export async function processAbandonedCheckoutReminders(
  limit = 40,
): Promise<AbandonedCheckoutBatchResult> {
  const origin = process.env.NEXTAUTH_URL || "https://nopriorauthorization.com";
  const cutoff = new Date(Date.now() - ABANDON_AFTER_MS);

  const attempts = await prisma.checkoutAttempt.findMany({
    where: {
      completedAt: null,
      reminderSentAt: null,
      createdAt: { lte: cutoff },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const attempt of attempts) {
    const purchased = await prisma.purchase.findFirst({
      where: {
        customerEmail: { equals: attempt.buyerEmail, mode: "insensitive" },
        productSlug: attempt.productSlug,
        createdAt: { gte: new Date(attempt.createdAt.getTime() - 120_000) },
      },
    });
    if (purchased) {
      await prisma.checkoutAttempt.update({
        where: { id: attempt.id },
        data: { completedAt: new Date() },
      });
      skipped += 1;
      continue;
    }

    const productTitle = getCheckoutProductTitle(attempt.productSlug, attempt.source);
    const resumeUrl = getCheckoutResumeUrl(origin, attempt.productSlug, attempt.source, {
      funnelSessionId: attempt.funnelSessionId,
    });
    const originLabel = getCheckoutOriginLabel(attempt.source);
    const html = generateAbandonedCheckoutEmail({ productTitle, resumeUrl, originLabel });

    const result = await sendEmail({
      to: attempt.buyerEmail,
      subject: `Complete your ${productTitle} order — No Prior Authorization`,
      html,
    });

    if (result.success) {
      await prisma.checkoutAttempt.update({
        where: { id: attempt.id },
        data: { reminderSentAt: new Date() },
      });
      sent += 1;
    } else {
      errors += 1;
    }
  }

  return { scanned: attempts.length, sent, skipped, errors };
}
