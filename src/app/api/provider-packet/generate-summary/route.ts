import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required to generate clinical summary." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { packetData, providerNotes } = body;

    if (!packetData) {
      return NextResponse.json(
        { error: "Clinical data is required" },
        { status: 400 }
      );
    }

    // Generate AI clinical summary
    const clinicalSummary = await generateClinicalSummary(packetData, providerNotes);

    return NextResponse.json({
      summary: clinicalSummary,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to generate clinical summary:", error);
    return NextResponse.json(
      { error: "Failed to generate clinical summary" },
      { status: 500 }
    );
  }
}

async function generateClinicalSummary(packetData: any, providerNotes?: string): Promise<string> {
  const prompt = `You are a clinical documentation specialist tasked with generating a professional clinical summary for healthcare providers. Based on the patient's submitted information, create a concise, clinically-relevant summary that highlights key findings, concerns, and considerations.

Patient Information:
${formatPatientDataForAI(packetData)}

${providerNotes ? `Provider Notes: ${providerNotes}` : ''}

Please generate a professional clinical summary that includes:
1. Patient demographics and chief concern
2. Key clinical findings and history
3. Risk factors and safety considerations
4. Current medications and allergies
5. Patient priorities and goals
6. Clinical recommendations or next steps

Write this as a cohesive clinical narrative suitable for inclusion in medical records. Use professional medical terminology but keep it clear and actionable. Focus on information that would be most relevant to a healthcare provider preparing for a patient visit.

Return only the clinical summary text, no additional formatting or headers.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert clinical documentation assistant. Generate clear, professional clinical summaries based on patient data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.3, // Lower temperature for more consistent clinical writing
    });

    return completion.choices[0]?.message?.content?.trim() || "Unable to generate clinical summary at this time.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Clinical summary generation temporarily unavailable. Please review patient data manually.";
  }
}

function formatPatientDataForAI(packetData: any): string {
  const sections = [];

  // Personal Info
  if (packetData.personalInfo) {
    const { name, dob, height, weight, allergies } = packetData.personalInfo;
    let age = "";
    if (dob) {
      age = `, Age: ${Math.floor((Date.now() - new Date(dob).getTime()) / 3.15576e10)}`;
    }

    sections.push(`Personal Information:
- Name: ${name || 'Not provided'}${age}
- Height: ${height || 'Not provided'}
- Weight: ${weight || 'Not provided'}
- Allergies: ${allergies || 'None reported'}`);
  }

  // Chief Concern
  if (packetData.chiefConcern) {
    sections.push(`Chief Concern: ${packetData.chiefConcern}`);
  }

  // Primary Concerns
  if (packetData.primaryConcerns) {
    sections.push(`Primary Clinical Concerns: ${packetData.primaryConcerns}`);
  }

  // Patient Questions/Goals
  if (packetData.patientQuestions) {
    sections.push(`Patient Questions/Goals: ${packetData.patientQuestions}`);
  }

  // Current Medications
  if (packetData.currentMedications) {
    sections.push(`Current Medications: ${packetData.currentMedications}`);
  }

  // Supplements
  if (packetData.supplements) {
    sections.push(`Supplements: ${packetData.supplements}`);
  }

  // Medical History
  if (packetData.medicalHistory) {
    sections.push(`Medical History: ${packetData.medicalHistory}`);
  }

  // Labs/Vitals
  if (packetData.labsVitals) {
    sections.push(`Recent Labs/Vitals: ${packetData.labsVitals}`);
  }

  // Prior Therapies
  if (packetData.priorTherapies) {
    sections.push(`Prior Therapies/Treatments: ${packetData.priorTherapies}`);
  }

  return sections.join('\n\n');
}