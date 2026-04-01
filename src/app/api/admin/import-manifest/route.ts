export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import {
  persistDeliveryManifest,
  validateManifestPayload,
} from "@/lib/delivery/persist-manifest";

export async function POST(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = validateManifestPayload(body);
  if (!parsed.valid) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const incoming = parsed.manifest;

  try {
    const stats = await persistDeliveryManifest(incoming, {
      id: admin.id,
      email: admin.email ?? "admin",
    });

    return NextResponse.json({
      success: true,
      productId: incoming.productId,
      displayName: incoming.displayName,
      etsySku: incoming.etsySku,
      templatesTotal: stats.templatesTotal,
      templatesFilled: stats.templatesFilled,
      deliveryReady: stats.deliveryReady,
      message: stats.deliveryReady
        ? `${incoming.displayName} is fully imported and delivery-ready.`
        : `${incoming.displayName} imported with ${stats.templatesFilled}/${stats.templatesTotal} templates filled.`,
    });
  } catch (err) {
    console.error("[import-manifest] Failed to persist manifest:", err);
    return NextResponse.json(
      { error: "Failed to persist manifest import" },
      { status: 500 }
    );
  }
}
