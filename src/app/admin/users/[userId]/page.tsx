"use client";

/**
 * ADMIN PORTAL: User Detail
 * 
 * PHASE 2A.2 — Individual user management with disable/enable
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type UserDetail = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isDisabled: boolean;
  createdAt: string;
  lastAccessAt: string | null;
};

type DisableEvent = {
  id: string;
  disabledAt: string;
  disabledBy: string;
  disabledByEmail?: string;
  reason: string | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
  resolvedByEmail?: string;
};

type ConsentLog = {
  id: string;
  consentType: string;
  oldValue: boolean;
  newValue: boolean;
  changedAt: string;
  changedBy: { id: string; email: string; name: string | null } | null;
  source: string;
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [consent, setConsent] = useState<any>(null);
  const [consentHistory, setConsentHistory] = useState<ConsentLog[]>([]);
  const [dataRequests, setDataRequests] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [disableHistory, setDisableHistory] = useState<DisableEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Disable/Enable state
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disableReason, setDisableReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch user detail
  const fetchUserDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      
      if (!response.ok) {
        if (response.status === 403) {
          window.location.href = "/login?callbackUrl=/admin/users";
          return;
        }
        if (response.status === 404) {
          setError("User not found");
          return;
        }
        throw new Error("Failed to fetch user detail");
      }

      const data = await response.json();
      setUser(data.user);
      setConsent(data.consent);
      setDataRequests(data.dataRequests);
      setSummary(data.summary);
      setDisableHistory(data.disableHistory);

      // Fetch consent history
      const consentResponse = await fetch(`/api/admin/users/${userId}/consent-history`);
      if (consentResponse.ok) {
        const consentData = await consentResponse.json();
        setConsentHistory(consentData.logs || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  // Handle disable
  const handleDisable = async () => {
    if (!confirm("This will immediately prevent login and all access. Continue?")) {
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}/disable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: disableReason || null }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to disable user");
      }

      setShowDisableModal(false);
      setDisableReason("");
      await fetchUserDetail(); // Refresh
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to disable user");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle enable
  const handleEnable = async () => {
    if (!confirm("This will restore login and access for this user. Continue?")) {
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}/enable`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to enable user");
      }

      await fetchUserDetail(); // Refresh
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to enable user");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-hot-pink border-t-transparent"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-black text-white p-12">
        <div className="max-w-2xl mx-auto">
          <p className="text-red-400">{error || "User not found"}</p>
          <Link href="/admin/users" className="text-hot-pink hover:text-pink-300 text-sm mt-4 inline-block">
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="text-xs uppercase tracking-[0.35em] text-hot-pink hover:text-pink-300 transition"
          >
            ← Users
          </Link>
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold">{user.email}</h1>
              {user.name && <p className="mt-1 text-gray-400">{user.name}</p>}
              <div className="mt-2 flex items-center gap-3">
                <span
                  className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                    user.role === "ADMIN"
                      ? "bg-hot-pink/20 text-hot-pink"
                      : user.role === "PROVIDER"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-700/50 text-gray-300"
                  }`}
                >
                  {user.role}
                </span>
                {user.isDisabled ? (
                  <span className="text-xs text-red-400">● Disabled</span>
                ) : (
                  <span className="text-xs text-green-400">● Active</span>
                )}
              </div>
            </div>
            <div>
              {user.isDisabled ? (
                <button
                  onClick={handleEnable}
                  disabled={actionLoading}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading ? "Enabling..." : "Enable Account"}
                </button>
              ) : (
                <button
                  onClick={() => setShowDisableModal(true)}
                  disabled={actionLoading}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  Disable Account
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-hot-pink">Account Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">User ID:</span>{" "}
                <span className="font-mono text-gray-300">{user.id}</span>
              </div>
              <div>
                <span className="text-gray-500">Role:</span>{" "}
                <span className="text-gray-300">{user.role}</span>
                <p className="text-xs text-gray-500 mt-1">Managed by support</p>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>{" "}
                <span className="text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Last Access:</span>{" "}
                <span className="text-gray-300">
                  {user.lastAccessAt
                    ? new Date(user.lastAccessAt).toLocaleString()
                    : "Never"}
                </span>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-hot-pink">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href={`/admin/activity-logs?search=${user.id}`}
                className="block text-sm text-gray-300 hover:text-hot-pink transition"
              >
                → View Activity Logs for this user
              </Link>
              <Link
                href={`/admin/share-links?userId=${user.id}`}
                className="block text-sm text-gray-300 hover:text-hot-pink transition opacity-50 cursor-not-allowed"
              >
                → View Active Share Links (Coming Soon)
              </Link>
              <Link
                href={`/admin/consent-history?search=${user.email}`}
                className="block text-sm text-gray-300 hover:text-hot-pink transition"
              >
                → View Consent History
              </Link>
            </div>
          </section>

          {/* Consent Status */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-hot-pink">Consent Status</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {consent.clinicalSummarySharing ? (
                  <span className="text-green-400">✅</span>
                ) : (
                  <span className="text-red-400">❌</span>
                )}
                <span className="text-gray-300">Clinical Summary Sharing</span>
              </div>
              <div className="flex items-center gap-2">
                {consent.providerToProviderSharing ? (
                  <span className="text-green-400">✅</span>
                ) : (
                  <span className="text-red-400">❌</span>
                )}
                <span className="text-gray-300">Provider-to-Provider Sharing</span>
              </div>
              <div className="flex items-center gap-2">
                {consent.emailNotificationsEnabled ? (
                  <span className="text-green-400">✅</span>
                ) : (
                  <span className="text-red-400">❌</span>
                )}
                <span className="text-gray-300">Email Notifications</span>
              </div>
            </div>
            
            {/* Recent Consent Changes */}
            {consentHistory.length > 0 && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Recent Changes</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {consentHistory.slice(0, 10).map((log) => (
                    <div key={log.id} className="text-xs bg-black/30 rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">
                          {log.consentType === "clinicalSummary" && "Clinical Summary"}
                          {log.consentType === "providerSharing" && "Provider Sharing"}
                          {log.consentType === "emailNotifications" && "Email Notifications"}
                        </span>
                        <span className={log.newValue ? "text-green-400" : "text-red-400"}>
                          {log.oldValue ? "✓" : "✗"} → {log.newValue ? "✓" : "✗"}
                        </span>
                      </div>
                      <div className="text-gray-500 mt-1">
                        {new Date(log.changedAt).toLocaleString()} •{" "}
                        {log.changedBy ? log.changedBy.email : "Self"} •{" "}
                        {log.source}
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/admin/consent-history?search=${user.email}`}
                  className="text-xs text-hot-pink hover:underline mt-2 inline-block"
                >
                  View all consent changes →
                </Link>
              </div>
            )}
          </section>

          {/* Summary Stats */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-hot-pink">Activity Summary</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-2xl font-semibold text-white">
                  {summary.activeShareLinksCount}
                </div>
                <div className="text-xs text-gray-500">Active Share Links</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-white">
                  {summary.recentActivityCount}
                </div>
                <div className="text-xs text-gray-500">Activity Events (30d)</div>
              </div>
            </div>
          </section>

          {/* Disable History */}
          {disableHistory.length > 0 && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-lg font-semibold text-hot-pink">Disable History</h2>
              <div className="space-y-3">
                {disableHistory.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-white/5 bg-black/30 p-3 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-red-400">
                          Disabled: {new Date(event.disabledAt).toLocaleString()}
                        </div>
                        <div className="text-gray-500 mt-1">
                          By: {event.disabledByEmail || event.disabledBy}
                        </div>
                        {event.reason && (
                          <div className="text-gray-400 mt-1">Reason: {event.reason}</div>
                        )}
                      </div>
                      {event.resolvedAt && (
                        <div className="text-right">
                          <div className="text-green-400">
                            Enabled: {new Date(event.resolvedAt).toLocaleString()}
                          </div>
                          <div className="text-gray-500 mt-1">
                            By: {event.resolvedByEmail || event.resolvedBy}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Data Requests */}
          {(dataRequests.exportRequested || dataRequests.deletionRequested) && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-lg font-semibold text-hot-pink">Data Requests</h2>
              <div className="space-y-2 text-sm">
                {dataRequests.exportRequested && (
                  <div className="text-gray-300">
                    Export requested: {new Date(dataRequests.exportRequested).toLocaleDateString()}
                  </div>
                )}
                {dataRequests.deletionRequested && (
                  <div className="text-red-400">
                    ⚠️ Deletion requested:{" "}
                    {new Date(dataRequests.deletionRequested).toLocaleDateString()}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Disable Modal */}
        {showDisableModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                ⚠️ Disable Account: {user.email}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                This will immediately:
              </p>
              <ul className="text-sm text-gray-400 mb-6 list-disc list-inside">
                <li>Prevent login and all access</li>
                <li>Revoke all active sessions</li>
                <li>Log this action to audit trail</li>
              </ul>
              <label className="block text-sm text-gray-300 mb-2">
                Reason (optional):
              </label>
              <textarea
                value={disableReason}
                onChange={(e) => setDisableReason(e.target.value)}
                placeholder="Optional reason for disabling..."
                className="w-full rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-hot-pink focus:outline-none mb-6"
                rows={3}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDisableModal(false);
                    setDisableReason("");
                  }}
                  className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-white transition hover:border-hot-pink"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisable}
                  disabled={actionLoading}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? "Disabling..." : "Disable Account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
