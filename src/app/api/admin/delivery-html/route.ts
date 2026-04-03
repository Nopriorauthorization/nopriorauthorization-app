import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { isFreePublicFormPath, resolveGatedFormFile } from "@/lib/delivery/form-access";

export const dynamic = "force-dynamic";

/**
 * Lets logged-in admins open gated HTML (delivery-assets) without a buyer token.
 * Public /forms/ lead magnets are still linked directly in the admin UI.
 */
export async function GET(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawPath = req.nextUrl.searchParams.get("path")?.trim();
  if (!rawPath || !rawPath.startsWith("/forms/") || !rawPath.endsWith(".html")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  if (isFreePublicFormPath(rawPath)) {
    return NextResponse.redirect(new URL(rawPath, req.nextUrl.origin), 307);
  }

  const abs = resolveGatedFormFile(rawPath);
  if (!abs) {
    return NextResponse.json({ error: "File not found in delivery assets" }, { status: 404 });
  }

  const html = fs.readFileSync(abs, "utf8");
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
