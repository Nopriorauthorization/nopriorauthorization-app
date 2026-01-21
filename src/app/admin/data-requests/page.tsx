"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface DataRequestItem {
  id: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  requestType: string;
  status: string;
  requestedAt: string;
  fulfilledAt: string | null;
  fulfilledBy: { id: string; email: string; name: string | null } | null;
  cancelledAt: string | null;
  cancelledBy: { id: string; email: string; name: string | null } | null;
  cancellationReason: string | null;
  notes: string | null;
}

interface DataRequestsResponse {
  requests: DataRequestItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const typeLabels: Record<string, string> = {
  export: "Data Export",
  deletion: "Account Deletion",
};

export default function DataRequestsPage() {
  const [data, setData] = useState<DataRequestsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [requestType, setRequestType] = useState("all");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(status !== "all" && { status }),
      ...(requestType !== "all" && { requestType }),
    });

    try {
      const response = await fetch(`/api/admin/data-requests?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data requests");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, requestType]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRequests();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
        <h1 className="text-3xl font-bold">Data Requests</h1>
        <p className="text-gray-600">Manage user export and deletion requests (GDPR/HIPAA)</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Request Type
              </label>
              <select
                value={requestType}
                onChange={(e) => {
                  setRequestType(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="export">Data Export</option>
                <option value="deletion">Account Deletion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
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
              Showing {data.requests.length} of {data.pagination.total} requests
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fulfilled/Cancelled
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/users/${req.userId}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {req.userEmail}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {typeLabels[req.requestType] || req.requestType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(req.status)}`}>
                          {statusLabels[req.status] || req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(req.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {req.fulfilledAt && (
                          <div className="text-green-600">
                            ✓ {new Date(req.fulfilledAt).toLocaleDateString()}
                          </div>
                        )}
                        {req.cancelledAt && (
                          <div className="text-gray-600">
                            ✗ {new Date(req.cancelledAt).toLocaleDateString()}
                          </div>
                        )}
                        {!req.fulfilledAt && !req.cancelledAt && "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/data-requests/${req.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Details →
                        </Link>
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

        {!loading && data && data.requests.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No data requests found
          </p>
        )}
      </div>
    </div>
  );
}
