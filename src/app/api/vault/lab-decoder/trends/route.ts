import { NextRequest, NextResponse } from 'next/server';

type TrendData = {
  testName: string;
  values: { date: string; value: number; status: string }[];
  trend: 'rising' | 'falling' | 'stable' | 'fluctuating';
  insight: string;
  clinicalSignificance: string;
  familyContext?: string;
};

// GET /api/vault/lab-decoder/trends - Get lab trends over time
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testName = searchParams.get('test');
    const timeframe = searchParams.get('timeframe') || '6months';

    // Mock trend data - in production this would analyze historical lab data
    const mockTrends: TrendData[] = [
      {
        testName: 'C-Reactive Protein',
        values: [
          { date: '2023-07-15', value: 1.2, status: 'normal' },
          { date: '2023-10-15', value: 2.1, status: 'normal' },
          { date: '2024-01-15', value: 3.2, status: 'high' }
        ],
        trend: 'rising',
        insight: 'Gradual upward trend over 6 months, now in high range',
        clinicalSignificance: 'Progressive inflammation may indicate developing inflammatory condition or cardiovascular risk',
        familyContext: 'Family history of cardiovascular disease makes this trend clinically significant'
      },
      {
        testName: 'Vitamin D',
        values: [
          { date: '2023-07-15', value: 35, status: 'normal' },
          { date: '2023-10-15', value: 32, status: 'normal' },
          { date: '2024-01-15', value: 28, status: 'low' }
        ],
        trend: 'falling',
        insight: 'Declining levels, now deficient',
        clinicalSignificance: 'Vitamin D deficiency may impact bone health and immune function',
        familyContext: 'Family history of osteoporosis increases importance of maintaining adequate vitamin D'
      },
      {
        testName: 'Hemoglobin A1c',
        values: [
          { date: '2023-07-15', value: 5.6, status: 'normal' },
          { date: '2023-10-15', value: 5.7, status: 'normal' },
          { date: '2024-01-15', value: 5.8, status: 'high' }
        ],
        trend: 'rising',
        insight: 'Slight upward trend, approaching prediabetes range',
        clinicalSignificance: 'Early indication of glucose metabolism changes',
        familyContext: 'Family history of diabetes warrants close monitoring'
      }
    ];

    // Filter by test name if specified
    const filteredTrends = testName
      ? mockTrends.filter(trend => trend.testName.toLowerCase().includes(testName.toLowerCase()))
      : mockTrends;

    return NextResponse.json({
      success: true,
      trends: filteredTrends,
      timeframe,
      analysis: {
        totalMarkers: filteredTrends.length,
        concerningTrends: filteredTrends.filter(t => t.trend === 'rising').length,
        improvingTrends: filteredTrends.filter(t => t.trend === 'falling').length,
        summary: `Analysis of ${filteredTrends.length} lab markers shows ${filteredTrends.filter(t => t.trend !== 'stable').length} trending markers requiring attention.`
      }
    });

  } catch (error) {
    console.error('Lab trends error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve lab trends' },
      { status: 500 }
    );
  }
}