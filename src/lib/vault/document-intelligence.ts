/**
 * NPA Phase 3: Document Intelligence
 * 
 * COMPLIANCE STATEMENT (REQUIRED):
 * "This feature organizes and displays information exactly as provided by healthcare documents.
 * It does not interpret, diagnose, or provide medical advice."
 * 
 * ABSOLUTE GUARDRAILS:
 * ❌ NO diagnosis
 * ❌ NO treatment recommendations
 * ❌ NO interpretation of lab values
 * ❌ NO "abnormal", "concerning", "high", "low" labels
 * ❌ NO "you should..." statements
 * 
 * ✅ ALLOWED:
 * - Extract text as-written
 * - Classify document types
 * - Organize information by section
 * - Display exactly what clinicians wrote
 */

import type { NpaDocumentCategory } from "@prisma/client";

// ============================================
// DOCUMENT CLASSIFICATION ENGINE
// ============================================

export type DocumentType =
  | "visit_summary"
  | "lab_report"
  | "imaging_report"
  | "discharge_summary"
  | "medication_list"
  | "referral"
  | "insurance"
  | "immunization_record"
  | "procedure_note"
  | "other";

interface ClassificationResult {
  documentType: DocumentType;
  confidence: number;
  matchedPatterns: string[];
  reasoning: string;
}

// Pattern matchers for document classification
const CLASSIFICATION_PATTERNS: Record<
  DocumentType,
  { keywords: string[]; phrases: string[]; weight: number }
> = {
  visit_summary: {
    keywords: [
      "visit",
      "appointment",
      "office",
      "clinic",
      "encounter",
      "consultation",
      "progress",
      "follow-up",
      "followup",
      "checkup",
    ],
    phrases: [
      "after visit summary",
      "visit summary",
      "office visit",
      "clinical visit",
      "encounter summary",
      "progress note",
      "soap note",
      "chief complaint",
      "history of present illness",
      "review of systems",
      "physical examination",
      "assessment and plan",
    ],
    weight: 1,
  },
  lab_report: {
    keywords: [
      "lab",
      "laboratory",
      "blood",
      "serum",
      "plasma",
      "urine",
      "specimen",
      "chemistry",
      "hematology",
      "pathology",
    ],
    phrases: [
      "lab results",
      "laboratory report",
      "blood work",
      "test results",
      "complete blood count",
      "cbc",
      "metabolic panel",
      "lipid panel",
      "hemoglobin a1c",
      "thyroid panel",
      "urinalysis",
      "reference range",
      "collected date",
    ],
    weight: 1,
  },
  imaging_report: {
    keywords: [
      "imaging",
      "radiology",
      "radiologist",
      "scan",
      "x-ray",
      "xray",
      "mri",
      "ct",
      "ultrasound",
      "mammogram",
      "dexa",
    ],
    phrases: [
      "imaging report",
      "radiology report",
      "diagnostic imaging",
      "ct scan",
      "mri scan",
      "x-ray report",
      "ultrasound report",
      "impression:",
      "findings:",
      "technique:",
      "comparison:",
      "clinical indication",
    ],
    weight: 1,
  },
  discharge_summary: {
    keywords: [
      "discharge",
      "hospital",
      "inpatient",
      "admission",
      "hospitalization",
      "emergency",
      "er",
      "ed",
    ],
    phrases: [
      "discharge summary",
      "discharge instructions",
      "hospital discharge",
      "admission date",
      "discharge date",
      "length of stay",
      "discharge diagnosis",
      "discharge medications",
      "follow-up appointments",
      "emergency department",
      "urgent care",
    ],
    weight: 1.2,
  },
  medication_list: {
    keywords: [
      "medication",
      "medications",
      "medicine",
      "prescription",
      "rx",
      "drug",
      "pharmacy",
    ],
    phrases: [
      "medication list",
      "current medications",
      "active medications",
      "prescription list",
      "medication reconciliation",
      "take as directed",
      "refills remaining",
      "dosage",
      "frequency",
    ],
    weight: 1,
  },
  referral: {
    keywords: ["referral", "refer", "specialist", "consultation", "consult"],
    phrases: [
      "referral request",
      "referral to",
      "referred to",
      "specialist referral",
      "consultation request",
      "reason for referral",
      "referring provider",
    ],
    weight: 1,
  },
  insurance: {
    keywords: [
      "insurance",
      "coverage",
      "claim",
      "eob",
      "benefits",
      "copay",
      "deductible",
      "member",
      "policy",
    ],
    phrases: [
      "explanation of benefits",
      "insurance card",
      "member id",
      "group number",
      "coverage summary",
      "claim number",
      "amount billed",
      "amount paid",
      "patient responsibility",
    ],
    weight: 1,
  },
  immunization_record: {
    keywords: [
      "immunization",
      "vaccine",
      "vaccination",
      "shot",
      "inoculation",
      "booster",
    ],
    phrases: [
      "immunization record",
      "vaccination record",
      "vaccine history",
      "date administered",
      "lot number",
      "manufacturer",
      "next due date",
      "covid vaccine",
      "flu shot",
    ],
    weight: 1,
  },
  procedure_note: {
    keywords: [
      "procedure",
      "surgery",
      "surgical",
      "operation",
      "biopsy",
      "colonoscopy",
      "endoscopy",
    ],
    phrases: [
      "procedure note",
      "operative report",
      "surgical report",
      "pre-procedure",
      "post-procedure",
      "anesthesia",
      "informed consent",
      "complications",
      "specimens",
    ],
    weight: 1,
  },
  other: {
    keywords: [],
    phrases: [],
    weight: 0.5,
  },
};

