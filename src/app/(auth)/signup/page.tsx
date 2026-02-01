"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card, { CardContent, CardHeader } from "@/components/ui/card";

/**
 * NPA Signup Page
 * 
 * DEV NOTE (REQUIRED):
 * "Authentication establishes patient ownership and trust.
 * This flow must remain calm, minimal, and compliant.
 * No medical claims or analytics belong at login."
 * 
 * REQUIRED: User must check disclaimer checkbox to complete signup.
 * 
 * PROHIBITED LANGUAGE (DO NOT USE):
 * - "diagnose"
 * - "medical advice"
 * - "AI doctor"
 * - "replace your physician"
 * - "emergency care"
 */

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate disclaimer checkbox (NON-NEGOTIABLE)
    if (!disclaimerAccepted) {
      setError("You must acknowledge the disclaimer to create an account.");
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Create account
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          disclaimerAccepted: true, // Send acknowledgment to server
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Auto-login after signup
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Account created but login failed - redirect to login
        router.push("/login?message=Account created. Please log in.");
      } else {
        // Success - redirect to NPA Welcome page (not subscribe)
        router.push("/vault/welcome");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
          {/* PRIMARY HEADLINE */}
          <h1 className="text-2xl font-bold text-slate-900">
            Take ownership of your health history
          </h1>
          {/* SUBHEADLINE */}
          <p className="text-slate-600 mt-2">
            Create your NPA Health ID and secure vault in seconds.
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name (optional)"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-sm text-slate-500 hover:text-slate-700 font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />

            <p className="text-xs text-slate-500">
              Password must be at least 8 characters with uppercase, lowercase, and a number.
            </p>

            {/* REQUIRED DISCLAIMER CHECKBOX (NON-NEGOTIABLE) */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-amber-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-amber-900">
                  I understand No Prior Authorization is not a medical provider and does not
                  provide medical advice.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              isLoading={isLoading}
              disabled={!disclaimerAccepted}
            >
              Create Account
            </Button>

            <p className="text-xs text-center text-slate-500">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-purple-600 hover:underline">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-purple-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          {/* TRUST LINE */}
          <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 text-center">
              🔒 We never sell health data. Access is permission-based and revocable.
            </p>
          </div>

          {/* Login link */}
          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Log in
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
