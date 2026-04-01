"use client";

import { useState } from "react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  const handleSubmit = async (e: React.FormEvent) => {
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
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <p className="text-lg font-bold text-emerald-400">
          Check your inbox!
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Your free templates are on the way.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#D4537E]/30 bg-[#D4537E]/5 p-8 text-center">
      <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
        Get 10 free templates
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-gray-400">
        Join 500+ aesthetic providers. Get 10 ready-to-use social media
        templates and our weekly content tips &mdash; free.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
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
          {status === "loading" ? "Sending..." : "Send me the templates"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-xs text-red-400">
          Something went wrong. Try again or email us directly.
        </p>
      )}
      <p className="mt-3 text-xs text-gray-600">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
