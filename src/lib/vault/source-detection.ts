import type { NpaDocumentSource, NpaDocumentCategory } from "@prisma/client";

/**
 * NPA Vault Source Detection
 * 
 * Detects document source system and category from filename patterns,
 * file content, and metadata.
 * 
 * NOTE: This is organization only, not interpretation.
 * No diagnosis, no treatment advice.
 */

interface SourceDetectionResult {
  source: NpaDocumentSource;
  sourceSystem: string | null;
  category: NpaDocumentCategory;
  confidence: number; // 0-1
}

// Pattern matchers for EHR systems
const EHR_PATTERNS: Array<{
  patterns: RegExp[];
  source: NpaDocumentSource;
  systemName: string;
}> = [
  {
    patterns: [/mychart/i, /epic/i, /mychartcentral/i],
    source: "EPIC_MYCHART",
    systemName: "Epic MyChart",
  },
  {
    patterns: [/cerner/i, /powerchart/i, /millennium/i],
    source: "CERNER",
    systemName: "Cerner PowerChart",
  },
  {
    patterns: [/athena/i, /athenahealth/i, /athenanet/i],
    source: "ATHENA",
    systemName: "athenahealth",
  },
  {
    patterns: [/allscripts/i, /touchworks/i, /professional\s*ehr/i],
    source: "ALLSCRIPTS",
    systemName: "Allscripts",
  },
  {
    patterns: [/meditech/i, /expanse/i],
    source: "MEDITECH",
    systemName: "MEDITECH",
  },
  {
    patterns: [/nextgen/i, /ng\s*healthcare/i],
    source: "NEXTGEN",
    systemName: "NextGen Healthcare",
  },
  {
    patterns: [/eclinicalworks/i, /ecw/i, /e-?clinicalworks/i],
    source: "ECW",
    systemName: "eClinicalWorks",
  },
  {
    patterns: [/labcorp/i, /quest\s*diagnostics/i, /bio\s*reference/i],
    source: "LAB_DIRECT",
    systemName: "Laboratory",
  },
  {
    patterns: [/radiology/i, /imaging\s*center/i, /mri\s*center/i, /x-?ray/i],
    source: "IMAGING_CENTER",
    systemName: "Imaging Center",
  },
  {
    patterns: [/cvs/i, /walgreens/i, /rite\s*aid/i, /pharmacy/i, /rx/i],
    source: "PHARMACY",
    systemName: "Pharmacy",
  },
  {
    patterns: [
      /insurance/i,
      /bcbs/i,
      /blue\s*cross/i,
      /aetna/i,
      /cigna/i,
      /united\s*healthcare/i,
      /humana/i,
      /anthem/i,
      /kaiser/i,
      /eob/i,
      /explanation\s*of\s*benefits/i,
    ],
    source: "INSURANCE",
    systemName: "Insurance",
  },
];

// Category patterns
const CATEGORY_PATTERNS: Array<{
  patterns: RegExp[];
  category: NpaDocumentCategory;
}> = [
  {
    patterns: [
      /lab\s*result/i,
      /blood\s*test/i,
      /cbc/i,
      /metabolic\s*panel/i,
      /lipid\s*panel/i,
      /a1c/i,
      /hemoglobin/i,
      /cholesterol/i,
      /glucose/i,
      /thyroid/i,
      /tsh/i,
    ],
    category: "LAB_RESULT",
  },
  {
    patterns: [
      /imaging\s*report/i,
      /radiology\s*report/i,
      /ct\s*scan/i,
      /mri\s*report/i,
      /x-?ray\s*report/i,
      /ultrasound\s*report/i,
      /mammogram/i,
      /findings/i,
    ],
    category: "IMAGING_REPORT",
  },
  {
    patterns: [
      /scan/i,
      /dicom/i,
      /\.dcm$/i,
      /ct\s*image/i,
      /mri\s*image/i,
    ],
    category: "IMAGING_SCAN",
  },
  {
    patterns: [
      /visit\s*summary/i,
      /after\s*visit\s*summary/i,
      /avs/i,
      /office\s*visit/i,
      /encounter\s*summary/i,
    ],
    category: "VISIT_SUMMARY",
  },
  {
    patterns: [
      /discharge\s*summary/i,
      /discharge\s*instructions/i,
      /hospital\s*discharge/i,
    ],
    category: "DISCHARGE_SUMMARY",
  },
  {
    patterns: [
      /medication\s*list/i,
      /med\s*list/i,
      /current\s*medications/i,
      /prescription/i,
    ],
    category: "MEDICATION_LIST",
  },
  {
    patterns: [
      /allergy/i,
      /allergies/i,
      /drug\s*allergy/i,
      /food\s*allergy/i,
    ],
    category: "ALLERGY_LIST",
  },
  {
    patterns: [
      /immunization/i,
      /vaccination/i,
      /vaccine/i,
      /shot\s*record/i,
      /covid\s*vaccine/i,
    ],
    category: "IMMUNIZATION_RECORD",
  },
  {
    patterns: [
      /procedure\s*note/i,
      /procedure\s*report/i,
      /colonoscopy/i,
      /endoscopy/i,
      /biopsy/i,
    ],
    category: "PROCEDURE_NOTE",
  },
  {
    patterns: [/operative\s*report/i, /surgery\s*note/i, /surgical\s*report/i],
    category: "OPERATIVE_REPORT",
  },
  {
    patterns: [/pathology/i, /biopsy\s*result/i, /cytology/i, /histology/i],
    category: "PATHOLOGY_REPORT",
  },
  {
    patterns: [/referral/i, /consult\s*request/i, /specialist\s*referral/i],
    category: "REFERRAL",
  },
  {
    patterns: [
      /insurance\s*card/i,
      /member\s*id\s*card/i,
      /health\s*plan\s*card/i,
    ],
    category: "INSURANCE_CARD",
  },
  {
    patterns: [
      /eob/i,
      /explanation\s*of\s*benefits/i,
      /claim\s*summary/i,
      /billing\s*statement/i,
    ],
    category: "INSURANCE_EOB",
  },
  {
    patterns: [/ccd/i, /ccda/i, /continuity\s*of\s*care/i, /c-?cda/i],
    category: "CCDA_CCD",
  },
  {
    patterns: [/care\s*plan/i, /treatment\s*plan/i, /care\s*coordination/i],
    category: "CARE_PLAN",
  },
  {
    patterns: [/consent/i, /authorization/i, /hipaa\s*form/i],
    category: "CONSENT_FORM",
  },
  {
    patterns: [
      /advance\s*directive/i,
      /living\s*will/i,
      /healthcare\s*proxy/i,
      /poa/i,
      /power\s*of\s*attorney/i,
    ],
    category: "ADVANCE_DIRECTIVE",
  },
];

