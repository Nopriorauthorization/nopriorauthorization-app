"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/button";
import { BeauToxAvatar } from "@/lib/ai/beau-tox";
import { useAppMode } from "./app-mode-provider";

export default function Header() {
  const { data: session, status } = useSession();
  const { mode, setMode } = useAppMode();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BeauToxAvatar />
            <span className="font-bold text-xl">
              No Prior <span className="text-hot-pink">Authorization</span>™
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 text-xs">
            <button
              type="button"
              onClick={() => setMode("consumer")}
              className={`px-3 py-1 rounded-full font-semibold uppercase tracking-wide transition ${
                mode === "consumer"
                  ? "bg-black text-white"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Consumer
            </button>
            <button
              type="button"
              onClick={() => setMode("provider")}
              className={`px-3 py-1 rounded-full font-semibold uppercase tracking-wide transition ${
                mode === "provider"
                  ? "bg-black text-white"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Provider
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {mode === "consumer" && (
              <>
                <Link
                  href="/chat"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Chat
                </Link>
                <Link
                  href="/storyboard"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  My Storyboard
                </Link>
                <Link
                  href="/myth-vault"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Myth Vault
                </Link>
                <Link
                  href="/what-no-one-tells-you"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  The Real Talk
                </Link>
                <Link
                  href="/appointment-prep"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Prep Guide
                </Link>
              </>
            )}
            {mode === "provider" && (
              <>
                <Link
                  href="/provider"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Provider Hub
                </Link>
                <Link
                  href="/provider/widget"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Widget
                </Link>
              </>
            )}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="h-9 w-20 bg-gray-100 rounded-lg animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm text-gray-600">
                  {session.user?.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                {mode === "consumer" ? (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="primary" size="sm">
                        Get Started
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/provider">
                    <Button variant="primary" size="sm">
                      Start Trial
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
