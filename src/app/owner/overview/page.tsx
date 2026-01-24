'use client';

import { useState, useEffect } from 'react';

interface Metrics {
  totalUsers: number;
  activePaidUsers: number;
  newSignups: {
    '7d': number;
    '30d': number;
  };
  totalDecodes: number;
  familyMembersCount: number;
}

export default function OwnerOverview() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/owner/metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">Error loading metrics: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Owner Overview</h1>
          <p className="mt-2 text-gray-600">Business health and metrics dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics?.totalUsers ?? 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Paid</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics?.activePaidUsers ?? 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">New Signups (7d)</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics?.newSignups?.['7d'] ?? 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">New Signups (30d)</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics?.newSignups?.['30d'] ?? 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Platform Activity</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Decodes:</span>
                <span className="font-semibold">{metrics?.totalDecodes ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Family Members:</span>
                <span className="font-semibold">{metrics?.familyMembersCount ?? 0}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Support Health</h3>
            <p className="text-gray-600">Support metrics will be displayed here.</p>
            <p className="text-sm text-gray-500 mt-2">Coming soon</p>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">API: OK</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">Database: OK</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">Stripe: OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}