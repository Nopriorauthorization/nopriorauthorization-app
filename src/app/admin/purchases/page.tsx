export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";
import Link from "next/link";
import { ResendButton } from "./ResendButton";

export default async function AdminPurchasesPage() {
  await requireAdmin("/admin/purchases");

  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const totalRevenue = purchases.reduce((sum, p) => sum + p.amountPaid, 0);
  const byProduct = purchases.reduce<Record<string, { count: number; revenue: number }>>(
    (acc, p) => {
      if (!acc[p.productSlug]) acc[p.productSlug] = { count: 0, revenue: 0 };
      acc[p.productSlug].count += 1;
      acc[p.productSlug].revenue += p.amountPaid;
      return acc;
    },
    {},
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">Admin</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold">Purchases</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/api/admin/purchases/export`}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-hot-pink/50"
            >
              Export CSV
            </Link>
            <Link
              href="/admin"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:text-white"
            >
              &larr; Admin
            </Link>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Revenue</div>
            <div className="mt-2 text-2xl font-bold text-emerald-400">
              ${(totalRevenue / 100).toFixed(2)}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Orders</div>
            <div className="mt-2 text-2xl font-bold">{purchases.length}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Products Sold</div>
            <div className="mt-2 text-2xl font-bold">{Object.keys(byProduct).length}</div>
          </div>
        </div>

        {/* By Product */}
        {Object.keys(byProduct).length > 0 && (
          <div className="mb-8 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Sales</th>
                  <th className="px-4 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {Object.entries(byProduct)
                  .sort((a, b) => b[1].revenue - a[1].revenue)
                  .map(([slug, data]) => (
                    <tr key={slug} className="text-gray-300">
                      <td className="px-4 py-3 font-medium text-white">{slug}</td>
                      <td className="px-4 py-3">{data.count}</td>
                      <td className="px-4 py-3 text-emerald-400">
                        ${(data.revenue / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Delivered</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {purchases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No purchases yet.
                  </td>
                </tr>
              )}
              {purchases.map((p) => (
                <tr key={p.id} className="text-gray-300">
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{p.customerEmail}</td>
                  <td className="px-4 py-3 font-medium text-white">
                    {p.productTitle}
                  </td>
                  <td className="px-4 py-3">
                    ${(p.amountPaid / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {p.deliveryEmailSent ? (
                      <span className="text-emerald-400">Sent</span>
                    ) : (
                      <span className="text-amber-400">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ResendButton purchaseId={p.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
