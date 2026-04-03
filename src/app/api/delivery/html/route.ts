import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { getDeliveryProductBySlugAsync } from "@/lib/delivery/catalog";
import {
  isGatedFormPath,
  resolveGatedFormFile,
} from "@/lib/delivery/form-access";
import { verifyDeliveryToken } from "@/lib/delivery/token";

export const dynamic = "force-dynamic";

/**
 * Serves gated paid HTML (cheat sheets, etc.) only when a valid delivery token
 * is presented. Does not replace public lead magnets in /public/forms/.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")?.trim();
  const iRaw = req.nextUrl.searchParams.get("i");
  const index = iRaw === null || iRaw === "" ? 0 : parseInt(iRaw, 10);

  if (!token || Number.isNaN(index) || index < 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const grant = verifyDeliveryToken(token);
  if (!grant) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 403 });
  }

  const product = await getDeliveryProductBySlugAsync(grant.productSlug);
  if (!product || !product.templates[index]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const template = product.templates[index];
  const editUrl = template.editUrl;
  if (!editUrl || !isGatedFormPath(editUrl)) {
    return NextResponse.json(
      { error: "This asset is not served through this endpoint" },
      { status: 404 },
    );
  }

  const absPath = resolveGatedFormFile(editUrl);
  if (!absPath) {
    return NextResponse.json({ error: "File missing" }, { status: 500 });
  }

  const html = fs.readFileSync(absPath, "utf8");
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
