import HeroSplitSlideshow from '@/components/home/HeroSplitSlideshow';
import SpecialistsTeaser from '@/components/mascots/SpecialistsTeaser';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Slideshow */}
      <HeroSplitSlideshow />

      {/* Homepage Explainer Video */}
      <div className="w-full max-w-6xl mx-auto px-6 py-16">
        <video
          className="w-full rounded-lg shadow-2xl"
          muted
          autoPlay
          loop
          playsInline
          src="/videos/homepage-explainer-v1.mp4"
        />
      </div>

      {/* Specialists Section */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        <SpecialistsTeaser />
      </div>
    </div>
  );
}
