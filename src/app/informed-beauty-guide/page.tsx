import type { Metadata } from "next";
import {
  INFORMED_BEAUTY_GUIDE_SLUG,
  INFORMED_BEAUTY_PRICE_CENTS,
  INFORMED_BEAUTY_TITLE,
} from "@/config/informed-beauty-guide.config";
import { NPA_SITE_URL } from "@/config/npa-brand.config";
import { getInformedBeautySalesBodyHtml } from "@/lib/informed-beauty-guide/sales-page-html";
import { InformedBeautyGuideSalesHydrated } from "./InformedBeautyGuideSalesHydrated";

const PAGE_PATH = "/informed-beauty-guide";
const PROMO_IMAGE_URL = `${NPA_SITE_URL}/images/informed-beauty-guide-promo.png`;
const PROMO_IMAGE_ALT =
  "The Informed Beauty Guide — patient education on skincare, lasers, injectables, hormones, and wellness. $49 instant access.";

export const metadata: Metadata = {
  metadataBase: new URL(NPA_SITE_URL),
  title: `${INFORMED_BEAUTY_TITLE} | No Prior Authorization`,
  description:
    "Take control of your aesthetic and wellness care — 11 plain-English sections on skin, injectables, GLP-1, hormones, labs, IVs, peptides, and more. Instant download from Danielle Alcala.",
  openGraph: {
    title: `${INFORMED_BEAUTY_TITLE} | NPA`,
    description:
      "Patient education guide from 10+ years in a real med spa. Know what to ask before your next treatment.",
    type: "website",
    url: `${NPA_SITE_URL}${PAGE_PATH}`,
    images: [
      {
        url: PROMO_IMAGE_URL,
        width: 1024,
        height: 682,
        alt: PROMO_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${INFORMED_BEAUTY_TITLE} | NPA`,
    description: "Everything you need to take control of your beauty and wellness care — instant download.",
    images: [PROMO_IMAGE_URL],
  },
  alternates: {
    canonical: `${NPA_SITE_URL}${PAGE_PATH}`,
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
    image: PROMO_IMAGE_URL,
    offers: {
      "@type": "Offer",
      url: `${NPA_SITE_URL}${PAGE_PATH}`,
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
