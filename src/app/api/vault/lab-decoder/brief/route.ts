import { NextRequest, NextResponse } from 'next/server';

type ProviderBrief = {
  id: string;
  title: string;
  recipientType: 'insurance' | 'specialist' | 'primary_care';
  content: {
    patientInfo: {
      name: string;
      dob: string;
      dateGenerated: string;
    };
    clinicalSummary: string;
    keyFindings: string[];
    trends: string[];
    familyHistory: string[];
    recommendations: string[];
    supportingData: string[];
  };
  formattedContent: string;
  generatedAt: string;
};

// POST /api/vault/lab-decoder/brief - Generate provider brief
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      recipientType = 'insurance',
      patientName = '[Patient Name]',
      patientDob = '[Date of Birth]',
      includeTrends = true,
      includeFamilyHistory = true,
      customNotes = ''
    } = body;

    // Generate brief based on type
    const brief: ProviderBrief = {
      id: `brief-${Date.now()}`,
      title: `${recipientType === 'insurance' ? 'Insurance Appeal' : recipientType === 'specialist' ? 'Specialist Consultation' : 'Primary Care Update'} Brief`,
      recipientType: recipientType as 'insurance' | 'specialist' | 'primary_care',
      content: {
        patientInfo: {
          name: patientName,
          dob: patientDob,
          dateGenerated: new Date().toLocaleDateString()
        },
        clinicalSummary: 'Patient presents with abnormal lab findings requiring clinical correlation and intervention.',
        keyFindings: [
          'C-Reactive Protein: 3.2 mg/L (High, reference <3.0 mg/L)',
          'Vitamin D: 28 ng/mL (Low, reference 30-100 ng/mL)',
          'Hemoglobin A1c: 5.8% (High, reference 4.0-5.6%)'
        ],
        trends: includeTrends ? [
          'CRP trending upward over 6 months (1.2 → 2.1 → 3.2 mg/L)',
          'Vitamin D declining steadily (35 → 32 → 28 ng/mL)',
          'HbA1c stable to slightly elevated (5.6 → 5.7 → 5.8%)'
        ] : [],
        familyHistory: includeFamilyHistory ? [
          'Family history of cardiovascular disease (father diagnosed at age 55)',
          'Family history of osteoporosis (maternal grandmother)',
          'Family history of type 2 diabetes (paternal uncle)'
        ] : [],
        recommendations: [
          'Further evaluation for source of inflammation',
          'Vitamin D supplementation and retesting',
          'Glucose monitoring and lifestyle counseling',
          'Consider cardiovascular risk assessment'
        ],
        supportingData: [
          'Lab results from Metropolitan Lab Services, collected January 15, 2024',
          'Previous lab results from July 15, 2023 and October 15, 2023',
          'Family medical history documented in patient records'
        ]
      },
      formattedContent: generateFormattedBrief({
        recipientType: recipientType as 'insurance' | 'specialist' | 'primary_care',
        patientName,
        patientDob,
        includeTrends,
        includeFamilyHistory,
        customNotes
      }),
      generatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      brief,
      message: 'Provider brief generated successfully'
    });

  } catch (error) {
    console.error('Provider brief generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate provider brief' },
      { status: 500 }
    );
  }
}

