// Drug interaction detection utility
// Uses OpenAI to analyze medications and detect potential interactions

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Medication = {
  name: string;
  dosage?: string;
  frequency?: string;
};

type DrugInteraction = {
  type: "interaction" | "contraindication" | "timing" | "safety";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  medications: string[];
};

export async function detectDrugInteractions(
  medications: Medication[]
): Promise<DrugInteraction[]> {
  if (medications.length < 2) {
    return []; // Need at least 2 medications to check interactions
  }

  try {
    const medicationList = medications
      .map((m) => `${m.name}${m.dosage ? ` (${m.dosage})` : ""}`)
      .join(", ");

    const prompt = `You are a medical safety AI. Analyze the following medications for potential drug interactions, contraindications, timing conflicts, and safety concerns.

Medications: ${medicationList}

Identify any:
1. Drug-drug interactions (critical, warning, or info level)
2. Contraindications
3. Timing conflicts (should be taken at different times)
4. Safety concerns (food interactions, etc.)

Return a JSON array of issues. Each issue should have:
- type: "interaction" | "contraindication" | "timing" | "safety"
- severity: "critical" | "warning" | "info"
- title: Brief title (e.g., "Ibuprofen + Aspirin Interaction")
- description: Clear explanation of the concern
- medications: Array of medication names involved

Only include clinically significant interactions. Return empty array if no interactions found.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a medical safety AI specialized in drug interactions. Always provide accurate, evidence-based information. Format responses as JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3, // Low temperature for medical accuracy
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return [];
    }

    const parsed = JSON.parse(content);
    const interactions = parsed.interactions || parsed.issues || [];

    return interactions;
  } catch (error) {
    console.error("Error detecting drug interactions:", error);
    return [];
  }
}

// Parse medications from document text using AI
export async function extractMedicationsFromText(
  text: string
): Promise<Medication[]> {
  try {
    const prompt = `Extract all medication names from the following medical document. Include dosage and frequency if mentioned.

Document text: ${text.substring(0, 3000)} // Limit text length

Return a JSON array of medications. Each should have:
- name: medication name
- dosage: dosage if mentioned (e.g., "10mg", "500 units")
- frequency: frequency if mentioned (e.g., "twice daily", "as needed")

Only include actual medications (prescription or OTC drugs). Exclude procedures, conditions, or supplements unless they're important for interactions.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a medical document parser. Extract medication information accurately. Format as JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return [];
    }

    const parsed = JSON.parse(content);
    const medications = parsed.medications || [];

    return medications;
  } catch (error) {
    console.error("Error extracting medications:", error);
    return [];
  }
}

// Common drug interactions database (simplified)
// This can be replaced with FDA API or a comprehensive database
export const COMMON_INTERACTIONS: Record<string, DrugInteraction> = {
  "warfarin-nsaids": {
    type: "interaction",
    severity: "critical",
    title: "Warfarin + NSAIDs - Bleeding Risk",
    description:
      "Taking warfarin with NSAIDs (like ibuprofen, aspirin) significantly increases bleeding risk. Consult your doctor before combining these medications.",
    medications: ["warfarin", "ibuprofen", "aspirin", "naproxen"],
  },
  "ssri-nsaids": {
    type: "interaction",
    severity: "warning",
    title: "SSRI + NSAIDs - GI Bleeding Risk",
    description:
      "SSRIs combined with NSAIDs may increase risk of gastrointestinal bleeding. Monitor for symptoms and discuss with your provider.",
    medications: [
      "sertraline",
      "fluoxetine",
      "ibuprofen",
      "aspirin",
      "naproxen",
    ],
  },
  "statin-grapefruit": {
    type: "safety",
    severity: "warning",
    title: "Statin Medications + Grapefruit",
    description:
      "Grapefruit and grapefruit juice can increase statin levels in your blood, raising the risk of side effects. Avoid grapefruit while taking statins.",
    medications: ["atorvastatin", "simvastatin", "lovastatin"],
  },
};
