import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/stripe";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error("No userId in checkout session metadata");
    return;
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Create or update subscription record
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubId: subscriptionId,
      status: "active",
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubId: subscriptionId,
      status: "active",
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  // Track analytics
  await prisma.analytics.create({
    data: {
      event: "subscription_created",
      userId,
      metadata: { priceId: session.metadata?.priceId },
    },
  });

  console.log(`Subscription created for user: ${userId}`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    // Try to find by subscription ID
    const existingSub = await prisma.subscription.findUnique({
      where: { stripeSubId: subscription.id },
    });
    if (!existingSub) return;

    await prisma.subscription.update({
      where: { stripeSubId: subscription.id },
      data: {
        status: subscription.status === "active" ? "active" : subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
    return;
  }

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: subscription.status === "active" ? "active" : subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubId: subscription.id },
    data: {
      status: "canceled",
      stripeSubId: null,
    },
  });

  // Track analytics
  const sub = await prisma.subscription.findFirst({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (sub) {
    await prisma.analytics.create({
      data: {
        event: "subscription_canceled",
        userId: sub.userId,
      },
    });
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  await prisma.subscription.updateMany({
    where: { stripeCustomerId: customerId },
    data: { status: "past_due" },
  });
}
