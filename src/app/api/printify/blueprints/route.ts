export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrintifyClient } from "@/lib/printify/client";
import { authorizePrintifyAdminOrKey } from "@/lib/printify/route-auth";
import { PRINTIFY_PRODUCTS } from "@/lib/printify/products";

const DEFAULT_BLUEPRINT_IDS = Array.from(
  new Set(
    Object.values(PRINTIFY_PRODUCTS).map((p) => p.blueprint_id).concat([74, 1193]),
  ),
).sort((a, b) => a - b);

export async function GET(req: NextRequest) {
  if (!authorizePrintifyAdminOrKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let client: PrintifyClient;
  try {
    client = new PrintifyClient();
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 503 },
    );
  }

  const q = req.nextUrl.searchParams.get("ids");
  const ids = q
    ? q
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0)
    : DEFAULT_BLUEPRINT_IDS;

  const out: Record<string, unknown> = {};
  for (const id of ids) {
    const [bp, pp] = await Promise.all([
      client.getBlueprint(id),
      client.getBlueprintPrintProviders(id),
    ]);
    out[String(id)] = {
      blueprint: bp.ok ? bp.data : { error: bp.text, status: bp.status },
      print_providers: pp.ok ? pp.data : { error: pp.text, status: pp.status },
    };
  }

  return NextResponse.json({ ok: true, blueprints: out });
}
