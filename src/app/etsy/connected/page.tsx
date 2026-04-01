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
            OAuth completed. Tokens are stored in secure cookies for this
            browser. You can call the Etsy Open API from server routes next.
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
