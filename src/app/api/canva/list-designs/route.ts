import { NextRequest, NextResponse } from "next/server";
import { CANVA_DESIGNS_LIST_URL, getCanvaEnv } from "@/lib/canva/oauth";

const MAX_PAGES = 100;
const PAGE_LIMIT = 100;

type CanvaDesignItem = {
  id?: string;
  title?: string;
  owner?: { user_id?: string; team_id?: string };
  urls?: { edit_url?: string; view_url?: string };
  thumbnail?: { width?: number; height?: number; url?: string };
  created_at?: number;
  updated_at?: number;
  page_count?: number;
};

type ListDesignsResponse = {
  items?: CanvaDesignItem[];
  continuation?: string;
};

function resolveCanvaAccessToken(req: NextRequest): string | undefined {
  const cookie = req.cookies.get("canva_access_token")?.value?.trim();
  if (cookie) return cookie;

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const t = auth.slice(7).trim();
    if (t) return t;
  }

  if (process.env.NODE_ENV !== "production") {
    const envTok = process.env.CANVA_ACCESS_TOKEN?.trim();
    if (envTok) return envTok;
  }

  return undefined;
}

/**
 * Lists all designs visible to the connected Canva user (paginated server-side).
 * Requires OAuth with `design:meta:read` and that scope enabled in the Canva portal.
 * GET /api/canva/list-designs
 *
 * Auth (first match): `canva_access_token` cookie (after /canva OAuth), or
 * `Authorization: Bearer <token>`, or in development only `CANVA_ACCESS_TOKEN` in env
 * (server logs this once after successful OAuth — see /api/canva/callback).
 *
 * Query (optional):
 * - ownership: any | owned | shared (default any)
 */
export async function GET(req: NextRequest) {
  const cfg = getCanvaEnv();
  if (!cfg) {
    return NextResponse.json(
      { error: "Missing Canva environment configuration." },
      { status: 503 }
    );
  }

  const accessToken = resolveCanvaAccessToken(req);
  if (!accessToken) {
    return NextResponse.json(
      {
        error: "Not connected to Canva yet. Visit /canva and connect first.",
        hint:
          "Use the same browser host you used for OAuth (e.g. 127.0.0.1 vs localhost). Dev: set CANVA_ACCESS_TOKEN in .env.local or pass Authorization: Bearer …",
      },
      { status: 401 }
    );
  }

  const url = req.nextUrl;
  const ownership = url.searchParams.get("ownership");
  const validOwnership =
    ownership === "owned" || ownership === "shared" || ownership === "any"
      ? ownership
      : "any";

  const allItems: CanvaDesignItem[] = [];
  let continuation: string | undefined;
  let pages = 0;

  try {
    while (pages < MAX_PAGES) {
      const listUrl = new URL(CANVA_DESIGNS_LIST_URL);
      listUrl.searchParams.set("limit", String(PAGE_LIMIT));
      listUrl.searchParams.set("ownership", validOwnership);
      if (continuation) {
        listUrl.searchParams.set("continuation", continuation);
      }

      const res = await fetch(listUrl.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      let body: ListDesignsResponse | Record<string, unknown> = {};
      try {
        body = (await res.json()) as ListDesignsResponse;
      } catch {
        body = {};
      }

      if (!res.ok) {
        return NextResponse.json(
          {
            connected: true,
            error: "Canva list designs failed.",
            status: res.status,
            data: body,
            hint:
              res.status === 403
                ? "Enable design:meta:read in the Canva portal, add it to CANVA_OAUTH_SCOPES, then reconnect OAuth."
                : undefined,
          },
          { status: 502 }
        );
      }

      const items = body.items ?? [];
      allItems.push(...items);
      pages += 1;

      const next = body.continuation;
      if (!next) {
        continuation = undefined;
        break;
      }
      continuation = next;
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { connected: true, error: "Canva list designs request failed." },
      { status: 502 }
    );
  }

  const designs = allItems.map((d) => ({
    id: d.id ?? null,
    title: d.title ?? null,
    owner: d.owner ?? null,
    created_at: d.created_at ?? null,
    updated_at: d.updated_at ?? null,
    page_count: d.page_count ?? null,
    thumbnail: d.thumbnail
      ? {
          width: d.thumbnail.width ?? null,
          height: d.thumbnail.height ?? null,
          url: d.thumbnail.url ?? null,
        }
      : null,
    urls: d.urls
      ? {
          edit_url: d.urls.edit_url ?? null,
          view_url: d.urls.view_url ?? null,
        }
      : null,
  }));

  return NextResponse.json({
    connected: true,
    count: designs.length,
    ownership: validOwnership,
    pagesFetched: pages,
    truncated: Boolean(continuation),
    designs,
  });
}
