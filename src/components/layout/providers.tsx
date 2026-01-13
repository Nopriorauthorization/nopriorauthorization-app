"use client";

import { SessionProvider } from "next-auth/react";
import { AppModeProvider } from "./app-mode-provider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AppModeProvider>{children}</AppModeProvider>
    </SessionProvider>
  );
}
