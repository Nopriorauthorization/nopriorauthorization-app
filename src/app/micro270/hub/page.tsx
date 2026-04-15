"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { micro270PricingHref } from "@/config/micro270-sales.config";

type Chapter = {
  ch: number;
  title: string;
  file: string;
  total: number;
  built: boolean;
  supabaseUrl: string | null;
  freeHubAccess: boolean;
  hubLaunchAllowed: boolean;
};

const PROGRESS_GOAL = 1000;

function readProgress(ch: number, fallbackTotal: number) {
  if (typeof window === "undefined") {
    return { revealed: 0, total: fallbackTotal };
  }
  try {
    const raw = localStorage.getItem(`micro270_progress_ch${ch}`);
    if (!raw) return { revealed: 0, total: fallbackTotal };
    const p = JSON.parse(raw) as { revealed?: number; total?: number };
    return {
      revealed: Math.max(0, Math.min(p.revealed ?? 0, fallbackTotal)),
      total: p.total ?? fallbackTotal,
    };
  } catch {
    return { revealed: 0, total: fallbackTotal };
  }
}

function chapterSrc(c: Chapter) {
  return c.supabaseUrl ?? `/micro270/${c.file}`;
}

export default function Micro270HubPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [open, setOpen] = useState<Chapter | null>(null);
  const [progressVersion, setProgressVersion] = useState(0);

  const bumpProgress = useCallback(() => {
    setProgressVersion((v) => v + 1);
  }, []);

  const loadChapters = useCallback(async () => {
    try {
      const res = await fetch("/api/micro270/chapters", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Chapter[];
      if (Array.isArray(data)) {
        setChapters(data);
        setLoadError(null);
      } else setLoadError("Invalid response");
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await loadChapters();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [loadChapters]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("micro270_progress_ch")) bumpProgress();
    };
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (
        d &&
        typeof d === "object" &&
        d.type === "micro270-progress" &&
        typeof d.ch === "number"
      ) {
        localStorage.setItem(
          `micro270_progress_ch${d.ch}`,
          JSON.stringify({
            revealed: d.revealed ?? 0,
            total: d.total ?? 50,
          })
        );
        bumpProgress();
      }
    };
    const onFocus = () => {
      bumpProgress();
      void loadChapters();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("message", onMsg);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("message", onMsg);
      window.removeEventListener("focus", onFocus);
    };
  }, [bumpProgress, loadChapters]);

  const overall = useMemo(() => {
    let revealed = 0;
    for (const c of chapters) {
      revealed += readProgress(c.ch, c.total).revealed;
    }
    return { revealed, target: PROGRESS_GOAL };
  }, [chapters, progressVersion]);

  const overallPct = Math.min(
    100,
    Math.round((overall.revealed / overall.target) * 100)
  );

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <header className="border-b border-white/10 bg-[#071018]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4537E]">
            Micro270
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Study hub
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Free preview: only chapters marked for the public hub can be
            launched here without purchasing the full bank. After you buy,
            refresh this page (or come back from checkout) so your access
            cookie applies. Direct links to paid chapter files redirect to
            pricing.
          </p>
          <p className="mt-3 text-sm text-white/50">
            <a
              href="/micro270"
              className="text-[#D4537E] underline-offset-2 hover:underline"
            >
              ← Back to Micro 270 overview
            </a>
            {" · "}
            <a
              href={micro270PricingHref}
              className="text-[#2a9d8f] underline-offset-2 hover:underline"
            >
              Buy the full bank
            </a>
          </p>
          <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Overall progress</span>
              <span className="font-mono text-[#2a9d8f]">
                {overall.revealed} / {overall.target} revealed
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D4537E] to-[#2a9d8f] transition-[width] duration-300"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
          {loadError ? (
            <p className="mt-4 text-sm text-amber-300">{loadError}</p>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {chapters.map((c) => {
            const { revealed, total } = readProgress(c.ch, c.total);
            const pct = total ? Math.round((revealed / total) * 100) : 0;
            const canLaunch = c.built && c.hubLaunchAllowed;
            const lockedPaid = c.built && !c.hubLaunchAllowed;
            return (
              <article
                key={c.ch}
                className={`flex flex-col rounded-xl border p-5 transition-colors ${
                  c.built
                    ? "border-white/15 bg-white/[0.04]"
                    : "border-white/5 bg-white/[0.02] opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#D4537E]">
                      Ch. {c.ch}
                    </span>
                    <h2 className="mt-1 font-serif text-lg font-semibold text-white">
                      {c.title}
                    </h2>
                    <p className="mt-1 font-mono text-xs text-white/45">
                      {c.file}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {lockedPaid ? (
                      <span className="rounded-full bg-amber-500/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                        Paid bank
                      </span>
                    ) : null}
                    {!c.built ? (
                      <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/60">
                        Coming soon
                      </span>
                    ) : null}
                    {c.built && c.hubLaunchAllowed && c.freeHubAccess ? (
                      <span className="rounded-full bg-[#2a9d8f]/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#7dcdc4]">
                        Free preview
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Revealed</span>
                    <span className="font-mono text-white/80">
                      {revealed} / {total}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/40">
                    <div
                      className="h-full rounded-full bg-[#D4537E]/90"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {canLaunch ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setOpen(c)}
                        className="rounded-lg bg-[#D4537E] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#b83e68]"
                      >
                        Launch
                      </button>
                      <a
                        href={chapterSrc(c)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
                      >
                        New tab
                      </a>
                    </>
                  ) : null}
                  {lockedPaid ? (
                    <a
                      href={micro270PricingHref}
                      className="rounded-lg bg-[#2a9d8f] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#227a6f]"
                    >
                      Unlock — see pricing
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-label={`Chapter ${open.ch}`}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#0a1628] px-4 py-3">
            <p className="truncate text-sm font-medium text-white/90">
              Ch. {open.ch} — {open.title}
            </p>
            <button
              type="button"
              onClick={() => {
                setOpen(null);
                bumpProgress();
              }}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
            >
              Close
            </button>
          </div>
          <iframe
            title={open.title}
            src={chapterSrc(open)}
            className="min-h-0 flex-1 w-full border-0 bg-[#0a1628]"
          />
        </div>
      ) : null}
    </div>
  );
}
