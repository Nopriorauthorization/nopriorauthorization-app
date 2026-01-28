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

          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Share health summary with providers</p>
                  <p className="text-sm text-gray-500">Allow providers to view your health overview</p>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Email notifications</p>
                  <p className="text-sm text-gray-500">Receive updates about your health journey</p>
                </div>
                <div className="w-12 h-6 bg-pink-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                </div>
              </div>
            </div>
            <Link
              href="/storyboard"
              className="inline-flex text-sm font-semibold text-black"
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