/**
 * Classify a document based on filename and extracted text
 * Returns document type with confidence score
 */
export function classifyDocument(
  filename: string,
  extractedText: string
): ClassificationResult {
  const combinedText = `${filename} ${extractedText}`.toLowerCase();
  const scores: Record<DocumentType, { score: number; matches: string[] }> = {
    visit_summary: { score: 0, matches: [] },
    lab_report: { score: 0, matches: [] },
    imaging_report: { score: 0, matches: [] },
    discharge_summary: { score: 0, matches: [] },
    medication_list: { score: 0, matches: [] },
    referral: { score: 0, matches: [] },
    insurance: { score: 0, matches: [] },
    immunization_record: { score: 0, matches: [] },
    procedure_note: { score: 0, matches: [] },
    other: { score: 0, matches: [] },
  };

  // Score each document type
  for (const [docType, patterns] of Object.entries(CLASSIFICATION_PATTERNS)) {
    const type = docType as DocumentType;
    let score = 0;
    const matches: string[] = [];

    // Check phrases (higher weight)
    for (const phrase of patterns.phrases) {
      if (combinedText.includes(phrase)) {
        score += 3 * patterns.weight;
        matches.push(phrase);
      }
    }

    // Check keywords (lower weight)
    for (const keyword of patterns.keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const keywordMatches = combinedText.match(regex);
      if (keywordMatches) {
        score += keywordMatches.length * patterns.weight;
        if (!matches.includes(keyword)) {
          matches.push(keyword);
        }
      }
    }

    scores[type] = { score, matches };
  }

  // Find best match
  const sortedScores = Object.entries(scores)
    .filter(([type]) => type !== "other")
    .sort((a, b) => b[1].score - a[1].score);

  const bestMatch = sortedScores[0];
  const secondMatch = sortedScores[1];

  // Require meaningful confidence
  if (!bestMatch || bestMatch[1].score < 2) {
    return {
      documentType: "other",
      confidence: 0.3,
      matchedPatterns: [],
      reasoning: "No specific document patterns detected",
    };
  }

  // Calculate confidence based on score difference
  const scoreDiff = bestMatch[1].score - (secondMatch?.[1].score || 0);
  const confidence = Math.min(0.95, 0.5 + scoreDiff * 0.1);

  return {
    documentType: bestMatch[0] as DocumentType,
    confidence,
    matchedPatterns: bestMatch[1].matches.slice(0, 5),
    reasoning: `Matched patterns: ${bestMatch[1].matches.slice(0, 3).join(", ")}`,
  };
}

