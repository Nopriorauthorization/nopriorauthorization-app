import "./globals.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import MainNavigation from "@/components/layout/main-navigation";
import { StickyEmailBar } from "@/components/shop/StickyEmailBar";
import Providers from "@/components/layout/providers";
import { MascotControllerProvider } from "@/context/MascotController";
import type { Metadata, Viewport } from "next";

const SITE_URL = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "No Prior Authorization | Med Spa Business Systems by Danielle Alcala",
    template: "%s | No Prior Authorization",
  },
  description:
    "Playbooks, templates, and tools built inside a real med spa — so you don't spend years figuring out what nobody taught you. Free digital audit included.",
  keywords: [
    "med spa templates",
    "med spa playbooks",
    "botox consent forms",
    "med spa business",
    "aesthetic provider templates",
    "med spa marketing",
    "med spa startup",
    "injector training",
    "med spa social media",
    "HIPAA forms med spa",
    "GLP-1 templates",
    "IV therapy templates",
    "med spa digital products",
    "Danielle Alcala",
    "Hello Gorgeous Med Spa",
  ],
  authors: [{ name: "Danielle Alcala", url: SITE_URL }],
  creator: "No Prior Authorization",
  publisher: "No Prior Authorization",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "No Prior Authorization",
    title:
      "No Prior Authorization | Med Spa Business Systems by Danielle Alcala",
    description:
      "Playbooks, templates, clinical systems, and marketing tools built by providers who actually run a med spa. Free digital audit included.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "No Prior Authorization — The Operating System for the Modern Med Spa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "No Prior Authorization | Med Spa Business Systems",
    description:
      "Built by a med spa founder who actually runs one. Playbooks, templates, and tools — instant download.",
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "Business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const schemaGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "No Prior Authorization",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description:
        "Med spa business systems, playbooks, and tools built by Danielle Alcala, founder of Hello Gorgeous Med Spa.",
      founder: {
        "@type": "Person",
        name: "Danielle Alcala",
        jobTitle: "Founder, Licensed Esthetician",
        worksFor: {
          "@type": "Organization",
          name: "Hello Gorgeous Med Spa",
        },
      },
      sameAs: [
        "https://instagram.com/hellogorgeousmedspa",
        "https://www.etsy.com/shop/nopriorauthorization",
      ],
    },
    {
      "@type": "Person",
      name: "Danielle Alcala",
      jobTitle: "Med Spa Founder & Business Educator",
      url: `${SITE_URL}`,
      description:
        "Danielle Alcala is the founder of Hello Gorgeous Med Spa in Oswego, Illinois and creator of No Prior Authorization — the business platform for aesthetic providers.",
      sameAs: [
        "https://instagram.com/hellogorgeousmedspa",
      ],
    },
    {
      "@type": "WebSite",
      name: "No Prior Authorization",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/shop?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaGraph),
          }}
        />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-black text-white antialiased">
        <Providers>
          <MascotControllerProvider>
            <ErrorBoundary>
              <MainNavigation />
              <main className="min-w-0 pt-16 pb-[calc(6rem+env(safe-area-inset-bottom,0px))]">
                {children}
              </main>
              <StickyEmailBar />
            </ErrorBoundary>
          </MascotControllerProvider>
        </Providers>
      </body>
    </html>
  );
}
