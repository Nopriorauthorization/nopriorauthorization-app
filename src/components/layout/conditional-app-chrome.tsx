"use client";

import { usePathname } from "next/navigation";
import MainNavigation from "@/components/layout/main-navigation";
import { StickyEmailBar } from "@/components/shop/StickyEmailBar";

/** Routes that render without global nav, sticky bar, or main padding (full-bleed landing pages). */
const STANDALONE_PREFIXES = ["/book", "/micro270"];

export function ConditionalAppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const standalone = STANDALONE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (standalone) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <>
      <MainNavigation />
      <main className="min-w-0 pt-16 pb-[calc(6rem+env(safe-area-inset-bottom,0px))]">
        {children}
      </main>
      <StickyEmailBar />
    </>
  );
}
