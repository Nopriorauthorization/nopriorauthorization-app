import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);

    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, anonId } = identity;
    const where = userId ? { userId } : { anonId };

    // Gather user's health context
    const [appointments, documents, providers] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          ...where,
          appointmentDate: { gte: new Date() },
        },
        orderBy: { appointmentDate: "asc" },
        take: 3,
      }),
      prisma.document.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          category: true,
        },
      }),
      prisma.provider.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          specialty: true,
        },
      }),
    ]);

    // Build context for AI
    const upcomingAppt = appointments[0];
    const recentDocs = documents.map((d) => d.category).join(", ") || "None";
    
    // Generate questions using AI
    const promptText = `You are a patient advocate helping someone prepare for a medical appointment.

Context:
${upcomingAppt ? `- Upcoming: ${upcomingAppt.appointmentType} with ${upcomingAppt.providerName} on ${new Date(upcomingAppt.appointmentDate).toLocaleDateString()}` : "- No upcoming appointments"}
- Recent documents: ${recentDocs}

Generate 8-12 smart questions this patient should ask their provider. Focus on:
1. Treatment alternatives and options
2. Expected outcomes and timelines
3. Risks and side effects
4. Cost and insurance coverage
5. Lifestyle considerations
6. Follow-up care

For each question provide:
- question (clear, direct)
- category (treatment, cost, risks, outcomes, lifestyle, or followup)
- priority (high, medium, or low)
- reasoning (why this matters)

Return ONLY valid JSON array:
[{"question":"...","category":"...","priority":"...","reasoning":"..."}]`;

    // 🚨 HIPAA COMPLIANCE: External AI processing disabled
    // Previously sent health data to OpenAI without BAA
    console.warn("🚨 HIPAA COMPLIANCE: AI question generation is temporarily unavailable to prevent PHI transmission to third-party services.");

    const questionsData = [
      {
        question: "⚠️ AI question generation is currently disabled due to HIPAA compliance requirements.",
        category: "compliance",
        priority: "high" as const,
        reasoning: "Protecting your health information privacy"
      },
      {
        question: "What are the potential risks and benefits of my treatment options?",
        category: "treatment",
        priority: "high" as const,
        reasoning: "Understanding treatment choices is essential for informed decision making"
      },
      {
        question: "How will this affect my daily life and activities?",
        category: "lifestyle",
        priority: "medium" as const,
        reasoning: "Practical impact assessment helps with planning and expectations"
      },
      {
        question: "What should I monitor and when should I contact you?",
        category: "followup",
        priority: "high" as const,
        reasoning: "Knowing warning signs ensures timely medical attention"
      }
    ];

    // Add IDs
    const questions = questionsData.map((q, i) => ({
      id: `q-${Date.now()}-${i}`,
      ...q,
    }));

    return NextResponse.json({
      appointmentType: upcomingAppt?.appointmentType || "General Consultation",
      providerSpecialty: upcomingAppt?.providerSpecialty || providers[0]?.specialty || "Primary Care",
      questions,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate questions" },
      { status: 500 }
    );
  }
}
