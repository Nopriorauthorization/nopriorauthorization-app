import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  const admin = await getAdminUser();
  
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { requestId } = params;

  const dataRequest = await prisma.dataRequest.findUnique({
    where: { id: requestId },
    include: {
      user: {
        select: { id: true, email: true, name: true, createdAt: true },
      },
    },
  });

  if (!dataRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  // Get admin details
  const adminIds = [dataRequest.fulfilledBy, dataRequest.cancelledBy].filter(Boolean) as string[];
  const admins = await prisma.user.findMany({
    where: { id: { in: adminIds } },
    select: { id: true, email: true, name: true },
  });
  const adminMap = new Map(admins.map(u => [u.id, u]));

  return NextResponse.json({
    request: {
      id: dataRequest.id,
      user: dataRequest.user,
      requestType: dataRequest.requestType,
      status: dataRequest.status,
      requestedAt: dataRequest.requestedAt,
      fulfilledAt: dataRequest.fulfilledAt,
      fulfilledBy: dataRequest.fulfilledBy ? adminMap.get(dataRequest.fulfilledBy) : null,
      cancelledAt: dataRequest.cancelledAt,
      cancelledBy: dataRequest.cancelledBy ? adminMap.get(dataRequest.cancelledBy) : null,
      cancellationReason: dataRequest.cancellationReason,
      notes: dataRequest.notes,
    },
  });
}
