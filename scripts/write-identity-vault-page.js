const fs = require('fs');
const path = require('path');

const pageContent = `"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Document = {
  id: string;
  title: string;
  category: string;
  mimeType: string;
  sizeBytes: number;
  docDate: string | null;
  createdAt: string;
  decode: { id: string; createdAt: string } | null;
};

type DocumentsData = {
  documents: Document[];
  stats: {
    total: number;
    totalSizeMB: number;
    decoded: number;
    categories: number;
  };
  categories: { name: string; count: number }[];
  recentUploads: Document[];
  isEmpty: boolean;
};

const IDENTITY_CATEGORIES = [
  { value: "INSURANCE_CARD", label: "Insurance Cards", icon: "🏥", description: "Front/back of insurance cards" },
  { value: "GOVERNMENT_ID", label: "Government ID", icon: "🪪", description: "Optional, user-controlled" },
  { value: "REFERRAL", label: "Referrals", icon: "📋", description: "Specialist referrals" },
  { value: "LAB_ORDER", label: "Lab Orders", icon: "🧪", description: "Lab test orders" },
  { value: "IMAGING_ORDER", label: "Imaging Orders", icon: "📊", description: "Imaging orders (MRI, CT, etc)" },
  { value: "PRIOR_AUTH", label: "Prior Auth", icon: "✅", description: "Prior authorization letters" },
  { value: "BENEFITS_SUMMARY", label: "Benefits", icon: "📄", description: "Benefits summaries" },
  { value: "PRESCRIPTION", label: "Prescriptions", icon: "💊", description: "Medication prescriptions" },
  { value: "LAB_RESULT", label: "Lab Results", icon: "🔬", description: "Lab test results" },
  { value: "IMAGING", label: "Imaging", icon: "🩻", description: "Medical imaging" },
  { value: "OTHER", label: "Other", icon: "📎", description: "Other documents" },
];

export default function DocumentsPage() {
  const [data, setData] = useState<DocumentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.set("category", selectedCategory);
      }

      const res = await fetch(\`/api/vault/documents?\${params.toString()}\`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryInfo = (category: string) => {
    return IDENTITY_CATEGORIES.find((c) => c.value === category) || IDENTITY_CATEGORIES[IDENTITY_CATEGORIES.length - 1];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3"></div>
          <div className="h-32 bg-white/5 rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white/5 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-red-400">Failed to load identity vault</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Identity Vault</h1>
        <p className="text-white/60 text-sm mt-1">
          Everything you need to upload, store, or send for your healthcare
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h3 className="font-semibold text-white mb-1">
              Secure Healthcare Document Storage
            </h3>
            <p className="text-sm text-white/80">
              Store insurance cards, IDs, referrals, orders, and authorizations. View and download anytime—no sharing by default.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {!data.isEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">
              {data.stats.total}
            </div>
            <div className="text-sm text-white/60">Total Documents</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {data.stats.totalSizeMB.toFixed(1)} MB
            </div>
            <div className="text-sm text-white/60">Storage Used</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-pink-400">
              {data.stats.decoded}
            </div>
            <div className="text-sm text-white/60">Decoded</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {data.stats.categories}
            </div>
            <div className="text-sm text-white/60">Categories</div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-semibold text-white">Document Types</h2>
          <span className="text-sm text-white/50">
            ({selectedCategory === "all" ? "All" : getCategoryInfo(selectedCategory).label})
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={\`p-3 rounded-lg border transition-colors \${
              selectedCategory === "all"
                ? "bg-pink-400/20 border-pink-400 text-white"
                : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
            }\`}
          >
            <div className="text-2xl mb-1">📁</div>
            <div className="text-xs font-medium">All Types</div>
          </button>
          {IDENTITY_CATEGORIES.slice(0, 7).map((cat) => {
            const count = data.categories.find((c) => c.name === cat.value)?.count || 0;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={\`p-3 rounded-lg border transition-colors \${
                  selectedCategory === cat.value
                    ? "bg-pink-400/20 border-pink-400 text-white"
                    : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                }\`}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-xs font-medium">{cat.label}</div>
                {count > 0 && (
                  <div className="text-xs text-white/50 mt-1">({count})</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link
          href="/documents"
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
        >
          + Upload Documents
        </Link>
        <Link
          href="/vault/decoder"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
        >
          Decode Documents
        </Link>
      </div>

      {/* Empty State */}
      {data.isEmpty && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            No documents uploaded yet
          </h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Upload your healthcare documents to keep everything organized and accessible.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/documents"
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
            >
              Upload First Document
            </Link>
            <Link
              href="/vault/decoder"
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            >
              Decode a Document
            </Link>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      {!data.isEmpty && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">
            Your Documents ({data.documents.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.documents.map((doc) => {
              const catInfo = getCategoryInfo(doc.category);
              return (
                <div
                  key={doc.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-pink-400/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{catInfo.icon}</div>
                    <div className="flex gap-1">
                      {doc.decode && (
                        <span className="px-2 py-1 bg-pink-400/20 text-pink-400 text-xs font-medium rounded">
                          Decoded
                        </span>
                      )}
                      <span className="px-2 py-1 bg-blue-400/20 text-blue-400 text-xs font-medium rounded">
                        {catInfo.label}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-white mb-1">{doc.title}</h3>
                  
                  <div className="text-xs text-white/50 space-y-1 mb-3">
                    <div>Size: {formatFileSize(doc.sizeBytes)}</div>
                    <div>Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</div>
                    {doc.docDate && (
                      <div>Document Date: {new Date(doc.docDate).toLocaleDateString()}</div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors">
                      Download
                    </button>
                    {!doc.decode && (
                      <Link
                        href="/vault/decoder"
                        className="flex-1 px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 text-sm rounded transition-colors text-center"
                      >
                        Decode
                      </Link>
                    )}
                    {doc.decode && (
                      <button className="flex-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm rounded transition-colors">
                        View Decode
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
`;

const outputPath = path.join(__dirname, '../src/app/vault/documents/page.tsx');

fs.writeFileSync(outputPath, pageContent, 'utf8');
console.log('✅ Identity Vault (Documents) page successfully written to', outputPath);
