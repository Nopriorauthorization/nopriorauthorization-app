"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ConsentLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  consentType: string;
  oldValue: boolean;
  newValue: boolean;
  changedAt: string;
  changedBy: { id: string; email: string; name: string | null } | null;
  source: string;
}

interface ConsentHistoryResponse {
  logs: ConsentLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const consentTypeLabels: Record<string, string> = {
  clinicalSummary: "Share Clinical Summary",
  providerSharing: "Provider-to-Provider Sharing",
  emailNotifications: "Email Notifications",
};

export default function ConsentHistoryPage() {
  const [data, setData] = useState<ConsentHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [consentType, setConsentType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [page, consentType, startDate, endDate]);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(consentType !== "all" && { consentType }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    try {
      const response = await fetch(`/api/admin/consent-history?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch consent history");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const formatChange = (oldValue: boolean, newValue: boolean) => {
    return (
      <span className={newValue ? "text-green-600" : "text-red-600"}>
        {oldValue ? "✓" : "✗"} → {newValue ? "✓" : "✗"}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Admin Portal
        </Link>
        <h1 className="text-3xl font-bold">Consent History</h1>
        <p className="text-gray-600">Track all consent preference changes</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Search User Email
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Consent Type
              </label>
              <select
                value={consentType}
                onChange={(e) => {
                  setConsentType(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="clinicalSummary">Clinical Summary</option>
                <option value="providerSharing">Provider Sharing</option>
                <option value="emailNotifications">Email Notifications</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {loading && <p className="text-center py-4">Loading...</p>}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && data && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {data.logs.length} of {data.pagination.total} consent changes
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Consent Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Changed By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/users/${log.userId}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {log.userEmail}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {consentTypeLabels[log.consentType] || log.consentType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatChange(log.oldValue, log.newValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.changedBy ? (
                          <Link
                            href={`/admin/users/${log.changedBy.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {log.changedBy.email}
                          </Link>
                        ) : (
                          <span className="text-gray-500">Self</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                          {log.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.changedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {data.pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page === data.pagination.totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {!loading && data && data.logs.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No consent changes found
          </p>
        )}
      </div>
    </div>
  );
}
