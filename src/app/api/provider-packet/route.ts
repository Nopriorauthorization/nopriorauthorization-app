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
    const [supplements, treatments, user] = await Promise.all([
      prisma.supplementRecord.findMany({
        where: { userId, status: "CURRENT" },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.userTreatment.findMany({
        where: {
          userId,
          OR: [
            { startDate: { gte: oneYearAgo } },
            { updatedAt: { gte: oneYearAgo } },
          ],
        },
        include: { treatment: true, globalTreatment: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, metadata: true },
      }),
    ]);

    const governance = getGovernanceProfile(user?.metadata);

    const medicationList = supplements.map((item) => ({
      name: item.name,
      status: item.status,
      startDate: item.startDate?.toISOString() ?? null,
      endDate: item.endDate?.toISOString() ?? null,
      notes: item.notes ?? null,
    }));

    const treatmentList = treatments.map((item) => {
      const name =
        item.treatment?.name ??
        item.globalTreatment?.name ??
        "Unnamed treatment";
      return {
        name,
        status: item.status,
        startDate: item.startDate?.toISOString() ?? null,
        endDate: item.endDate?.toISOString() ?? null,
        notes: item.notes ?? null,
        updatedAt: item.updatedAt.toISOString(),
      };
    });

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