/**
 * Detect source system from filename and content
 */
export function detectSource(
  filename: string,
  extractedText?: string | null
): { source: NpaDocumentSource; systemName: string | null; confidence: number } {
  const textToSearch = `${filename} ${extractedText || ""}`.toLowerCase();

  for (const ehrPattern of EHR_PATTERNS) {
    for (const pattern of ehrPattern.patterns) {
      if (pattern.test(textToSearch)) {
        return {
          source: ehrPattern.source,
          systemName: ehrPattern.systemName,
          confidence: 0.8,
        };
      }
    }
  }

  return {
    source: "PATIENT_UPLOAD",
    systemName: null,
    confidence: 0.5,
  };
}

/**
 * Detect document category from filename and content
 */
export function detectCategory(
  filename: string,
  mimeType: string,
  extractedText?: string | null
): { category: NpaDocumentCategory; confidence: number } {
  const textToSearch = `${filename} ${extractedText || ""}`.toLowerCase();

  // Check for CCDA/CCD XML files first
  if (
    mimeType === "application/xml" ||
    mimeType === "text/xml" ||
    filename.toLowerCase().endsWith(".xml")
  ) {
    if (
      textToSearch.includes("clinicaldocument") ||
      textToSearch.includes("cda") ||
      textToSearch.includes("ccda")
    ) {
      return { category: "CCDA_CCD", confidence: 0.9 };
    }
  }

  for (const catPattern of CATEGORY_PATTERNS) {
    for (const pattern of catPattern.patterns) {
      if (pattern.test(textToSearch)) {
        return {
          category: catPattern.category,
          confidence: 0.7,
        };
      }
    }
  }

  return {
    category: "OTHER",
    confidence: 0.3,
  };
}

/**
 * Full source detection combining all signals
 */
export function detectDocumentMetadata(
  filename: string,
  mimeType: string,
  extractedText?: string | null
): SourceDetectionResult {
  const sourceResult = detectSource(filename, extractedText);
  const categoryResult = detectCategory(filename, mimeType, extractedText);

  return {
    source: sourceResult.source,
    sourceSystem: sourceResult.systemName,
    category: categoryResult.category,
    confidence: (sourceResult.confidence + categoryResult.confidence) / 2,
  };
}

/**
 * Get supported MIME types for NPA Vault
 */
export const VAULT_SUPPORTED_MIME_TYPES = new Set([
  // PDF
  "application/pdf",
  // Images
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/tiff",
  // CCDA / CCD / XML
  "application/xml",
  "text/xml",
  "application/cda+xml",
  // FHIR (future)
  "application/fhir+json",
  "application/fhir+xml",
]);

/**
 * Check if a MIME type is supported
 */
export function isSupportedMimeType(mimeType: string): boolean {
  return VAULT_SUPPORTED_MIME_TYPES.has(mimeType.toLowerCase());
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    "application/pdf": ".pdf",
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/heic": ".heic",
    "image/heif": ".heif",
    "image/tiff": ".tiff",
    "application/xml": ".xml",
    "text/xml": ".xml",
    "application/cda+xml": ".xml",
    "application/fhir+json": ".json",
    "application/fhir+xml": ".xml",
  };

  return mimeToExt[mimeType.toLowerCase()] || ".bin";
}
