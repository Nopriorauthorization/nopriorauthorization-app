import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { overallRiskScore, riskLevel, highRiskConditions, familyMembers, age, gender, ethnicity, calculatedAt } = body;

    // In a real application, this would save to a database
    // For now, we'll simulate saving and return success
    console.log('Saving genetic risk assessment:', {
      overallRiskScore,
      riskLevel,
      highRiskConditions,
      familyMembersCount: familyMembers.length,
      age,
      gender,
      ethnicity,
      calculatedAt
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'Genetic risk assessment saved successfully',
      data: {
        id: `gr_${Date.now()}`,
        overallRiskScore,
        riskLevel,
        highRiskConditions,
        familyMembers,
        age,
        gender,
        ethnicity,
        calculatedAt,
        savedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error saving genetic risk assessment:', error);
    return NextResponse.json(
      { error: 'Failed to save genetic risk assessment' },
      { status: 500 }
    );
  }
}