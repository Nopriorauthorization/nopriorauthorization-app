type CanvaConnectedPageProps = {
  searchParams?: {
    ok?: string;
    error?: string;
  };
};

export default function CanvaConnectedPage({
  searchParams,
}: CanvaConnectedPageProps) {
  const ok = searchParams?.ok;
  const error = searchParams?.error;

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Canva connection</h1>
      {ok ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          Canva OAuth completed successfully. Your access token is now stored in
          secure cookies for this app.
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
          {error}
        </p>
      ) : null}
      {!ok && !error ? (
        <p className="mt-4 text-neutral-600">
          Return to the Canva tools page to start the connection flow.
        </p>
      ) : null}
      <p className="mt-8">
        <a className="text-sm underline" href="/canva">
          Back to Canva tools
        </a>
      </p>
    </main>
  );
}
