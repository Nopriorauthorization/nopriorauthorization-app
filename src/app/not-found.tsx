import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-24">
      <section className="w-full max-w-4xl fade-up">
        <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6 md:p-10">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
            <div className="text-center md:text-left md:max-w-md">
              <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-pink-500">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/10 border border-pink-500/30">
                  ?
                </span>
                404
              </p>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
                Page Not Found
              </h1>
              <p className="mt-5 text-gray-300">
                Oops! The page you&apos;re looking for doesn&apos;t exist.
                Let&apos;s get you back on track.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start fade-up fade-delay-1">
                <Link
                  href="/"
                  className="px-6 py-3 rounded-full bg-pink-500 text-black font-semibold hover:bg-pink-400 transition"
                >
                  Go Home
                </Link>
                <Link
                  href="/chat"
                  className="px-6 py-3 rounded-full border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black transition"
                >
                  Chat with Beau-Tox
                </Link>
              </div>
            </div>

            <div className="w-full max-w-md fade-up fade-delay-2">
              <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                <Image
                  src="/characters/together.png"
                  alt="Beau and Peppi together"
                  width={900}
                  height={600}
                  className="h-auto w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)] float-slow"
                  priority
                  sizes="(min-width: 768px) 420px, 90vw"
                />
              </div>
              <p className="mt-3 text-center text-sm text-gray-400">
                Not sure where to go? Start with chat.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
