import HeroSplitSlideshow from '@/components/home/HeroSplitSlideshow';
import MascotsSection from '@/components/home/MascotsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSplitSlideshow />
      <MascotsSection />
    </div>
  );
}
