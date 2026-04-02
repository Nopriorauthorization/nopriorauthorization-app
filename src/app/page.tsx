export const metadata = {
  title: "No Prior Authorization — The Operating System for the Modern Med Spa",
  description:
    "Playbooks, templates, clinical systems, and marketing tools built by providers who actually run a med spa. Free digital audit, premium education, and done-for-you content — all instant download.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <iframe
        src="/npa-homepage.html"
        className="block w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="No Prior Authorization"
      />
    </div>
  );
}
