import Link from "next/link";

type Props = { searchParams: Record<string, string | string[] | undefined> };

export default function EtsyConnectedPage({ searchParams }: Props) {
  const err =
    typeof searchParams.error === "string" ? searchParams.error : undefined;
  const ok = searchParams.ok === "1" || searchParams.ok === "true";

  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        {err ? "Etsy connection issue" : ok ? "Etsy connected" : "Etsy"}
      </h1>
      <p className="mt-4 text-neutral-600">
        {err ? (
          err
        ) : ok ? (
          <>
            OAuth completed. Tokens are stored in your database for server-side
            API calls. Visit{" "}
            <Link href="/etsy" className="font-medium text-rose-700 underline">
              /etsy
            </Link>{" "}
            to see synced listings, or{" "}
            <Link href="/api/etsy/listings" className="font-medium text-rose-700 underline">
              /api/etsy/listings
            </Link>{" "}
            for JSON.
          </>
        ) : (
          "Use Connect from the Etsy page to authorize this app."
        )}
      </p>
      <p className="mt-8">
        <Link href="/etsy" className="text-rose-700 underline">
          Back to Etsy tools
        </Link>
      </p>
    </main>
  );
}
