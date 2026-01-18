"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/button";

const marketingLinks = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/#blueprint" },
  { label: "Experts", href: "/#experts" },
  { label: "Pricing", href: "/subscribe" },
  { label: "Log in", href: "/login" },
];

const appLinks = [
  { label: "Blueprint", href: "/blueprint" },
  { label: "Treatments", href: "/treatments" },
  { label: "Diary", href: "/diary" },
  { label: "Resources", href: "/resources" },
  { label: "Chat", href: "/chat" },
  { label: "Provider Packet", href: "/provider-packet" },
  { label: "Documents Vault", href: "/documents" },
  { label: "Settings", href: "/settings" },
  { label: "Subscribe", href: "/subscribe" },
]

export default function MainNavigation() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const directNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const navigateAuthAware = (href: string) => {
    if (session) {
      directNavigate(href);
      return;
    }
    router.push(`/login?callbackUrl=${encodeURIComponent(href)}`);
    setOpen(false);
  };

  const isAppNav = Boolean(session);

  const renderLinks = (links: { label: string; href: string }[]) =>
    links.map((link) => (
      <button
        key={link.href}
        onClick={() =>
          link.label === "Log in" || link.label === "Home" || !session
            ? directNavigate(link.href)
            : navigateAuthAware(link.href)
        }
        className={`text-sm font-medium transition ${
          pathname === link.href ? "text-hot-pink" : "text-white/70"
        }`}
      >
        {link.label}
      </button>
    ));

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black px-4 py-3 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <Link href="/" className="text-lg font-semibold text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✦</span>
            <span>No Prior Authorization</span>
          </div>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {!isAppNav && renderLinks(marketingLinks)}
          {isAppNav && renderLinks(appLinks)}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {!isAppNav && (
            <Link
              href="/subscribe"
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Plans
            </Link>
          )}
          <button
            onClick={() =>
              session
                ? router.push("/blueprint")
                : router.push("/login?callbackUrl=/blueprint")
            }
            className="rounded-full bg-hot-pink px-4 py-2 text-sm font-semibold text-black transition hover:bg-pink-500"
          >
            Open Blueprint
          </button>
          {session && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
              onClick={() => signOut()}
            >
              Log out
            </Button>
          )}
        </div>
        {session && (
          <div className="hidden md:flex items-center justify-end text-xs text-white/70">
            Upgrade to Blueprint to unlock exports, docs, and secure sharing.
          </div>
        )}
        <button
          className="ml-auto text-sm text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          Menu
        </button>
      </div>
      {open && (
        <div className="mt-3 flex flex-col gap-3 border-t border-white/5 pt-3 md:hidden">
          {!isAppNav && renderLinks(marketingLinks)}
          {isAppNav && renderLinks(appLinks)}
          {session && (
            <p className="text-xs text-center text-white/70">
              Upgrade to Blueprint to unlock exports, docs, and secure sharing.
            </p>
          )}
        </div>
      )}
    </header>
  );
}
