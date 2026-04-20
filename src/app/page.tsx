import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { FreeTemplatesHomeBanner } from "@/components/marketing/FreeTemplatesHomeBanner";
import { NPA_PRIMARY_MESSAGE, NPA_SITE_URL } from "@/config/npa-brand.config";
import {
  baseOpenGraphSiteFields,
  defaultBrandOpenGraphImages,
  defaultBrandTwitterImages,
} from "@/lib/seo/brand-social-meta";

const HomepageAudienceStrip = dynamic(
  () =>
    import("@/components/marketing/HomepageAudienceStrip").then(
      (m) => m.HomepageAudienceStrip,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="relative z-10 min-h-[min(80dvh,920px)] border-b border-white/10 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0d0d0d]"
        aria-hidden
      />
    ),
  },
);

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
    <div className="-mt-16 flex min-h-dvh flex-col">
      <FreeTemplatesHomeBanner />
      <HomepageAudienceStrip />
      <iframe
        src="/npa-homepage.html"
        className="min-h-0 w-full flex-1 border-0"
        title="No Prior Authorization"
      />
    </div>
  );
}
