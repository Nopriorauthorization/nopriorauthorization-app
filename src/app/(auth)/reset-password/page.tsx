"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card, { CardContent, CardHeader } from "@/components/ui/card";

/**
 * NPA Password Reset Page
 * 
 * AUDIT LOGGING:
 * - Password reset request logged
 * - Password reset success logged
 */

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send reset email");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
        {/* NPA Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 mb-4">
            <span className="text-2xl font-bold text-white">NPA</span>
          </div>
        </div>

        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
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
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Check Your Email</h1>
            <p className="text-slate-600 mb-6">
              If an account exists for <strong>{email}</strong>, you&apos;ll receive
              password reset instructions shortly.
            </p>
            <Link href="/login">
              <Button
                variant="secondary"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Trust Footer */}
        <p className="mt-8 text-xs text-slate-400">
          Didn&apos;t receive an email? Check your spam folder or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
      {/* NPA Logo */}
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
          <h1 className="text-2xl font-bold text-slate-900">Reset Your Password</h1>
          <p className="text-slate-600 mt-2">
            Enter your email and we&apos;ll send you reset instructions.
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 border border-red-200">
              {error}
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              isLoading={isLoading}
            >
              Send Reset Instructions
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Back to login
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
        <a href="mailto:support@nopriorauthorization.com" className="hover:text-purple-600">
          Contact Support
        </a>
      </footer>

      <p className="mt-4 text-xs text-slate-400">
        © {new Date().getFullYear()} No Prior Authorization. All rights reserved.
      </p>
    </div>
  );
}
