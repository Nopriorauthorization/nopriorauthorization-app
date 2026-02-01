import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { labId } = await request.json();

    if (!labId) {
      return NextResponse.json({ error: 'Lab ID required' }, { status: 400 });
    }

    // Get the vault item
    const vaultItem = await prisma.vaultItem.findUnique({
      where: { id: labId }
    });

    if (!vaultItem) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
    }

    // Simulate lab decoding (in production, this would use OCR/AI)
    const decodedResult = await simulateLabDecoding(vaultItem);

    // Update vault item with decoded results
    await prisma.vaultItem.update({
      where: { id: labId },
      data: {
        metadata: {
          ...vaultItem.metadata,
          decodedAt: new Date().toISOString(),
          status: 'decoded',
          decodedResult
        }
      }
    });

    // Create lab result records
    for (const test of decodedResult.flaggedValues) {
      await prisma.labResult.create({
        data: {
          vaultItemId: labId,
          testName: test.test,
          flags: [test.status],
          parsedSummary: `${test.test}: ${test.value} (${test.status})`
        }
      });
    }

    return NextResponse.json(decodedResult);

  } catch (error) {
    console.error('Decode error:', error);
    return NextResponse.json(
      { error: 'Failed to decode lab results' },
      { status: 500 }
    );
  }
}

async function simulateLabDecoding(vaultItem: any) {
  // Simulate different types of lab results based on the file name or metadata
  const fileName = vaultItem.metadata?.fileName?.toLowerCase() || '';
  const labDate = vaultItem.metadata?.labDate || new Date().toISOString().split('T')[0];

  // Mock lab decoding results
  const mockResults = {
    id: vaultItem.id,
    labType: detectLabType(fileName),
    date: labDate,
    keyFindings: [
      'Cholesterol levels within normal range',
      'Vitamin D levels optimal',
      'Iron levels slightly elevated'
    ],
    flaggedValues: [
      {
        test: 'Total Cholesterol',
        value: '185 mg/dL',
        range: '< 200 mg/dL',
        status: 'normal' as const
      },
      {
        test: 'HDL Cholesterol',
        value: '55 mg/dL',
        range: '> 40 mg/dL',
        status: 'normal' as const
      },
      {
        test: 'Vitamin D',
        value: '45 ng/mL',
        range: '30-100 ng/mL',
        status: 'normal' as const
      },
      {
        test: 'Iron',
        value: '160 mcg/dL',
        range: '30-150 mcg/dL',
        status: 'high' as const
      }
    ],
    confidenceLevel: 92,
    summary: 'Overall lab results are within normal ranges with one slightly elevated value that may warrant monitoring.',
    recommendations: [
      'Continue current healthy lifestyle habits',
      'Monitor iron levels in future blood work',
      'Consider vitamin D supplementation if levels decrease'
    ],
    createdAt: new Date().toISOString()
  };

  return mockResults;
}

function detectLabType(fileName: string): string {
  if (fileName.includes('cbc') || fileName.includes('complete blood')) {
    return 'Complete Blood Count (CBC)';
  }
  if (fileName.includes('lipid') || fileName.includes('cholesterol')) {
    return 'Lipid Panel';
  }
  if (fileName.includes('metabolic') || fileName.includes('comprehensive')) {
    return 'Comprehensive Metabolic Panel';
  }
  if (fileName.includes('thyroid')) {
    return 'Thyroid Panel';
  }
  return 'General Lab Panel';
}