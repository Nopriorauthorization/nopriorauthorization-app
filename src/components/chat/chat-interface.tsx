"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import MessageBubble, { TypingIndicator } from "./message-bubble";
import Button from "@/components/ui/button";
import type { ChatMessage } from "@/types";
import { getMascotList, getMascotMeta } from "@/lib/mascots";
import { trackConsumerQuestion } from "@/lib/analytics";

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[];
  sessionId?: string;
  mascotId?: string;
}

export default function ChatInterface({
  initialMessages = [],
  sessionId: initialSessionId,
  mascotId,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [selectedMascotId, setSelectedMascotId] = useState(mascotId);
  const mascot = getMascotMeta(selectedMascotId);
  const mascotList = getMascotList();
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  useEffect(() => {
    setSelectedMascotId(mascotId);
  }, [mascotId]);

  const handleMascotChange = (nextMascotId: string) => {
    if (nextMascotId === selectedMascotId) return;
    setSelectedMascotId(nextMascotId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("mascot", nextMascotId);
    router.replace(`/chat?${params.toString()}`);
    startNewChat();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput || isLoading) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      role: "user",
      content: trimmedInput,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    trackConsumerQuestion(mascot.id);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const controller = new AbortController();
      requestRef.current = controller;
      const timeoutId = window.setTimeout(() => controller.abort(), 15000);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedInput,
          sessionId,
          mascot: mascot.id,
        }),
        signal: controller.signal,
      });

      window.clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }
      if (!data.response) {
        throw new Error("No response returned from server.");
      }

      // Add AI response
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSessionId(data.sessionId);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      requestRef.current = null;
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestion = (question: string) => {
    setInput(question);
    if (inputRef.current) {
      inputRef.current.value = question;
      inputRef.current.focus();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setSessionId(undefined);
    setError("");
    setIsLoading(false);
    requestRef.current?.abort();
    requestRef.current = null;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div>
          <h2 className="font-semibold text-lg">{mascot.header}</h2>
          <p className="text-sm text-gray-500">{mascot.subheader}</p>
          <div
            key={mascot.id}
            className="mt-2 text-xs text-gray-500 animate-fade-in"
          >
            <span className="font-semibold text-gray-700">Role:</span>{" "}
            {mascot.role} ·{" "}
            <span className="font-semibold text-gray-700">Focus:</span>{" "}
            {mascot.offer}
            {mascot.credentials && (
              <>
                {" "}
                ·{" "}
                <span className="font-semibold text-gray-700">Credentials:</span>{" "}
                <span className="text-pink-500">{mascot.credentials}</span>
              </>
            )}
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={startNewChat}>
            New Chat
          </Button>
        )}
      </div>
    <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="hidden md:flex flex-wrap gap-2">
        {mascotList.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleMascotChange(item.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
              item.id === mascot.id
                ? "border-black bg-black text-white"
                : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
            }`}
            aria-pressed={item.id === mascot.id}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="md:hidden">
        <label className="sr-only" htmlFor="mascot-select">
          Choose a guide
        </label>
        <select
          id="mascot-select"
          value={mascot.id}
          onChange={(e) => handleMascotChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        >
          {mascotList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll">
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
          <p className="font-semibold">
            You&apos;re talking to {mascot.name}.
          </p>
          <p className="text-gray-500">
            {mascot.role} · Focus: {mascot.offer}
          </p>
          {mascot.credentials && (
            <p className="text-gray-500">
              <span className="text-pink-500 font-semibold">
                {mascot.credentials}
              </span>
            </p>
          )}
        </div>
        {messages.length === 0 ? (
          <WelcomeMessage mascotId={mascot.id} onSuggestion={handleSuggestion} />
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 mb-2 px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}


      {/* Input area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${mascot.name}...`}
            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent min-h-[44px] max-h-[150px]"
            rows={1}
            disabled={isLoading}
            maxLength={2000}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            Send
          </Button>
          {isLoading && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => requestRef.current?.abort()}
              className="self-end"
            >
              Stop
            </Button>
          )}
          {isLoading && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                requestRef.current?.abort();
                setIsLoading(false);
              }}
              className="self-end"
            >
              Reset
            </Button>
          )}
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

function WelcomeMessage({
  mascotId,
  onSuggestion,
}: {
  mascotId?: string;
  onSuggestion: (question: string) => void;
}) {
  const mascot = getMascotMeta(mascotId);
  const initials = mascot.name
    .replace(/[^a-zA-Z\s-]/g, "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isFounder = mascot.id === "founder";
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-pink-400 shadow-[0_16px_40px_rgba(255,92,165,0.35)] mb-4 mascot-bob">
        {mascot.image ? (
          <Image
            src={mascot.image}
            alt={mascot.imageAlt}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-hot-pink to-hot-pink-dark flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {isFounder ? "Welcome. I'm glad you're here." : `Hi! I'm ${mascot.name}`}
      </h3>
      <div className="text-gray-600 mb-6 max-w-2xl text-sm leading-relaxed space-y-3 text-left">
        {isFounder ? (
          <>
            <p>
              I built No Prior Authorization because too many people walk into
              appointments confused — and walk out with more questions than answers.
            </p>
            <p>
              This isn&apos;t about mistrusting providers. It&apos;s about
              understanding what&apos;s actually being said, what&apos;s being left
              out, and what you deserve to know before making decisions about your body.
            </p>
            <p>
              Inside this app, you&apos;ll meet experts who explain things clearly,
              don&apos;t sugar-coat risk, don&apos;t sell you hype, and aren&apos;t
              afraid to say “it depends” when that&apos;s the honest answer.
            </p>
            <p>
              You don&apos;t need permission to ask real questions here. You
              don&apos;t need to feel embarrassed. And you don&apos;t need to
              pretend you understand something you don&apos;t.
            </p>
            <p>Take your time. Pick an expert. Ask the question you&apos;ve been holding back.</p>
            <p className="font-semibold text-gray-700">You deserve clarity.</p>
            <p className="text-xs text-gray-500">
              — Founder
              <br />
              <span className="text-pink-500 font-semibold">
                OWNER | RN-S | CMAA
              </span>
            </p>
          </>
        ) : (
          <p>{mascot.subheader}</p>
        )}
      </div>
      <div className="grid gap-2 w-full max-w-sm">
        {mascot.suggestions.map((question) => (
          <SuggestedQuestion
            key={question}
            question={question}
            onSelect={onSuggestion}
          />
        ))}
      </div>
    </div>
  );
}

function SuggestedQuestion({
  question,
  onSelect,
}: {
  question: string;
  onSelect: (question: string) => void;
}) {
  return (
    <button
      className="text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-hot-pink hover:bg-pink-50 transition-colors text-sm text-gray-700"
      onClick={() => onSelect(question)}
    >
      {question}
    </button>
  );
}
