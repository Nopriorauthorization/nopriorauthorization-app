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
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus("done");
      setTimeout(() => setStatus("dismissed"), 3000);
    } catch {
      setStatus("idle");
    }
  };

  if (status === "dismissed") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#D4537E]/30 bg-[#1A1A1A]/97 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {status === "done" ? (
          <p className="flex-1 text-center text-sm font-bold text-emerald-400">
            Check your inbox — free templates on the way!
          </p>
        ) : (
          <>
            <p className="hidden text-sm text-gray-300 sm:block">
              <strong className="text-white">Free:</strong> 10 med spa templates + weekly tips
            </p>
            <form onSubmit={submit} className="flex flex-1 gap-2 sm:flex-none">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourclinic.com"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#D4537E]/60 focus:outline-none sm:w-56"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="shrink-0 rounded-lg bg-[#D4537E] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#D4537E]/80 disabled:opacity-50"
              >
                {status === "loading" ? "..." : "Get Free Templates"}
              </button>
            </form>
          </>
        )}
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-gray-500 transition hover:text-white"
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
