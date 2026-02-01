"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";

/**
 * NPA Welcome Page - First-time user onboarding
 * 
 * POST-SIGNUP BEHAVIOR (CRITICAL):
 * User is routed here after first successful signup.
 * User is NOT routed to dashboards, reports, or analytics.
 * 
 * This page:
 * - Confirms NPA ID creation
 * - Introduces the empty NPA Vault
 * - Guides user to their first action (upload a document)
 * - Builds trust through calm, clear messaging
 */

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [npaInfo, setNpaInfo] = useState<{
    npaIdAlias: string;
    createdAt: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchNpaInfo();
    }
  }, [status, router]);

  const fetchNpaInfo = async () => {
    try {
      const response = await fetch("/api/identity");
      if (response.ok) {
        const data = await response.json();
        setNpaInfo(data);
      }
    } catch (error) {
      console.error("Failed to fetch NPA info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6">
            <svg
              className="w-10 h-10 text-white"
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
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome to Your NPA Health Vault
          </h1>
          <p className="text-lg text-slate-600">
            Your health history is now yours to own, organize, and share.
          </p>
        </div>

        {/* NPA ID Card */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg font-bold">ID</span>
              </div>
              <div>
                <p className="text-purple-100 text-sm font-medium">Your NPA Health ID</p>
                <p className="text-2xl font-mono font-bold tracking-wider">
                  {npaInfo?.npaIdAlias || "Loading..."}
                </p>
              </div>
            </div>
          </div>
          <CardContent className="p-6 bg-white">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Immutable & Secure</p>
                  <p className="text-sm text-slate-600">
                    Your NPA ID never changes and is cryptographically secure.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Patient-Owned</p>
                  <p className="text-sm text-slate-600">
                    All records linked to this ID are controlled by you.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Cross-Provider</p>
                  <p className="text-sm text-slate-600">
                    Share with any provider. Build continuity across systems.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Get Started in 3 Simple Steps
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Upload Your First Record</p>
                  <p className="text-sm text-slate-600">
                    MyChart PDF, lab results, visit summaries—anything you already own.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Watch Your Timeline Build</p>
                  <p className="text-sm text-slate-600">
                    Documents are organized chronologically so you can see your history.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Share on Your Terms</p>
                  <p className="text-sm text-slate-600">
                    Generate secure links. Control access. Revoke anytime.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/vault/dashboard" className="flex-1">
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Go to My Vault
            </Button>
          </Link>
          <Link href="/vault/timeline" className="flex-1">
            <Button
              variant="secondary"
              size="lg"
              className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              View Timeline
            </Button>
          </Link>
        </div>

        {/* Trust Footer */}
        <div className="text-center">
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600">
              🔒 Your data is encrypted at rest and in transit.
              <br />
              We never sell health data. Access is permission-based and revocable.
            </p>
          </div>
          
          <p className="mt-6 text-xs text-slate-400">
            No Prior Authorization is not a medical provider and does not provide medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
