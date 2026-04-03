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

export function FacebookSocialPanel(props: {
  fbReady: boolean;
  pageIdSuffix: string | null;
  storageReady: boolean;
}) {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [posts, setPosts] = useState<ScheduledRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/admin/scheduled-posts?limit=40");
      const data = await res.json();
      if (res.ok && Array.isArray(data.posts)) setPosts(data.posts);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function postNow() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/social/post-facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: caption,
          imageUrl: imageUrl.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Post failed");
        return;
      }
      setMessage("Posted to Hello Gorgeous Facebook Page.");
      setCaption("");
      setImageUrl("");
      loadPosts();
    } finally {
      setBusy(false);
    }
  }

  async function schedulePost() {
    if (!scheduleAt) {
      setMessage("Pick a date and time for the schedule.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const scheduledAt = new Date(scheduleAt);
      if (Number.isNaN(scheduledAt.getTime())) {
        setMessage("Invalid schedule time.");
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
        setMessage(data.error ?? "Schedule failed");
        return;
      }
      setMessage("Scheduled.");
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

  async function onPickImage(file: File | null) {
    if (!file) return;
    setMessage(null);
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
        setMessage(data.error ?? "Upload failed");
        return;
      }
      if (typeof data.publicUrl === "string") {
        setImageUrl(data.publicUrl);
        setMessage("Image uploaded — ready to post or schedule.");
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-10">
      <div
        className={`rounded-xl border p-5 ${
          props.fbReady
            ? "border-emerald-500/40 bg-emerald-500/5"
            : "border-amber-500/40 bg-amber-500/5"
        }`}
      >
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
          Facebook connection
        </h2>
        {props.fbReady ? (
          <p className="mt-2 text-sm text-white">
            Hello Gorgeous Page credentials loaded{" "}
            {props.pageIdSuffix ? (
              <span className="text-gray-400">
                (Page ID …{props.pageIdSuffix})
              </span>
            ) : null}
          </p>
        ) : (
          <p className="mt-2 text-sm text-amber-200/90">
            Set <code className="text-hot-pink">FB_PAGE_ID</code> and{" "}
            <code className="text-hot-pink">FB_PAGE_ACCESS_TOKEN</code> in
            Vercel (or <code className="text-hot-pink">.env.local</code>) to
            enable posting.
          </p>
        )}
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
              disabled={!props.storageReady || uploading}
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
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy || uploading || !props.fbReady}
            onClick={postNow}
            className="rounded-lg bg-hot-pink px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
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
            disabled={busy || uploading || !props.fbReady}
            onClick={schedulePost}
            className="ml-3 rounded-lg border border-hot-pink/50 px-4 py-2 text-sm font-semibold text-hot-pink disabled:opacity-40"
          >
            Add to queue
          </button>
        </div>
        {message ? (
          <p className="mt-4 text-sm text-gray-300">{message}</p>
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
        {loadingList ? (
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
