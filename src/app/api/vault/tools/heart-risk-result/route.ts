import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { score, riskLevel, factors, calculatedAt } = body;

    // In a real application, this would save to a database
    // For now, we'll simulate saving and return success
    console.log('Saving heart risk assessment:', {
      score,
      riskLevel,
      factors,
      calculatedAt
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'Heart risk assessment saved successfully',
      data: {
        id: `hra_${Date.now()}`,
        score,
        riskLevel,
        factors,
        calculatedAt,
        savedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error saving heart risk assessment:', error);
    return NextResponse.json(
      { error: 'Failed to save heart risk assessment' },
      { status: 500 }
    );
  }
}