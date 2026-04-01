export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { sendEmail } from "@/lib/email";
import { generateDeliveryEmail } from "@/lib/email/delivery-email";

export async function POST(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { purchaseId } = (await req.json()) as { purchaseId?: string };
  if (!purchaseId) {
    return NextResponse.json({ error: "purchaseId required" }, { status: 400 });
  }

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });
  if (!purchase) {
    return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  }
  if (!purchase.deliveryToken) {
    return NextResponse.json({ error: "No delivery token on record" }, { status: 400 });
  }

  const origin = process.env.NEXTAUTH_URL || "https://nopriorauthorization.com";
  const deliveryUrl = `${origin}/delivery/${purchase.deliveryToken}`;
  const priceDisplay = `$${(purchase.amountPaid / 100).toFixed(purchase.amountPaid % 100 === 0 ? 0 : 2)}`;

  const html = generateDeliveryEmail({
    customerName: purchase.customerName || undefined,
    productTitle: purchase.productTitle,
    deliveryUrl,
    price: priceDisplay,
  });

  const result = await sendEmail({
    to: purchase.customerEmail,
    subject: `Your ${purchase.productTitle} is ready! 🎉`,
    html,
  });

  if (result.success) {
    await prisma.purchase.update({
      where: { id: purchaseId },
      data: { deliveryEmailSent: true, deliveryEmailAt: new Date() },
    });
  }

  return NextResponse.json({ success: result.success });
}
