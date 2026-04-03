export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { uploadPublicSocialImage } from "@/lib/storage/supabase";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/**
 * POST /api/admin/social/upload-image
 * multipart/form-data: field "file" — returns { publicUrl, path }
 */
export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file field" }, { status: 400 });
    }
    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED.has(mimeType)) {
      return NextResponse.json(
        { error: "Use JPEG, PNG, WebP, or GIF" },
        { status: 400 }
      );
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const { path, publicUrl } = await uploadPublicSocialImage(buf, mimeType);
    return NextResponse.json({ publicUrl, path });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    const status =
      msg.includes("not configured") || msg.includes("Bucket") ? 503 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
