import Link from "next/link";
import {
  getDeliveryCatalogGeneratedAt,
  getDeliveryProductBySlugAsync,
} from "@/lib/delivery/catalog";
import { isGatedFormPath } from "@/lib/delivery/form-access";
import { maskEmail, verifyDeliveryToken } from "@/lib/delivery/token";
import { isAnatomyStudyProductSlug } from "@/config/anatomy-study.config";
import {
  MICRO270_CRAM_SLUGS,
} from "@/config/micro270-sales.config";
import { MICRO270_SHOP_SLUG_CHEATS } from "@/config/micro270-shop.config";

export const dynamic = "force-dynamic";

type Props = {
  params: { token: string };
};

export default async function DeliveryPage({ params }: Props) {
  const grant = verifyDeliveryToken(params.token);

  if (!grant) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-semibold text-red-900">
            Delivery link unavailable
          </h1>
          <p className="mt-3 text-sm text-red-800">
            This link is invalid or has expired. If you purchased recently,
            contact support and we can reissue your delivery link.
          </p>
        </div>
      </main>
    );
  }

  const product = await getDeliveryProductBySlugAsync(grant.productSlug);
  if (!product) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
          <h1 className="text-2xl font-semibold text-amber-900">
            Product delivery not loaded yet
          </h1>
          <p className="mt-3 text-sm text-amber-800">
            This delivery link is valid, but the product catalog for{" "}
            <code className="rounded bg-white px-1">{grant.productSlug}</code>{" "}
            has not been imported into the app yet.
          </p>
        </div>
      </main>
    );
  }

  const generatedAt = getDeliveryCatalogGeneratedAt();
  const expiresAt = new Date(grant.expiresAt * 1000).toLocaleString();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
          No Prior Authorization
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {product.productTitle}
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          Your templates are ready below. Click to view, print, or download
          each form. Customize with your clinic details before use.
        </p>

        {grant.productSlug.startsWith("micro270") && (
          <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
            {grant.productSlug === MICRO270_SHOP_SLUG_CHEATS ? (
              <>
                <p className="font-semibold text-indigo-900">Micro 270 — Chapter cheat sheets</p>
                <p className="mt-1 text-sm text-indigo-800">
                  Activate to unlock printable chapter pages under{" "}
                  <code className="rounded bg-white/80 px-1">/micro270/cheat-sheets/</code> on this
                  browser. Upgrade to the full question bank anytime from the cheat-sheet index.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={`/api/micro270/activate?token=${encodeURIComponent(params.token)}`}
                    className="inline-flex rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800"
                  >
                    Activate cheat-sheet access →
                  </a>
                  <a
                    href="/micro270/cheat-sheets"
                    className="inline-flex rounded-lg border border-indigo-300 px-5 py-2.5 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
                  >
                    Open chapter index
                  </a>
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold text-indigo-900">Micro270 Study Hub</p>
                <p className="mt-1 text-sm text-indigo-800">
                  Click below to activate your hub access on this device. All 20 chapters
                  will unlock and your progress will be tracked automatically.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={`/api/micro270/activate?token=${encodeURIComponent(params.token)}`}
                    className="inline-flex rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800"
                  >
                    Activate hub access →
                  </a>
                  {MICRO270_CRAM_SLUGS.has(grant.productSlug) && (
                    <a
                      href="/micro270/cram"
                      className="inline-flex rounded-lg border border-indigo-300 px-5 py-2.5 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
                    >
                      Go to AI cram tool
                    </a>
                  )}
                </div>
              </>
            )}
            <p className="mt-3 text-xs text-indigo-600">
              Access is stored as a cookie on this browser. If you switch devices, visit
              your delivery link again and click activate.
            </p>
          </div>
        )}

        {isAnatomyStudyProductSlug(grant.productSlug) && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-5">
            <p className="font-semibold text-pink-950">Anatomy &amp; Physiology Study Hub</p>
            <p className="mt-1 text-sm text-pink-900">
              Activate your purchase on this device to unlock lectures 2–12 (lecture 1
              stays free as a preview). Progress syncs when you&apos;re logged in.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href={`/api/anatomy-study/activate?token=${encodeURIComponent(params.token)}`}
                className="inline-flex rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-700"
              >
                Activate full course access →
              </a>
              <Link
                href="/nursing-study/anatomy/hub"
                className="inline-flex rounded-lg border border-pink-300 px-5 py-2.5 text-sm font-semibold text-pink-900 hover:bg-pink-100"
              >
                Open study hub
              </Link>
            </div>
            <p className="mt-3 text-xs text-pink-800">
              Access is stored as a cookie on this browser. If you switch devices, open
              this delivery link again and click activate.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4 rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-700 md:grid-cols-3">
          <div>
            <p className="font-medium text-neutral-900">Buyer</p>
            <p>{maskEmail(grant.buyerEmail)}</p>
          </div>
          <div>
            <p className="font-medium text-neutral-900">Order reference</p>
            <p>{grant.orderRef || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium text-neutral-900">Link expires</p>
            <p>{expiresAt}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
          <h2 className="text-lg font-semibold text-neutral-900">How it works</h2>
          <ol className="mt-3 space-y-2 text-sm text-neutral-700">
            <li>1. Click any template below to open it.</li>
            <li>2. Use your browser&apos;s Print function (Ctrl+P / Cmd+P) to print or save as PDF.</li>
            <li>3. Fill in your clinic name, logo, and contact details before sharing with patients.</li>
            <li>4. Templates with Canva links open directly in Canva for full editing.</li>
          </ol>
        </div>

        <div className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                Your templates
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                {product.templateCount} professional templates included in this
                product.
              </p>
            </div>
            {generatedAt ? (
              <p className="text-xs text-neutral-400">
                Imported {new Date(generatedAt).toLocaleString()}
              </p>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3">
            {product.templates.map((template, index) => {
              const isHtml =
                template.editUrl?.startsWith("/forms/") ||
                template.editUrl?.endsWith(".html");
              const isPdfDeliverable =
                !!template.editUrl?.startsWith("/deliverables/") &&
                template.editUrl.endsWith(".pdf");
              const isCanva = template.editUrl?.startsWith(
                "https://www.canva.com/"
              );
              const gated = isHtml && isGatedFormPath(template.editUrl);
              const htmlHref =
                gated && template.editUrl
                  ? `/api/delivery/html?token=${encodeURIComponent(params.token)}&i=${index}`
                  : template.editUrl || "";
              const pdfHref =
                isPdfDeliverable && template.editUrl
                  ? `/api/delivery/pdf?token=${encodeURIComponent(params.token)}&i=${index}`
                  : "";

              return (
                <div
                  key={`${template.designId || template.title}-${index}`}
                  className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium text-neutral-900">
                      {template.title}
                    </p>
                    {isHtml ? (
                      <p className="mt-1 text-xs text-emerald-600">
                        Printable form — view &amp; print from browser
                      </p>
                    ) : isPdfDeliverable ? (
                      <p className="mt-1 text-xs text-emerald-700">
                        PDF download — save to any device
                      </p>
                    ) : template.designId ? (
                      <p className="mt-1 text-xs text-neutral-500">
                        Canva template
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-3">
                    {isHtml && template.editUrl ? (
                      <a
                        href={htmlHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                      >
                        View &amp; Print
                      </a>
                    ) : isPdfDeliverable && pdfHref ? (
                      <a
                        href={pdfHref}
                        className="inline-flex rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                      >
                        Download PDF
                      </a>
                    ) : isCanva && template.editUrl ? (
                      <a
                        href={template.editUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                      >
                        Open in Canva
                      </a>
                    ) : template.editUrl ? (
                      <a
                        href={template.editUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                      >
                        Open template
                      </a>
                    ) : null}
                    {template.viewUrl ? (
                      <a
                        href={template.viewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                      >
                        Preview
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-8 text-sm text-neutral-500">
          Need help? Contact your seller or support team and reference the order
          number above.
        </p>
        <p className="mt-2 text-xs text-neutral-400">
          Powered by a secure tokenized delivery link. This page is intended for
          the purchaser only.
        </p>

        <p className="mt-8 text-sm">
          <Link href="/etsy" className="text-rose-700 underline">
            Back to Etsy tools
          </Link>
        </p>
      </div>
    </main>
  );
}
