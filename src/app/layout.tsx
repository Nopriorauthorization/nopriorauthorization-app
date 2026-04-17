import "./globals.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ConditionalAppChrome } from "@/components/layout/conditional-app-chrome";
import Providers from "@/components/layout/providers";
import { MascotControllerProvider } from "@/context/MascotController";
import type { Metadata, Viewport } from "next";
import {
  NPA_OG_IMAGE_PATH,
  NPA_PRIMARY_MESSAGE,
  NPA_SHORT_TAGLINE,
} from "@/config/npa-brand.config";

const SITE_URL = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "No Prior Authorization | Med Spa Business Systems by Danielle Alcala",
    template: "%s | No Prior Authorization",
  },
  description: NPA_PRIMARY_MESSAGE,
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
    "med spa cheat sheet",
    "botox quick reference injector",
    "aesthetic practice templates",
    "medical spa SOP templates",
    "semaglutide patient education",
    "tirzepatide clinic templates",
    "peptide therapy consent",
    "med spa intake forms",
    "injector training templates",
    "laser IPL consent form",
    "microneedling consent template",
    "esthetician business templates",
    "aesthetic nurse documentation",
    "med spa HIPAA templates",
    "patient journey kit med spa",
    "Canva med spa templates",
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
    description: NPA_PRIMARY_MESSAGE,
    images: [
      {
        url: `${SITE_URL}${NPA_OG_IMAGE_PATH}`,
        width: 1024,
        height: 571,
        alt: "No Prior Authorization — The Operating System for the Modern Med Spa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "No Prior Authorization | Med Spa Business Systems",
    description: NPA_PRIMARY_MESSAGE,
    images: [`${SITE_URL}${NPA_OG_IMAGE_PATH}`],
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
      image: `${SITE_URL}${NPA_OG_IMAGE_PATH}`,
      description: NPA_PRIMARY_MESSAGE,
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
      description: NPA_PRIMARY_MESSAGE,
      sameAs: [
        "https://instagram.com/hellogorgeousmedspa",
      ],
    },
    {
      "@type": "WebSite",
      name: "No Prior Authorization",
      url: SITE_URL,
      description: NPA_SHORT_TAGLINE,
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
              <ConditionalAppChrome>{children}</ConditionalAppChrome>
            </ErrorBoundary>
          </MascotControllerProvider>
        </Providers>
      </body>
    </html>
  );
}
