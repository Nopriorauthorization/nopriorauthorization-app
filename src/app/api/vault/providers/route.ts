import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

// GET /api/vault/providers - List all user providers
export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId 
      ? { userId: identity.userId } 
      : { anonId: identity.anonId };

    const providers = await prisma.provider.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ providers });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

// POST /api/vault/providers - Create new provider
export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, specialty, phone, email, address, notes, tags } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Provider name is required" },
        { status: 400 }
      );
    }

    const provider = await prisma.provider.create({
      data: {
        name,
        specialty: specialty || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        notes: notes || null,
        tags: tags || [],
        userId: identity.userId || null,
        anonId: identity.anonId || null,
      },
    });

    return NextResponse.json({ provider }, { status: 201 });
  } catch (error) {
    console.error("Error creating provider:", error);
    return NextResponse.json(
      { error: "Failed to create provider" },
      { status: 500 }
    );
  }
}
