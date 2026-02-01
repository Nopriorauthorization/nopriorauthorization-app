"use client";
export const dynamic = "force-dynamic";

import { useSession } from "next-auth/react";
import Link from "next/link";
import DocumentsVault from "@/components/documents/DocumentsVault";
import Button from "@/components/ui/button";

/**
 * NPA Documents Upload Page
 * 
 * The primary place for patients to upload their health records.
 * Supports: PDFs (MyChart, Epic), images (labs, scans), and more.
 */

export default function DocumentsPage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status || "loading";

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to upload documents</h1>
          <Link href="/login">
            <Button variant="primary">Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vault/dashboard"
            className="text-sm text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Vault
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Upload Health Records
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Add your medical records, lab results, visit summaries, and more.
            Everything stays encrypted and patient-owned.
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-purple-300 mb-1">
                Supported Formats
              </p>
              <p className="text-sm text-slate-300">
                <strong>PDFs:</strong> MyChart exports, Epic summaries, discharge notes, lab reports
                <br />
                <strong>Images:</strong> Photos of lab results, prescriptions, insurance cards
              </p>
            </div>
          </div>
        </div>

        {/* Documents Vault Component */}
        <DocumentsVault />

        {/* Help Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-2xl mb-2 block">📥</span>
            <h3 className="font-semibold mb-1">From MyChart</h3>
            <p className="text-sm text-slate-400">
              Download your records as PDF from MyChart and upload here.
            </p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-2xl mb-2 block">📸</span>
            <h3 className="font-semibold mb-1">Take Photos</h3>
            <p className="text-sm text-slate-400">
              Snap a photo of paper documents, prescriptions, or cards.
            </p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-2xl mb-2 block">🔗</span>
            <h3 className="font-semibold mb-1">Share Anytime</h3>
            <p className="text-sm text-slate-400">
              Once uploaded, share with any provider via secure link.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/vault/timeline">
            <Button variant="secondary" size="sm">
              View Timeline
            </Button>
          </Link>
          <Link href="/share/create">
            <Button variant="primary" size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600">
              Share with Provider
            </Button>
          </Link>
        </div>

        {/* Trust Footer */}
        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-slate-400">
            🔒 All documents are encrypted and patient-owned. We never sell your data.
          </p>
        </div>
      </div>
    </div>
  );
}
