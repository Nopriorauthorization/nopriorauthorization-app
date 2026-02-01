"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card, { CardContent, CardHeader } from "@/components/ui/card";

/**
 * NPA Login Page
 * 
 * DEV NOTE (REQUIRED):
 * "Authentication establishes patient ownership and trust.
 * This flow must remain calm, minimal, and compliant.
 * No medical claims or analytics belong at login."
 * 
 * PROHIBITED LANGUAGE (DO NOT USE):
 * - "diagnose"
 * - "medical advice"
 * - "AI doctor"
 * - "replace your physician"
 * - "emergency care"
 */

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/vault/dashboard";
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    error === "CredentialsSignin" ? "Invalid email or password" : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
      {/* NPA Logo/Branding */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 mb-4">
          <span className="text-2xl font-bold text-white">NPA</span>
        </div>
        <p className="text-sm text-slate-500 font-medium tracking-wider uppercase">
          No Prior Authorization
        </p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          {/* PRIMARY HEADLINE (USE VERBATIM) */}
          <h1 className="text-2xl font-bold text-slate-900">
            Your health history. Owned by you.
          </h1>
          {/* SUBHEADLINE (USE VERBATIM) */}
          <p className="text-slate-600 mt-2">
            Access your No Prior Authorization health vault and continuity record.
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Success message (e.g., after signup) */}
          {message && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-4 border border-green-200">
              {message}
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 border border-red-200">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-sm text-slate-500 hover:text-slate-700 font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                href="/reset-password"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              isLoading={isLoading}
            >
              Log In
            </Button>
          </form>

          {/* TRUST LINE (REQUIRED) */}
          <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 text-center">
              🔒 We never sell health data. Access is permission-based and revocable.
            </p>
          </div>

          {/* Signup link */}
          <div className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* REQUIRED FOOTER LINKS */}
      <footer className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
        <Link href="/privacy" className="hover:text-purple-600">
          Privacy Policy
        </Link>
        <span className="text-slate-300">|</span>
        <Link href="/terms" className="hover:text-purple-600">
          Terms of Use
        </Link>
        <span className="text-slate-300">|</span>
        <Link href="/security" className="hover:text-purple-600">
          Security & Trust
        </Link>
        <span className="text-slate-300">|</span>
        <a href="mailto:support@nopriorauthorization.com" className="hover:text-purple-600">
          Contact Support
        </a>
      </footer>

      {/* Copyright */}
      <p className="mt-4 text-xs text-slate-400">
        © {new Date().getFullYear()} No Prior Authorization. All rights reserved.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100" aria-hidden />
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
