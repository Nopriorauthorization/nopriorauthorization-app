import { NextRequest, NextResponse } from 'next/server';
import { BlueprintIntelligenceEngine } from '@/lib/services/blueprint-intelligence';

const intelligenceEngine = new BlueprintIntelligenceEngine();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vaultId = searchParams.get('vaultId') || 'default_vault';

    const insights = await intelligenceEngine.getInsights(vaultId);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error fetching blueprint insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blueprint insights' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const vaultId = body.vaultId || 'default_vault';

    const insights = await intelligenceEngine.generateInsights(vaultId || 'default_vault');

    return NextResponse.json({ success: true, insights });
  } catch (error) {
    console.error('Error generating blueprint insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate blueprint insights' },
      { status: 500 }
    );
  }
}