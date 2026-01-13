import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import "./globals.css";
import { AppModeProvider } from "@/components/site/app-mode-provider";
import SiteHeader from "@/components/site/header";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "No Prior Authorization",
  description:
    "Expert-led answers patients are afraid to ask. Trust-first education for consumers and providers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${fraunces.variable} antialiased`}>
        <AppModeProvider>
          <SiteHeader />
          {children}
        </AppModeProvider>
      </body>
    </html>
  );
}
