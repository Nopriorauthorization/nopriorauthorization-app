const fs = require('fs');
const path = require('path');

const documentsPageContent = `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Document = {
  id: string;
  title: string;
  category: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  docDate: Date | null;
  createdAt: Date;
  hasDecoded?: boolean;
};

type DocumentsData = {
  documents: Document[];
  stats: {
    total: number;
    totalSizeMB: number;
    decoded: number;
    categories: number;
  };
  categories: Array<{ name: string; value: string; count: number }>;
  recentUploads: Array<{
    id: string;
    title: string;
    category: string;
    createdAt: Date;
    hasDecoded: boolean;
  }>;
  isEmpty: boolean;
};

export default function DocumentsPage() {
  const [data, setData] = useState<DocumentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory, searchQuery]);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(\`/api/vault/documents?\${params}\`);
      if (res.ok) {
        const docsData = await res.json();
        setData(docsData);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelectDoc(id: string) {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocs(newSelected);
  }

  function selectAll() {
    if (data && selectedDocs.size === data.documents.length) {
      setSelectedDocs(new Set());
    } else if (data) {
      setSelectedDocs(new Set(data.documents.map(d => d.id)));
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
    return Math.round(bytes / (1024 * 1024) * 10) / 10 + " MB";
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getCategoryIcon(category: string) {
    const icons: Record<string, string> = {
      LAB_RESULT: "🧪",
      IMAGING: "📊",
      PRESCRIPTION: "💊",
      REFERRAL: "📋",
      INSURANCE: "🏥",
      BILLING: "💳",
      OTHER: "📄",
    };
    return icons[category] || "📄";
  }

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-white/10 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="h-24 bg-white/5 rounded"></div>
              <div className="h-24 bg-white/5 rounded"></div>
              <div className="h-24 bg-white/5 rounded"></div>
              <div className="h-24 bg-white/5 rounded"></div>
            </div>
            <div className="h-64 bg-white/5 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!data || data.isEmpty) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">📄</span>
            <h1 className="text-4xl md:text-5xl font-semibold">Documents</h1>
          </div>

          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">📁</span>
            <p className="text-gray-500 text-lg mb-6">
              No documents uploaded yet. Start building your health vault.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/documents"
                className="px-6 py-3 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
              >
                Upload Documents
              </Link>
              <Link
                href="/vault/decoder"
                className="px-6 py-3 rounded-full bg-white/5 text-white text-sm font-semibold hover:bg-white/10 transition border border-white/10"
              >
                Decode a Document
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { documents, stats, categories } = data;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/vault"
          className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
        >
          ← Back to Sacred Vault
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📄</span>
            <h1 className="text-4xl md:text-5xl font-semibold">Documents</h1>
          </div>
          <Link
            href="/documents"
            className="px-4 py-2 rounded-full bg-pink-400 text-black text-sm font-semibold hover:bg-pink-500 transition"
          >
            + Upload
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
            <div className="text-xs text-gray-400 mt-1">Total Documents</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-2xl font-bold text-purple-400">{stats.totalSizeMB} MB</div>
            <div className="text-xs text-gray-400 mt-1">Storage Used</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-2xl font-bold text-pink-400">{stats.decoded}</div>
            <div className="text-xs text-gray-400 mt-1">Decoded</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-2xl font-bold text-green-400">{stats.categories}</div>
            <div className="text-xs text-gray-400 mt-1">Categories</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-pink-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={\`px-4 py-2 rounded-full text-sm font-semibold transition \${
                selectedCategory === "all"
                  ? "bg-pink-400 text-black"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }\`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={\`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2 \${
                  selectedCategory === cat.value
                    ? "bg-pink-400 text-black"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }\`}
              >
                <span>{getCategoryIcon(cat.value)}</span>
                <span>{cat.name}</span>
                <span className="opacity-60">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDocs.size > 0 && (
          <div className="mb-4 p-4 rounded-xl border border-pink-400/30 bg-pink-400/5 flex items-center justify-between">
            <span className="text-sm text-white">
              {selectedDocs.size} document{selectedDocs.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition">
                Download Selected
              </button>
              <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition">
                Decode Selected
              </button>
              <button
                onClick={() => setSelectedDocs(new Set())}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="space-y-3">
          {/* Select All */}
          <div className="flex items-center gap-3 px-4 py-2">
            <input
              type="checkbox"
              checked={selectedDocs.size === documents.length && documents.length > 0}
              onChange={selectAll}
              className="w-4 h-4 rounded border-white/20 bg-white/5"
            />
            <span className="text-sm text-gray-400">Select All</span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No documents found matching your filters.
            </div>
          ) : (
            documents.map((doc: any) => (
              <div
                key={doc.id}
                className={\`p-5 rounded-xl border transition \${
                  selectedDocs.has(doc.id)
                    ? "border-pink-400/30 bg-pink-400/5"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }\`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedDocs.has(doc.id)}
                    onChange={() => toggleSelectDoc(doc.id)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(doc.category)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                          <p className="text-xs text-gray-500">{doc.originalFileName}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {doc.decodes && doc.decodes.length > 0 && (
                          <span className="px-3 py-1 rounded-full text-xs bg-pink-400/10 text-pink-400 border border-pink-400/20">
                            Decoded
                          </span>
                        )}
                        <span className="px-3 py-1 rounded-full text-xs bg-blue-400/10 text-blue-400 border border-blue-400/20">
                          {doc.category.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span>{formatFileSize(doc.sizeBytes)}</span>
                      <span>•</span>
                      <span>Uploaded {formatDate(doc.createdAt)}</span>
                      {doc.docDate && (
                        <>
                          <span>•</span>
                          <span>Document date: {formatDate(doc.docDate)}</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <a
                        href={\`/api/documents/\${doc.id}/download\`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition"
                      >
                        Download
                      </a>
                      {(!doc.decodes || doc.decodes.length === 0) && (
                        <Link
                          href={\`/vault/decoder?doc=\${doc.id}\`}
                          className="px-4 py-2 rounded-lg bg-pink-400/10 hover:bg-pink-400/20 text-pink-400 text-sm transition"
                        >
                          Decode
                        </Link>
                      )}
                      {doc.decodes && doc.decodes.length > 0 && (
                        <Link
                          href={\`/vault/decoder?doc=\${doc.id}\`}
                          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition"
                        >
                          View Decode
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        {documents.length > 0 && (
          <div className="mt-8 p-6 rounded-xl border border-white/10 bg-white/5">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/documents"
                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-center"
              >
                <div className="text-2xl mb-2">📤</div>
                <div className="text-sm font-semibold">Upload More</div>
              </Link>
              <Link
                href="/vault/decoder"
                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-center"
              >
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-sm font-semibold">Decode</div>
              </Link>
              <Link
                href="/vault/analytics"
                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-center"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-semibold">Analytics</div>
              </Link>
              <Link
                href="/vault/timeline"
                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-center"
              >
                <div className="text-2xl mb-2">📅</div>
                <div className="text-sm font-semibold">Timeline</div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
`;

const targetPath = path.join(process.cwd(), 'src/app/vault/documents/page.tsx');
fs.writeFileSync(targetPath, documentsPageContent, 'utf8');
console.log('✅ Documents page successfully written to:', targetPath);
