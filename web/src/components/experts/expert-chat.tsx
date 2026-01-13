"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { EXPERTS } from "@/content/experts";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const APP_CHAT_URL = "https://app.nopriorauthorization.com/api/chat";

export default function ExpertChat() {
  const [selectedId, setSelectedId] = useState(EXPERTS[0]?.id ?? "founder");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const selected = useMemo(
    () => EXPERTS.find((expert) => expert.id === selectedId) ?? EXPERTS[0],
    [selectedId]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError("");
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setIsLoading(true);

    try {
      const response = await fetch(APP_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          mascot: selectedId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to process message.");
      }

      if (!data?.response) {
        throw new Error("No response returned.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-black/70 p-6 md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
            Ask an Expert
          </p>
          <h2 className="font-display text-3xl md:text-4xl">
            Get a clear answer without the awkwardness.
          </h2>
          <p className="max-w-2xl text-sm text-white/70 md:text-base">
            Choose who you want to ask, then send your question. We route the
            answer through the app so your website stays secure and compliant.
          </p>
        </div>
        {selected && (
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/60 px-4 py-3">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-hot-pink/60 bg-black">
              <Image
                src={selected.image}
                alt={selected.name}
                width={128}
                height={128}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">{selected.name}</p>
              <p className="text-xs text-white/60">{selected.role}</p>
              {selected.credentials && (
                <p className="text-xs text-hot-pink">{selected.credentials}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-[0.3em] text-white/50">
            Choose an expert
          </label>
          <div className="flex flex-wrap gap-2">
            {EXPERTS.map((expert) => (
              <button
                key={expert.id}
                type="button"
                onClick={() => setSelectedId(expert.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  selectedId === expert.id
                    ? "border-hot-pink bg-hot-pink text-black"
                    : "border-white/10 text-white/70 hover:border-hot-pink hover:text-white"
                }`}
              >
                {expert.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/50">
            Educational only. Always consult a licensed provider for medical
            advice.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-sm text-white/60">
                Ask a question to get started.
              </p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-xl px-4 py-3 text-sm ${
                    message.role === "user"
                      ? "bg-white/10 text-white"
                      : "bg-hot-pink/10 text-white"
                  }`}
                >
                  {message.content}
                </div>
              ))
            )}

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={`Ask ${selected?.name ?? "an expert"}...`}
              className="min-h-[96px] w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-hot-pink"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/40">
                Powered by the app — no keys exposed.
              </p>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-hot-pink px-4 py-2 text-xs font-semibold uppercase tracking-wide text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Thinking..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
