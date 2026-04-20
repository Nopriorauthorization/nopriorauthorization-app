import type { Metadata } from "next";
import { NPA_SITE_URL } from "@/config/npa-brand.config";
import {
  baseOpenGraphSiteFields,
  defaultBrandOpenGraphImages,
  defaultBrandTwitterImages,
} from "@/lib/seo/brand-social-meta";
import { normalizePathEntrySource } from "@/lib/analytics/path-entry-source";
import { ProviderPathView } from "@/components/site/ProviderPathView";

const CANONICAL = `${NPA_SITE_URL}/for-providers`;

export const metadata: Metadata = {
  title: "For Med Spa Injectors & Owners | No Prior Authorization",
  description:
    "Growth System, Hello Gorgeous patient education, shop collections, playbooks, and consent bundles — curated for aesthetic practices.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    ...baseOpenGraphSiteFields(),
    title: "For Med Spa Injectors & Owners | NPA",
    description:
      "Templates, playbooks, and systems for the treatment room and the business — fewer SKUs, stronger offers.",
    url: CANONICAL,
    images: [...defaultBrandOpenGraphImages()],
  },
  twitter: {
    card: "summary_large_image",
    title: "For Med Spa Injectors & Owners | NPA",
    description:
      "Growth System, collections, playbooks, and patient education — built for injectors and owners.",
    images: [...defaultBrandTwitterImages()],
  },
  robots: { index: true, follow: true },
};

export default function ForProvidersPage({
  searchParams,
}: {
  searchParams: { source?: string | string[] };
}) {
  const source = normalizePathEntrySource(searchParams.source);
  return <ProviderPathView entrySource={source} />;
}
