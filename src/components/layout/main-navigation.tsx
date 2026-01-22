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
  { label: "Settings", href: "/settings" },
];

// Interactive Chat Section - Our signature feature
const chatSection = {
  label: "💬 Chat with Expert Mascots",
  description: "Ask any question to Beau-Tox, Peppi, Grace & 5+ specialists. All conversations saved to your blueprint.",
  href: "/chat",
  features: ["7 Expert Mascots", "Memory & Blueprint", "Real-time AI Responses"]
};

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
        
        {/* Interactive Chat Section - Signature Feature */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 hover:from-pink-500/30 hover:to-purple-500/30 transition-all cursor-pointer" onClick={() => directNavigate(chatSection.href)}>
            <span className="text-lg">{chatSection.label.split(' ')[0]}</span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">Chat with</span>
              <span className="text-xs text-pink-300">Expert Mascots</span>
            </div>
            <div className="ml-2 flex gap-1">
              {chatSection.features.slice(0, 2).map((feature, idx) => (
                <span key={idx} className="text-xs bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded text-[10px]">
                  {feature.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

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
      
      {/* Mobile Chat Section */}
      {open && (
        <div className="mt-3 border-t border-white/5 pt-3 md:hidden">
          <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
            <button 
              onClick={() => directNavigate(chatSection.href)}
              className="w-full text-left"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <div className="font-semibold text-white text-sm">Chat with Expert Mascots</div>
                  <div className="text-xs text-gray-300 mt-1">{chatSection.description}</div>
                  <div className="flex gap-1 mt-2">
                    {chatSection.features.map((feature, idx) => (
                      <span key={idx} className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {renderLinks(marketingLinks)}
          </div>
        </div>
      )}
    </header>
  );
}