// ============================================
// SECTION DETECTION (AS-WRITTEN ONLY)
// ============================================

export interface DocumentSections {
  medications?: string;
  allergies?: string;
  diagnoses?: string;
  procedures?: string;
  labResults?: string;
  vitalSigns?: string;
  assessmentPlan?: string;
  instructions?: string;
  providerNotes?: string;
  rawText: string;
}

// Section header patterns (exactly as they appear in clinical documents)
const SECTION_PATTERNS: Array<{
  key: keyof Omit<DocumentSections, "rawText">;
  headers: RegExp[];
  endMarkers: RegExp[];
}> = [
  {
    key: "medications",
    headers: [
      /(?:^|\n)\s*(?:current\s+)?medications?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*active\s+medications?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*medication\s+list\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*discharge\s+medications?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*home\s+medications?\s*:?\s*(?:\n|$)/i,
    ],
    endMarkers: [/(?:^|\n)\s*(?:allergies|diagnos|problem|vital|assessment|plan|instruction|note)/i],
  },
  {
    key: "allergies",
    headers: [
      /(?:^|\n)\s*allergies?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*(?:drug\s+)?allergies?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*allergy\s+list\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*adverse\s+reactions?\s*:?\s*(?:\n|$)/i,
    ],
    endMarkers: [/(?:^|\n)\s*(?:medications?|diagnos|problem|vital|assessment|plan|instruction|note)/i],
  },
  {
    key: "diagnoses",
    headers: [
      /(?:^|\n)\s*diagnos[ei]s?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*(?:active\s+)?problems?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*problem\s+list\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*(?:discharge\s+)?diagnos[ei]s?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*principal\s+diagnos[ei]s?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*secondary\s+diagnos[ei]s?\s*:?\s*(?:\n|$)/i,
    ],
    endMarkers: [/(?:^|\n)\s*(?:medications?|allergies|procedure|vital|assessment|plan|instruction|note)/i],
  },
  {
    key: "procedures",
    headers: [
      /(?:^|\n)\s*procedures?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*procedures?\s+performed\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*surgical\s+procedures?\s*:?\s*(?:\n|$)/i,
    ],
    endMarkers: [/(?:^|\n)\s*(?:medications?|allergies|diagnos|vital|assessment|plan|instruction|note)/i],
  },
  {
    key: "labResults",
    headers: [
      /(?:^|\n)\s*lab(?:oratory)?\s+results?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*test\s+results?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*labs?\s*:?\s*(?:\n|$)/i,
    ],
    endMarkers: [/(?:^|\n)\s*(?:medications?|allergies|diagnos|vital|assessment|plan|instruction|note|impression)/i],
  },
  {
    key: "vitalSigns",
    headers: [
      /(?:^|\n)\s*vital\s+signs?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*vitals?\s*:?\s*(?:\n|$)/i,
    ],
    endMarkers: [/(?:^|\n)\s*(?:medications?|allergies|diagnos|procedure|assessment|plan|instruction|note)/i],
  },
  {
    key: "assessmentPlan",
    headers: [
      /(?:^|\n)\s*assessment\s*(?:and|&)?\s*plan\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*assessment\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*plan\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*impression\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*clinical\s+impression\s*:?\s*(?:\n|$)/i,
    ],
    endMarkers: [/(?:^|\n)\s*(?:instruction|follow-?up|signature|provider|electronically\s+signed)/i],
  },
  {
    key: "instructions",
    headers: [
      /(?:^|\n)\s*instructions?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*patient\s+instructions?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*discharge\s+instructions?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*follow-?up\s+instructions?\s*:?\s*(?:\n|$)/i,
    ],
    endMarkers: [/(?:^|\n)\s*(?:signature|provider|electronically\s+signed|printed\s+by)/i],
  },
  {
    key: "providerNotes",
    headers: [
      /(?:^|\n)\s*(?:provider|physician|clinician)\s+notes?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*clinical\s+notes?\s*:?\s*(?:\n|$)/i,
      /(?:^|\n)\s*notes?\s*:?\s*(?:\n|$)/i,
    ],
    endMarkers: [/(?:^|\n)\s*(?:signature|electronically\s+signed|printed\s+by)/i],
  },
];

