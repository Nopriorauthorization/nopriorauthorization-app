"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ShareDetails {
  id: string;
  token: string;
  documentId: string;
  documentTitle: string;
  documentCategory: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
  revokedBy: { email: string; name: string | null } | null;
  status: string;
  accessCount: number;
}

interface Access {
  id: string;
  accessedAt: string;
  ipAddress: string | null;
  userAgent: string | null;
}

export default function ShareLinkDetailPage({ params }: { params: { linkId: string } }) {
  const router = useRouter();
  const [share, setShare] = useState<ShareDetails | null>(null);
  const [accesses, setAccesses] = useState<Access[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const [revoking, setRevoking] = useState(false);

  const fetchShareDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/share-links/${params.linkId}`);
      const data = await response.json();
      
      setShare(data.share);
      setAccesses(data.accesses);
    } catch (error) {
      console.error("Failed to fetch share details:", error);
    } finally {
      setLoading(false);
    }
  }, [params.linkId]);

  useEffect(() => {
    fetchShareDetails();
  }, [fetchShareDetails]);

  const handleRevoke = async () => {
    setRevoking(true);
    try {
      const response = await fetch(`/api/admin/share-links/${params.linkId}/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: revokeReason || undefined }),
      });

      if (response.ok) {
        setShowRevokeModal(false);
        fetchShareDetails(); // Refresh data
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to revoke share link");
    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!share) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Share link not found</div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      expired: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      revoked: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors[status as keyof typeof colors]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/share-links" className="text-sm text-hot-pink hover:text-hot-pink-dark mb-4 inline-block">
            ← Back to Share Links
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Share Link Details</h1>
              <p className="mt-2 text-sm text-gray-400">
                Document: {share.documentTitle}
              </p>
            </div>
            {getStatusBadge(share.status)}
          </div>
        </div>

        {/* Share Details */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Share Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500">User</dt>
                <dd className="text-sm">
                  {share.userEmail}
                  {share.userName && <span className="text-gray-400"> ({share.userName})</span>}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Document Category</dt>
                <dd className="text-sm">{share.documentCategory}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Created</dt>
                <dd className="text-sm">{new Date(share.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Expires</dt>
                <dd className="text-sm">{new Date(share.expiresAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Total Accesses</dt>
                <dd className="text-sm">{share.accessCount}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Actions</h3>
            <div className="space-y-3">
              <Link
                href={`/admin/users/${share.userId}`}
                className="block px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-center transition"
              >
                View User Profile
              </Link>
              <Link
                href={`/admin/activity-logs?userId=${share.userId}`}
                className="block px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-center transition"
              >
                View User Activity
              </Link>
              {share.status === "active" && (
                <button
                  onClick={() => setShowRevokeModal(true)}
                  className="w-full px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-medium transition"
                >
                  Revoke Share Link
                </button>
              )}
              {share.revokedAt && share.revokedBy && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-400 mb-1">Revoked By</p>
                  <p className="text-sm">{share.revokedBy.email}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(share.revokedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Access Logs */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-medium mb-4">Access History</h3>
          {accesses.length === 0 ? (
            <p className="text-sm text-gray-400">No accesses recorded</p>
          ) : (
            <div className="space-y-3">
              {accesses.map((access) => (
                <div key={access.id} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">
                      {new Date(access.accessedAt).toLocaleString()}
                    </div>
                    {access.ipAddress && (
                      <div className="text-xs text-gray-500 mt-1">
                        IP: {access.ipAddress}
                      </div>
                    )}
                    {access.userAgent && (
                      <div className="text-xs text-gray-500 mt-1">
                        {access.userAgent.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl border border-white/10 p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Revoke Share Link</h3>
            <p className="text-sm text-gray-400 mb-6">
              This will immediately prevent access to this share link. The action will be logged to the audit trail.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="E.g., User request, security concern, etc."
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-hot-pink focus:outline-none resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRevokeModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                disabled={revoking}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition disabled:opacity-50"
              >
                {revoking ? "Revoking..." : "Confirm Revoke"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
