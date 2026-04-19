import Link from "next/link";
import fs from "fs";
import path from "path";
import { micro270ShopCheckout } from "@/config/micro270-sales.config";

type ChapterRow = { ch: number; title: string; file: string };

function loadChapters(): ChapterRow[] {
  try {
    const p = path.join(process.cwd(), "public/micro270/chapters.json");
    return JSON.parse(fs.readFileSync(p, "utf8")) as ChapterRow[];
  } catch {
    return [];
  }
}

export default function Micro270CheatSheetsIndexPage() {
  const chapters = loadChapters();

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-[#1A1A1A] px-4 py-12 text-white">
      <p className="text-sm font-medium uppercase tracking-wide text-teal-300/90">
        Micro 270 · Chapter cheat sheets
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold">Printable chapters</h1>
      <p className="mt-3 text-sm text-gray-400">
        Open any chapter, then use Print → Save as PDF (or print) for your binder. If a link
        sends you back to pricing, open your delivery email and click{" "}
        <strong>Activate</strong> on this device first.
      </p>
      <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
        Ready for the full interactive bank (all questions + explanations + hub)?{" "}
        <Link
          href={micro270ShopCheckout.completeMicrobiology}
          className="font-semibold text-[#D4537E] underline-offset-2 hover:underline"
        >
          Get everything in one — Complete Microbiology ($79)
        </Link>{" "}
        <span className="text-gray-500">or</span>{" "}
        <Link
          href={micro270ShopCheckout.bankOnly}
          className="font-semibold text-teal-300/90 underline-offset-2 hover:underline"
        >
          bank only ($47)
        </Link>
        .
      </p>
      <ul className="mt-8 space-y-2">
        {chapters.map((row) => (
          <li key={row.ch}>
            <Link
              href={`/micro270/cheat-sheets/${row.file}`}
              className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm transition hover:border-teal-500/40 hover:bg-white/[0.06]"
            >
              <span className="font-medium text-gray-100">
                Ch. {row.ch} — {row.title}
              </span>
              <span className="shrink-0 text-xs text-teal-300/90">Open →</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-center text-sm text-gray-500">
        <Link href="/micro270" className="text-gray-400 hover:text-white">
          ← Back to Micro 270 home
        </Link>
      </p>
    </main>
  );
}
