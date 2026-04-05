import Link from "next/link";
import type { Metadata } from "next";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "Campaign videos — Reels-ready MP4s",
  description:
    "Direct links to Remotion-exported campaign videos for No Prior Authorization — storefront and NCLEX. 9:16 for Reels and TikTok.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE}/campaign-videos` },
};

const VIDEOS = [
  {
    title: "Storefront campaign (9×16)",
    file: "/videos/campaign/storefront-campaign-reels.mp4",
    description: "Hero, stats, pillars, trust, testimonial, CTA → /storefront",
  },
  {
    title: "NCLEX bundle (9×16)",
    file: "/videos/campaign/nclex-bundle-reels.mp4",
    description: "Cheat sheets + study guides, topics, price, CTA → /nclex-bundle",
  },
] as const;

export default function CampaignVideosPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4537E]">Social · Ads</p>
        <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Campaign video files</h1>
        <p className="mt-3 text-gray-400">
          Use these URLs in Meta Ads, TikTok, or anywhere you need a direct MP4 link. Right-click the link and copy
          address, or download from the player.
        </p>
        <ul className="mt-10 space-y-12">
          {VIDEOS.map((v) => {
            const url = `${SITE}${v.file}`;
            return (
              <li key={v.file} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="font-serif text-xl font-bold text-white">{v.title}</h2>
                <p className="mt-2 text-sm text-gray-400">{v.description}</p>
                <p className="mt-4 break-all text-sm text-[#D4537E]">
                  <a href={url} className="underline-offset-2 hover:underline">
                    {url}
                  </a>
                </p>
                <video
                  className="mt-6 w-full max-h-[520px] rounded-xl border border-white/10 bg-black object-contain"
                  controls
                  playsInline
                  preload="metadata"
                  src={v.file}
                />
              </li>
            );
          })}
        </ul>
        <p className="mt-12 text-center text-sm text-gray-500">
          <Link href="/storefront" className="text-[#D4537E] hover:underline">
            Campaign landing
          </Link>
          <span className="mx-2 text-gray-600">·</span>
          <Link href="/nclex-bundle" className="text-gray-400 hover:text-white">
            NCLEX bundle
          </Link>
          <span className="mx-2 text-gray-600">·</span>
          <Link href="/shop" className="text-gray-400 hover:text-white">
            Shop
          </Link>
        </p>
      </div>
    </div>
  );
}
