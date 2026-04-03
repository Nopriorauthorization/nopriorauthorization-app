export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/auth/admin-guard";
import Link from "next/link";
import { FacebookSocialPanel } from "./FacebookSocialPanel";

export default async function AdminSocialPage() {
  await requireAdmin("/admin/social");

  const pageId = process.env.FB_PAGE_ID?.trim() ?? "";
  const token = process.env.FB_PAGE_ACCESS_TOKEN?.trim() ?? "";
  const fbReady = Boolean(pageId && token);
  const pageIdSuffix =
    pageId.length > 4 ? pageId.slice(-4) : pageId || null;
  const storageReady = Boolean(
    process.env.SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
              Admin
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold">
              Facebook — Hello Gorgeous Page
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Posts go to the Hello Gorgeous Facebook Page (Vercel credentials unchanged).
              Post now or queue for cron. Facebook only.
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:text-white"
          >
            &larr; Admin
          </Link>
        </div>

        <FacebookSocialPanel
          fbReady={fbReady}
          pageIdSuffix={pageIdSuffix}
          storageReady={storageReady}
        />
      </div>
    </div>
  );
}
