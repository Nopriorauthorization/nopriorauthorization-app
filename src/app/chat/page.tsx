"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatInterface from "@/components/chat/chat-interface";
import WidgetTracker from "@/components/provider/widget-tracker";

function ChatPageInner() {
  const searchParams = useSearchParams();
  const mascotId = searchParams.get("mascot");

  return (
    <main className="min-h-screen bg-white">
      <WidgetTracker />
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-800">
          Verified by No Prior Authorization
        </span>
        <span className="text-gray-500">Educational only</span>
      </div>
      <div className="h-[calc(100vh-52px)]">
        <ChatInterface mascotId={mascotId || undefined} />
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