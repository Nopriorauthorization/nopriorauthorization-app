import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

const SITE = "https://nopriorauthorization.com";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-micro270-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-micro270-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Micro 270 Study Hub — 1,000 Nursing Microbiology Questions | No Prior Authorization",
  description:
    "Free study tool for Microbiology 270. 1,000 professor-style Q&A across 20 chapters with exam traps, explanations, and progress tracking. Built for nursing students.",
  alternates: {
    canonical: `${SITE}/micro270`,
  },
  openGraph: {
    title:
      "Micro 270 Study Hub — 1,000 Nursing Microbiology Questions | No Prior Authorization",
    description:
      "Free study tool for Microbiology 270. Professor-style Q&A, exam traps, and progress tracking.",
    url: `${SITE}/micro270`,
    siteName: "No Prior Authorization",
    type: "website",
  },
};

export default function Micro270Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} ${playfair.variable}`}>{children}</div>
  );
}
