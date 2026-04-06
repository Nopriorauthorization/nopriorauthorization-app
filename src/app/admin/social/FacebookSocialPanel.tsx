"use client";

import { useCallback, useEffect, useState } from "react";

type ScheduledRow = {
  id: string;
  caption: string;
  imageUrl: string | null;
  scheduledAt: string;
  status: string;
  fbPostId: string | null;
  errorMsg: string | null;
  createdAt: string;
};

type Banner = { text: string; tone: "info" | "error" | "success" };

export function FacebookSocialPanel(props: {
  fbReady: boolean;
  pageIdSuffix: string | null;
  storageReady: boolean;
  oauthConnected: boolean;
  canStartOAuth: boolean;
  /** Server could not read prisma.facebookPageCredential (migrations / DB). */
  credentialLoadError?: string | null;
}) {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [testingGraph, setTestingGraph] = useState(false);
  const [posts, setPosts] = useState<ScheduledRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [fbReady, setFbReady] = useState(props.fbReady);
  const [pageIdSuffix, setPageIdSuffix] = useState(props.pageIdSuffix);
  const [oauthConnected, setOauthConnected] = useState(props.oauthConnected);
  const [canStartOAuth, setCanStartOAuth] = useState(props.canStartOAuth);
  const [queueError, setQueueError] = useState<string | null>(null);
  const [statusRefreshError, setStatusRefreshError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoadingList(true);
    setQueueError(null);
    try {
      const res = await fetch("/api/admin/scheduled-posts?limit=40");
      const data = (await res.json()) as { posts?: unknown; error?: string };
      if (res.ok && Array.isArray(data.posts)) {
        setPosts(data.posts as ScheduledRow[]);
      } else {
        setQueueError(
          data.error ??
            (res.status === 403
              ? "Not authorized — sign in and ensure your account has admin access."
              : `Queue API failed (HTTP ${res.status}).`),
        );
      }
    } catch {
      setQueueError("Could not load the post queue — network or server error.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    const err = q.get("fb_error");
    const ok = q.get("fb_connected");
    if (err) {
      setBanner({
        tone: "error",
        text: decodeURIComponent(err.replace(/\+/g, " ")),
      });
      window.history.replaceState({}, "", "/admin/social");
    }
    if (ok === "1") {
      setBanner({
        tone: "success",
        text: "Facebook connected — Page token saved for posting.",
      });
      window.history.replaceState({}, "", "/admin/social");
      setOauthConnected(true);
      setFbReady(true);
      void loadPosts();
    }
  }, [loadPosts]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/social/posting-status");
        const data = (await res.json()) as {
          fbReady?: boolean;
          pageIdSuffix?: string | null;
          oauthConnected?: boolean;
          canStartOAuth?: boolean;
          error?: string;
        };
        if (!cancelled) {
          if (res.ok && typeof data.fbReady === "boolean") {
            setStatusRefreshError(
              typeof data.error === "string" && data.error.trim()
                ? data.error
                : null,
            );
            setFbReady(data.fbReady);
            setPageIdSuffix(data.pageIdSuffix ?? null);
            if (typeof data.oauthConnected === "boolean") {
              setOauthConnected(data.oauthConnected);
            }
            if (typeof data.canStartOAuth === "boolean") {
              setCanStartOAuth(data.canStartOAuth);
            }
          } else if (!res.ok) {
            const err = (data as { error?: string }).error;
            setStatusRefreshError(
              err ??
                (res.status === 403
                  ? "Posting status: not authorized (sign in as admin)."
                  : `Posting status failed (HTTP ${res.status}).`),
            );
          }
        }
      } catch {
        if (!cancelled) {
          setStatusRefreshError("Could not refresh Facebook status from the server.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasPostContent =
    caption.trim().length > 0 || imageUrl.trim().length > 0;
  const canPostNow =
    fbReady && hasPostContent && !busy && !uploading;
  const canSchedule =
    fbReady &&
    hasPostContent &&
    Boolean(scheduleAt) &&
    !busy &&
    !uploading;

  async function postNow() {
    setBusy(true);
    setBanner(null);
    try {
      const res = await fetch("/api/social/post-facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: caption,
          imageUrl: imageUrl.trim() || null,
        }),
      });
      let data: {
        error?: string;
        result?: { id?: string; post_id?: string };
      };
      try {
        data = await res.json();
      } catch {
        setBanner({
          tone: "error",
          text: `Bad response from server (HTTP ${res.status}). Check Vercel logs for /api/social/post-facebook.`,
        });
        return;
      }
      if (!res.ok) {
        setBanner({
          tone: "error",
          text: data.error ?? `Post failed (HTTP ${res.status})`,
        });
        return;
      }
      const postId =
        (typeof data.result?.id === "string" && data.result.id) ||
        (typeof data.result?.post_id === "string" && data.result.post_id) ||
        null;
      setBanner({
        tone: "success",
        text: postId
          ? `Facebook accepted the post. Post ID: ${postId}. If it does not appear on the Page, open Meta Business Suite → your Page → Posts (sometimes there is a short delay or moderation).`
          : "Facebook accepted the post. Check the Page’s Posts tab if you do not see it in the feed.",
      });
      setCaption("");
      setImageUrl("");
      loadPosts();
    } finally {
      setBusy(false);
    }
  }

  async function testGraphConnection() {
    setTestingGraph(true);
    setBanner(null);
    try {
      const res = await fetch("/api/admin/social/facebook-debug");
      const data = (await res.json()) as {
        ok?: boolean;
        page?: { id?: string; name?: string };
        error?: string;
        hint?: string;
      };
      if (data.ok && data.page?.name) {
        const src =
          (data as { tokenSource?: string }).tokenSource === "database"
            ? " (saved from Facebook login)"
            : (data as { tokenSource?: string }).tokenSource === "env"
              ? " (from env FB_PAGE_ACCESS_TOKEN)"
              : "";
        setBanner({
          tone: "success",
          text: `Graph API OK — Page “${data.page.name}” (id ${data.page.id})${src}.`,
        });
      } else {
        setBanner({
          tone: "error",
          text: [data.error, data.hint].filter(Boolean).join(" "),
        });
      }
    } catch {
      setBanner({ tone: "error", text: "Could not reach debug endpoint." });
    } finally {
      setTestingGraph(false);
    }
  }

  async function schedulePost() {
    if (!scheduleAt) {
      setBanner({
        tone: "info",
        text: "Pick a date and time for the schedule.",
      });
      return;
    }
    setBusy(true);
    setBanner(null);
    try {
      const scheduledAt = new Date(scheduleAt);
      if (Number.isNaN(scheduledAt.getTime())) {
        setBanner({ tone: "error", text: "Invalid schedule time." });
        return;
      }
      const res = await fetch("/api/admin/scheduled-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          imageUrl: imageUrl.trim() || null,
          scheduledAt: scheduledAt.toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBanner({
          tone: "error",
          text: data.error ?? "Schedule failed",
        });
        return;
      }
      setBanner({ tone: "success", text: "Scheduled." });
      setScheduleAt("");
      loadPosts();
    } finally {
      setBusy(false);
    }
  }

  async function cancelPending(id: string) {
    if (!confirm("Cancel this scheduled post?")) return;
    const res = await fetch(`/api/admin/scheduled-posts/${id}`, {
      method: "DELETE",
    });
    if (res.ok) loadPosts();
  }

  async function disconnectFacebook() {
    if (
      !confirm(
        "Remove the stored Facebook Page token? Posting will use env FB_PAGE_ACCESS_TOKEN only if it is still set."
      )
    ) {
      return;
    }
    const res = await fetch("/api/auth/facebook/disconnect", {
      method: "POST",
    });
    if (res.ok) {
      setOauthConnected(false);
      setBanner({
        tone: "info",
        text: "Stored token removed. Reconnect or rely on env token.",
      });
      const st = await fetch("/api/admin/social/posting-status");
      const d = (await st.json()) as { fbReady?: boolean };
      if (st.ok && typeof d.fbReady === "boolean") {
        setFbReady(d.fbReady);
      }
    }
  }

  async function onPickImage(file: File | null) {
    if (!file) return;
    setBanner(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/social/upload-image", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setBanner({ tone: "error", text: data.error ?? "Upload failed" });
        return;
      }
      if (typeof data.publicUrl === "string") {
        setImageUrl(data.publicUrl);
        setBanner({
          tone: "success",
          text: "Image uploaded — ready to post or schedule.",
        });
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-10">
      {props.credentialLoadError ? (
        <div className="rounded-xl border border-red-500/50 bg-red-950/40 p-4 text-sm text-red-100">
          <strong className="font-semibold">Database</strong> — {props.credentialLoadError}
        </div>
      ) : null}
      {statusRefreshError ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 text-sm text-amber-100">
          {statusRefreshError}
        </div>
      ) : null}

      <div
        className={`rounded-xl border p-5 ${
          fbReady
            ? "border-emerald-500/40 bg-emerald-500/5"
            : "border-amber-500/40 bg-amber-500/5"
        }`}
      >
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
          Facebook connection
        </h2>
        <div className="mt-2 space-y-3">
          <p className="text-sm text-white">
            Hello Gorgeous Page{" "}
            {pageIdSuffix ? (
              <span className="text-gray-400">(Page ID …{pageIdSuffix})</span>
            ) : null}
          </p>
          <p className="text-xs text-gray-400">
            Token:{" "}
            <span className="text-white">
              {oauthConnected
                ? "Facebook login (saved in database)"
                : fbReady
                  ? "Environment variable FB_PAGE_ACCESS_TOKEN"
                  : "Not configured"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {canStartOAuth ? (
              <a
                href="/api/auth/facebook/login"
                className="inline-flex items-center rounded-lg border border-[#1877F2]/60 bg-[#1877F2]/25 px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1877F2]/35"
              >
                {oauthConnected ? "Reconnect Facebook" : "Connect Facebook"}
              </a>
            ) : (
              <p className="text-xs text-amber-200/90">
                Set <code className="text-hot-pink">FB_APP_ID</code>,{" "}
                <code className="text-hot-pink">FB_APP_SECRET</code>,{" "}
                <code className="text-hot-pink">FB_REDIRECT_URI</code>, and{" "}
                <code className="text-hot-pink">FB_PAGE_ID</code> to enable Connect.
              </p>
            )}
            {oauthConnected ? (
              <button
                type="button"
                onClick={() => void disconnectFacebook()}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-gray-400 hover:text-white"
              >
                Disconnect stored token
              </button>
            ) : null}
          </div>
          {fbReady ? (
            <>
              <button
                type="button"
                disabled={testingGraph}
                onClick={() => void testGraphConnection()}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:border-emerald-400/50 disabled:opacity-50"
              >
                {testingGraph ? "Testing…" : "Test Graph API"}
              </button>
              <p className="text-xs text-gray-500">
                Confirms the active token can read this Page. After Connect, run
                this before your first post.
              </p>
            </>
          ) : (
            <div className="space-y-2 text-sm text-amber-200/90">
              <p>
                <strong className="text-white">Posting is off</strong> until you
                Connect Facebook or set <code className="text-hot-pink">FB_PAGE_ACCESS_TOKEN</code>{" "}
                in Vercel / <code className="text-hot-pink">.env.local</code>.
              </p>
              <p className="text-xs text-amber-200/70">
                In Meta App → Facebook Login → Settings, add Valid OAuth Redirect
                URI: your <code className="text-hot-pink">FB_REDIRECT_URI</code>{" "}
                (e.g.{" "}
                <code className="text-gray-400">
                  https://nopriorauthorization.com/api/auth/facebook/callback
                </code>
                ).
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-white">Composer</h2>
        <p className="mt-1 text-xs text-gray-500">
          Upload an image to Supabase (public URL) or paste any public HTTPS
          image link. Caption optional if you only post an image.
        </p>
        <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-gray-500">
          Caption
        </label>
        <textarea
          className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-gray-600"
          rows={4}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Post text…"
        />
        <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-gray-500">
          Image — upload or URL
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:border-hot-pink/50 disabled:opacity-40">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={!props.storageReady || uploading || !fbReady}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                e.target.value = "";
                void onPickImage(f);
              }}
            />
            {uploading ? "Uploading…" : "Choose file"}
          </label>
          {!props.storageReady ? (
            <span className="text-xs text-amber-300/90">
              Set Supabase URL + service role in env to enable uploads.
            </span>
          ) : null}
        </div>
        <input
          type="url"
          className="mt-3 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-gray-600"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://… (or use upload above)"
        />
        {fbReady && !hasPostContent ? (
          <p className="mt-3 text-xs text-gray-500">
            Add a caption and/or an image URL to enable Post now.
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!canPostNow}
            onClick={postNow}
            title={
              !fbReady
                ? "Set FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN first"
                : !hasPostContent
                  ? "Add caption or image"
                  : undefined
            }
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
              canPostNow
                ? "bg-hot-pink shadow-lg shadow-hot-pink/30 ring-2 ring-white/25 hover:brightness-110"
                : "bg-hot-pink/40 opacity-50"
            }`}
          >
            Post now
          </button>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6">
          <h3 className="text-sm font-semibold text-white">Schedule</h3>
          <input
            type="datetime-local"
            className="mt-2 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
            value={scheduleAt}
            onChange={(e) => setScheduleAt(e.target.value)}
          />
          <button
            type="button"
            disabled={!canSchedule}
            onClick={schedulePost}
            title={
              !fbReady
                ? "Set Facebook env vars first"
                : !hasPostContent
                  ? "Add caption or image"
                  : !scheduleAt
                    ? "Pick date and time"
                    : undefined
            }
            className={`ml-3 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              canSchedule
                ? "border-hot-pink bg-hot-pink/15 text-hot-pink ring-2 ring-hot-pink/30 hover:bg-hot-pink/25"
                : "border-hot-pink/30 text-hot-pink/50 opacity-60"
            }`}
          >
            Add to queue
          </button>
        </div>
        {banner ? (
          <p
            className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
              banner.tone === "error"
                ? "border-red-500/50 bg-red-950/40 text-red-100"
                : banner.tone === "success"
                  ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-100"
                  : "border-white/15 bg-white/5 text-gray-300"
            }`}
          >
            {banner.text}
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="border-b border-white/10 bg-white/[0.03] px-4 py-3">
          <h2 className="text-lg font-semibold text-white">Queue</h2>
          <p className="text-xs text-gray-500">
            Cron publishes pending rows when{" "}
            <code className="text-gray-400">scheduledAt</code> is due (every
            minute on Vercel).
          </p>
        </div>
        {queueError ? (
          <p className="p-4 text-sm text-red-300">{queueError}</p>
        ) : loadingList ? (
          <p className="p-4 text-sm text-gray-500">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No posts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Preview</th>
                  <th className="px-3 py-2">FB id / error</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((p) => (
                  <tr key={p.id} className="text-gray-300">
                    <td className="whitespace-nowrap px-3 py-2 text-xs">
                      {new Date(p.scheduledAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          p.status === "published"
                            ? "text-emerald-400"
                            : p.status === "failed"
                              ? "text-red-400"
                              : "text-amber-300"
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-3 py-2 text-xs">
                      {p.caption}
                      {p.imageUrl ? " · 🖼" : ""}
                    </td>
                    <td className="max-w-xs truncate px-3 py-2 text-xs text-gray-500">
                      {p.fbPostId ?? p.errorMsg ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {p.status === "pending" ? (
                        <button
                          type="button"
                          onClick={() => cancelPending(p.id)}
                          className="text-xs text-gray-500 hover:text-hot-pink"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
