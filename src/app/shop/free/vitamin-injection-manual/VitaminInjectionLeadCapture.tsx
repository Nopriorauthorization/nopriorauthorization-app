"use client";

import Link from "next/link";
import { useState } from "react";

const SOURCE = "vitamin-injection-lead";

export function VitaminInjectionLeadCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [unlockUrl, setUnlockUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/shop/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: SOURCE }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        leadMagnetUrl?: string | null;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Try again.");
        return;
      }

      setStatus("done");
      setUnlockUrl(data.leadMagnetUrl ?? null);
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Try again.");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <p className="text-lg font-bold text-emerald-400">You&apos;re in — here&apos;s your manual</p>
        <p className="mt-2 text-sm text-gray-400">
          We&apos;ll also send helpful emails from NPA (unsubscribe anytime). Your free reference is ready
          below.
        </p>
        {unlockUrl ? (
          <a
            href={unlockUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#D4537E] px-8 py-3 text-base font-bold text-white transition hover:bg-[#D4537E]/85"
          >
            Open Vitamin Injection Manual →
          </a>
        ) : (
          <p className="mt-4 text-sm text-amber-200/90">
            Download link could not be generated (server config). Check your inbox for the next email, or
            contact support.
          </p>
        )}
        <p className="mt-6 text-sm text-gray-500">
          Next step:{" "}
          <Link
            href="/shop/injection-techniques-cheat-sheet"
            className="font-bold text-[#D4537E] hover:underline"
          >
            Injection Techniques Cheat Sheet — $10
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#D4537E]/30 bg-[#D4537E]/5 p-8">
      <h2 className="text-center font-serif text-2xl font-bold text-white sm:text-3xl">
        Get the free Vitamin Injection Manual
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-400">
        Doses, routes, IM procedure steps, and vitamin-specific cards (B12, biotin, MIC, glutathione, and
        more). Enter your email — we&apos;ll unlock the file instantly and add you to our list (no spam).
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourclinic.com"
          className="flex-1 rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#D4537E]/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-[#D4537E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D4537E]/80 disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Email me the manual"}
        </button>
      </form>
      {(status === "error" || errorMessage) && (
        <p className="mt-3 text-center text-xs text-red-400">{errorMessage}</p>
      )}
      <p className="mt-4 text-center text-xs text-gray-600">
        Then: level up with{" "}
        <Link href="/shop/injection-techniques-cheat-sheet" className="text-[#D4537E] hover:underline">
          Injection Techniques Cheat Sheet ($10)
        </Link>
        .
      </p>
    </div>
  );
}
