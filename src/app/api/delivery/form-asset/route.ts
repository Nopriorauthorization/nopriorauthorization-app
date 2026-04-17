import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyDeliveryToken } from "@/lib/delivery/token";

export const dynamic = "force-dynamic";

const SAFE_NAME = /^[a-zA-Z0-9._-]+\.(png|jpg|jpeg|gif|webp|svg)$/i;

function contentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const map: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  return map[ext] ?? "application/octet-stream";
}

/**
 * Serves a static file from delivery-assets/forms/ when the buyer has a valid
 * delivery token (same gate as /api/delivery/html). Used for images referenced
 * from gated HTML.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")?.trim();
  const f = req.nextUrl.searchParams.get("f")?.trim();
  if (!token || !verifyDeliveryToken(token)) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 403 });
  }
  if (!f || !SAFE_NAME.test(f)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const abs = path.join(process.cwd(), "delivery-assets", "forms", path.basename(f));
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buf = fs.readFileSync(abs);
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": contentType(f),
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
