"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";

/**
 * NPA Share Creation Page
 * 
 * The key "aha moment" - users generate a secure link
 * to share their health records with any provider.
 * 
 * KEY UX PRINCIPLES:
 * - Provider doesn't need an account
 * - Patient controls what's shared
 * - Time-limited by default
 * - One-click link generation
 * - Easy copy to clipboard
 */

type Document = {
  id: string;
  title: string;
  category: string;
  dateOfCare: string | null;
  uploadedAt: string;
};

export default function CreateSharePage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status || "loading";
  const router = useRouter();

  const [step, setStep] = useState<"select" | "configure" | "complete">("select");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Configuration
  const [config, setConfig] = useState({
    title: "",
    permission: "READ_ONLY" as "READ_ONLY" | "READ_DOWNLOAD" | "UPLOAD_ALLOWED",
    expiration: "7d" as "24h" | "7d" | "30d" | "custom",
    showPatientName: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/share/create");
      return;
    }
    if (status === "authenticated") {
      fetchDocuments();
    }
  }, [status, router]);

  async function fetchDocuments() {
    try {
      const res = await fetch("/api/vault");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createShare() {
    if (selectedDocs.length === 0) return;

    setCreating(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentIds: selectedDocs,
          title: config.title || `Shared Records - ${new Date().toLocaleDateString()}`,
          permission: config.permission,
          expiration: config.expiration,
          showPatientName: config.showPatientName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setShareLink(data.shareUrl);
        setStep("complete");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create share link");
      }
    } catch (error) {
      console.error("Failed to create share:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function toggleDocument(docId: string) {
    setSelectedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  }

  function selectAll() {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map((d) => d.id));
    }
  }

  async function copyToClipboard() {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vault/dashboard"
            className="text-sm text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Vault
          </Link>
          <h1 className="text-3xl font-bold mb-2">Share with Provider</h1>
          <p className="text-slate-400">
            Generate a secure link to share your records. Your provider doesn't need an account.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {["select", "configure", "complete"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === s
                    ? "bg-purple-600 text-white"
                    : i < ["select", "configure", "complete"].indexOf(step)
                    ? "bg-green-600 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {i < ["select", "configure", "complete"].indexOf(step) ? "✓" : i + 1}
              </div>
              <span
                className={`text-sm ${
                  step === s ? "text-white" : "text-slate-400"
                }`}
              >
                {s === "select" ? "Select Documents" : s === "configure" ? "Configure" : "Share"}
              </span>
              {i < 2 && <div className="w-8 h-0.5 bg-slate-700" />}
            </div>
          ))}
        </div>

        {/* Step 1: Select Documents */}
        {step === "select" && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Select Documents to Share</h2>
                <button
                  onClick={selectAll}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  {selectedDocs.length === documents.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">No documents in your vault yet</p>
                  <Link href="/vault/documents">
                    <Button variant="primary" size="sm">
                      Upload Documents First
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {documents.map((doc) => (
                    <label
                      key={doc.id}
                      className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition ${
                        selectedDocs.includes(doc.id)
                          ? "bg-purple-500/20 border border-purple-500/50"
                          : "bg-white/5 border border-transparent hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => toggleDocument(doc.id)}
                        className="w-5 h-5 rounded border-slate-500 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-slate-400">
                          {doc.category} •{" "}
                          {doc.dateOfCare
                            ? new Date(doc.dateOfCare).toLocaleDateString()
                            : new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-2xl">📄</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={() => setStep("configure")}
                disabled={selectedDocs.length === 0}
                className="bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                Continue ({selectedDocs.length} selected)
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === "configure" && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Share Title (optional)
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="e.g., Records for Dr. Smith appointment"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Permission Level */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Access Level
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: "READ_ONLY", label: "View Only", desc: "Can view documents", icon: "👁️" },
                    { value: "READ_DOWNLOAD", label: "View & Download", desc: "Can download copies", icon: "📥" },
                    { value: "UPLOAD_ALLOWED", label: "Can Upload", desc: "Provider can add records", icon: "📤" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setConfig({ ...config, permission: opt.value as any })}
                      className={`p-4 rounded-lg border text-left transition ${
                        config.permission === opt.value
                          ? "bg-purple-500/20 border-purple-500"
                          : "bg-white/5 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{opt.icon}</span>
                      <p className="font-medium">{opt.label}</p>
                      <p className="text-xs text-slate-400">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Expiration */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Link Expires After
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "24h", label: "24 hours" },
                    { value: "7d", label: "7 days" },
                    { value: "30d", label: "30 days" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setConfig({ ...config, expiration: opt.value as any })}
                      className={`px-4 py-2 rounded-lg border transition ${
                        config.expiration === opt.value
                          ? "bg-purple-500/20 border-purple-500"
                          : "bg-white/5 border-white/10 hover:border-white/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showPatientName}
                    onChange={(e) => setConfig({ ...config, showPatientName: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-500 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <p className="font-medium">Show my name to provider</p>
                    <p className="text-sm text-slate-400">
                      If unchecked, your name won't be displayed on the share page
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep("select")}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={createShare}
                isLoading={creating}
                className="bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                Generate Share Link
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === "complete" && shareLink && (
          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Share Link Created!</h2>
              <p className="text-slate-300 mb-6">
                Send this link to your provider. They can view your records without creating an account.
              </p>

              {/* Share Link */}
              <div className="bg-black/30 rounded-lg p-4 mb-6">
                <p className="text-xs text-slate-400 mb-2">Your secure share link:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-purple-300 break-all">
                    {shareLink}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Quick Share Options */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <a
                  href={`mailto:?subject=Health Records Shared&body=I'm sharing my health records with you via No Prior Authorization.%0A%0AClick here to view: ${encodeURIComponent(shareLink)}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  📧 Email Link
                </a>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  📋 Copy Link
                </button>
              </div>

              {/* Info */}
              <div className="bg-white/5 rounded-lg p-4 text-left text-sm">
                <p className="text-slate-300 mb-2">
                  <strong>What happens next:</strong>
                </p>
                <ul className="text-slate-400 space-y-1">
                  <li>• Your provider clicks the link and sees your selected records</li>
                  <li>• They don't need to create an account</li>
                  <li>• The link expires in {config.expiration === "24h" ? "24 hours" : config.expiration === "7d" ? "7 days" : "30 days"}</li>
                  <li>• You can revoke access anytime from your governance dashboard</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between">
              <Link href="/vault/governance">
                <Button variant="secondary">
                  View in Governance
                </Button>
              </Link>
              <Link href="/vault/dashboard">
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  Back to Vault
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Trust Footer */}
        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-sm text-slate-400 text-center">
            🔒 All share links are encrypted and access is logged.
            <Link href="/vault/governance" className="text-purple-400 hover:text-purple-300 ml-1">
              View access logs →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