/**
 * Extract sections from clinical document text
 * Only extracts sections that are explicitly present - NO inference
 */
export function extractSections(text: string): DocumentSections {
  const sections: DocumentSections = {
    rawText: text,
  };

  for (const { key, headers, endMarkers } of SECTION_PATTERNS) {
    for (const headerPattern of headers) {
      const headerMatch = text.match(headerPattern);
      if (headerMatch && headerMatch.index !== undefined) {
        // Find the start of the section content
        const sectionStart = headerMatch.index + headerMatch[0].length;

        // Find where this section ends (next section or end of text)
        let sectionEnd = text.length;
        for (const endPattern of endMarkers) {
          const endMatch = text.slice(sectionStart).match(endPattern);
          if (endMatch && endMatch.index !== undefined) {
            const potentialEnd = sectionStart + endMatch.index;
            if (potentialEnd < sectionEnd) {
              sectionEnd = potentialEnd;
            }
          }
        }

        // Extract and clean the section content
        const sectionContent = text
          .slice(sectionStart, sectionEnd)
          .trim();

        // Only include if there's meaningful content
        if (sectionContent.length > 5) {
          sections[key] = sectionContent;
          break; // Found this section, move to next
        }
      }
    }
  }

  return sections;
}

// ============================================
// DATE EXTRACTION
// ============================================

/**
 * Extract date of care from document text
 * Uses multiple patterns to find the most relevant date
 */
export function extractDateOfCare(text: string): Date | null {
  // Patterns for common date formats with context
  const datePatterns = [
    // "Date of Service: MM/DD/YYYY"
    /date\s+of\s+(?:service|visit|encounter|care)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    // "Visit Date: MM/DD/YYYY"
    /visit\s+date\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    // "Collected: MM/DD/YYYY" (labs)
    /collected\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    // "Admission Date: MM/DD/YYYY"
    /admission\s+date\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    // "Discharge Date: MM/DD/YYYY"
    /discharge\s+date\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    // "Date: MM/DD/YYYY" at start of line
    /(?:^|\n)\s*date\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    // Written dates "January 15, 2024"
    /(?:date\s+of\s+(?:service|visit|care)\s*:?\s*)?(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})/i,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        // Handle written month format
        if (match[1] && isNaN(parseInt(match[1]))) {
          const months: Record<string, number> = {
            january: 0, february: 1, march: 2, april: 3,
            may: 4, june: 5, july: 6, august: 7,
            september: 8, october: 9, november: 10, december: 11,
          };
          const month = months[match[1].toLowerCase()];
          const day = parseInt(match[2]);
          const year = parseInt(match[3]);
          return new Date(year, month, day);
        }

        // Handle numeric format
        const dateStr = match[1];
        const parts = dateStr.split(/[\/\-]/);
        if (parts.length === 3) {
          let [month, day, year] = parts.map((p) => parseInt(p));
          // Handle 2-digit year
          if (year < 100) {
            year += year > 50 ? 1900 : 2000;
          }
          return new Date(year, month - 1, day);
        }
      } catch {
        continue;
      }
    }
  }

  return null;
}

// ============================================
// PROVIDER/SOURCE EXTRACTION
// ============================================

/**
 * Extract provider and facility information
 */
