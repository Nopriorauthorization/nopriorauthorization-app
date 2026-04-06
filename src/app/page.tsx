import type { Metadata } from "next";
import { NpaConversionHome } from "@/components/marketing/NpaConversionHome";
import { FreeTemplatesHomeBanner } from "@/components/marketing/FreeTemplatesHomeBanner";
import { NPA_PRIMARY_MESSAGE, NPA_SITE_URL } from "@/config/npa-brand.config";
import {
  baseOpenGraphSiteFields,
  defaultBrandOpenGraphImages,
  defaultBrandTwitterImages,
} from "@/lib/seo/brand-social-meta";

export const metadata: Metadata = {
  title: "No Prior Authorization — Med spa templates, playbooks & Pro Membership",
  description: NPA_PRIMARY_MESSAGE,
  openGraph: {
    ...baseOpenGraphSiteFields(),
    title: "No Prior Authorization — Digital OS for med spas & injectors",
    description: NPA_PRIMARY_MESSAGE,
    url: NPA_SITE_URL,
    images: [...defaultBrandOpenGraphImages()],
  },
  twitter: {
    card: "summary_large_image",
    title: "No Prior Authorization — Med spa templates & Pro Membership",
    description: NPA_PRIMARY_MESSAGE,
    images: [...defaultBrandTwitterImages()],
  },
  alternates: { canonical: NPA_SITE_URL },
};

export default function HomePage() {
  return (
    <div className="-mt-16 min-h-dvh">
      <FreeTemplatesHomeBanner />
      <NpaConversionHome />
    </div>
  );
}
