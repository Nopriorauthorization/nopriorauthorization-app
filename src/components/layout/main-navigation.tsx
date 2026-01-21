"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/button";

const marketingLinks = [
  { label: "Home", href: "/" },
  { label: "Blueprint", href: "/blueprint" },
  { label: "Treatments", href: "/treatments" },
  { label: "AI Concierge", href: "/ai-concierge", icon: "🤖" },
  { label: "Provider Packet", href: "/provider-packet-interactive", icon: "📋" },
  { label: "Sacred Vault", href: "/vault", dynamic: true },
  { label: "Health Decoder", href: "/vault/decoder", icon: "🏥" },
  { label: "Life Changing Diagnosis", href: "/vault/priority", icon: "🛡️" },
  { label: "Chat", href: "/chat" },
  { label: "Settings", href: "/settings" },
];

// No appLinks: all navigation is public

export default function MainNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const directNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const renderLinks = (links: { label: string; href: string; dynamic?: boolean; icon?: string }[]) =>
    links.map((link) => (
      <button
        key={link.href}
        onClick={() => directNavigate(link.href)}
        className={`text-sm font-medium transition flex items-center gap-1.5 ${
          pathname === link.href ? "text-hot-pink" : "text-white/70"
        }`}
      >
        {link.icon && <span>{link.icon}</span>}
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
          {renderLinks(marketingLinks)}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/subscribe"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View Plans
          </Link>
          <button
            onClick={() => router.push("/blueprint")}
            className="rounded-full bg-hot-pink px-4 py-2 text-sm font-semibold text-black transition hover:bg-pink-500"
          >
            Open Blueprint
          </button>
        </div>
        <button
          className="ml-auto text-sm text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          Menu
        </button>
      </div>
      {open && (
        <div className="mt-3 flex flex-col gap-3 border-t border-white/5 pt-3 md:hidden">
          {renderLinks(marketingLinks)}
        </div>
      )}
    </header>
  );
}
