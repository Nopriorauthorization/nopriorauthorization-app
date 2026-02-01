"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatInterface from "@/components/chat/chat-interface";
import WidgetTracker from "@/components/provider/widget-tracker";
import { SourceTransparency } from "@/components/ui/SourceTransparency";

function ChatPageInner() {
  const searchParams = useSearchParams();
  const persona = searchParams.get("persona");
  const source = searchParams.get("source");

  return (
    <main className="min-h-screen bg-white">
      <WidgetTracker />
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-800">
          Verified by No Prior Authorization
        </span>
        <span className="text-gray-500">Educational only</span>
      </div>
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <SourceTransparency variant="compact" className="bg-white border-gray-200" />
      </div>
      <div className="h-[calc(100vh-52px)]">
        <ChatInterface persona={persona || undefined} source={source || undefined} />
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" aria-hidden />}>
      <ChatPageInner />
    </Suspense>
  );
}