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
    const [appointments, documents, providers, snapshot] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          ...where,
          date: { gte: new Date() }, // Future appointments
        },
        orderBy: { date: "asc" },
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
          createdAt: true,
        },
      }),
      prisma.provider.findMany({
        where,
        orderBy: { lastVisit: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          specialty: true,
          lastVisit: true,
        },
      }),
      prisma.userMemory.findFirst({
        where,
        select: {
          medications: true,
          conditions: true,
          allergies: true,
          goals: true,
        },
      }),
    ]);

    // Build context for AI
    const context = {
      upcomingAppointment: appointments[0] || null,
      recentDocuments: documents.map((d) => ({
        category: d.category,
        title: d.title,
      })),
      providers: providers.map((p) => ({
        name: p.name,
        specialty: p.specialty,
      })),
      healthProfile: {
        medications: snapshot?.medications || [],
        conditions: snapshot?.conditions || [],
        allergies: snapshot?.allergies || [],
        goals: snapshot?.goals || [],
      },
    };

    // Generate questions using AI
    const prompt = `You are a patient advocate helping someone prepare for a medical appointment.

Context about the patient:
${context.upcomingAppointment ? `- Next appointment: ${context.upcomingAppointment.title} on ${new Date(context.upcomingAppointment.date).toLocaleDateString()}` : ""}
- Recent documents: ${context.recentDocuments.map((d) => d.category).join(", ")}
- Medications: ${context.healthProfile.medications.join(", ") || "None listed"}
- Conditions: ${context.healthProfile.conditions.join(", ") || "None listed"}
- Allergies: ${context.healthProfile.allergies.join(", ") || "None listed"}
- Health goals: ${context.healthProfile.goals.join(", ") || "Not specified"}

Generate 8-12 smart, specific questions this patient should ask their provider. Focus on:
1. Medication interactions and side effects
2. Treatment alternatives and options
3. Expected outcomes and timelines
4. Risks and contraindications
5. Cost and insurance coverage
6. Lifestyle considerations
7. Follow-up care and monitoring

For each question, provide:
- The question itself (clear, direct, easy to ask)
- Category (medication, treatment, cost, risks, outcomes, lifestyle, or followup)
- Priority (high, medium, or low)
- Brief reasoning (why this question matters for this patient)

Return ONLY a valid JSON array with this structure:
[
  {
    "question": "What are the potential interactions between [medication] and my current prescriptions?",
    "category": "medication",
    "priority": "high",
    "reasoning": "You're on multiple medications, so checking interactions is critical"
  }
]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a patient advocate assistant. Generate thoughtful, specific questions patients should ask their healthcare providers. Always return valid JSON arrays.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || "[]";

    // Parse AI response
    let questionsData: Array<{
      question: string;
      category: string;
      priority: "high" | "medium" | "low";
      reasoning?: string;
    }>;

    try {
      questionsData = JSON.parse(responseText);
    } catch (parseError) {
      // If parsing fails, extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        questionsData = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Failed to parse AI response");
      }
    }

    // Add IDs to questions
    const questions = questionsData.map((q, i) => ({
      id: `q-${Date.now()}-${i}`,
      ...q,
    }));

    return NextResponse.json({
      appointmentType: appointments[0]?.title || "General Consultation",
      providerSpecialty: providers[0]?.specialty || "Primary Care",
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
