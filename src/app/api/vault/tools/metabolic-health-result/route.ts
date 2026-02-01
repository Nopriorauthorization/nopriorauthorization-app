import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { score, healthLevel, markers, calculatedAt } = body;

    // In a real application, this would save to a database
    // For now, we'll simulate saving and return success
    console.log('Saving metabolic health assessment:', {
      score,
      healthLevel,
      markers,
      calculatedAt
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'Metabolic health assessment saved successfully',
      data: {
        id: `mhs_${Date.now()}`,
        score,
        healthLevel,
        markers,
        calculatedAt,
        savedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error saving metabolic health assessment:', error);
    return NextResponse.json(
      { error: 'Failed to save metabolic health assessment' },
      { status: 500 }
    );
  }
}