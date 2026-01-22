"use client";
export const dynamic = 'force-dynamic';
/**
 * ADMIN PORTAL: Activity & Audit Logs
 * 
 * PHASE 2A.1 — Core compliance and visibility interface
 * 
 * READ-ONLY PHI POLICY:
 * - Displays: User IDs, emails, timestamps, action types
 * - Does NOT display: Clinical content, chat transcripts, documents
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type AccessLog = {
  id: string;
  timestamp: string;
  actorId: string | null;
  actorEmail?: string;
  actorName?: string;
  subjectUserId: string | null;
  subjectEmail?: string;
  subjectName?: string;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: any;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

const demoLogs: AccessLog[] = [
  {
    id: "demo-log-1",
    timestamp: new Date("2024-03-02T14:15:00Z").toISOString(),
    actorId: "support-agent-1",
    actorEmail: "support1@example.com",
    actorName: "Support Agent",
    subjectUserId: "demo-user-1",
    subjectEmail: "guest.patient@example.com",
    subjectName: "Guest Patient",
    action: "VIEW",
    resourceType: "vault_item",
    resourceId: "vault-demo-1",
    ipAddress: "203.0.113.42",
    userAgent: "Mozilla/5.0",
    metadata: { notes: "Viewed sacred vault overview" },
  },
  {
    id: "demo-log-2",
    timestamp: new Date("2024-03-01T09:30:00Z").toISOString(),
    actorId: "support-agent-2",
    actorEmail: "support2@example.com",
    actorName: "Support Agent",
    subjectUserId: "demo-user-2",
    subjectEmail: "guest.provider@example.com",
    subjectName: "Guest Provider",
    action: "CONSENT_GRANTED",
    resourceType: "consent",
    resourceId: "consent-demo-1",
    ipAddress: "198.51.100.24",
    userAgent: "Mozilla/5.0",
    metadata: { consentType: "providerSharing" },
  },
  {
    id: "demo-log-3",
    timestamp: new Date("2024-02-24T20:05:00Z").toISOString(),
    actorId: "support-agent-1",
    actorEmail: "support1@example.com",
    actorName: "Support Agent",
    subjectUserId: "demo-user-3",
    subjectEmail: "guest.admin@example.com",
    subjectName: "Guest Admin",
    action: "USER_ENABLED",
    resourceType: "user_account",
    resourceId: "demo-user-3",
    ipAddress: "192.0.2.55",
    userAgent: "Mozilla/5.0",
    metadata: { reason: "Security review completed" },
  },
];

const demoPagination: Pagination = {
  page: 1,
  limit: 25,
  total: demoLogs.length,
  pages: 1,
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Filters
  const [action, setAction] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsDemoMode(false);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(action !== "ALL" && { action }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/activity-logs?${params}`);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setIsDemoMode(true);
          setLogs(demoLogs);
          setPagination(demoPagination);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch logs");
      }

      const data = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [page, action, search]);

  // Fetch on mount and filter changes
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Export CSV
  const handleExport = () => {
    if (isDemoMode) {
      alert("Demo mode: exports are disabled.");
      return;
    }
    const params = new URLSearchParams({
      ...(action !== "ALL" && { action }),
      ...(search && { search }),
    });

    window.location.href = `/api/admin/activity-logs/export?${params}`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format action type
  const formatAction = (action: string) => {
    const actionColors: Record<string, string> = {
      VIEW: "text-blue-400",
      SHARE_CREATE: "text-green-400",
      REVOKE: "text-red-400",
      CONSENT_GRANTED: "text-green-400",
      CONSENT_REVOKED: "text-orange-400",
      USER_DISABLED: "text-red-400",
      USER_ENABLED: "text-green-400",
      ADMIN_REVOKE: "text-red-400",
    };

    return (
      <span className={`font-mono text-xs ${actionColors[action] || "text-gray-400"}`}>
        {action}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {isDemoMode && (
          <div className="mb-6 rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4 text-sm text-blue-200">
            You are viewing demo audit logs. Exports and management actions are disabled in this public preview.
          </div>
        )}
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="text-xs uppercase tracking-[0.35em] text-hot-pink hover:text-pink-300 transition"
            >
              ← Admin Portal
            </Link>
            <h1 className="text-3xl font-semibold md:text-4xl mt-2">
              Activity & Audit Logs
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              HIPAA compliance center — PHI access patterns, consent changes, share events
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isDemoMode}
            className="rounded-lg bg-hot-pink px-4 py-2 text-sm font-semibold text-black transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
            title={isDemoMode ? "Demo mode exports are disabled" : undefined}
          >
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search user email or resource ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to page 1 on search
              }}
              className="w-full rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-hot-pink focus:outline-none"
            />
          </div>
          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1); // Reset to page 1 on filter
            }}
            className="rounded-lg border border-gray-700 bg-black px-4 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="VIEW">VIEW</option>
            <option value="SHARE_CREATE">SHARE_CREATE</option>
            <option value="REVOKE">REVOKE</option>
            <option value="CONSENT_GRANTED">CONSENT_GRANTED</option>
            <option value="CONSENT_REVOKED">CONSENT_REVOKED</option>
            <option value="USER_DISABLED">USER_DISABLED</option>
            <option value="USER_ENABLED">USER_ENABLED</option>
            <option value="ADMIN_REVOKE">ADMIN_REVOKE</option>
          </select>
          <button
            onClick={fetchLogs}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-white hover:border-hot-pink transition"
          >
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-hot-pink border-t-transparent"></div>
          </div>
        )}

        {/* Table */}
        {!loading && logs.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Resource
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <>
                      <tr
                        key={log.id}
                        className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition"
                        onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                      >
                        <td className="px-4 py-3 text-xs text-gray-300">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            {log.actorEmail && (
                              <div className="text-sm text-white">{log.actorEmail}</div>
                            )}
                            {log.subjectEmail && log.actorEmail !== log.subjectEmail && (
                              <div className="text-xs text-gray-500">
                                Subject: {log.subjectEmail}
                              </div>
                            )}
                            {!log.actorEmail && !log.subjectEmail && (
                              <div className="text-xs text-gray-500">System</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">{formatAction(log.action)}</td>
                        <td className="px-4 py-3">
                          {log.resourceType && (
                            <div className="text-xs text-gray-400">
                              {log.resourceType}
                              {log.resourceId && (
                                <span className="ml-1 font-mono text-gray-500">
                                  ...{log.resourceId.slice(-8)}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-xs text-gray-500">
                            {expandedRow === log.id ? "▼" : "▶"}
                          </span>
                        </td>
                      </tr>
                      {expandedRow === log.id && (
                        <tr className="border-b border-white/5 bg-white/5">
                          <td colSpan={5} className="px-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              {log.actorEmail && (
                                <div>
                                  <span className="text-gray-500">Actor:</span>{" "}
                                  <span className="text-gray-300">
                                    {log.actorEmail} {log.actorName && `(${log.actorName})`}
                                  </span>
                                </div>
                              )}
                              {log.subjectEmail && (
                                <div>
                                  <span className="text-gray-500">Subject:</span>{" "}
                                  <span className="text-gray-300">
                                    {log.subjectEmail} {log.subjectName && `(${log.subjectName})`}
                                  </span>
                                </div>
                              )}
                              <div>
                                <span className="text-gray-500">IP Address:</span>{" "}
                                <span className="font-mono text-gray-300">
                                  {log.ipAddress || "N/A"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">User Agent:</span>{" "}
                                <span className="text-gray-400">
                                  {log.userAgent ? log.userAgent.substring(0, 60) + "..." : "N/A"}
                                </span>
                              </div>
                              {log.metadata && Object.keys(log.metadata).length > 0 && (
                                <div className="col-span-2">
                                  <span className="text-gray-500">Metadata:</span>{" "}
                                  <pre className="mt-1 rounded bg-black p-2 text-gray-400 overflow-x-auto">
                                    {JSON.stringify(log.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-white transition hover:border-hot-pink disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.pages}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-white transition hover:border-hot-pink disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && logs.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-gray-400">No activity logs found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
