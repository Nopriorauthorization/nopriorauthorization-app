"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FUNNEL_FINAL_REDIRECTS } from "@/lib/shop/funnel-types";

type FunnelRow = {
  id: string;
  productSlug: string | null;
  categoryDefault: string | null;
  enabled: boolean;
  useDedicatedLanding: boolean;
  bumpSlugs: string[];
  postUpsellSlugs: string[];
  finalRedirect: string;
};

export function ProductFunnelsAdmin() {
  const [funnels, setFunnels] = useState<FunnelRow[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<{
    byStep: Array<{ primarySlug: string; step: string; count: number; revenueCents: number }>;
    uniqueSessions: number;
  } | null>(null);

  const [mode, setMode] = useState<"product" | "category">("product");
  const [productSlug, setProductSlug] = useState("");
  const [categoryDefault, setCategoryDefault] = useState("");
  const [bumpCsv, setBumpCsv] = useState("");
  const [upsellCsv, setUpsellCsv] = useState("");
  const [finalRedirect, setFinalRedirect] = useState<string>("post_purchase");
  const [useLanding, setUseLanding] = useState(true);
  const [enabledNew, setEnabledNew] = useState(true);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/admin/product-funnels");
    const data = (await res.json()) as {
      funnels?: FunnelRow[];
      categories?: string[];
      error?: string;
    };
    if (!res.ok) {
      setError(data.error || "Failed to load");
      return;
    }
    setFunnels(data.funnels ?? []);
    setCategories(data.categories ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const loadAnalytics = async () => {
    const res = await fetch("/api/admin/funnel-analytics");
    const data = (await res.json()) as typeof analytics;
    if (res.ok && data && "byStep" in data) {
      setAnalytics(data);
    }
  };

  const parseCsv = (s: string) =>
    s
      .split(/[\s,]+/)
      .map((x) => x.trim())
      .filter(Boolean);

  const createFunnel = async () => {
    setError(null);
    const res = await fetch("/api/admin/product-funnels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productSlug: mode === "product" ? productSlug.trim() : null,
        categoryDefault: mode === "category" ? categoryDefault.trim() : null,
        enabled: enabledNew,
        useDedicatedLanding: useLanding,
        bumpSlugs: parseCsv(bumpCsv),
        postUpsellSlugs: parseCsv(upsellCsv),
        finalRedirect,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Create failed");
      return;
    }
    setProductSlug("");
    setCategoryDefault("");
    setBumpCsv("");
    setUpsellCsv("");
    await load();
  };

  const patch = async (id: string, patchBody: Record<string, unknown>) => {
    setError(null);
    const res = await fetch(`/api/admin/product-funnels/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchBody),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Update failed");
      return;
    }
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this funnel row?")) return;
    const res = await fetch(`/api/admin/product-funnels/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    await load();
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">Admin</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold">Shop product funnels</h1>
          <p className="mt-2 max-w-xl text-sm text-gray-400">
            Assign order bumps (max 3) and post-purchase upsells (max 2, ordered). Toggle per row or set a category
            default when no product-specific funnel exists.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void loadAnalytics()}
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-hot-pink/50"
          >
            Load funnel analytics
          </button>
          <Link
            href="/admin"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:text-white"
          >
            &larr; Admin
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {analytics ? (
        <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Sessions (filtered query)</p>
          <p className="mt-1 text-lg font-semibold text-white">{analytics.uniqueSessions} unique session IDs</p>
          <div className="mt-4 max-h-48 overflow-auto text-sm">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase text-gray-500">
                <tr>
                  <th className="py-1 pr-3">Product</th>
                  <th className="py-1 pr-3">Step</th>
                  <th className="py-1 pr-3">Count</th>
                  <th className="py-1">Revenue (¢)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {analytics.byStep.map((row, i) => (
                  <tr key={`${row.primarySlug}-${row.step}-${i}`}>
                    <td className="py-1 pr-3 font-mono text-xs">{row.primarySlug}</td>
                    <td className="py-1 pr-3">{row.step}</td>
                    <td className="py-1 pr-3">{row.count}</td>
                    <td className="py-1">{row.revenueCents}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="mb-10 rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-white">New funnel</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={mode === "product"}
              onChange={() => setMode("product")}
              className="text-hot-pink"
            />
            Product override
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={mode === "category"}
              onChange={() => setMode("category")}
              className="text-hot-pink"
            />
            Category default
          </label>
        </div>
        {mode === "product" ? (
          <label className="mt-4 block text-sm">
            <span className="text-gray-400">Product slug</span>
            <input
              value={productSlug}
              onChange={(e) => setProductSlug(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm text-white"
              placeholder="e.g. botox-clinical-cheat-sheet"
            />
          </label>
        ) : (
          <label className="mt-4 block text-sm">
            <span className="text-gray-400">Category</span>
            <select
              value={categoryDefault}
              onChange={(e) => setCategoryDefault(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="mt-4 block text-sm">
          <span className="text-gray-400">Bump slugs (comma or space, max 3)</span>
          <input
            value={bumpCsv}
            onChange={(e) => setBumpCsv(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm text-white"
          />
        </label>
        <label className="mt-4 block text-sm">
          <span className="text-gray-400">Post-purchase upsell slugs (order preserved, max 2)</span>
          <input
            value={upsellCsv}
            onChange={(e) => setUpsellCsv(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm text-white"
          />
        </label>
        <label className="mt-4 block text-sm">
          <span className="text-gray-400">Final redirect (when no post-upsell step)</span>
          <select
            value={finalRedirect}
            onChange={(e) => setFinalRedirect(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
          >
            {FUNNEL_FINAL_REDIRECTS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useLanding}
              onChange={(e) => setUseLanding(e.target.checked)}
            />
            Dedicated pre-checkout landing
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enabledNew}
              onChange={(e) => setEnabledNew(e.target.checked)}
            />
            Enabled
          </label>
        </div>
        <button
          type="button"
          onClick={() => void createFunnel()}
          className="mt-6 rounded-lg bg-hot-pink px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
        >
          Create funnel
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">On</th>
                <th className="px-4 py-3">Landing</th>
                <th className="px-4 py-3">Bumps</th>
                <th className="px-4 py-3">Upsells</th>
                <th className="px-4 py-3">Final</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {funnels.map((f) => (
                <tr key={f.id} className="text-gray-300">
                  <td className="px-4 py-3 font-mono text-xs text-white">
                    {f.productSlug ? `product:${f.productSlug}` : `category:${f.categoryDefault}`}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void patch(f.id, { enabled: !f.enabled })}
                      className="rounded border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
                    >
                      {f.enabled ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        void patch(f.id, { useDedicatedLanding: !f.useDedicatedLanding })
                      }
                      className="rounded border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
                    >
                      {f.useDedicatedLanding ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="max-w-[140px] truncate px-4 py-3 font-mono text-[11px]">
                    {f.bumpSlugs.join(", ") || "—"}
                  </td>
                  <td className="max-w-[140px] truncate px-4 py-3 font-mono text-[11px]">
                    {f.postUpsellSlugs.join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">{f.finalRedirect}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void remove(f.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {funnels.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500">No funnel rows yet.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
