"use client";

import { useState } from "react";

export function ResendButton({ purchaseId }: { purchaseId: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const resend = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/admin/purchases/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId }),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") return <span className="text-xs text-emerald-400">Resent</span>;
  if (status === "error") return <span className="text-xs text-red-400">Failed</span>;

  return (
    <button
      type="button"
      onClick={resend}
      disabled={status === "sending"}
      className="text-xs font-medium text-hot-pink transition hover:underline disabled:opacity-50"
    >
      {status === "sending" ? "Sending…" : "Resend email"}
    </button>
  );
}
