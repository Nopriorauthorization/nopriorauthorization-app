export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { readFacebookEnv } from "@/lib/facebook/env";
import prisma from "@/lib/db";

/**
 * Removes OAuth-stored Page token; posting falls back to FB_PAGE_ACCESS_TOKEN if set.
 */
export async function POST() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const pageId = readFacebookEnv("FB_PAGE_ID");
  if (!pageId) {
    return NextResponse.json({ error: "FB_PAGE_ID not set" }, { status: 400 });
  }

  await prisma.facebookPageCredential.deleteMany({ where: { pageId } });
  return NextResponse.json({ ok: true });
}
