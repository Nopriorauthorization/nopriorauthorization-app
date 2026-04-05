import { FreeTemplatesHomeBanner } from "@/components/marketing/FreeTemplatesHomeBanner";

export const metadata = {
  title: "No Prior Authorization — The Operating System for the Modern Med Spa",
  description:
    "Playbooks, templates, clinical systems, and marketing tools built by providers who actually run a med spa. Free digital audit, premium education, and done-for-you content — all instant download.",
};

export default function HomePage() {
  return (
    <div className="-mt-16 min-h-dvh">
      <FreeTemplatesHomeBanner />
      <iframe
        src="/npa-homepage.html"
        className="block h-dvh min-h-dvh w-full border-0"
        title="No Prior Authorization"
      />
    </div>
  );
}
