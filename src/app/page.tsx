import HeroSplitSlideshow from '@/components/home/HeroSplitSlideshow';
import SpecialistsTeaser from '@/components/mascots/SpecialistsTeaser';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSplitSlideshow />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <SpecialistsTeaser />
      </div>
    </div>
  );
}
