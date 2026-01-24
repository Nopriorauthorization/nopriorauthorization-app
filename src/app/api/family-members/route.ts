import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const familyMembers = await prisma.familyMember.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ members: familyMembers });
  } catch (error) {
    console.error('Failed to fetch family members:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { relationship, sex, age, ageAtDeath, conditions, notes } = body;

    // Validate required fields
    if (!relationship || !sex) {
      return NextResponse.json({ error: 'Relationship and sex are required' }, { status: 400 });
    }

    // Validate relationship
    const validRelationships = ['parent', 'grandparent', 'sibling', 'child'];
    if (!validRelationships.includes(relationship)) {
      return NextResponse.json({ error: 'Invalid relationship' }, { status: 400 });
    }

    // Validate sex
    const validSexes = ['male', 'female', 'unknown'];
    if (!validSexes.includes(sex)) {
      return NextResponse.json({ error: 'Invalid sex' }, { status: 400 });
    }

    // Validate conditions
    const validConditions = [
      'Cardiovascular',
      'Metabolic / Diabetes',
      'Thyroid',
      'Cancer',
      'Autoimmune',
      'Neurological',
      'Mental Health',
      'Hormonal / Endocrine'
    ];

    if (conditions && !Array.isArray(conditions)) {
      return NextResponse.json({ error: 'Conditions must be an array' }, { status: 400 });
    }

    if (conditions && conditions.some((c: string) => !validConditions.includes(c))) {
      return NextResponse.json({ error: 'Invalid condition' }, { status: 400 });
    }

    const familyMember = await prisma.familyMember.create({
      data: {
        userId: session.user.id,
        relationship,
        sex,
        age: age ? parseInt(age) : null,
        ageAtDeath: ageAtDeath ? parseInt(ageAtDeath) : null,
        conditions: conditions || [],
        notes: notes || null
      }
    });

    return NextResponse.json({ member: familyMember }, { status: 201 });
  } catch (error) {
    console.error('Failed to create family member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}