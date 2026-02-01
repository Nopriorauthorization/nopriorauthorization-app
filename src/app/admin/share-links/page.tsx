"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Share {
  id: string;
  token: string;
  userEmail: string;
  userName: string | null;
  documentTitle: string;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
  accessCount: number;
  status: "active" | "expired" | "revoked";
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ShareLinksPage() {
  const [shares, setShares] = useState<Share[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const fetchShares = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        status,
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/share-links?${params}`);
      const data = await response.json();
      
      setShares(data.shares);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch shares:", error);
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchShares();
  }, [fetchShares]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchShares();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      expired: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      revoked: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[status as keyof typeof colors]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-hot-pink hover:text-hot-pink-dark mb-4 inline-block">
            ← Back to Admin Portal
          </Link>
          <h1 className="text-3xl font-semibold">Share Links</h1>
          <p className="mt-2 text-sm text-gray-400">
            Monitor and manage document share links across all users
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user email..."
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-hot-pink focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-hot-pink hover:bg-hot-pink-dark rounded-lg font-medium transition"
            >
              Search
            </button>
          </form>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-hot-pink focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : shares.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No share links found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Document</th>
                    <th className="pb-3 font-medium">Created</th>
                    <th className="pb-3 font-medium">Expires</th>
                    <th className="pb-3 font-medium">Accesses</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shares.map((share) => (
                    <tr key={share.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4">
                        <div className="text-sm">{share.userEmail}</div>
                        {share.userName && <div className="text-xs text-gray-500">{share.userName}</div>}
                      </td>
                      <td className="py-4 text-sm">{share.documentTitle}</td>
                      <td className="py-4 text-sm text-gray-400">
                        {new Date(share.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-sm text-gray-400">
                        {new Date(share.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-sm">{share.accessCount}</td>
                      <td className="py-4">{getStatusBadge(share.status)}</td>
                      <td className="py-4">
                        <Link
                          href={`/admin/share-links/${share.id}`}
                          className="text-sm text-hot-pink hover:text-hot-pink-dark"
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
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {shares.length} of {pagination.total} shares
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-400">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
