"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Providers from "@/components/layout/providers";
import Header from "@/components/layout/header";
import DashboardNav from "@/components/layout/nav";
import ChatInterface from "@/components/chat/chat-interface";
import { getMascotMeta } from "@/lib/mascots";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const subscriptionSuccess = searchParams.get("subscription") === "success";
  const mascotId = searchParams.get("mascot") || undefined;
  const mascot = getMascotMeta(mascotId);
  const isInternal =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_INTERNAL_ACCESS === "true";

  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(
    isInternal ? true : null
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(subscriptionSuccess);

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsSubscribed(false);
    }
  }, [status]);

  useEffect(() => {
    if (session && !isInternal) {
      checkSubscription();
    }
  }, [session, isInternal]);

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const checkSubscription = async () => {
    try {
      const response = await fetch("/api/subscription");
      const data = await response.json();
      setIsSubscribed(data.isActive);
    } catch (error) {
      console.error("Subscription check failed:", error);
      setIsSubscribed(false);
    }
  };

  if (status === "loading" || isSubscribed === null) {
    return (
      <Providers>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </Providers>
    );
  }

  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        {/* Success message */}
        {showSuccessMessage && (
          <div className="bg-green-50 border-b border-green-100 px-4 py-3">
            <div className="max-w-4xl mx-auto flex items-center gap-2 text-green-800">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-medium">Welcome!</span>
              <span>Your subscription is active. Start chatting with {mascot.name}!</span>
            </div>
          </div>
        )}

        {!isSubscribed && (
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="max-w-4xl mx-auto flex flex-col gap-2 text-gray-700 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="font-medium">Free access:</span>{" "}
                Explore the app and chat with the mascots. Subscribe to unlock
                premium depth and features.
              </div>
              <div className="flex items-center gap-3">
                {!session && (
                  <Link
                    href="/login?callbackUrl=/chat"
                    className="text-sm font-semibold text-gray-700 hover:text-black"
                  >
                    Sign in
                  </Link>
                )}
                <Link
                  href="/subscribe"
                  className="text-sm font-semibold text-pink-600 hover:text-pink-500"
                >
                  Subscribe
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Chat area */}
        <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
          <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
            <ChatInterface mascotId={mascot.id} />
          </div>
        </main>

        {/* Mobile navigation */}
        <DashboardNav />
      </div>
    </Providers>
  );
}
