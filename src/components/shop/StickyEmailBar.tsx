"use client";

import { useState, useEffect } from "react";

export function StickyEmailBar() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "dismissed">("idle");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("npa-email-bar-dismissed")) {
      setStatus("dismissed");
    }
  }, []);

  const dismiss = () => {
    setStatus("dismissed");
    sessionStorage.setItem("npa-email-bar-dismissed", "1");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await fetch("/api/shop/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "sticky_bar" }),
      });
      setStatus("done");
      setTimeout(() => setStatus("dismissed"), 3000);
    } catch {
      setStatus("idle");
    }
  };

  if (status === "dismissed") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#D4537E]/30 bg-[#1A1A1A]/97 backdrop-blur-sm pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
        {status === "done" ? (
          <div className="flex items-center justify-between gap-3">
            <p className="flex-1 text-center text-sm font-bold text-emerald-400">
              Check your inbox — free templates on the way!
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="min-h-[44px] min-w-[44px] shrink-0 text-2xl leading-none text-gray-500 transition hover:text-white"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-start justify-between gap-3 sm:contents">
              <p className="text-xs text-gray-400 sm:hidden">
                <strong className="text-white">Free templates</strong> + weekly tips — no spam.
              </p>
              <p className="hidden text-sm text-gray-300 sm:block">
                <strong className="text-white">Free:</strong> 10 med spa templates + weekly tips
              </p>
              <button
                type="button"
                onClick={dismiss}
                className="min-h-[44px] min-w-[44px] shrink-0 text-2xl leading-none text-gray-500 transition hover:text-white sm:order-last"
                aria-label="Dismiss"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={submit}
              className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourclinic.com"
                autoComplete="email"
                inputMode="email"
                className="min-h-[44px] w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-base text-white placeholder:text-gray-500 focus:border-[#D4537E]/60 focus:outline-none sm:w-56 sm:py-2 sm:text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="min-h-[44px] w-full shrink-0 rounded-lg bg-[#D4537E] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#D4537E]/80 disabled:opacity-50 sm:w-auto sm:min-h-0 sm:py-2"
              >
                <span className="sm:hidden">{status === "loading" ? "..." : "Get templates"}</span>
                <span className="hidden sm:inline">
                  {status === "loading" ? "..." : "Get Free Templates"}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
