"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/**
 * Provider Share View Page
 * 
 * This is what providers see when they click a share link.
 * NO ACCOUNT REQUIRED - this is the key UX differentiator.
 * 
 * Features:
 * - Clean, read-only view of shared documents
 * - Patient name (if permitted)
 * - Timeline of shared records
 * - Download capability (if permitted)
 * - Upload capability (if permitted)
 */

type SharedDocument = {
  id: string;
  title: string;
  category: string;
  dateOfCare: string | null;
  mimeType: string;
  sizeBytes: number;
  source: string;
};

type ShareData = {
  session: {
    id: string;
    title: string;
    patientName: string | null;
    permission: "READ_ONLY" | "READ_DOWNLOAD" | "UPLOAD_ALLOWED";
    expiresAt: string;
    documentsCount: number;
  };
  documents: SharedDocument[];
};

export default function ProviderViewPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [data, setData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  
  // Upload state (for UPLOAD_ALLOWED)
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMeta, setUploadMeta] = useState({
    providerName: "",
    providerOrg: "",
    providerRole: "MD",
    dateOfCare: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchShareData();
  }, [token]);

  async function fetchShareData() {
    try {
      const res = await fetch(`/api/share/${token}/access`);
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "This share link is invalid or has expired.");
        return;
      }
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError("Unable to load shared records. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadDocument(docId: string, title: string) {
    setDownloading(docId);
    try {
      const res = await fetch(`/api/share/${token}/access?documentId=${docId}&action=download`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = title;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(null);
    }
  }

  async function handleUpload() {
    if (!uploadFile || !uploadMeta.providerName || !uploadMeta.providerOrg || !uploadMeta.dateOfCare) {
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("providerName", uploadMeta.providerName);
      formData.append("providerOrg", uploadMeta.providerOrg);
      formData.append("providerRole", uploadMeta.providerRole);
      formData.append("dateOfCare", uploadMeta.dateOfCare);

      const res = await fetch(`/api/share/${token}/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setUploadSuccess(true);
        setUploadFile(null);
        setShowUpload(false);
        fetchShareData(); // Refresh
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
      }
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function getExpirationText(expiresAt: string) {
    const expires = new Date(expiresAt);
    const now = new Date();
    const diffMs = expires.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Expired";
    if (diffDays === 1) return "Expires in 1 day";
    return `Expires in ${diffDays} days`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading shared records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-8">{error}</p>
          <p className="text-sm text-slate-500">
            If you believe this is an error, please contact the patient who shared this link.
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { session, documents } = data;
  const canDownload = session.permission === "READ_DOWNLOAD" || session.permission === "UPLOAD_ALLOWED";
  const canUpload = session.permission === "UPLOAD_ALLOWED";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <p className="text-sm text-slate-400">Shared Health Records</p>
                <p className="font-semibold">No Prior Authorization</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">{getExpirationText(session.expiresAt)}</p>
              <p className="text-xs text-green-400">🔒 Secure Share</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Share Info Card */}
        <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl p-6 mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold mb-1">{session.title}</h1>
              {session.patientName && (
                <p className="text-slate-300">
                  Shared by <span className="font-semibold text-white">{session.patientName}</span>
                </p>
              )}
              <p className="text-sm text-slate-400 mt-2">
                {documents.length} document{documents.length !== 1 ? "s" : ""} shared with you
              </p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                session.permission === "UPLOAD_ALLOWED" 
                  ? "bg-green-500/20 text-green-400" 
                  : session.permission === "READ_DOWNLOAD"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-slate-500/20 text-slate-400"
              }`}>
                {session.permission === "UPLOAD_ALLOWED" ? "Can Upload" : 
                 session.permission === "READ_DOWNLOAD" ? "Can Download" : "View Only"}
              </span>
            </div>
          </div>
        </div>

        {/* Upload Success Message */}
        {uploadSuccess && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-400">Document uploaded successfully</p>
              <p className="text-sm text-slate-400">The patient will see this in their vault.</p>
            </div>
            <button onClick={() => setUploadSuccess(false)} className="ml-auto text-slate-400 hover:text-white">
              ×
            </button>
          </div>
        )}

        {/* Provider Upload Section */}
        {canUpload && (
          <div className="mb-8">
            {!showUpload ? (
              <button
                onClick={() => setShowUpload(true)}
                className="w-full p-4 border-2 border-dashed border-green-500/30 rounded-xl text-green-400 hover:bg-green-500/10 transition flex items-center justify-center gap-3"
              >
                <span className="text-2xl">📤</span>
                <span>Upload Visit Summary or Notes</span>
              </button>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Upload to Patient's Vault</h3>
                  <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-white">
                    Cancel
                  </button>
                </div>

                {/* File Drop */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center ${
                    uploadFile ? "border-green-500/50 bg-green-500/10" : "border-white/20"
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) setUploadFile(file);
                  }}
                >
                  {uploadFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">📄</span>
                      <span>{uploadFile.name}</span>
                      <button onClick={() => setUploadFile(null)} className="text-red-400 text-sm">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-400 mb-2">Drop PDF here or</p>
                      <label className="cursor-pointer text-purple-400 hover:text-purple-300">
                        choose a file
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </>
                  )}
                </div>

                {/* Provider Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={uploadMeta.providerName}
                      onChange={(e) => setUploadMeta({ ...uploadMeta, providerName: e.target.value })}
                      placeholder="Dr. Jane Smith"
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Organization *</label>
                    <input
                      type="text"
                      value={uploadMeta.providerOrg}
                      onChange={(e) => setUploadMeta({ ...uploadMeta, providerOrg: e.target.value })}
                      placeholder="City Medical Center"
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Role</label>
                    <select
                      value={uploadMeta.providerRole}
                      onChange={(e) => setUploadMeta({ ...uploadMeta, providerRole: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                    >
                      <option value="MD">MD</option>
                      <option value="DO">DO</option>
                      <option value="NP">NP</option>
                      <option value="PA">PA</option>
                      <option value="RN">RN</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Date of Care *</label>
                    <input
                      type="date"
                      value={uploadMeta.dateOfCare}
                      onChange={(e) => setUploadMeta({ ...uploadMeta, dateOfCare: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                </div>

                {/* Legal Notice */}
                <p className="text-xs text-slate-500 mb-4">
                  By uploading, you confirm this document is accurate and intended for this patient's health record.
                </p>

                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || !uploadMeta.providerName || !uploadMeta.providerOrg || !uploadMeta.dateOfCare || uploading}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 rounded-lg font-semibold transition"
                >
                  {uploading ? "Uploading..." : "Upload to Patient's Vault"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Documents List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Shared Documents</h2>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <h3 className="font-semibold">{doc.title}</h3>
                      <p className="text-sm text-slate-400">
                        {doc.category} • {doc.dateOfCare ? new Date(doc.dateOfCare).toLocaleDateString() : "No date"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatFileSize(doc.sizeBytes)} • {doc.source === "PROVIDER" ? "Provider Uploaded" : "Patient Uploaded"}
                      </p>
                    </div>
                  </div>
                  {canDownload && (
                    <button
                      onClick={() => downloadDocument(doc.id, doc.title)}
                      disabled={downloading === doc.id}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition disabled:opacity-50"
                    >
                      {downloading === doc.id ? "..." : "Download"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-slate-400">
            Access is granted by the patient and may be revoked at any time.
            Shared information reflects records as provided and does not constitute medical advice.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <Link href="/security" className="text-xs text-purple-400 hover:text-purple-300">
              Security & Trust
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/privacy" className="text-xs text-purple-400 hover:text-purple-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
