import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";

// GET - Check subscription status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription) {
      return NextResponse.json({
        isActive: false,
        status: "none",
      });
    }

    const isActive =
      subscription.status === "active" &&
      (!subscription.currentPeriodEnd ||
        subscription.currentPeriodEnd > new Date());

    return NextResponse.json({
      isActive,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json(
      { error: "Failed to check subscription" },
      { status: 500 }
    );
  }
}

// POST — legacy Stripe customer portal removed; checkout is Square.
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Billing portal is not available. NPA shop checkout uses Square; contact support for subscription changes.",
      },
      { status: 410 }
    );
  } catch (error) {
    console.error("Subscription POST error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
