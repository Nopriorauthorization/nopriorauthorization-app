import { NextRequest, NextResponse } from 'next/server';

type LabInsight = {
  id: string;
  type: 'pattern' | 'risk' | 'family' | 'action';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  markers: string[];
  clinicalContext: string;
  recommendations: string[];
  familyContext?: string;
  evidence: string;
  generatedAt: string;
};

// GET /api/vault/lab-decoder/insights - Get AI-powered lab insights
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // pattern, risk, family, action
    const severity = searchParams.get('severity'); // low, medium, high, critical

    // Mock AI-generated insights - in production this would use ML models
    const mockInsights: LabInsight[] = [
      {
        id: 'insight-001',
        type: 'pattern',
        title: 'Multi-Marker Inflammation Pattern Detected',
        description: 'Three inflammatory markers (CRP, ESR, fibrinogen) have shifted together over the last 18 months, suggesting a coordinated inflammatory response.',
        severity: 'high',
        markers: ['C-Reactive Protein', 'Erythrocyte Sedimentation Rate', 'Fibrinogen'],
        clinicalContext: 'Coordinated elevation of multiple inflammatory markers suggests systemic inflammation that may be related to autoimmune conditions, chronic infection, or cardiovascular risk.',
        recommendations: [
          'Consider rheumatologic evaluation',
          'Monitor for symptoms of autoimmune conditions',
          'Repeat inflammatory markers in 3 months',
          'Consider cardiovascular risk assessment'
        ],
        familyContext: 'Family history of rheumatoid arthritis increases the clinical significance of this pattern.',
        evidence: 'Based on analysis of 18 months of lab data showing correlated elevation of acute phase reactants.',
        generatedAt: new Date().toISOString()
      },
      {
        id: 'insight-002',
        type: 'risk',
        title: 'Cardiovascular Risk Pattern Emerging',
        description: 'Combination of elevated CRP and declining HDL suggests increasing cardiovascular risk that aligns with family history.',
        severity: 'medium',
        markers: ['C-Reactive Protein', 'HDL Cholesterol'],
        clinicalContext: 'Elevated CRP combined with low HDL indicates heightened cardiovascular risk, particularly significant given family history.',
        recommendations: [
          'Consider advanced lipid testing',
          'Evaluate for metabolic syndrome',
          'Discuss aspirin prophylaxis with cardiologist',
          'Implement lifestyle modifications for cardiovascular health'
        ],
        familyContext: 'Family history of early cardiovascular disease makes this pattern particularly concerning.',
        evidence: 'CRP >3.0 mg/L combined with HDL <40 mg/dL in context of family history creates elevated 10-year cardiovascular risk.',
        generatedAt: new Date().toISOString()
      },
      {
        id: 'insight-003',
        type: 'family',
        title: 'Hereditary Risk Pattern Identified',
        description: 'Lab abnormalities align with known hereditary patterns in your family, suggesting genetic predisposition.',
        severity: 'high',
        markers: ['Vitamin D', 'Calcium', 'PTH'],
        clinicalContext: 'Pattern of vitamin D deficiency with secondary hyperparathyroidism suggests possible genetic predisposition to vitamin D metabolism issues.',
        recommendations: [
          'Genetic counseling for vitamin D metabolism disorders',
          'Higher dose vitamin D supplementation (under medical supervision)',
          'Monitor for bone density changes',
          'Consider family screening for vitamin D deficiency'
        ],
        familyContext: 'Family history of osteoporosis and vitamin D deficiency suggests hereditary vitamin D metabolism disorder.',
        evidence: 'Persistent vitamin D deficiency despite supplementation, combined with family history of similar issues.',
        generatedAt: new Date().toISOString()
      },
      {
        id: 'insight-004',
        type: 'action',
        title: 'Vitamin D Optimization Required',
        description: 'Vitamin D levels have declined steadily and are now deficient, requiring immediate intervention.',
        severity: 'medium',
        markers: ['Vitamin D'],
        clinicalContext: 'Vitamin D deficiency can impact bone health, immune function, and multiple chronic conditions.',
        recommendations: [
          'Start vitamin D supplementation (2000-5000 IU daily)',
          'Recheck levels in 8-12 weeks',
          'Consider calcium supplementation if deficient',
          'Safe sun exposure when possible',
          'Monitor for improvement in related symptoms'
        ],
        familyContext: 'Given family history of osteoporosis, maintaining adequate vitamin D is crucial for bone health.',
        evidence: 'Vitamin D level of 28 ng/mL (deficient) with documented decline over 6 months.',
        generatedAt: new Date().toISOString()
      }
    ];

    // Filter insights based on query parameters
    let filteredInsights = mockInsights;

    if (type) {
      filteredInsights = filteredInsights.filter(insight => insight.type === type);
    }

    if (severity) {
      filteredInsights = filteredInsights.filter(insight => insight.severity === severity);
    }

    // Sort by severity (critical first)
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    filteredInsights.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);

    return NextResponse.json({
      success: true,
      insights: filteredInsights,
      summary: {
        total: filteredInsights.length,
        critical: filteredInsights.filter(i => i.severity === 'critical').length,
        high: filteredInsights.filter(i => i.severity === 'high').length,
        medium: filteredInsights.filter(i => i.severity === 'medium').length,
        low: filteredInsights.filter(i => i.severity === 'low').length
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Lab insights error:', error);
    return NextResponse.json(
      { error: 'Failed to generate lab insights' },
      { status: 500 }
    );
  }
}