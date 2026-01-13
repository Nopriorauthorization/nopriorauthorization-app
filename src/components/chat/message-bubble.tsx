"use client";

import { BeauToxAvatar } from "@/lib/ai/beau-tox";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 animate-fade-in ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
            You
          </div>
        ) : (
          <BeauToxAvatar />
        )}
      </div>

      {/* Message */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-black text-white rounded-br-md"
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {formatMessage(message.content)}
        </div>
      </div>
    </div>
  );
}

// Format message content (handle markdown-style formatting)
function formatMessage(content: string): React.ReactNode {
  // Split by the disclaimer separator
  const parts = content.split("---");

  if (parts.length > 1) {
    return (
      <>
        <div>{parts[0].trim()}</div>
        <div className="mt-3 pt-3 border-t border-gray-300 text-xs text-gray-500 italic">
          {parts[1].replace(/\*/g, "").trim()}
        </div>
      </>
    );
  }

  return content;
}

// Loading indicator component
export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <BeauToxAvatar />
      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full loading-dot" />
          <span className="w-2 h-2 bg-gray-400 rounded-full loading-dot" />
          <span className="w-2 h-2 bg-gray-400 rounded-full loading-dot" />
        </div>
      </div>
    </div>
  );
}
