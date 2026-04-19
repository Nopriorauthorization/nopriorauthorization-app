import prisma from "@/lib/db";
import { GROWTH_SYSTEM_SLUG } from "@/config/growth-funnel.config";
import {
  FUNNEL_TAG_BUYER,
  FUNNEL_TAG_GROWTH_SYSTEM_BUYER,
  FUNNEL_TAG_MEMBER,
} from "@/config/email-funnel.config";

function mergeTags(existing: string[], add: string[]): string[] {
  return Array.from(new Set([...existing, ...add]));
}

/**
 * Call from Square after a completed purchase.
 * Stops promo funnel; tags buyer / growth_system_buyer.
 */
export async function pauseFunnelOnPurchase(
  customerEmail: string,
  productSlug: string,
): Promise<void> {
  const email = customerEmail.trim().toLowerCase();
  if (!email) return;

  const isGrowth =
    productSlug === GROWTH_SYSTEM_SLUG || productSlug === "growth-system";

  const tagsToAdd = isGrowth
    ? [FUNNEL_TAG_BUYER, FUNNEL_TAG_GROWTH_SYSTEM_BUYER]
    : [FUNNEL_TAG_BUYER];

  const stopReason = isGrowth ? "growth_system_buyer" : "buyer";

  const sub = await prisma.emailFunnelSubscriber.findUnique({
    where: { email },
  });
  if (!sub) return;

  await prisma.emailFunnelSubscriber.update({
    where: { id: sub.id },
    data: {
      tags: mergeTags(sub.tags, tagsToAdd),
      stopReason,
      nextSendAt: null,
    },
  });

  await prisma.analytics.create({
    data: {
      event: "email_funnel_stopped_purchase",
      metadata: { email, productSlug, stopReason },
    },
  });
}

/**
 * Call when membership is confirmed (internal webhook or admin).
 */
export async function pauseFunnelOnMembership(emailRaw: string): Promise<void> {
  const email = emailRaw.trim().toLowerCase();
  if (!email) return;

  const sub = await prisma.emailFunnelSubscriber.findUnique({
    where: { email },
  });
  if (!sub) return;

  await prisma.emailFunnelSubscriber.update({
    where: { id: sub.id },
    data: {
      tags: mergeTags(sub.tags, [FUNNEL_TAG_MEMBER]),
      stopReason: "member",
      nextSendAt: null,
    },
  });

  await prisma.analytics.create({
    data: {
      event: "email_funnel_stopped_membership",
      metadata: { email },
    },
  });
}
