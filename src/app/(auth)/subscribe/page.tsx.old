"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import BeauTox from "@/lib/ai/beau-tox";

function SubscribePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const canceled = searchParams.get("canceled");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    if (!session) {
      router.push("/login?callbackUrl=/subscribe");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <BeauTox size="lg" className="mx-auto mb-6" />

          <h1 className="text-2xl font-bold text-center mb-2">
            Unlock Full Access
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Get unlimited chats with Beau-Tox™ and access to all educational
            content.
          </p>

          {canceled && (
            <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-lg text-sm mb-6">
              Checkout was canceled. No worries—you can try again when you're
              ready!
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Pricing Card */}
          <div className="border-2 border-black rounded-xl p-6 mb-6">
            <div className="flex items-baseline justify-center gap-1 mb-4">
              <span className="text-4xl font-bold">$7.99</span>
              <span className="text-gray-600">/month</span>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
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
                <span>Unlimited AI chats with Beau-Tox™</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
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
                <span>Full Myth Vault access</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
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
                <span>Appointment prep guides</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
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
                <span>Cancel anytime</span>
              </li>
            </ul>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSubscribe}
              isLoading={isLoading}
            >
              {session ? "Subscribe Now" : "Sign Up to Subscribe"}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Secure payment powered by Stripe. Your payment information is never
            stored on our servers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-gray-50" aria-hidden />}
    >
      <SubscribePageInner />
    </Suspense>
  );
}
