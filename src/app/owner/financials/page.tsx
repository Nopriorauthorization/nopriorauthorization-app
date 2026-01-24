export const dynamic = 'force-dynamic';
import { requireAdmin } from "@/lib/auth/admin-guard";

interface FinancialData {
  revenueOverview?: {
    mrr: number;
    arr: number;
    activeSubscriptions: number;
    arpu: number;
  };
  subscriptionMix?: {
    tiers: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
  };
  billingHealth?: {
    failedPayments: number;
    refunds: number;
    churnRate: number;
  };
  growthSnapshot?: {
    newSubscriptions: number;
    revenueChange: number;
  };
}

export default async function OwnerFinancialsPage() {
  // Check OWNER/ADMIN access
  const admin = await requireAdmin("/owner/financials");

  // Fetch data on server side
  let data: FinancialData | null = null;
  let error: string | null = null;

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/owner/financials`, {
      headers: {
        // Pass admin session info if needed
        'x-admin-user': admin.id,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch financial data");
    }

    data = await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
          <p className="mt-2 text-gray-600">Business metrics and subscription analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Overview</h2>
            {data?.revenueOverview ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Recurring Revenue</span>
                  <span className="text-2xl font-bold text-gray-900">${data.revenueOverview.mrr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Annual Recurring Revenue</span>
                  <span className="text-2xl font-bold text-gray-900">${data.revenueOverview.arr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Subscriptions</span>
                  <span className="text-xl font-semibold text-gray-900">{data.revenueOverview.activeSubscriptions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Revenue Per User</span>
                  <span className="text-xl font-semibold text-gray-900">${data.revenueOverview.arpu.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Data unavailable</div>
            )}
          </div>

          {/* Subscription Mix */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Mix</h2>
            {data?.subscriptionMix && data.subscriptionMix.tiers.length > 0 ? (
              <div className="space-y-3">
                {data.subscriptionMix.tiers.map((tier, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{tier.name}</span>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{tier.count}</div>
                      <div className="text-sm text-gray-500">{tier.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">Data unavailable</div>
            )}
          </div>

          {/* Billing Health */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Health</h2>
            {data?.billingHealth ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Failed Payments (30d)</span>
                  <span className={`text-xl font-semibold ${data.billingHealth.failedPayments > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {data.billingHealth.failedPayments}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Refunds (30d)</span>
                  <span className={`text-xl font-semibold ${data.billingHealth.refunds > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {data.billingHealth.refunds}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Churn Rate (30d)</span>
                  <span className={`text-xl font-semibold ${data.billingHealth.churnRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {data.billingHealth.churnRate}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Data unavailable</div>
            )}
          </div>

          {/* Growth Snapshot */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Growth Snapshot</h2>
            {data?.growthSnapshot ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">New Subscriptions (30d)</span>
                  <span className="text-xl font-semibold text-green-600">+{data.growthSnapshot.newSubscriptions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenue Change (30d)</span>
                  <span className={`text-xl font-semibold ${data.growthSnapshot.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.growthSnapshot.revenueChange >= 0 ? '+' : ''}{data.growthSnapshot.revenueChange}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Data unavailable</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}