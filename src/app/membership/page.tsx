export const metadata = {
  title: "NPA Pro Membership | $47/mo — All Products, New Monthly Drops",
  description:
    "Get access to every playbook, kit, and template. New content drops monthly. $47/mo or $397/year. The operating system for the modern med spa.",
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
