export const dynamic = 'force-dynamic';
import Link from "next/link";
import Providers from "@/components/layout/providers";
import Header from "@/components/layout/header";
import DashboardNav from "@/components/layout/nav";

export default function StoryboardPreferencesPage() {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold">
              Add Your Preferences
            </h1>
            <p className="mt-2 text-gray-500">
              You&apos;re in control. Choose what you want to share and what
              you&apos;d rather keep private.
            </p>
          </header>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Preferences are coming soon. For now, use the Storyboard to keep
              track of what matters to you.
            </p>
            <Link
              href="/storyboard"
              className="mt-6 inline-flex text-sm font-semibold text-black"
            >
              ← Back to My Storyboard
            </Link>
          </div>
        </main>

        <DashboardNav />
      </div>
    </Providers>
  );
}
