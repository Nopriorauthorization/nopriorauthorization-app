import Link from "next/link";

export default function CanvaToolsPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Canva (dev)</h1>
      <p className="mt-4 text-neutral-600">
        Connect your Canva integration via OAuth. The redirect URI in{" "}
        <code className="rounded bg-neutral-100 px-1 text-sm">
          CANVA_OAUTH_REDIRECT_URI
        </code>{" "}
        must exactly match one of the Authorized redirects in the Canva
        developer portal.
      </p>
      <p className="mt-4 text-neutral-600">
        Local development can use{" "}
        <code className="rounded bg-neutral-100 px-1 text-sm">
          http://127.0.0.1:3000/api/canva/callback
        </code>
        . Production should use{" "}
        <code className="rounded bg-neutral-100 px-1 text-sm">
          https://nopriorauthorization.com/api/canva/callback
        </code>
        .
      </p>
      <p className="mt-6">
        <a
          className="inline-flex rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          href="/api/canva/auth"
        >
          Connect Canva account
        </a>
      </p>
      <p className="mt-3 text-sm text-neutral-500">
        <a href="/api/canva/reset" className="underline">
          Reset Canva session cookies
        </a>
      </p>
      <p className="mt-8 text-sm text-neutral-500">
        <Link href="/api/canva/status" className="underline">
          Check status (JSON)
        </Link>
      </p>
      <p className="mt-3 text-sm text-neutral-500">
        <Link href="/api/canva/profile" className="underline">
          Probe connected profile (JSON)
        </Link>
      </p>
      <p className="mt-3 text-sm text-neutral-500">
        <Link href="/api/canva/capabilities" className="underline">
          Probe Canva capabilities (JSON)
        </Link>
      </p>
      <p className="mt-3 text-sm text-neutral-500">
        <Link href="/api/canva/list-designs" className="underline">
          List all designs (JSON) — needs{" "}
          <code className="rounded bg-neutral-100 px-1 text-sm">
            design:meta:read
          </code>
        </Link>
      </p>
      <p className="mt-2 text-xs text-neutral-500">
        For <code className="rounded bg-neutral-100 px-1">npm run store:fill</code>,
        save this response as{" "}
        <code className="rounded bg-neutral-100 px-1">imports/canva-list-designs.json</code>{" "}
        (see <code className="rounded bg-neutral-100 px-1">CANVA-NAMING-GUIDE.md</code>
        ).
      </p>
      <p className="mt-3 text-sm text-neutral-500">
        <Link href="/api/canva/match-manifests" className="underline">
          Auto-match manifests to Canva designs (JSON)
        </Link>
      </p>
      <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        After OAuth succeeds, open{" "}
        <code className="rounded bg-white px-1 text-sm">/api/canva/profile</code>{" "}
        to confirm Canva is returning your account profile, then open{" "}
        <code className="rounded bg-white px-1 text-sm">
          /api/canva/capabilities
        </code>{" "}
        to see what the connected Canva account can use through the API.
      </div>
    </main>
  );
}
