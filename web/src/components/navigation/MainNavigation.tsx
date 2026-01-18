"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function MainNavigation() {
  const [open, setOpen] = useState(false);

  // Set in Vercel (web project) for previews:
  // NEXT_PUBLIC_APP_URL=https://app.nopriorauthorization.com
  const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://app.nopriorauthorization.com";

  const appLogin = (callbackPath: string) =>
    `${APP_URL}/login?callbackUrl=${encodeURIComponent(callbackPath)}`;

  const marketingLinks = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "How it works", href: "/#blueprint" },
      { label: "Experts", href: "/#experts" },
      { label: "Pricing", href: "/subscribe" },
    ],
    []
  );

  const portalLinks = useMemo(
    () => [
      { label: "Blueprint", href: appLogin("/blueprint") },
      { label: "Treatments", href: appLogin("/treatments") },
      { label: "Diary", href: appLogin("/diary") },
      { label: "Resources", href: appLogin("/resources") },
      { label: "Chat", href: appLogin("/chat") },
    ],
    [APP_URL]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold text-white">
            No Prior Authorization
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {marketingLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-white/80 hover:text-white"
              >
                {l.label}
              </Link>
            ))}

            <span className="h-4 w-px bg-white/15" />

            {portalLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-white/80 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={appLogin("/login")}
            className="text-sm font-semibold text-white/80 hover:text-white"
          >
            Log in
          </a>

          <Link
            href="/subscribe"
            className="rounded-full bg-hot-pink px-4 py-2 text-sm font-semibold text-black transition hover:bg-pink-500"
          >
            View Plans
          </Link>

          <a
            href={appLogin("/blueprint")}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Open Blueprint
          </a>
        </div>

        <button
          type="button"
          className="md:hidden rounded-md p-2 text-white/80 hover:text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="text-sm font-semibold">{open ? "Close" : "Menu"}</span>
        </button>
      </div>

      <div className={cx("md:hidden", open && "border-t border-white/10")}>
        {open && (
          <div className="space-y-2 px-6 py-4">
            {marketingLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="block py-2 text-sm text-white/80 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}

            <div className="my-3 h-px bg-white/10" />

            {portalLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="block py-2 text-sm text-white/80 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}

            <div className="my-3 h-px bg-white/10" />

            <div className="flex flex-col gap-2">
              <Link
                href="/subscribe"
                className="rounded-full bg-hot-pink px-4 py-2 text-center text-sm font-semibold text-black transition hover:bg-pink-500"
                onClick={() => setOpen(false)}
              >
                View Plans
              </Link>
              <a
                href={appLogin("/blueprint")}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Open Blueprint
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
