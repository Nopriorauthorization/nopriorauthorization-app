"use client";

import { useMemo, useState } from "react";
import type { LibraryProductRow } from "@/lib/admin/library-types";
import { FREE_PUBLIC_FORM_SET } from "@/lib/delivery/free-public-forms";

type Props = {
  products: LibraryProductRow[];
  catalogGeneratedAt: string | null;
};

export function LibraryOrganizer({ products, catalogGeneratedAt }: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const s = new Set<string>();
    for (const p of products) {
      s.add(p.category || "general");
    }
    return ["all", ...Array.from(s).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      const pc = p.category || "general";
      if (cat !== "all" && pc !== cat) return false;
      if (!needle) return true;
      const blob = [
        p.productId,
        p.displayName,
        p.etsySku,
        p.description,
        ...p.templates.map((t) => `${t.name} ${t.id}`),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(needle);
    });
  }, [products, q, cat]);

  const stats = useMemo(() => {
    let templates = 0;
    let html = 0;
    let canva = 0;
    let ph = 0;
    for (const p of products) {
      for (const t of p.templates) {
        templates += 1;
        if (t.deliveryKind === "html") html += 1;
        else if (t.deliveryKind === "canva") canva += 1;
        else ph += 1;
      }
    }
    return { templates, html, canva, ph, products: products.length };
  }, [products]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
        <span>
          <strong className="text-white">{stats.products}</strong> products
        </span>
        <span className="text-gray-600">·</span>
        <span>
          <strong className="text-white">{stats.templates}</strong> templates
        </span>
        <span className="text-gray-600">·</span>
        <span>
          <span className="text-emerald-400">{stats.html}</span> HTML
        </span>
        <span className="text-gray-600">·</span>
        <span>
          <span className="text-sky-400">{stats.canva}</span> Canva
        </span>
        <span className="text-gray-600">·</span>
        <span>
          <span className="text-amber-400/90">{stats.ph}</span> placeholder
        </span>
        {catalogGeneratedAt && (
          <>
            <span className="ml-auto text-xs text-gray-500">
              Catalog JSON: {new Date(catalogGeneratedAt).toLocaleString()}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search products, SKUs, template names…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-hot-pink/60 focus:outline-none focus:ring-1 focus:ring-hot-pink/40"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-hot-pink/60 focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c} className="bg-zinc-900">
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-gray-400">
            No products match your filters.
          </p>
        )}
        {filtered.map((p) => {
          const isOpen = openId === p.productId;
          return (
            <div
              key={p.productId}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenId(isOpen ? null : p.productId)
                }
                className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-white/5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-white">
                      {p.displayName}
                    </h2>
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {p.category || "general"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                    {p.productId} · {p.etsySku || "—"}
                    {p.priceUSD != null ? ` · $${p.priceUSD}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right text-xs text-gray-500">
                  <div>
                    <span className="text-white font-medium">
                      {p.filledCount}/{p.totalCount}
                    </span>{" "}
                    linked
                  </div>
                  <div className="mt-1 text-[10px] text-gray-600">
                    {p.sourceFile}
                  </div>
                </div>
                <span className="text-gray-500">{isOpen ? "▾" : "▸"}</span>
              </button>

              {isOpen && (
                <div className="border-t border-white/10 bg-black/30 px-5 py-4">
                  {p.description && (
                    <p className="mb-4 text-sm leading-relaxed text-gray-400">
                      {p.description}
                    </p>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          <th className="pb-2 pr-4">Template</th>
                          <th className="pb-2 pr-4">ID</th>
                          <th className="pb-2 pr-4">Type</th>
                          <th className="pb-2">Open</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {p.templates.map((t) => (
                          <tr key={t.id} className="text-gray-300">
                            <td className="py-2.5 pr-4 align-top">
                              <div className="font-medium text-white">
                                {t.name}
                              </div>
                              {t.description && (
                                <div className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                                  {t.description}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 pr-4 align-top font-mono text-xs text-gray-500">
                              {t.id}
                            </td>
                            <td className="py-2.5 pr-4 align-top">
                              <KindBadge kind={t.deliveryKind} />
                            </td>
                            <td className="py-2.5 align-top">
                              <TemplateLink url={t.canvaTemplateUrl} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KindBadge({
  kind,
}: {
  kind: "html" | "canva" | "placeholder";
}) {
  const styles =
    kind === "html"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : kind === "canva"
        ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
        : "bg-amber-500/10 text-amber-200/90 border-amber-500/25";
  const label =
    kind === "html"
      ? "HTML"
      : kind === "canva"
        ? "Canva"
        : "Unset";
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles}`}
    >
      {label}
    </span>
  );
}

function TemplateLink({ url }: { url: string }) {
  if (!url || url === "PLACEHOLDER_CANVA_URL") {
    return <span className="text-xs text-gray-600">—</span>;
  }
  let href = url.startsWith("/") ? url : url;
  if (
    url.startsWith("/forms/") &&
    url.endsWith(".html") &&
    !FREE_PUBLIC_FORM_SET.has(url)
  ) {
    href = `/api/admin/delivery-html?path=${encodeURIComponent(url)}`;
  }
  const label = url.startsWith("/forms/") ? "View HTML" : "Open in Canva";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex text-xs font-semibold text-hot-pink hover:underline"
    >
      {label} ↗
    </a>
  );
}
