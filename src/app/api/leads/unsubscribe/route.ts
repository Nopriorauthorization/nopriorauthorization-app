import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * One-click unsubscribe for free-templates nurture (sets opted_in = false).
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")?.trim();
  if (!token) {
    return new NextResponse("Missing token", { status: 400, headers: { "Content-Type": "text/plain" } });
  }

  const lead = await prisma.lead.findUnique({
    where: { unsubscribeToken: token },
  });

  if (!lead) {
    return new NextResponse("Invalid link", { status: 404, headers: { "Content-Type": "text/plain" } });
  }

  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      optedIn: false,
      nextNurtureAt: null,
    },
  });

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Unsubscribed</title></head>
<body style="font-family:system-ui,sans-serif;padding:40px;text-align:center;background:#f5f3f1;color:#333">
<p style="font-size:18px">You&apos;re unsubscribed from follow-up emails for this lead magnet.</p>
<p style="margin-top:16px"><a href="https://nopriorauthorization.com/free-templates" style="color:#D4537E;font-weight:600">Back to NPA</a></p>
</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
