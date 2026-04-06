import type { Metadata } from "next";
import {
  INFORMED_BEAUTY_GUIDE_SLUG,
  INFORMED_BEAUTY_PRICE_CENTS,
  INFORMED_BEAUTY_TITLE,
} from "@/config/informed-beauty-guide.config";
import { getInformedBeautySalesBodyHtml } from "@/lib/informed-beauty-guide/sales-page-html";
import { InformedBeautyGuideSalesHydrated } from "./InformedBeautyGuideSalesHydrated";

const SITE_URL = process.env.NEXTAUTH_URL || "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: `${INFORMED_BEAUTY_TITLE} | No Prior Authorization`,
  description:
    "Take control of your aesthetic and wellness care — 11 plain-English sections on skin, injectables, GLP-1, hormones, labs, IVs, peptides, and more. Instant download from Danielle Alcala.",
  openGraph: {
    title: `${INFORMED_BEAUTY_TITLE} | NPA`,
    description:
      "Patient education guide from 10+ years in a real med spa. Know what to ask before your next treatment.",
    type: "website",
    url: `${SITE_URL}/informed-beauty-guide`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${INFORMED_BEAUTY_TITLE} | NPA`,
    description: "Everything you need to take control of your beauty and wellness care — instant download.",
  },
  alternates: {
    canonical: `${SITE_URL}/informed-beauty-guide`,
  },
};

export default function InformedBeautyGuidePage() {
  const bodyHtml = getInformedBeautySalesBodyHtml();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: INFORMED_BEAUTY_TITLE,
    description:
      "Digital patient education guide — aesthetic treatments, wellness, and how to advocate for your own care.",
    brand: { "@type": "Brand", name: "No Prior Authorization" },
    sku: INFORMED_BEAUTY_GUIDE_SLUG,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/informed-beauty-guide`,
      priceCurrency: "USD",
      price: INFORMED_BEAUTY_PRICE_CENTS / 100,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InformedBeautyGuideSalesHydrated bodyHtml={bodyHtml} />
    </>
  );
}
