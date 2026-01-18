import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const shareLink = await prisma.providerPacketLink.findUnique({
    where: { token: params.token },
    include: { packet: true },
  });

  if (
    !shareLink ||
    shareLink.revokedAt ||
    shareLink.expiresAt.getTime() < Date.now() ||
    !shareLink.packet
  ) {
    return NextResponse.json(
      { error: "This provider packet link is no longer available." },
      { status: 410 }
    );
  }

  await prisma.providerPacketAccessLog.create({
    data: {
      providerPacketLinkId: shareLink.id,
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: request.headers.get("user-agent") ?? null,
    },
  });

  return NextResponse.json(
    {
      error:
        "Provider packet PDF generation is temporarily unavailable (pdfkit dependency pending). Please try again later.",
    },
    {
      status: 501,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
