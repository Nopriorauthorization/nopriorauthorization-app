import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import { getGovernanceProfile } from "@/lib/governance/metadata";

export async function GET(_request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required to generate a provider packet." },
      { status: 401 }
    );
  }
  const userId = session.user.id;

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    const governance = getGovernanceProfile(null);

    const medicationList: any[] = []; // Supplements feature not yet implemented
    const treatmentList: any[] = []; // Treatments feature not yet implemented

    return NextResponse.json({
      patientName: user?.name ?? session.user.email ?? "Patient",
      email: session.user.email ?? null,
      generatedAt: new Date().toISOString(),
      allergies: governance.allergies,
      medications: medicationList,
      treatments: treatmentList,
      governance: {
        personalBio: governance.personalBio,
        bloodType: governance.bloodType,
        primaryHealthGoals: governance.primaryHealthGoals,
        dataPortability: governance.dataPortability,
      },
    });
  } catch (error) {
    console.error("Provider packet error:", error);
    return NextResponse.json(
      { error: "Unable to compile provider packet." },
      { status: 500 }
    );
  }
}
