"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/button";
import { FiSearch, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { getNavigationConfig, NavigationItem } from "@/components/shared/navigation-config";

// Get app mode from environment (set by Vercel configs)
const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE || 'app';

// Navigation structure with dropdowns - SINGLE SOURCE OF TRUTH
const navigationItems: NavigationItem[] = getNavigationConfig(APP_MODE as 'marketing' | 'app');

export default function MainNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const directNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
    setShowSearch(false);
    setSearchQuery('');
    setOpenDropdown(null);
  };

  // Search functionality - search through all dropdown items
  const allSearchableItems = navigationItems.flatMap(item => 
    item.hasDropdown ? item.dropdownItems : [item]
  );

  const searchResults = allSearchableItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.icon && item.icon.includes(searchQuery.toLowerCase()))
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      directNavigate(searchResults[0].href);
    }
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const renderDesktopNavigationWithCTA = () => (
    <div className="hidden items-center gap-6 md:flex">
      {navigationItems.map((item) => (
        <div key={item.label} className="relative" ref={item.hasDropdown ? dropdownRef : null}>
          {item.hasDropdown ? (
            <>
              <button
                onClick={() => toggleDropdown(item.label)}
                className={`flex items-center gap-1 text-sm font-medium transition ${
                  pathname.startsWith(item.href) || item.dropdownItems.some(d => pathname === d.href)
                    ? "text-hot-pink"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
                {openDropdown === item.label ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
              </button>
              {openDropdown === item.label && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur border border-white/20 rounded-lg shadow-xl z-50">
                  <div className="p-2">
                    {item.dropdownItems.map((dropdownItem) => (
                      <button
                        key={dropdownItem.href}
                        onClick={() => directNavigate(dropdownItem.href)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 ${
                          pathname === dropdownItem.href
                            ? "bg-hot-pink/20 text-hot-pink"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="text-lg">{dropdownItem.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{dropdownItem.label}</div>
                          {dropdownItem.comingSoon && (
                            <div className="text-xs text-yellow-400">Coming Soon</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => directNavigate(item.href)}
              className={`text-sm font-medium transition ${
                pathname === item.href ? "text-hot-pink" : "text-white/70 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
      {/* CTA Button */}
      <a
        href="/signup"
        className="ml-6 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all hover:scale-105"
      >
        Get Started
      </a>
    </div>
  );

  const renderMobileNavigation = () => (
    <div className="flex flex-col gap-3 md:hidden">
      {navigationItems.map((item) => (
        <div key={item.label}>
          {item.hasDropdown ? (
            <>
              <button
                onClick={() => toggleDropdown(item.label)}
                className={`w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors ${
                  pathname.startsWith(item.href) || item.dropdownItems.some(d => pathname === d.href)
                    ? "bg-hot-pink/20 text-hot-pink"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="font-medium">{item.label}</span>
                {openDropdown === item.label ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>
              {openDropdown === item.label && (
                <div className="ml-4 mt-2 space-y-1">
                  {item.dropdownItems.map((dropdownItem) => (
                    <button
                      key={dropdownItem.href}
                      onClick={() => directNavigate(dropdownItem.href)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 ${
                        pathname === dropdownItem.href
                          ? "bg-hot-pink/20 text-hot-pink"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span>{dropdownItem.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{dropdownItem.label}</div>
                        {dropdownItem.comingSoon && (
                          <div className="text-xs text-yellow-400">Coming Soon</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => directNavigate(item.href)}
              className={`w-full text-left p-3 rounded-lg transition-colors font-medium ${
                pathname === item.href ? "bg-hot-pink/20 text-hot-pink" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black px-4 py-3 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <Link href="/" className="text-lg font-semibold text-white">
          <div className="flex items-center gap-2">
            <img src="/nopriornew.png" alt="No Prior Authorization" className="h-8 w-auto" />
            <span>No Prior Authorization</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {renderDesktopNavigationWithCTA()}

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

      {/* Mobile Navigation */}
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

          {/* Mobile Chat Section - Signature Feature */}
          <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
            <button
              onClick={() => directNavigate("/chat")}
              className="w-full text-left"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <div className="font-semibold text-white text-sm">Chat with Expert Mascots</div>
                  <div className="text-xs text-gray-300 mt-1">Ask any question to Beau-Tox, Peppi, Grace & 5+ specialists. All conversations saved to your blueprint.</div>
                  <div className="flex gap-1 mt-2">
                    {["7 Expert Mascots", "Memory & Blueprint", "Real-time AI Responses"].map((feature, idx) => (
                      <span key={idx} className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          </div>

          {renderMobileNavigation()}

          {/* Mobile CTA Button */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <a
              href="/signup"
              className="w-full block text-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
