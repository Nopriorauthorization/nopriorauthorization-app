import { NextRequest, NextResponse } from 'next/server';

// Lab Result Data Types
type LabResult = {
  id: string;
  testName: string;
  normalizedTestName: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'low' | 'normal' | 'high';
  collectionDate: string;
  sourceDocumentId: string;
  trendDirection: 'up' | 'down' | 'stable';
  insightTags: string[];
  familyContextTags: string[];
  providerNote?: string;
  plainExplanation?: string;
  clinicalContext?: string;
  familyRelevance?: string;
  watchItems?: string[];
};

type LabDocument = {
  id: string;
  fileName: string;
  uploadDate: string;
  labResults: LabResult[];
  providerName?: string;
  facilityName?: string;
  summary: string;
};

// Mock OCR/PDF parsing function
async function parseLabDocument(file: File): Promise<LabResult[]> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock parsed results - in production this would use OCR/Google Vision/AWS Textract
  return [
    {
      id: `result-${Date.now()}-1`,
      testName: 'C-Reactive Protein',
      normalizedTestName: 'c_reactive_protein',
      value: 3.2,
      unit: 'mg/L',
      referenceRange: '< 3.0',
      status: 'high',
      collectionDate: new Date().toISOString().split('T')[0],
      sourceDocumentId: `doc-${Date.now()}`,
      trendDirection: 'up',
      insightTags: ['inflammation', 'cardiovascular_risk'],
      familyContextTags: ['cardiovascular_history'],
      plainExplanation: 'This marker measures inflammation in your body. It\'s like a general alarm that something might be causing inflammation.',
      clinicalContext: 'CRP is a non-specific marker of inflammation that can be elevated in many conditions including infections, autoimmune diseases, and cardiovascular disease.',
      familyRelevance: 'Given your family history of cardiovascular disease, this elevated CRP is clinically relevant and should be monitored.',
      watchItems: ['Monitor for symptoms of infection or autoimmune conditions', 'Consider cardiovascular risk assessment', 'Repeat testing in 3-6 months']
    },
    {
      id: `result-${Date.now()}-2`,
      testName: 'Hemoglobin A1c',
      normalizedTestName: 'hemoglobin_a1c',
      value: 5.8,
      unit: '%',
      referenceRange: '4.0-5.6',
      status: 'high',
      collectionDate: new Date().toISOString().split('T')[0],
      sourceDocumentId: `doc-${Date.now()}`,
      trendDirection: 'stable',
      insightTags: ['glucose_metabolism', 'diabetes_risk'],
      familyContextTags: ['diabetes_history'],
      plainExplanation: 'This shows your average blood sugar control over the past 2-3 months. It\'s like a report card for how well your body is managing sugar.',
      clinicalContext: 'HbA1c reflects average glycemia over the preceding 2-3 months and is used for diabetes diagnosis and monitoring.',
      familyRelevance: 'Your family history of diabetes makes this value noteworthy, even though it\'s only slightly elevated.',
      watchItems: ['Consider lifestyle modifications for blood sugar control', 'Monitor for diabetes symptoms', 'Repeat testing in 6 months']
    },
    {
      id: `result-${Date.now()}-3`,
      testName: 'Vitamin D',
      normalizedTestName: 'vitamin_d',
      value: 28,
      unit: 'ng/mL',
      referenceRange: '30-100',
      status: 'low',
      collectionDate: new Date().toISOString().split('T')[0],
      sourceDocumentId: `doc-${Date.now()}`,
      trendDirection: 'down',
      insightTags: ['bone_health', 'immune_function'],
      familyContextTags: ['osteoporosis_risk'],
      plainExplanation: 'Vitamin D helps your body absorb calcium and supports your immune system. It\'s like sunshine in a bottle.',
      clinicalContext: 'Vitamin D deficiency is associated with bone disorders, immune dysfunction, and various chronic conditions.',
      familyRelevance: 'Given your family history of osteoporosis, maintaining adequate vitamin D levels is important for bone health.',
      watchItems: ['Consider vitamin D supplementation', 'Increase sun exposure safely', 'Monitor calcium intake']
    }
  ];
}

// POST /api/vault/lab-decoder - Process lab documents
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const processedDocuments: LabDocument[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.includes('pdf') && !file.type.includes('image/')) {
        continue; // Skip invalid files
      }

      // Parse the lab document
      const labResults = await parseLabDocument(file);

      // Create document record
      const document: LabDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        labResults,
        providerName: 'Metropolitan Lab Services', // Would be extracted from document
        facilityName: 'Metropolitan Lab Services', // Would be extracted from document
        summary: `Processed ${labResults.length} lab results from ${file.name}. ${labResults.filter(r => r.status !== 'normal').length} values outside normal range.`
      };

      processedDocuments.push(document);
    }

    return NextResponse.json({
      success: true,
      documents: processedDocuments,
      message: `Successfully processed ${processedDocuments.length} lab documents`
    });

  } catch (error) {
    console.error('Lab decoder processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process lab documents' },
      { status: 500 }
    );
  }
}

// GET /api/vault/lab-decoder - Get user's lab history
export async function GET() {
  try {
    // Mock lab history - in production this would come from database
    const mockHistory: LabDocument[] = [
      {
        id: 'doc-001',
        fileName: 'comprehensive-metabolic-panel.pdf',
        uploadDate: '2024-01-15T10:30:00Z',
        labResults: [],
        providerName: 'Dr. Sarah Johnson',
        facilityName: 'Metropolitan Lab Services',
        summary: 'Comprehensive metabolic panel with notable findings in inflammation markers.'
      }
    ];

    return NextResponse.json({
      success: true,
      history: mockHistory
    });

  } catch (error) {
    console.error('Lab decoder history error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve lab history' },
      { status: 500 }
    );
  }
}