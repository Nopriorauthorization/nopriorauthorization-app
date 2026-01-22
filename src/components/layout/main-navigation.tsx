"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/button";
import { FiSearch, FiX } from "react-icons/fi";

const marketingLinks = [
  { label: "Home", href: "/" },
  { label: "Family Health Hub", href: "/vault", icon: "🌳", featured: true },
  { label: "Hormone Tracker", href: "/hormone-tracker", icon: "🌸" },
  { label: "Blueprint", href: "/blueprint" },
  { label: "Treatments", href: "/treatments" },
  { label: "AI Concierge", href: "/ai-concierge", icon: "🤖" },
  { label: "Provider Packet", href: "/provider-packet-interactive", icon: "📋" },
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const directNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
    setShowSearch(false);
    setSearchQuery('');
  };

  // Search functionality
  const searchResults = marketingLinks.filter(link =>
    link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (link.icon && link.icon.includes(searchQuery.toLowerCase()))
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      directNavigate(searchResults[0].href);
    }
  };

  const renderLinks = (links: { label: string; href: string; dynamic?: boolean; icon?: string; featured?: boolean }[]) =>
    links.map((link) => (
      <button
        key={link.href}
        onClick={() => directNavigate(link.href)}
        className={`text-sm font-medium transition flex items-center gap-1.5 ${
          link.featured
            ? 'text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-2 rounded-full border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30'
            : pathname === link.href
            ? "text-hot-pink"
            : "text-white/70 hover:text-white"
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
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Search"
          >
            <FiSearch size={18} />
          </button>
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

        {/* Search Overlay */}
        {showSearch && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur border-b border-white/10 p-4">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages and features..."
                  className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-hot-pink focus:ring-1 focus:ring-hot-pink"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <FiX size={18} />
                </button>
              </div>
              {searchQuery && searchResults.length > 0 && (
                <div className="mt-3 space-y-2">
                  {searchResults.slice(0, 5).map((result) => (
                    <button
                      key={result.href}
                      onClick={() => directNavigate(result.href)}
                      className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3"
                    >
                      {result.icon && <span className="text-lg">{result.icon}</span>}
                      <div>
                        <div className="text-white font-medium">{result.label}</div>
                        <div className="text-white/50 text-sm">{result.href}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}
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
          {/* Mobile Search */}
          <div className="mb-4">
            <form onSubmit={handleSearch} className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages..."
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-hot-pink text-sm"
              />
            </form>
            {searchQuery && searchResults.length > 0 && (
              <div className="mt-2 space-y-1">
                {searchResults.slice(0, 3).map((result) => (
                  <button
                    key={result.href}
                    onClick={() => directNavigate(result.href)}
                    className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    {result.icon && <span>{result.icon}</span>}
                    <span className="text-white text-sm">{result.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
