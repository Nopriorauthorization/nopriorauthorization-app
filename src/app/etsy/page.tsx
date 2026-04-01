import Link from "next/link";

export default function EtsyToolsPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Etsy (dev)</h1>
      <p className="mt-4 text-neutral-600">
        Connect your seller account via OAuth. Your{" "}
        <code className="rounded bg-neutral-100 px-1 text-sm">
          ETSY_OAUTH_REDIRECT_URI
        </code>{" "}
        must be{" "}
        <strong className="text-neutral-800">https</strong> and registered in{" "}
        <a
          className="text-rose-700 underline"
          href="https://www.etsy.com/developers/your-apps"
          target="_blank"
          rel="noreferrer"
        >
          Your Apps
        </a>{" "}
        (Etsy does not allow{" "}
        <code className="rounded bg-neutral-100 px-1 text-sm">
          http://localhost
        </code>{" "}
        for the authorize step).
      </p>
      <p className="mt-6">
        <a
          className="inline-flex rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          href="/api/etsy/auth"
        >
          Connect Etsy account
        </a>
      </p>
      <p className="mt-8 text-sm text-neutral-500">
        <Link href="/api/etsy/status" className="underline">
          Check status (JSON)
        </Link>
      </p>
      <p className="mt-3 text-sm text-neutral-500">
        <Link href="/api/etsy/shops" className="underline">
          Probe connected shop (JSON)
        </Link>
      </p>
      <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        After OAuth succeeds, open{" "}
        <code className="rounded bg-white px-1 text-sm">/api/etsy/shops</code>{" "}
        to confirm Etsy is returning your shop data.
      </div>
    </main>
  );
}
