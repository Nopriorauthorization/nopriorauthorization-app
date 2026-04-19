import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  MICRO270_BANK_COOKIE,
  MICRO270_BANK_COOKIE_VALUE,
  MICRO270_CHEATS_COOKIE,
  MICRO270_CHEATS_COOKIE_VALUE,
} from "@/config/micro270-sales.config";

/**
 * Basenames under /micro270/*.html allowed without purchase cookie.
 * Override with MICRO270_FREE_HTML (comma-separated). Empty env = none public.
 */
function freeHtmlBasenames(): string[] {
  const raw = process.env.MICRO270_FREE_HTML;
  if (raw === "") return [];
  if (raw == null) return ["Micro270-ch1-2.html"];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

/** In-memory rate limit (resets per isolate — use Upstash in production for shared limits). */
const rateMap = new Map<string, number[]>();

function rateLimit(req: NextRequest): NextResponse | null {
  const windowMs = 60_000;
  const limit = Number(process.env.MICRO270_RATE_LIMIT_PER_MIN ?? "90");
  if (!Number.isFinite(limit) || limit <= 0) return null;

  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const key = `${ip}:${req.nextUrl.pathname}`;
  const now = Date.now();
  const hits = (rateMap.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  rateMap.set(key, hits);

  if (hits.length > limit) {
    return new NextResponse("Too many requests", { status: 429 });
  }
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/micro270") ||
    pathname.startsWith("/api/micro270")
  ) {
    const limited = rateLimit(req);
    if (limited) return limited;
  }

  if (pathname.startsWith("/micro270/") && pathname.endsWith(".html")) {
    const base = pathname.slice(pathname.lastIndexOf("/") + 1);
    const allowed = freeHtmlBasenames();
    const unlockedBank =
      req.cookies.get(MICRO270_BANK_COOKIE)?.value ===
      MICRO270_BANK_COOKIE_VALUE;
    const unlockedCheats =
      req.cookies.get(MICRO270_CHEATS_COOKIE)?.value ===
      MICRO270_CHEATS_COOKIE_VALUE;
    const cheatPath = pathname.includes("/micro270/cheat-sheets/");

    if (cheatPath) {
      if (!unlockedBank && !unlockedCheats) {
        const url = req.nextUrl.clone();
        url.pathname = "/micro270";
        url.hash = "pricing";
        return NextResponse.redirect(url);
      }
    } else if (!unlockedBank && !allowed.includes(base)) {
      const url = req.nextUrl.clone();
      url.pathname = "/micro270";
      url.hash = "pricing";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/micro270/:path*", "/api/micro270/:path*"],
};
