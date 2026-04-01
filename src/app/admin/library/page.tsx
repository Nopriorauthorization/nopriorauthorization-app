export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/auth/admin-guard";
import Link from "next/link";
import {
  getLibraryCatalogMeta,
  readLibraryManifestsFromDisk,
} from "@/lib/admin/read-library-manifests";
import { LibraryOrganizer } from "./LibraryOrganizer";

export default async function AdminLibraryPage() {
  await requireAdmin("/admin/library");

  const products = readLibraryManifestsFromDisk();
  const { generatedAt } = getLibraryCatalogMeta();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              Template library
            </h1>
            <p className="mt-2 max-w-xl text-sm text-gray-400">
              Everything in{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-gray-300">
                imports/npa-manifests-and-spec/
              </code>{" "}
              — products, SKUs, and every template link (HTML + Canva). Search and
              expand to open files in a new tab.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/import"
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-hot-pink/50 hover:bg-white/10"
            >
              Import manifests
            </Link>
            <Link
              href="/admin"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:text-white"
            >
              ← Admin home
            </Link>
          </div>
        </div>

        <LibraryOrganizer
          products={products}
          catalogGeneratedAt={generatedAt}
        />
      </div>
    </div>
  );
}
