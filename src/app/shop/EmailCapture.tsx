"use client";

import { useState } from "react";

type EmailCaptureProps = { source?: string };

const LEADS_API_SOURCES = new Set(["free-templates-cta"]);

export function EmailCapture({ source = "free-templates-cta" }: EmailCaptureProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const useLeadsApi = LEADS_API_SOURCES.has(source);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMessage(null);

    try {
      if (useLeadsApi) {
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
        return;
      }

      const res = await fetch("/api/shop/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
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

      if (typeof data.leadMagnetUrl === "string" && data.leadMagnetUrl.startsWith("/")) {
        window.location.assign(data.leadMagnetUrl);
        return;
      }

      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Try again.");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <p className="text-lg font-bold text-emerald-400">
          Check your inbox!
        </p>
        <p className="mt-2 text-sm text-gray-400">
          {useLeadsApi
            ? "Danielle just sent your 10 template links — same Resend delivery as the shop."
            : "You're on the list."}
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
        Clinical cheat sheets, patient handouts, and ops tools — instant HTML downloads. No spam;
        unsubscribe anytime.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-6 flex max-w-lg flex-col gap-3"
      >
        {useLeadsApi ? (
          <input
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name (optional)"
            className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#D4537E]/60 focus:outline-none"
          />
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
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
        </div>
      </form>
      {status === "error" && (
        <p className="mt-3 text-xs text-red-400">
          {errorMessage || "Something went wrong. Try again or email us directly."}
        </p>
      )}
      <p className="mt-3 text-xs text-gray-600">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
