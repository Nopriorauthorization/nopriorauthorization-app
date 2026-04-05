import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import {
  LEAD_MAGNET_FILES,
  verifyLeadMagnetToken,
} from "@/lib/shop/lead-magnet-token";

export const dynamic = "force-dynamic";

/**
 * Serves email-gated lead magnet HTML from delivery-assets only (not public/).
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("t")?.trim();
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const grant = verifyLeadMagnetToken(token);
  if (!grant) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 403 });
  }

  const fileName = LEAD_MAGNET_FILES[grant.magnet];
  if (!fileName) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const absPath = path.join(process.cwd(), "delivery-assets", "forms", fileName);
  if (!fs.existsSync(absPath)) {
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
