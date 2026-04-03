export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/auth/admin-guard";
import { readFacebookEnv } from "@/lib/facebook/env";
import prisma from "@/lib/db";
import Link from "next/link";
import { FacebookSocialPanel } from "./FacebookSocialPanel";

export default async function AdminSocialPage() {
  await requireAdmin("/admin/social");

  const pageId = readFacebookEnv("FB_PAGE_ID");
  const envTok = readFacebookEnv("FB_PAGE_ACCESS_TOKEN");
  const appId = readFacebookEnv("FB_APP_ID");
  const appSecret = readFacebookEnv("FB_APP_SECRET");
  const redirectUri = readFacebookEnv("FB_REDIRECT_URI");

  const row = pageId
    ? await prisma.facebookPageCredential.findUnique({
        where: { pageId },
        select: { accessToken: true },
      })
    : null;

  const oauthConnected = Boolean(row?.accessToken?.trim());
  const fbReady = Boolean(pageId && (oauthConnected || Boolean(envTok)));
  const canStartOAuth = Boolean(appId && appSecret && redirectUri && pageId);
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
              Posts go to the Hello Gorgeous Facebook Page. Prefer{" "}
              <strong className="text-white">Connect Facebook</strong> so the
              Page token stays fresh; env <code className="text-hot-pink">FB_PAGE_ACCESS_TOKEN</code>{" "}
              is optional fallback.
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
          oauthConnected={oauthConnected}
          canStartOAuth={canStartOAuth}
        />
      </div>
    </div>
  );
}
