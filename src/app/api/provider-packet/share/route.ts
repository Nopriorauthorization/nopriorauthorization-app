export const dynamic = "force-dynamic";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { logAccess, getRequestMetadata } from "@/lib/audit-log";
import { getOrCreateAnonId } from "@/lib/memory/userMemory";
import {
  resolveProviderPacketIdentity,
} from "@/lib/provider-packet/server";
import {
  ProviderPacketPayload,
  ProviderPacketTemplate,
} from "@/lib/provider-packet/types";

const EXPIRES_OPTIONS: Record<string, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

const TEMPLATE_MAP: Record<string, ProviderPacketTemplate> = {
  primary: "primary",
  specialist: "specialist",
  urgent: "urgent",
};

const PRISMA_TEMPLATE_MAP: Record<
  ProviderPacketTemplate,
  "PRIMARY" | "SPECIALIST" | "URGENT"
> = {
  primary: "PRIMARY",
  specialist: "SPECIALIST",
  urgent: "URGENT",
};

function normalizeTemplate(
  input: unknown
): ProviderPacketTemplate | undefined {
  if (typeof input !== "string") return undefined;
  return TEMPLATE_MAP[input.toLowerCase()] ?? undefined;
}

function normalizeExpires(value: unknown): string {
  if (typeof value !== "string") return "7d";
  return Object.keys(EXPIRES_OPTIONS).includes(value) ? value : "7d";
}

function buildPayload(body: any): ProviderPacketPayload {
  const payload: ProviderPacketPayload = {
    visitReason: (body?.visitReason ?? "").toString().trim(),
    topConcerns: [],
  };

  const concernsInput = body?.topConcerns;
  const rawConcerns: string[] = [];
  if (Array.isArray(concernsInput)) {
    concernsInput.forEach((item) => {
      if (typeof item === "string") {
        rawConcerns.push(item.trim());
      }
    });
  } else if (typeof concernsInput === "string") {
    concernsInput
      .split(/[\r\n,]+/)
      .map((item) => item.trim())
      .forEach((value) => {
        if (value) rawConcerns.push(value);
      });
  }
  payload.topConcerns = rawConcerns.filter(Boolean).slice(0, 3);

  if (body?.questions) {
    payload.questions = body.questions.toString().trim();
  }
  if (body?.allergies) {
    payload.allergies = body.allergies.toString().trim();
  }
  if (body?.conditions) {
    payload.conditions = body.conditions.toString().trim();
  }
  if (body?.medications) {
    payload.medications = body.medications.toString().trim();
  }
  if (body?.supplements) {
    payload.supplements = body.supplements.toString().trim();
  }
  if (body?.labs) {
    payload.labs = body.labs.toString().trim();
  }
  if (body?.vitals) {
    payload.vitals = body.vitals.toString().trim();
  }

  if (Array.isArray(body?.treatments)) {
    payload.treatments = body.treatments
      .map((treatment: any) => {
        if (!treatment?.name) return null;
        return {
          name: treatment.name.toString().trim(),
          status:
            typeof treatment.status === "string"
              ? treatment.status.trim()
              : undefined,
          notes:
            typeof treatment.notes === "string"
              ? treatment.notes.trim()
              : undefined,
        };
      })
      .filter(Boolean);
  }

  return payload;
}

export async function POST(request: NextRequest) {
  const identity = await resolveProviderPacketIdentity(request);
  const hasUser = Boolean(identity.userId);
  
  // HIPAA CRITICAL: Consent enforcement before sharing
  if (hasUser && identity.userId) {
    const user = await prisma.user.findUnique({
      where: { id: identity.userId },
      select: { consentToShareClinicalSummary: true },
    });
    
    if (!user?.consentToShareClinicalSummary) {
      return NextResponse.json(
        { error: "You must consent to share your clinical summary before creating a share link." },
        { status: 403 }
      );
    }
  }
  const existingAnonId = request.cookies.get("npa_uid")?.value ?? null;
  const anonId =
    identity.anonId ||
    (!hasUser ? getOrCreateAnonId(existingAnonId) : null);

  if (!hasUser && !anonId) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const template =
    normalizeTemplate(body?.template) ?? ("primary" as ProviderPacketTemplate);
  const expiresToken = normalizeExpires(body?.expiresIn);
  const expiresMs = EXPIRES_OPTIONS[expiresToken];
  const payloadBody = buildPayload(body?.payload ?? {});

  if (!payloadBody.visitReason) {
    return NextResponse.json(
      { error: "Visit reason is required for the Provider Packet." },
      { status: 400 }
    );
  }

  const packet = await prisma.providerPacket.create({
    data: {
      userId: hasUser ? identity.userId ?? undefined : undefined,
      anonId: hasUser ? undefined : anonId ?? undefined,
      template: PRISMA_TEMPLATE_MAP[template],
      payload: payloadBody,
    },
  });

  const expiresAt = new Date(Date.now() + expiresMs);
  const token = randomUUID();
  await prisma.providerPacketLink.create({
    data: {
      token,
      packetId: packet.id,
      expiresAt,
    },
  });

  // HIPAA CRITICAL: Log share creation
  const { ipAddress, userAgent } = getRequestMetadata(request);
  await logAccess({
    actorId: identity.userId || null,
    subjectUserId: identity.userId || null,
    action: "SHARE",
    resourceType: "PROVIDER_PACKET",
    resourceId: packet.id,
    ipAddress,
    userAgent,
    metadata: { expiresAt: expiresAt.toISOString(), template },
  });

  const response = NextResponse.json({
    url: `${request.nextUrl.origin}/api/provider-packet/share/${token}`,
    token,
    expiresAt: expiresAt.toISOString(),
    packetId: packet.id,
  });

  if (!hasUser && !existingAnonId && anonId) {
    response.cookies.set("npa_uid", anonId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}
