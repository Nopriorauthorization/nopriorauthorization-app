import Link from "next/link";

/** Slim CTA above the homepage iframe — links to the lead magnet landing page. */
export function FreeTemplatesHomeBanner() {
  return (
    <div className="border-b border-[#D4537E]/25 bg-[#1A1A1A] px-4 py-2.5 text-center text-sm text-gray-300">
      <span className="text-white/90">Get 10 free templates</span>
      <span className="mx-2 text-gray-600">—</span>
      <span className="hidden sm:inline">clinical, handouts &amp; ops starters — </span>
      <Link href="/free-templates" className="font-semibold text-[#D4537E] hover:underline">
        enter your email
      </Link>
    </div>
  );
}
