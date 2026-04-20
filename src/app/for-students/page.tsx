import type { Metadata } from "next";
import { NPA_SITE_URL } from "@/config/npa-brand.config";
import {
  baseOpenGraphSiteFields,
  defaultBrandOpenGraphImages,
  defaultBrandTwitterImages,
} from "@/lib/seo/brand-social-meta";
import { normalizePathEntrySource } from "@/lib/analytics/path-entry-source";
import { StudentPathView } from "@/components/site/StudentPathView";

const CANONICAL = `${NPA_SITE_URL}/for-students`;

export const metadata: Metadata = {
  title: "For Nursing & Science Students | No Prior Authorization",
  description:
    "Microbiology, A&P, and exam prep in one lane — Micro 270 hub, Complete Microbiology bundle, physical study books, and NCLEX-style tools.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    ...baseOpenGraphSiteFields(),
    title: "For Nursing & Science Students | NPA",
    description:
      "Curated study paths: Micro 270, Complete Microbiology, A&P hub, print books, and exam prep — without catalog overload.",
    url: CANONICAL,
    images: [...defaultBrandOpenGraphImages()],
  },
  twitter: {
    card: "summary_large_image",
    title: "For Nursing & Science Students | NPA",
    description:
      "Micro 270, Complete Microbiology, A&P, and print study flagships — one clear student lane.",
    images: [...defaultBrandTwitterImages()],
  },
  robots: { index: true, follow: true },
};

export default function ForStudentsPage({
  searchParams,
}: {
  searchParams: { source?: string | string[] };
}) {
  const source = normalizePathEntrySource(searchParams.source);
  return <StudentPathView entrySource={source} />;
}
