"use client";

import { useState } from "react";
import { FREE_TEMPLATES_LEAD_MAGNET } from "@/config/free-templates-lead-magnet.config";

export function FreeTemplatesOptInForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/leads/free-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim() || "there",
          email: email.trim(),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Try again.");
        return;
      }

      setStatus("done");
      setEmail("");
      setFirstName("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Try again.");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <p className="text-lg font-bold text-emerald-400">You&apos;re in — thank you 🤍</p>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          Check your inbox — Danielle just sent your welcome email with a single link to grab all 10 files (
          <a href="/free-templates/downloads" className="font-semibold text-[#D4537E] hover:underline">
            open downloads page
          </a>
          ). If you don&apos;t see it in a minute, peek at spam.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#D4537E]/30 bg-[#D4537E]/5 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="text-left">
            <label htmlFor="ft-first" className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              First name
            </label>
            <input
              id="ft-first"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Danielle"
              className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#D4537E]/60 focus:outline-none"
            />
          </div>
          <div className="text-left">
            <label htmlFor="ft-email" className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Email
            </label>
            <input
              id="ft-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourclinic.com"
              className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#D4537E]/60 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-[#D4537E] py-3.5 text-sm font-bold text-white transition hover:bg-[#D4537E]/85 disabled:opacity-50 sm:w-auto sm:px-10"
        >
          {status === "loading" ? "Sending…" : "Get my 10 free templates"}
        </button>
        {status === "error" && errorMessage ? (
          <p className="text-center text-xs text-red-400">{errorMessage}</p>
        ) : null}
        <p className="text-center text-xs text-gray-600">
          We&apos;ll add you to our <code className="text-gray-500">leads</code> table (Supabase) and send 3 short
          follow-ups on days 1, 3, and 7. Unsubscribe in one click from any email.
        </p>
      </form>
    </div>
  );
}

export function FreeTemplatesPackList() {
  return (
    <ol className="mt-8 space-y-3 text-left text-sm text-gray-400">
      {FREE_TEMPLATES_LEAD_MAGNET.map((row, i) => (
        <li key={row.fileName} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D4537E]/20 text-xs font-bold text-[#D4537E]">
            {i + 1}
          </span>
          <span className="pt-0.5">{row.label}</span>
        </li>
      ))}
    </ol>
  );
}
