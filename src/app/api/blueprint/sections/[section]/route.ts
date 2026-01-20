import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import { canEditBlueprint } from "@/lib/capabilities";

export const dynamic = "force-dynamic";

const VALID_SECTIONS = [
  "identityContext",
  "healthFoundations",
  "treatments",
  "timeline",
  "documents",
  "providers",
  "preparation",
] as const;

type BlueprintSection = typeof VALID_SECTIONS[number];

export async function PUT(
  request: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can edit blueprint
    if (!canEditBlueprint(session.user.id)) {
      return NextResponse.json(
        { error: "Blueprint editing requires subscription upgrade" },
        { status: 403 }
      );
    }

    const { section } = params;
    if (!VALID_SECTIONS.includes(section as BlueprintSection)) {
      return NextResponse.json(
        { error: "Invalid section" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { data } = body;

    // Build the update object
    const updateData: Record<string, any> = {
      [section]: data,
      updatedAt: new Date(),
    };

    // Upsert the blueprint
    const blueprint = await prisma.blueprint.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        [section]: data,
      },
    });

    return NextResponse.json({ success: true, section, data });
  } catch (error) {
    console.error(`Error updating blueprint section ${params.section}:`, error);
    return NextResponse.json(
      { error: "Failed to update blueprint section" },
      { status: 500 }
    );
  }
}