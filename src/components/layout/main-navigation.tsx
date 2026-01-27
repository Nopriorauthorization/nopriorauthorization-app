"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiChevronDown, FiChevronUp, FiMenu } from "react-icons/fi";
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
    item.hasDropdown && item.dropdownItems ? item.dropdownItems : [item]
  );

  const searchResults = allSearchableItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
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

  const isActive = (item: NavigationItem) => {
    if (pathname === item.href) return true;
    if (item.hasDropdown && item.dropdownItems) {
      return item.dropdownItems.some(d => pathname === d.href);
    }
    return false;
  };

  const renderDesktopNavigation = () => (
    <nav className="hidden lg:flex items-center gap-1">
      {navigationItems.map((item) => (
        <div key={item.label} className="relative" ref={item.hasDropdown ? dropdownRef : null}>
          {item.hasDropdown ? (
            <>
              <button
                onClick={() => toggleDropdown(item.label)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item)
                    ? `${item.color || 'text-pink-400'} bg-white/5`
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon && <span className="text-base">{item.icon}</span>}
                <span>{item.label}</span>
                {openDropdown === item.label ? (
                  <FiChevronUp size={14} className="ml-1" />
                ) : (
                  <FiChevronDown size={14} className="ml-1" />
                )}
              </button>
              {openDropdown === item.label && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-2">
                    {item.dropdownItems?.map((dropdownItem) => (
                      <button
                        key={dropdownItem.href}
                        onClick={() => directNavigate(dropdownItem.href)}
                        className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-start gap-3 group ${
                          pathname === dropdownItem.href
                            ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <span className={`text-xl ${dropdownItem.color || 'text-white/70'} group-hover:scale-110 transition-transform`}>
                          {dropdownItem.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${pathname === dropdownItem.href ? 'text-pink-400' : 'text-white'}`}>
                            {dropdownItem.label}
                          </div>
                          {dropdownItem.description && (
                            <div className="text-xs text-gray-500 mt-0.5 truncate">
                              {dropdownItem.description}
                            </div>
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
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(item)
                  ? `${item.color || 'text-pink-400'} bg-white/5`
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon && <span className="text-base">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          )}
        </div>
      ))}
    </nav>
  );

  const renderMobileNavigation = () => (
    <div className="flex flex-col gap-1 lg:hidden">
      {navigationItems.map((item) => (
        <div key={item.label}>
          {item.hasDropdown ? (
            <>
              <button
                onClick={() => toggleDropdown(item.label)}
                className={`w-full text-left flex items-center justify-between p-3 rounded-xl transition-all ${
                  isActive(item)
                    ? `${item.color || 'text-pink-400'} bg-white/5`
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon && <span className="text-xl">{item.icon}</span>}
                  <span className="font-medium">{item.label}</span>
                </div>
                {openDropdown === item.label ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>
              {openDropdown === item.label && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/10 pl-4">
                  {item.dropdownItems?.map((dropdownItem) => (
                    <button
                      key={dropdownItem.href}
                      onClick={() => directNavigate(dropdownItem.href)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
                        pathname === dropdownItem.href
                          ? "bg-pink-500/20 text-pink-400"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className={dropdownItem.color || ''}>{dropdownItem.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{dropdownItem.label}</div>
                        {dropdownItem.description && (
                          <div className="text-xs text-gray-500">{dropdownItem.description}</div>
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
              className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center gap-3 ${
                isActive(item)
                  ? `${item.color || 'text-pink-400'} bg-white/5`
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon && <span className="text-xl">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/nopriornew.png" alt="NPA" className="h-8 w-auto" />
            <span className="text-lg font-semibold text-white hidden sm:block">No Prior Authorization</span>
          </Link>

          {/* Desktop Navigation */}
          {renderDesktopNavigation()}

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/subscribe"
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/blueprint"
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-pink-500/25 transition-all hover:scale-105"
              >
                Open Blueprint
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {showSearch && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-4 shadow-2xl">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages and features..."
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>
              {searchQuery && searchResults.length > 0 && (
                <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
                  {searchResults.slice(0, 8).map((result) => (
                    <button
                      key={result.href}
                      onClick={() => directNavigate(result.href)}
                      className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3"
                    >
                      {result.icon && <span className="text-lg">{result.icon}</span>}
                      <div>
                        <div className="text-white font-medium text-sm">{result.label}</div>
                        <div className="text-white/40 text-xs">{result.href}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="lg:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50 text-sm"
              />
            </form>

            {/* Quick Actions - Chat prominently featured */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
              <button
                onClick={() => directNavigate("/chat")}
                className="w-full text-left"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="font-semibold text-white text-sm">Chat with AI Specialists</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Harmony, Peppi, Beau-Tox, Slim-T & more
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Navigation Items */}
            {renderMobileNavigation()}

            {/* Mobile CTA */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                href="/subscribe"
                className="w-full block text-center px-6 py-3 border border-white/20 text-white text-sm font-medium rounded-xl hover:bg-white/5 transition-all"
              >
                View Pricing
              </Link>
              <Link
                href="/signup"
                className="w-full block text-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
