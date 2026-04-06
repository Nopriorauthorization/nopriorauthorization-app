"use client";

import { useEffect, useId, useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  loading: boolean;
  error: string | null;
  onConfirm: (email: string) => void;
};

export function CheckoutEmailDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  loading,
  error,
  onConfirm,
}: Props) {
  const id = useId();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!open) setEmail("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/70"
        onClick={() => !loading && onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-[#1A1A1A] p-6 shadow-xl"
      >
        <h2 id={`${id}-title`} className="font-serif text-xl font-bold text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
        <label htmlFor={`${id}-email`} className="mt-4 block text-xs font-bold uppercase tracking-wide text-gray-500">
          Email
        </label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-white placeholder:text-gray-600 focus:border-[#D4537E] focus:outline-none focus:ring-1 focus:ring-[#D4537E] disabled:opacity-60"
          placeholder="you@example.com"
        />
        {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading || !email.trim()}
            onClick={() => onConfirm(email)}
            className="rounded-lg bg-[#D4537E] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#D4537E]/85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Redirecting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
