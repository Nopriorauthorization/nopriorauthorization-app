const fs = require('fs');
const path = require('path');

const apiContent = `import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

// GET: Synthesize visit preparation intelligence
export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId
      ? { userId: identity.userId }
      : { anonId: identity.anonId };

    // Get upcoming appointments (next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        ...where,
        appointmentDate: {
          gte: now,
          lte: thirtyDaysFromNow,
        },
        status: { not: "cancelled" },
      },
      orderBy: { appointmentDate: "asc" },
      take: 5,
    });

    // Get active priorities (questions to ask, things to bring)
    const activePriorities = await prisma.priority.findMany({
      where: {
        ...where,
        status: "active",
      },
      orderBy: { dueDate: "asc" },
    });

    // Get care team members
    const careTeam = await prisma.careTeamMember.findMany({
      where,
      orderBy: { isPrimary: "desc" },
    });

    // Get active care plans
    const activePlans = await prisma.carePlan.findMany({
      where: {
        ...where,
        status: "active",
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Get recent documents (last 30 days)
    const recentDocuments = await prisma.document.findMany({
      where: {
        ...where,
        deletedAt: null,
        createdAt: {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
        docDate: true,
      },
    });

    // Synthesize preparation insights
    const questionsToAsk = activePriorities
      .filter((p) => p.type === "question")
      .map((p) => ({
        id: p.id,
        question: p.title,
        source: "priority",
        linkedAppointment: p.linkedAppointment,
      }));

    // Add questions from care plans
    activePlans.forEach((plan) => {
      if (plan.questionsToAsk && plan.questionsToAsk.length > 0) {
        plan.questionsToAsk.forEach((q: string) => {
          questionsToAsk.push({
            id: \`plan-\${plan.id}-\${questionsToAsk.length}\`,
            question: q,
            source: "care-plan",
            carePlanTitle: plan.title,
          });
        });
      }
    });

    // Things to bring
    const thingsToBring = activePriorities
      .filter((p) => p.type === "bring-item")
      .map((p) => ({
        id: p.id,
        item: p.title,
        linkedAppointment: p.linkedAppointment,
      }));

    // Add insurance cards, IDs, referrals if user has them
    const identityDocs = await prisma.document.findMany({
      where: {
        ...where,
        deletedAt: null,
        category: {
          in: ["INSURANCE_CARD", "GOVERNMENT_ID", "REFERRAL"],
        },
      },
      select: {
        id: true,
        title: true,
        category: true,
      },
    });

    identityDocs.forEach((doc) => {
      thingsToBring.push({
        id: \`doc-\${doc.id}\`,
        item: doc.title,
        category: doc.category,
        isDocument: true,
      });
    });

    // Follow-ups pending
    const pendingFollowUps = activePriorities
      .filter((p) => p.type === "follow-up")
      .map((p) => ({
        id: p.id,
        task: p.title,
        description: p.description,
      }));

    // Recent changes (documents from last 30 days, new appointments)
    const recentChanges = [];

    if (recentDocuments.length > 0) {
      recentChanges.push({
        type: "documents",
        count: recentDocuments.length,
        message: \`\${recentDocuments.length} new document\${recentDocuments.length !== 1 ? "s" : ""} uploaded\`,
        documents: recentDocuments,
      });
    }

    const newAppointments = upcomingAppointments.filter((apt) => {
      const createdRecently = new Date(apt.createdAt).getTime() > (now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return createdRecently;
    });

    if (newAppointments.length > 0) {
      recentChanges.push({
        type: "appointments",
        count: newAppointments.length,
        message: \`\${newAppointments.length} new appointment\${newAppointments.length !== 1 ? "s" : ""} scheduled\`,
        appointments: newAppointments,
      });
    }

    // Discussion items (active care plan goals)
    const discussionItems = activePlans.map((plan) => ({
      id: plan.id,
      title: plan.title,
      goal: plan.goal,
      targetDate: plan.targetDate,
    }));

    const isEmpty =
      upcomingAppointments.length === 0 &&
      questionsToAsk.length === 0 &&
      thingsToBring.length === 0 &&
      discussionItems.length === 0;

    return NextResponse.json({
      upcomingAppointments,
      questionsToAsk,
      thingsToBring,
      pendingFollowUps,
      recentChanges,
      discussionItems,
      careTeamContext: careTeam.slice(0, 3), // Top 3 care team members
      isEmpty,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating visit prep:", error);
    return NextResponse.json(
      { error: "Failed to generate visit preparation" },
      { status: 500 }
    );
  }
}
`;

const outputPath = path.join(__dirname, '../src/app/api/vault/visit-prep/route.ts');
const dir = path.dirname(outputPath);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, apiContent, 'utf8');
console.log('✅ Visit Prep API successfully written to', outputPath);
