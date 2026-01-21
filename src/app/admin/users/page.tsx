"use client";

/**
 * ADMIN PORTAL: Users Management
 * 
 * PHASE 2A.2 — User lookup, search, soft disable/enable
 * 
 * READ-ONLY PHI POLICY:
 * - Displays: User IDs, emails, names, roles, status
 * - Does NOT display: Clinical content, chat history, documents
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isDisabled: boolean;
  createdAt: string;
  lastAccessAt: string | null;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

const demoUsers: User[] = [
  {
    id: "demo-user-1",
    email: "guest.patient@example.com",
    name: "Guest Patient",
    role: "PATIENT",
    isDisabled: false,
    createdAt: new Date("2023-07-15T15:30:00Z").toISOString(),
    lastAccessAt: new Date("2024-02-12T09:15:00Z").toISOString(),
  },
  {
    id: "demo-user-2",
    email: "guest.provider@example.com",
    name: "Guest Provider",
    role: "PROVIDER",
    isDisabled: false,
    createdAt: new Date("2022-11-03T10:00:00Z").toISOString(),
    lastAccessAt: new Date("2024-03-01T18:45:00Z").toISOString(),
  },
  {
    id: "demo-user-3",
    email: "guest.admin@example.com",
    name: "Guest Admin",
    role: "ADMIN",
    isDisabled: false,
    createdAt: new Date("2021-05-22T20:00:00Z").toISOString(),
    lastAccessAt: null,
  },
];

const demoPagination: Pagination = {
  page: 1,
  limit: 10,
  total: demoUsers.length,
  pages: 1,
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsDemoMode(false);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(role !== "ALL" && { role }),
        ...(status !== "ALL" && { status }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setIsDemoMode(true);
          setUsers(demoUsers);
          setPagination(demoPagination);
          return;
        }
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [page, role, status, search]);

  // Fetch on mount and filter changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Format timestamp
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-xs uppercase tracking-[0.35em] text-hot-pink hover:text-pink-300 transition"
          >
            ← Admin Portal
          </Link>
          <h1 className="text-3xl font-semibold md:text-4xl mt-2">Users</h1>
          <p className="mt-2 text-sm text-gray-400">
            User lookup, role visibility, account status management
          </p>
        </div>

        {isDemoMode && (
          <div className="mb-6 rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4 text-sm text-blue-200">
            You are viewing demo user records. Account management actions are turned off in this public preview.
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-hot-pink focus:outline-none"
            />
          </div>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-700 bg-black px-4 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="PATIENT">Patient</option>
            <option value="PROVIDER">Provider</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-700 bg-black px-4 py-2 text-sm text-white focus:border-hot-pink focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
          <button
            onClick={fetchUsers}
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
        {!loading && users.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Last Access
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm text-white">{user.email}</div>
                        {user.name && (
                          <div className="text-xs text-gray-500">{user.name}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
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
                      </td>
                      <td className="px-4 py-3">
                        {user.isDisabled ? (
                          <span className="text-xs text-red-400">Disabled</span>
                        ) : (
                          <span className="text-xs text-green-400">Active</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {formatTimestamp(user.lastAccessAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="text-xs text-hot-pink hover:text-pink-300 transition"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
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
        {!loading && users.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-gray-400">No users found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
