import Link from "next/link";
import {
  getDeliveryCatalogGeneratedAt,
  getDeliveryProductBySlugAsync,
} from "@/lib/delivery/catalog";
import { maskEmail, verifyDeliveryToken } from "@/lib/delivery/token";

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
              const isCanva = template.editUrl?.startsWith(
                "https://www.canva.com/"
              );

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
                    ) : template.designId ? (
                      <p className="mt-1 text-xs text-neutral-500">
                        Canva template
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-3">
                    {isHtml && template.editUrl ? (
                      <a
                        href={template.editUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                      >
                        View &amp; Print
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
