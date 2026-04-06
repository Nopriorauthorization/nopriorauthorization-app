export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { getShopProductBySlug } from "@/lib/shop/products";
import { clampBumps, clampUpsells } from "@/lib/shop/funnel-resolve";
import { normalizeFinalRedirect } from "@/lib/shop/funnel-types";

function validateSlugsExist(slugs: string[], label: string): string | null {
  for (const s of slugs) {
    if (!getShopProductBySlug(s)) {
      return `Unknown ${label} SKU: ${s}`;
    }
  }
  return null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = params.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let body: {
    enabled?: boolean;
    useDedicatedLanding?: boolean;
    bumpSlugs?: string[];
    postUpsellSlugs?: string[];
    finalRedirect?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const existing = await prisma.shopProductFunnel.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: Prisma.ShopProductFunnelUpdateInput = {};

  if (typeof body.enabled === "boolean") data.enabled = body.enabled;
  if (typeof body.useDedicatedLanding === "boolean") {
    data.useDedicatedLanding = body.useDedicatedLanding;
  }
  if (body.bumpSlugs !== undefined) {
    const bumpSlugs = clampBumps(body.bumpSlugs);
    const err = validateSlugsExist(bumpSlugs, "bump");
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    data.bumpSlugs = bumpSlugs;
  }
  if (body.postUpsellSlugs !== undefined) {
    const postUpsellSlugs = clampUpsells(body.postUpsellSlugs);
    const err = validateSlugsExist(postUpsellSlugs, "upsell");
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    data.postUpsellSlugs = postUpsellSlugs;
  }
  if (body.finalRedirect !== undefined) {
    data.finalRedirect = normalizeFinalRedirect(body.finalRedirect);
  }

  const row = await prisma.shopProductFunnel.update({
    where: { id },
    data,
  });

  return NextResponse.json({ funnel: row });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = params.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await prisma.shopProductFunnel.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
