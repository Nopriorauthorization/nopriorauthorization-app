export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { getFacebookPageAccessContext } from "@/lib/facebook/get-page-token";

const GRAPH_VERSION = "v21.0";

/**
 * GET — verify Page token can read the configured Page (no token in response).
 */
export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const ctx = await getFacebookPageAccessContext();
  if (!ctx) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "No token — connect Facebook or set FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN.",
      },
      { status: 400 }
    );
  }

  const url = new URL(
    `https://graph.facebook.com/${GRAPH_VERSION}/${ctx.pageId}`
  );
  url.searchParams.set("fields", "id,name");
  url.searchParams.set("access_token", ctx.accessToken);

  try {
    const res = await fetch(url.toString(), { method: "GET" });
    const data = (await res.json()) as {
      id?: string;
      name?: string;
      error?: { message?: string; code?: number };
    };

    if (data.error) {
      return NextResponse.json({
        ok: false,
        error: data.error.message ?? "Graph error",
        code: data.error.code,
        hint:
          "Token may be expired, not a Page token, or Page ID does not match this token. Re-copy from Meta / Vercel (Hello Gorgeous project).",
      });
    }

    return NextResponse.json({
      ok: true,
      page: { id: data.id, name: data.name },
      tokenSource: ctx.source,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
