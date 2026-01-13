import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { createCheckoutSession } from "@/lib/stripe/stripe";
import prisma from "@/lib/db";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Get user's existing subscription/customer info
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    // Create checkout session
    const checkoutSession = await createCheckoutSession(
      session.user.id,
      session.user.email,
      subscription?.stripeCustomerId
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
