export const metadata = {
  title: "Free Med Spa Digital Audit | Score Your Online Presence — NPA",
  description:
    "Find out exactly what's costing you patients on Google. Free scored report in 60 seconds. No credit card required.",
  openGraph: {
    title: "Free Med Spa Digital Audit",
    description: "Score your online presence in 60 seconds. Free — no credit card required.",
  },
};

export default function AuditPage() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#FAF7F5]">
      <iframe
        src="/forms/NPA-Digital-Audit.html"
        className="mx-auto block h-[calc(100dvh-4rem)] min-h-[calc(100dvh-4rem)] w-full max-w-[860px] border-0 bg-[#FAF7F5]"
        title="Med Spa Digital Audit"
      />
    </div>
  );
}
