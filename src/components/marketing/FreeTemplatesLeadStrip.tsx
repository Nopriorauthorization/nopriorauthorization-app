import Link from "next/link";

/** Bottom-of-page strip on cheat sheet PDPs — optional lead magnet CTA. */
export function FreeTemplatesLeadStrip() {
  return (
    <section className="mb-10 rounded-2xl border border-[#D4537E]/35 bg-gradient-to-r from-[#D4537E]/[0.12] to-white/[0.04] p-6 text-center sm:p-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4537E]">Free pack</p>
      <p className="mt-2 font-serif text-lg font-bold text-white sm:text-xl">Want 10 free templates first?</p>
      <p className="mx-auto mt-2 max-w-lg text-sm text-gray-400">
        Free treatment guide cheat sheet, vitamin injection manual, patient handouts, and ops cheat sheets —
        email delivery from
        Danielle, same Resend setup as the shop.
      </p>
      <Link
        href="/free-templates"
        className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#D4537E] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#D4537E]/85"
      >
        Get 10 free templates →
      </Link>
    </section>
  );
}
