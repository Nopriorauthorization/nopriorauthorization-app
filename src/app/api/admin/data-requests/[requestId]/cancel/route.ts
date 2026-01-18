import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  const admin = await getAdminUser();
  
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { requestId } = params;
  const body = await request.json();
  const { reason } = body;

  if (!reason || reason.trim().length < 5) {
    return NextResponse.json(
      { error: "Cancellation reason required (min 5 characters)" },
      { status: 400 }
    );
  }

  const dataRequest = await prisma.dataRequest.findUnique({
    where: { id: requestId },
  });

  if (!dataRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (dataRequest.status !== "pending" && dataRequest.status !== "in_progress") {
    return NextResponse.json(
      { error: "Request already fulfilled or cancelled" },
      { status: 400 }
    );
  }

  const updated = await prisma.dataRequest.update({
    where: { id: requestId },
    data: {
      status: "cancelled",
      cancelledAt: new Date(),
      cancelledBy: admin.id,
      cancellationReason: reason,
    },
  });

  // Log admin action
  await prisma.accessLog.create({
    data: {
      actorId: admin.id,
      action: "DATA_REQUEST_CANCELLED",
      resourceType: "DATA_REQUEST",
      resourceId: requestId,
      metadata: {
        requestType: dataRequest.requestType,
        requestUserId: dataRequest.userId,
        reason,
      },
    },
  });

  return NextResponse.json({ success: true, request: updated });
}
