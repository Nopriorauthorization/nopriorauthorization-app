const fs = require('fs');
const path = require('path');

const apiContent = `import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

// GET: List all priorities
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
    const type = searchParams.get("type");

    const query: any = { ...where };
    if (status && status !== "all") {
      query.status = status;
    }
    if (type && type !== "all") {
      query.type = type;
    }

    const priorities = await prisma.priority.findMany({
      where: query,
      orderBy: [
        { status: "asc" }, // active first
        { dueDate: "asc" }, // earliest due date first
        { createdAt: "desc" },
      ],
    });

    const isEmpty = priorities.length === 0;
    const activeCount = priorities.filter((p) => p.status === "active").length;
    const completedCount = priorities.filter(
      (p) => p.status === "completed"
    ).length;

    // Count by type
    const byType = {
      question: priorities.filter((p) => p.type === "question").length,
      bringItem: priorities.filter((p) => p.type === "bring-item").length,
      followUp: priorities.filter((p) => p.type === "follow-up").length,
      other: priorities.filter((p) => p.type === "other").length,
    };

    return NextResponse.json({
      priorities,
      isEmpty,
      stats: {
        total: priorities.length,
        active: activeCount,
        completed: completedCount,
        byType,
      },
    });
  } catch (error) {
    console.error("Error fetching priorities:", error);
    return NextResponse.json(
      { error: "Failed to fetch priorities" },
      { status: 500 }
    );
  }
}

// POST: Create new priority
export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      type,
      linkedAppointment,
      linkedCareTeam,
      linkedCarePlan,
      dueDate,
    } = body;

    if (!title || !type) {
      return NextResponse.json(
        { error: "Title and type are required" },
        { status: 400 }
      );
    }

    const priority = await prisma.priority.create({
      data: {
        userId: identity.userId || undefined,
        anonId: identity.anonId || undefined,
        title,
        description: description || undefined,
        type,
        linkedAppointment: linkedAppointment || undefined,
        linkedCareTeam: linkedCareTeam || undefined,
        linkedCarePlan: linkedCarePlan || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status: "active",
      },
    });

    return NextResponse.json(priority, { status: 201 });
  } catch (error) {
    console.error("Error creating priority:", error);
    return NextResponse.json(
      { error: "Failed to create priority" },
      { status: 500 }
    );
  }
}
`;

const outputPath = path.join(__dirname, '../src/app/api/vault/priority/route.ts');
const dir = path.dirname(outputPath);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, apiContent, 'utf8');
console.log('✅ Priority API successfully written to', outputPath);
