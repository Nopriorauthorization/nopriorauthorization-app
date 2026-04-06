"use client";

import { SessionProvider } from "next-auth/react";
import { ProUpgradeModal } from "@/components/membership/ProUpgradeModal";
import { ProUpgradeProvider } from "@/components/membership/ProUpgradeContext";
import { AppModeProvider } from "./app-mode-provider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AppModeProvider>
        <ProUpgradeProvider>
          {children}
          <ProUpgradeModal />
        </ProUpgradeProvider>
      </AppModeProvider>
    </SessionProvider>
  );
}
