export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { authorizePrintifyAdminOrKey } from "@/lib/printify/route-auth";
import {
  getPrintifyRowForSku,
  resolvePrintifySku,
} from "@/lib/printify/products";
import { submitPrintifyOrderForSku } from "@/lib/printify/submit-order";

const shippingSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().min(2),
  region: z.string().optional(),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  zip: z.string().min(2),
});

const bodySchema = z.object({
  sku: z.string().min(1),
  quantity: z.number().int().positive().max(99).default(1),
  shippingAddress: shippingSchema,
  customerName: z.string().optional(),
  email: z.string().email(),
  stripeSessionId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  if (!authorizePrintifyAdminOrKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { sku: rawSku, quantity, shippingAddress, customerName, email, stripeSessionId } =
    parsed.data;
  const sku = resolvePrintifySku(rawSku) || rawSku;
  if (!getPrintifyRowForSku(sku)) {
    return NextResponse.json({ error: "Unknown SKU for Printify" }, { status: 400 });
  }

  const shipping = {
    ...shippingAddress,
    email,
  };

  const externalId =
    stripeSessionId?.trim() ||
    `manual_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  const row = getPrintifyRowForSku(sku)!;
  const submitted = await submitPrintifyOrderForSku({
    sku,
    quantity,
    shipping,
    externalId,
    customerName: customerName ?? null,
    label: row.title,
  });

  if (!submitted.ok) {
    return NextResponse.json(
      { success: false, error: submitted.message, status: submitted.status },
      { status: submitted.status && submitted.status >= 400 ? submitted.status : 502 },
    );
  }

  if (stripeSessionId?.trim()) {
    await prisma.purchase.updateMany({
      where: { stripeSessionId: stripeSessionId.trim() },
      data: {
        printifyOrderId: submitted.printifyOrderId,
        fulfillmentType: "physical",
      },
    });
  }

  return NextResponse.json({
    success: true,
    printifyOrderId: submitted.printifyOrderId,
  });
}
