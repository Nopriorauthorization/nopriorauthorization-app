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

  // 🚨 HIPAA COMPLIANCE: External AI processing disabled
  // This function previously sent medication data to OpenAI without BAA
  console.warn("🚨 HIPAA COMPLIANCE: AI drug interaction analysis is temporarily unavailable to prevent PHI transmission to third-party services.");

  // Return basic local interaction checking using common interactions database
  const interactions: DrugInteraction[] = [];
  const medNames = medications.map(m => m.name.toLowerCase());

  // Check for warfarin + NSAIDs
  if (medNames.includes('warfarin') && medNames.some(name => ['ibuprofen', 'aspirin', 'naproxen'].includes(name))) {
    interactions.push(COMMON_INTERACTIONS['warfarin-nsaids']);
  }

  // Check for SSRI + NSAIDs
  if (medNames.some(name => ['sertraline', 'fluoxetine', 'paroxetine'].includes(name)) &&
      medNames.some(name => ['ibuprofen', 'aspirin', 'naproxen'].includes(name))) {
    interactions.push(COMMON_INTERACTIONS['ssri-nsaids']);
  }

  // Check for statin + grapefruit (though this is lifestyle, not drug-drug)
  if (medNames.some(name => ['atorvastatin', 'simvastatin', 'lovastatin'].includes(name))) {
    interactions.push(COMMON_INTERACTIONS['statin-grapefruit']);
  }

  return interactions;
}

// 🚨 HIPAA COMPLIANCE: External AI processing disabled
// This function previously sent medical document text to OpenAI without BAA
export async function extractMedicationsFromText(
  text: string
): Promise<Medication[]> {
  console.warn("🚨 HIPAA COMPLIANCE: AI medication extraction is temporarily unavailable to prevent PHI transmission to third-party services.");

  // Return empty array - manual entry required for compliance
  return [];
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
