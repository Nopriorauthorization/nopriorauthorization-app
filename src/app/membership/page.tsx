export const metadata = {
  title: "NPA Pro Membership | Every Med Spa Product for $47/month",
  description:
    "Access all 22+ playbooks, kits, and templates. New products added monthly. Cancel anytime. Built by a med spa founder who actually runs one.",
  openGraph: {
    title: "NPA Pro Membership | $47/month",
    description: "Every playbook, kit, and template. New monthly drops. Cancel anytime.",
  },
};

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <iframe
        src="/forms/NPA-Pro-Membership.html"
        className="mx-auto block w-full max-w-[860px] border-0"
        style={{ minHeight: "100vh" }}
        title="NPA Pro Membership"
      />
    </div>
  );
}
