export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAdminUser } from "@/lib/auth/admin-guard";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
  });

  const header = "date,email,name,product_slug,product_title,amount_usd,delivered,stripe_session\n";
  const rows = purchases
    .map((p) =>
      [
        new Date(p.createdAt).toISOString().slice(0, 10),
        `"${p.customerEmail}"`,
        `"${p.customerName || ""}"`,
        p.productSlug,
        `"${p.productTitle}"`,
        (p.amountPaid / 100).toFixed(2),
        p.deliveryEmailSent ? "yes" : "no",
        p.stripeSessionId,
      ].join(","),
    )
    .join("\n");

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="npa-purchases-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
