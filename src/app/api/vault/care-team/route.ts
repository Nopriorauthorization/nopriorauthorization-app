import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

// GET: List all care team members
export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId
      ? { userId: identity.userId }
      : { anonId: identity.anonId };

    const members = await prisma.careTeamMember.findMany({
      where,
      orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
    });

    // Get linked provider details for each member
    const membersWithProviders = await Promise.all(
      members.map(async (member) => {
        if (member.linkedProviders && member.linkedProviders.length > 0) {
          const providers = await prisma.provider.findMany({
            where: {
              id: { in: member.linkedProviders },
              ...where,
            },
            select: {
              id: true,
              name: true,
              specialty: true,
              phone: true,
              email: true,
            },
          });
          return { ...member, providers };
        }
        return { ...member, providers: [] };
      })
    );

    // Get appointment counts per member
    const membersWithCounts = await Promise.all(
      membersWithProviders.map(async (member) => {
        const appointmentCount = await prisma.appointment.count({
          where: {
            ...where,
            providerName: member.name,
          },
        });
        return { ...member, appointmentCount };
      })
    );

    const isEmpty = members.length === 0;
    const primaryMember = members.find((m) => m.isPrimary);
    const specialistCount = members.filter((m) => !m.isPrimary).length;

    return NextResponse.json({
      members: membersWithCounts,
      isEmpty,
      stats: {
        total: members.length,
        hasPrimary: !!primaryMember,
        specialistCount,
      },
    });
  } catch (error) {
    console.error("Error fetching care team:", error);
    return NextResponse.json(
      { error: "Failed to fetch care team" },
      { status: 500 }
    );
  }
}

// POST: Create new care team member
export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      role,
      specialty,
      organization,
      phone,
      email,
      notes,
      isPrimary,
      linkedProviders,
    } = body;

    if (!name || !role) {
      return NextResponse.json(
        { error: "Name and role are required" },
        { status: 400 }
      );
    }

    const member = await prisma.careTeamMember.create({
      data: {
        userId: identity.userId || undefined,
        anonId: identity.anonId || undefined,
        name,
        role,
        specialty: specialty || undefined,
        organization: organization || undefined,
        phone: phone || undefined,
        email: email || undefined,
        notes: notes || undefined,
        isPrimary: isPrimary || false,
        linkedProviders: linkedProviders || [],
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Error creating care team member:", error);
    return NextResponse.json(
      { error: "Failed to create care team member" },
      { status: 500 }
    );
  }
}
