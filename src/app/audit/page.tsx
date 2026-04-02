export const metadata = {
  title: "Free Med Spa Digital Audit | No Prior Authorization",
  description:
    "Get your free personalized digital audit — scored report showing what's costing you patients and what to fix first. Enter your practice details, get results instantly.",
};

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <iframe
        src="/forms/NPA-Digital-Audit.html"
        className="mx-auto block w-full max-w-[860px] border-0"
        style={{ minHeight: "100vh" }}
        title="Med Spa Digital Audit"
      />
    </div>
  );
}
