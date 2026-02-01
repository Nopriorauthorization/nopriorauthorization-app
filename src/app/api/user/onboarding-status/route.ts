export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check onboarding status
    const userMemory = await prisma.userMemory.findUnique({
      where: { userId: session.user.id },
      select: { onboardingCompleted: true },
    });

    return NextResponse.json({
      onboardingCompleted: userMemory?.onboardingCompleted ?? false,
    });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return NextResponse.json({ error: 'Failed to check onboarding status' }, { status: 500 });
  }
}