"use client";

import Link from "next/link";
import { useAppMode } from "./app-mode-provider";

export default function SiteHeader() {
  const { mode, setMode } = useAppMode();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-[0.2em] uppercase">
          No Prior Authorization
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-xs md:flex">
          <button
            type="button"
            onClick={() => setMode("consumer")}
            className={`rounded-full px-3 py-1 font-semibold uppercase tracking-[0.2em] transition ${
              mode === "consumer"
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            Consumer
          </button>
          <button
            type="button"
            onClick={() => setMode("provider")}
            className={`rounded-full px-3 py-1 font-semibold uppercase tracking-[0.2em] transition ${
              mode === "provider"
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            Provider
          </button>
        </div>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {mode === "consumer" ? (
            <>
              <Link className="text-white/70 hover:text-white" href="/experts">
                Experts
              </Link>
              <Link className="text-white/70 hover:text-white" href="/pricing">
                Pricing
              </Link>
              <Link className="text-white/70 hover:text-white" href="/about">
                Philosophy
              </Link>
              <Link
                className="rounded-full bg-hot-pink px-4 py-2 text-black font-semibold"
                href="https://app.nopriorauthorization.com"
              >
                Start Asking
              </Link>
            </>
          ) : (
            <>
              <Link className="text-white/70 hover:text-white" href="/providers">
                Provider Home
              </Link>
              <Link className="text-white/70 hover:text-white" href="/widget">
                Widget
              </Link>
              <Link className="text-white/70 hover:text-white" href="/pricing">
                Pricing
              </Link>
              <Link
                className="rounded-full bg-hot-pink px-4 py-2 text-black font-semibold"
                href="/install"
              >
                Get the Widget
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
