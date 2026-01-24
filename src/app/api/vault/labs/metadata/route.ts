import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { labId, labType, date, keyFindings, flaggedValues, confidenceLevel, vaultId } = body;

    // For now, we'll store in vault items with metadata
    // TODO: Create proper LabResult records when vault structure is complete
    const vaultItem = await prisma.vaultItem.upsert({
      where: {
        id: labId // Using labId as vault item ID for now
      },
      update: {
        title: `${labType} Results`,
        metadata: {
          labType,
          date,
          keyFindings,
          flaggedValues,
          confidenceLevel,
          updatedAt: new Date().toISOString()
        },
        updatedAt: new Date()
      },
      create: {
        id: labId,
        vaultId: vaultId || 'default_vault', // TODO: Get from user session
        type: 'LAB',
        title: `${labType} Results`,
        metadata: {
          labType,
          date,
          keyFindings,
          flaggedValues,
          confidenceLevel,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    });

    // Trigger blueprint insight generation
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/vault/blueprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vaultId: vaultId || 'default_vault' })
      });
    } catch (error) {
      console.error('Error triggering blueprint update:', error);
      // Don't fail the request if blueprint update fails
    }

    return NextResponse.json({ success: true, metadata: vaultItem });
  } catch (error) {
    console.error('Error saving lab metadata:', error);
    return NextResponse.json(
      { error: 'Failed to save lab metadata' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vaultId = searchParams.get('vaultId') || 'default_vault';

    // Get lab vault items
    const labItems = await prisma.vaultItem.findMany({
      where: {
        vaultId,
        type: 'LAB'
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(labItems.map(item => item.metadata));
  } catch (error) {
    console.error('Error fetching lab metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lab metadata' },
      { status: 500 }
    );
  }
}