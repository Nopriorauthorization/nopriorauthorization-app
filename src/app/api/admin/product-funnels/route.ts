export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { getShopProductBySlug, getShopProducts } from "@/lib/shop/products";
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

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const rows = await prisma.shopProductFunnel.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const categories = Array.from(
    new Set(getShopProducts().map((p) => p.category)),
  ).sort();

  return NextResponse.json({ funnels: rows, categories });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let body: {
    productSlug?: string | null;
    categoryDefault?: string | null;
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

  const productSlug = body.productSlug?.trim() || null;
  const categoryDefault = body.categoryDefault?.trim() || null;

  if ((productSlug && categoryDefault) || (!productSlug && !categoryDefault)) {
    return NextResponse.json(
      { error: "Set exactly one of productSlug or categoryDefault" },
      { status: 400 },
    );
  }

  if (productSlug && !getShopProductBySlug(productSlug)) {
    return NextResponse.json({ error: `Unknown product: ${productSlug}` }, { status: 400 });
  }

  const bumpSlugs = clampBumps(body.bumpSlugs ?? []);
  const postUpsellSlugs = clampUpsells(body.postUpsellSlugs ?? []);

  const bumpErr = validateSlugsExist(bumpSlugs, "bump");
  if (bumpErr) return NextResponse.json({ error: bumpErr }, { status: 400 });

  const upErr = validateSlugsExist(postUpsellSlugs, "upsell");
  if (upErr) return NextResponse.json({ error: upErr }, { status: 400 });

  const finalRedirect = normalizeFinalRedirect(body.finalRedirect ?? "post_purchase");

  try {
    const row = await prisma.shopProductFunnel.create({
      data: {
        productSlug,
        categoryDefault,
        enabled: body.enabled ?? true,
        useDedicatedLanding: body.useDedicatedLanding ?? true,
        bumpSlugs,
        postUpsellSlugs,
        finalRedirect,
      },
    });
    return NextResponse.json({ funnel: row });
  } catch (e) {
    console.error("[admin/product-funnels POST]", e);
    return NextResponse.json(
      { error: "Could not create funnel (duplicate product or category?)" },
      { status: 400 },
    );
  }
}
