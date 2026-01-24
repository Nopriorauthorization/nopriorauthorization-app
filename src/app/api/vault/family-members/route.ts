import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, relationship, condition, relation, generation, ageOfOnset, vaultId } = body;

    const familyMember = await prisma.familyMember.create({
      data: {
        vaultId: vaultId || 'default_vault', // TODO: Get from user session
        relationship,
        conditionTags: condition ? [condition] : [],
        notes: relation ? `Relation: ${relation}, Generation: ${generation}, Age of onset: ${ageOfOnset}` : undefined
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

    return NextResponse.json({ success: true, member: familyMember });
  } catch (error) {
    console.error('Error saving family member:', error);
    return NextResponse.json(
      { error: 'Failed to save family member' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vaultId = searchParams.get('vaultId') || 'default_vault';

    const familyMembers = await prisma.familyMember.findMany({
      where: { vaultId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(familyMembers);
  } catch (error) {
    console.error('Error fetching family members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch family members' },
      { status: 500 }
    );
  }
}