import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDeliveryProductBySlugAsync } from "@/lib/delivery/catalog";
import { verifyDeliveryToken } from "@/lib/delivery/token";

export const dynamic = "force-dynamic";

function resolveDeliverablePdf(editUrl: string): string | null {
  if (!editUrl.startsWith("/deliverables/") || !editUrl.endsWith(".pdf")) return null;
  const rel = editUrl.replace(/^\//, "");
  const abs = path.join(process.cwd(), "delivery-assets", rel);
  if (!fs.existsSync(abs)) return null;
  return abs;
}

/**
 * Serves gated PDFs (e.g. Hello Gorgeous — THE BOOK) only with a valid delivery token.
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
  if (!editUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const absPath = resolveDeliverablePdf(editUrl);
  if (!absPath) {
    return NextResponse.json(
      { error: "File missing — run book:pdf and copy into delivery-assets/deliverables/" },
      { status: 404 }
    );
  }

  const buf = fs.readFileSync(absPath);
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="HelloGorgeous-THE-BOOK.pdf"',
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