export function extractProviderInfo(text: string): {
  providerName?: string;
  facilityName?: string;
  department?: string;
} {
  const result: {
    providerName?: string;
    facilityName?: string;
    department?: string;
  } = {};

  // Provider patterns
  const providerPatterns = [
    /(?:provider|physician|doctor|attending|seen\s+by)\s*:?\s*(?:dr\.?\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
    /(?:dr\.?\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+),?\s+(?:md|do|np|pa)/i,
  ];

  for (const pattern of providerPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.providerName = match[1].trim();
      break;
    }
  }

  // Facility patterns
  const facilityPatterns = [
    /(?:facility|hospital|clinic|medical\s+center)\s*:?\s*([A-Z][A-Za-z\s]+(?:Hospital|Medical|Health|Clinic|Center))/i,
  ];

  for (const pattern of facilityPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.facilityName = match[1].trim();
      break;
    }
  }

  // Department patterns
  const deptPatterns = [
    /(?:department|dept\.?|unit)\s*:?\s*([A-Za-z\s]+?)(?:\n|$)/i,
  ];

  for (const pattern of deptPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.department = match[1].trim();
      break;
    }
  }

  return result;
}

// ============================================
// FULL DOCUMENT PROCESSING
// ============================================

export interface ProcessedDocument {
  documentType: DocumentType;
  classification: ClassificationResult;
  sections: DocumentSections;
  dateOfCare: Date | null;
  providerInfo: {
    providerName?: string;
    facilityName?: string;
    department?: string;
  };
  processingTimestamp: Date;
  complianceNotice: string;
}

/**
 * Process a document completely
 * Returns structured data WITHOUT any medical interpretation
 */
export function processDocument(
  filename: string,
  extractedText: string
): ProcessedDocument {
  const classification = classifyDocument(filename, extractedText);
  const sections = extractSections(extractedText);
  const dateOfCare = extractDateOfCare(extractedText);
  const providerInfo = extractProviderInfo(extractedText);

  return {
    documentType: classification.documentType,
    classification,
    sections,
    dateOfCare,
    providerInfo,
    processingTimestamp: new Date(),
    complianceNotice:
      "This feature organizes and displays information exactly as provided by healthcare documents. It does not interpret, diagnose, or provide medical advice.",
  };
}

// ============================================
// USER-FRIENDLY LABELING (NO INTERPRETATION)
// ============================================

export const SAFE_LABELS: Record<string, string> = {
  medications: "Medications Listed",
  allergies: "Allergies Reported",
  diagnoses: "Reported Diagnoses",
  procedures: "Procedures Listed",
  labResults: "Lab Results (as reported)",
  vitalSigns: "Vital Signs Recorded",
  assessmentPlan: "Provider Notes",
  instructions: "Instructions Given",
  providerNotes: "Clinical Notes",
};

/**
 * Get display-safe label for a section
 */
export function getSafeLabel(sectionKey: string): string {
  return SAFE_LABELS[sectionKey] || "Document Section";
}

/**
 * Get display info for document type
 */
export function getDocumentTypeDisplay(docType: DocumentType): {
  label: string;
  icon: string;
  description: string;
} {
  const displays: Record<DocumentType, { label: string; icon: string; description: string }> = {
    visit_summary: {
      label: "Visit Summary",
      icon: "📋",
      description: "Summary from a healthcare visit",
    },
    lab_report: {
      label: "Lab Report",
      icon: "🧪",
      description: "Laboratory test results",
    },
    imaging_report: {
      label: "Imaging Report",
      icon: "📊",
      description: "Radiology or imaging study results",
    },
    discharge_summary: {
      label: "Discharge Summary",
      icon: "🏥",
      description: "Hospital or facility discharge documentation",
    },
    medication_list: {
      label: "Medication List",
      icon: "💊",
      description: "Current or historical medication records",
    },
    referral: {
      label: "Referral",
      icon: "📤",
      description: "Specialist or service referral",
    },
    insurance: {
      label: "Insurance Document",
      icon: "📑",
      description: "Insurance card or coverage document",
    },
    immunization_record: {
      label: "Immunization Record",
      icon: "💉",
      description: "Vaccination history",
    },
    procedure_note: {
      label: "Procedure Note",
      icon: "⚕️",
      description: "Documentation of a medical procedure",
    },
    other: {
      label: "Health Document",
      icon: "📄",
      description: "General health-related document",
    },
  };

  return displays[docType] || displays.other;
}
