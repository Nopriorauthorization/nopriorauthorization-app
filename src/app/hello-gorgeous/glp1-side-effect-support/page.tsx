import type { Metadata } from "next";
import { NPA_SITE_URL } from "@/config/npa-brand.config";

const STATIC_GUIDE = "/hello-gorgeous/glp1-side-effect-support-guide.html";
const HG_SITE = "https://www.hellogorgeousmedspa.com";

export const metadata: Metadata = {
  metadataBase: new URL(NPA_SITE_URL),
  title: "GLP-1 Side Effect Support Guide | Hello Gorgeous Med Spa",
  description:
    "Patient-friendly guide to common GLP-1 side effects — hydration, protein, movement, supplements, and when to contact your provider. From Hello Gorgeous Med Spa & No Prior Authorization.",
  openGraph: {
    title: "GLP-1 Side Effect Support Guide | Hello Gorgeous Med Spa",
    description:
      "Support strategies for nausea, fatigue, constipation, and more while on GLP-1 medications. Educational resource — not medical advice.",
    type: "article",
    url: `${NPA_SITE_URL}/hello-gorgeous/glp1-side-effect-support`,
  },
  alternates: {
    canonical: `${NPA_SITE_URL}/hello-gorgeous/glp1-side-effect-support`,
  },
};

export default function Glp1SideEffectSupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0d0d0f]">
      <header className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-white/10 bg-[#1a1a1a] px-4 py-3 text-center text-xs text-white/80 sm:text-sm">
        <span className="font-semibold text-[#D4537E]">Hello Gorgeous Med Spa</span>
        <span className="hidden text-white/40 sm:inline">·</span>
        <a href={HG_SITE} className="text-[#D4537E] underline-offset-2 hover:text-white hover:underline">
          hellogorgeousmedspa.com
        </a>
        <span className="text-white/40">·</span>
        <span className="text-white/55">GLP-1 patient resource</span>
      </header>
      <iframe
        title="GLP-1 Side Effect Support Guide"
        src={STATIC_GUIDE}
        className="min-h-[calc(100vh-52px)] w-full flex-1 border-0 bg-[#EDEAE8]"
      />
    </div>
  );
}
