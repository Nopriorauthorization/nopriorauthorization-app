import "./globals.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import MainNavigation from "@/components/layout/main-navigation";
import { MascotControllerProvider } from "@/context/MascotController";
import { Metadata } from "next";

const SITE_URL = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "No Prior Authorization - Family Health Operating System",
    template: "%s | No Prior Authorization",
  },
  description: "A patient-first health platform that helps you organize, decode, and understand your health — without confusion. Secure vault, AI health guides, and family health management.",
  keywords: ["health management", "family health", "medical records", "lab results", "health vault", "patient portal", "HIPAA compliant"],
  authors: [{ name: "No Prior Authorization" }],
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
    title: "No Prior Authorization - Family Health Operating System",
    description: "Take control of your family's health journey with AI-powered health guides, secure document vault, and comprehensive health management tools.",
  },
  twitter: {
    card: "summary_large_image",
    title: "No Prior Authorization - Family Health Operating System",
    description: "Take control of your family's health journey with AI-powered health guides and secure health management.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "Health",
};

// Schema.org JSON-LD structured data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "No Prior Authorization",
  url: SITE_URL,
  description: "A patient-first health intelligence platform that helps families organize, decode, and understand their health.",
  foundingDate: "2024",
  sameAs: [],
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "No Prior Authorization",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  description: "Family health operating system with AI health guides, secure vault, and health management tools.",
  offers: {
    "@type": "Offer",
    price: "29.00",
    priceCurrency: "USD",
  },
  featureList: [
    "Secure health document vault",
    "AI-powered lab result decoder",
    "Family health tree",
    "7 specialized AI health guides",
    "Provider packet generation",
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
        {/* Schema.org JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationSchema),
          }}
        />
      </head>
      <body className="bg-black text-white min-h-screen">
        <MascotControllerProvider>
          <ErrorBoundary>
            <MainNavigation />
            <main className="pt-16">{children}</main>
          </ErrorBoundary>
        </MascotControllerProvider>
      </body>
    </html>
  );
}