function generateFormattedBrief(options: {
  recipientType: 'insurance' | 'specialist' | 'primary_care';
  patientName: string;
  patientDob: string;
  includeTrends: boolean;
  includeFamilyHistory: boolean;
  customNotes: string;
}): string {
  const { recipientType, patientName, patientDob, includeTrends, includeFamilyHistory, customNotes } = options;

  let brief = '';

  // Header
  brief += `${recipientType === 'insurance' ? 'INSURANCE APPEAL' : recipientType === 'specialist' ? 'SPECIALIST CONSULTATION' : 'PRIMARY CARE UPDATE'} BRIEF\n\n`;

  // Patient Information
  brief += `PATIENT INFORMATION\n`;
  brief += `Name: ${patientName}\n`;
  brief += `Date of Birth: ${patientDob}\n`;
  brief += `Date Generated: ${new Date().toLocaleDateString()}\n\n`;

  // Clinical Summary
  brief += `CLINICAL SUMMARY\n`;
  brief += `Patient presents with abnormal laboratory findings requiring clinical correlation and intervention. `;
  brief += `Multiple markers show concerning trends that warrant comprehensive evaluation.\n\n`;

  // Key Findings
  brief += `KEY LABORATORY FINDINGS\n`;
  brief += `• C-Reactive Protein: 3.2 mg/L (High, reference range <3.0 mg/L)\n`;
  brief += `• Vitamin D: 28 ng/mL (Low, reference range 30-100 ng/mL)\n`;
  brief += `• Hemoglobin A1c: 5.8% (High, reference range 4.0-5.6%)\n\n`;

  // Trends (if included)
  if (includeTrends) {
    brief += `LABORATORY TRENDS\n`;
    brief += `• CRP trending upward over 6 months (1.2 → 2.1 → 3.2 mg/L)\n`;
    brief += `• Vitamin D declining steadily (35 → 32 → 28 ng/mL)\n`;
    brief += `• HbA1c stable to slightly elevated (5.6 → 5.7 → 5.8%)\n\n`;
  }

  // Family History (if included)
  if (includeFamilyHistory) {
    brief += `FAMILY MEDICAL HISTORY\n`;
    brief += `• Cardiovascular disease (father diagnosed at age 55)\n`;
    brief += `• Osteoporosis (maternal grandmother)\n`;
    brief += `• Type 2 diabetes (paternal uncle)\n\n`;
  }

  // Clinical Recommendations
  brief += `CLINICAL RECOMMENDATIONS\n`;
  brief += `1. Further evaluation for source of systemic inflammation\n`;
  brief += `2. Vitamin D supplementation with retesting in 8-12 weeks\n`;
  brief += `3. Glucose monitoring and lifestyle counseling\n`;
  brief += `4. Cardiovascular risk assessment given family history\n\n`;

  // Supporting Data
  brief += `SUPPORTING DATA\n`;
  brief += `• Laboratory results from Metropolitan Lab Services\n`;
  brief += `• Collection date: January 15, 2024\n`;
  brief += `• Previous results from July 15, 2023 and October 15, 2023\n`;
  brief += `• Family medical history documented in patient records\n\n`;

  // Custom Notes
  if (customNotes) {
    brief += `ADDITIONAL NOTES\n`;
    brief += `${customNotes}\n\n`;
  }

  // Medical Necessity Statement (for insurance)
  if (recipientType === 'insurance') {
    brief += `MEDICAL NECESSITY STATEMENT\n`;
    brief += `The patient's laboratory abnormalities, combined with family history and trending patterns, `;
    brief += `demonstrate medical necessity for the requested evaluation and intervention. `;
    brief += `Timely assessment is required to prevent progression of potential underlying conditions.\n\n`;
  }

  // Provider Signature Line
  brief += `Respectfully submitted,\n\n`;
  brief += `[Provider Name]\n`;
  brief += `[Credentials]\n`;
  brief += `[Contact Information]\n`;
  brief += `[Date]\n`;

  return brief;
}

// GET /api/vault/lab-decoder/brief - Get brief history
export async function GET() {
  try {
    // Mock brief history - in production this would come from database
    const mockBriefs: ProviderBrief[] = [
      {
        id: 'brief-001',
        title: 'Insurance Appeal Brief',
        recipientType: 'insurance',
        content: {
          patientInfo: { name: 'John Doe', dob: '01/15/1985', dateGenerated: '01/20/2024' },
          clinicalSummary: 'Abnormal lab findings requiring intervention',
          keyFindings: ['CRP: 3.2 mg/L (High)', 'Vitamin D: 28 ng/mL (Low)'],
          trends: ['CRP trending up', 'Vitamin D declining'],
          familyHistory: ['Cardiovascular disease', 'Osteoporosis'],
          recommendations: ['Further evaluation needed'],
          supportingData: ['Lab results from MLS']
        },
        formattedContent: 'Formatted brief content...',
        generatedAt: '2024-01-20T10:30:00Z'
      }
    ];

    return NextResponse.json({
      success: true,
      briefs: mockBriefs
    });

  } catch (error) {
    console.error('Brief history error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve brief history' },
      { status: 500 }
    );
  }
}