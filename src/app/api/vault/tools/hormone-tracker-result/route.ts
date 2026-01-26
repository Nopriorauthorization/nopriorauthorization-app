import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lastPeriodStart, cycleLength, periodLength, currentCycleDay, regularity, cycleHealth, entries, calculatedAt } = body;

    // In a real application, this would save to a database
    // For now, we'll simulate saving and return success
    console.log('Saving hormone tracker data:', {
      lastPeriodStart,
      cycleLength,
      periodLength,
      currentCycleDay,
      regularity,
      cycleHealth,
      entriesCount: entries.length,
      calculatedAt
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'Hormone tracker data saved successfully',
      data: {
        id: `ht_${Date.now()}`,
        lastPeriodStart,
        cycleLength,
        periodLength,
        currentCycleDay,
        regularity,
        cycleHealth,
        entries,
        calculatedAt,
        savedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error saving hormone tracker data:', error);
    return NextResponse.json(
      { error: 'Failed to save hormone tracker data' },
      { status: 500 }
    );
  }
}