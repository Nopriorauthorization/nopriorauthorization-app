import { requireAdmin } from "@/lib/auth/admin-guard";
import Link from "next/link";

/**
 * ADMIN PORTAL — Control Plane
 * 
 * This is an operating interface, not a dashboard.
 * Each domain is self-contained: Read → Act → Audit
 */

export default async function AdminPage() {
  const admin = await requireAdmin("/admin");

  const domains = [
    {
      title: "Activity & Audit Logs",
      href: "/admin/activity-logs",
      description: "HIPAA compliance center — PHI access patterns, consent changes, share events",
      icon: "📋",
    },
    {
      title: "Users",
      href: "/admin/users",
      description: "User lookup, role visibility, account status management",
      icon: "👤",
      disabled: true, // Phase 2A.2
    },
    {
      title: "Share Links",
      href: "/admin/share-links",
      description: "Active provider shares, revoke access, access tracking",
      icon: "🔗",
      disabled: true, // Phase 2A.3
    },
    {
      title: "Consent History",
      href: "/admin/consent-history",
      description: "Per-user consent timeline for compliance audits",
      icon: "✅",
      disabled: true, // Phase 2A.4
    },
    {
      title: "Data Requests",
      href: "/admin/data-requests",
      description: "Export/deletion queue management",
      icon: "📦",
      disabled: true, // Phase 2A.5
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
            Admin Portal
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl mt-2">
            Control Plane
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Logged in as <span className="text-white">{admin.email}</span> • Role: ADMIN
          </p>
        </div>

        {/* Domains Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {domains.map((domain) => (
            <Link
              key={domain.href}
              href={domain.disabled ? "#" : domain.href}
              className={`
                rounded-2xl border border-white/10 bg-white/5 p-6 transition
                ${
                  domain.disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:border-hot-pink/40 hover:bg-white/10"
                }
              `}
              {...(domain.disabled && { onClick: (e: React.MouseEvent) => e.preventDefault() })}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{domain.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {domain.title}
                    {domain.disabled && (
                      <span className="ml-2 text-xs text-gray-500">(Coming Soon)</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">{domain.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Security Notice */}
        <div className="mt-12 rounded-xl border border-hot-pink/40 bg-hot-pink/5 p-6">
          <p className="text-xs text-gray-400">
            <strong className="text-white">Security Notice:</strong> All admin actions are logged to the audit trail.
            Session timeout: 15 minutes. This interface displays user IDs and emails only — no PHI content.
          </p>
        </div>
      </div>
    </div>
  );
}
