import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

// GET: List all care plans
export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId
      ? { userId: identity.userId }
      : { anonId: identity.anonId };

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: any = { ...where };
    if (status && status !== "all") {
      query.status = status;
    }

    const plans = await prisma.carePlan.findMany({
      where: query,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    // Enrich with linked document and appointment counts
    const plansWithCounts = await Promise.all(
      plans.map(async (plan) => {
        const documentCount = plan.linkedDocuments?.length || 0;
        const appointmentCount = plan.linkedAppointments?.length || 0;
        const questionCount = plan.questionsToAsk?.length || 0;

        return {
          ...plan,
          documentCount,
          appointmentCount,
          questionCount,
        };
      })
    );

    const isEmpty = plans.length === 0;
    const activeCount = plans.filter((p) => p.status === "active").length;
    const completedCount = plans.filter((p) => p.status === "completed").length;

    return NextResponse.json({
      plans: plansWithCounts,
      isEmpty,
      stats: {
        total: plans.length,
        active: activeCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    console.error("Error fetching care plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch care plans" },
      { status: 500 }
    );
  }
}

// POST: Create new care plan
export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      goal,
      questionsToAsk,
      linkedDocuments,
      linkedAppointments,
      notes,
      targetDate,
      status,
    } = body;

    if (!title || !goal) {
      return NextResponse.json(
        { error: "Title and goal are required" },
        { status: 400 }
      );
    }

    const plan = await prisma.carePlan.create({
      data: {
        userId: identity.userId || undefined,
        anonId: identity.anonId || undefined,
        title,
        goal,
        questionsToAsk: questionsToAsk || [],
        linkedDocuments: linkedDocuments || [],
        linkedAppointments: linkedAppointments || [],
        notes: notes || undefined,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        status: status || "active",
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating care plan:", error);
    return NextResponse.json(
      { error: "Failed to create care plan" },
      { status: 500 }
    );
  }
}
