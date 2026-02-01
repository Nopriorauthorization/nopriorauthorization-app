import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db";
import { canEditBlueprint } from "@/lib/capabilities";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can edit blueprint
    if (!canEditBlueprint(session.user.id)) {
      return NextResponse.json(
        { error: "Blueprint access requires subscription upgrade" },
        { status: 403 }
      );
    }

    const blueprint = await prisma.blueprint.findUnique({
      where: { userId: session.user.id },
    });

    if (!blueprint) {
      // Return empty blueprint structure
      return NextResponse.json({
        identityContext: null,
        healthFoundations: null,
        treatments: null,
        timeline: null,
        documents: null,
        providers: null,
        preparation: null,
      });
    }

    return NextResponse.json(blueprint);
  } catch (error) {
    console.error("Error fetching blueprint:", error);
    return NextResponse.json(
      { error: "Failed to fetch blueprint" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      identityContext,
      healthFoundations,
      treatments,
      timeline,
      documents,
      providers,
      preparation,
    } = body;

    // Upsert the blueprint
    const blueprint = await prisma.blueprint.upsert({
      where: { userId: session.user.id },
      update: {
        identityContext,
        healthFoundations,
        treatments,
        timeline,
        documents,
        providers,
        preparation,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        identityContext,
        healthFoundations,
        treatments,
        timeline,
        documents,
        providers,
        preparation,
      },
    });

    return NextResponse.json(blueprint);
  } catch (error) {
    console.error("Error saving blueprint:", error);
    return NextResponse.json(
      { error: "Failed to save blueprint" },
      { status: 500 }
    );
  }
}