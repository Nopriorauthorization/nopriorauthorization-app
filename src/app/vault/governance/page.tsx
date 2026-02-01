"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader } from "@/components/ui/card";

/**
 * NPA Phase 6: Patient Governance Dashboard
 * 
 * PURPOSE: Make trust visible.
 * 
 * Patients can see:
 * - All active permissions
 * - All past shares
 * - All provider uploads
 * - All emergency accesses
 * - Full audit history
 * 
 * Patients can:
 * - Revoke any permission
 * - Disable emergency access
 * - Export audit logs
 * 
 * This is not optional UX — it's foundational.
 */

type GovernanceSection = "overview" | "permissions" | "history" | "contributions" | "emergency" | "audit" | "export";

// Safe hook wrapper for useSession that handles SSR
function useSafeSession() {
  const sessionData = useSession();
  return {
    session: sessionData?.data ?? null,
    status: sessionData?.status ?? "loading",
  };
}

interface OverviewData {
  npaId: string;
  memberSince: string;
  summary: {
    activeShares: number;
    totalShares: number;
    providerContributions: number;
    emergencyAccessEnabled: boolean;
    emergencyAccessSessions: number;
    vaultDocuments: number;
  };
  recentActivity: Array<{
    action: string;
    timestamp: string;
    metadata: any;
  }>;
  trustStatement: string;
}

export default function GovernancePage() {
  const { session, status } = useSafeSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<GovernanceSection>("overview");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchData(activeSection);
    }
  }, [status, activeSection, router]);

  const fetchData = async (section: GovernanceSection) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/governance?section=${section}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch governance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (exportType: string) => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exportType, format: "json" }),
      });

      if (response.ok) {
        const result = await response.json();
        // Download the JSON
        const blob = new Blob([JSON.stringify(result.data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `npa-export-${exportType}-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRevokeShare = async (shareId: string) => {
    try {
      const response = await fetch(`/api/share/${shareId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchData(activeSection);
      }
    } catch (error) {
      console.error("Failed to revoke share:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400">Loading governance dashboard...</div>
      </div>
    );
  }

  const sections: { id: GovernanceSection; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "permissions", label: "Active Permissions", icon: "🔓" },
    { id: "history", label: "Share History", icon: "📜" },
    { id: "contributions", label: "Provider Uploads", icon: "👨‍⚕️" },
    { id: "emergency", label: "Emergency Access", icon: "🚨" },
    { id: "audit", label: "Audit Log", icon: "📝" },
    { id: "export", label: "Export Data", icon: "📦" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/vault/dashboard" className="hover:text-purple-600">
              Vault
            </Link>
            <span>/</span>
            <span>Governance</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Your Health Data Governance
          </h1>
          <p className="text-slate-600 mt-2">
            Full transparency and control over your health information.
          </p>
        </div>

        {/* Trust Banner */}
        <Card className="mb-8 border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
                🔒
              </div>
              <div>
                <p className="font-medium text-purple-900">
                  Patient-First Governance
                </p>
                <p className="text-sm text-purple-700">
                  You have full control over your health data. Review, revoke, or export at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-purple-100 text-purple-900"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span>{section.icon}</span>
                      <span className="font-medium">{section.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Overview Section */}
            {activeSection === "overview" && data && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-purple-600">
                        {data.summary.vaultDocuments}
                      </p>
                      <p className="text-sm text-slate-600">Documents in Vault</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {data.summary.activeShares}
                      </p>
                      <p className="text-sm text-slate-600">Active Shares</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        {data.summary.providerContributions}
                      </p>
                      <p className="text-sm text-slate-600">Provider Uploads</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-bold">Emergency Access</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${data.summary.emergencyAccessEnabled ? "text-green-600" : "text-slate-600"}`}>
                          {data.summary.emergencyAccessEnabled ? "Enabled" : "Disabled"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {data.summary.emergencyAccessSessions} sessions total
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => setActiveSection("emergency")}
                      >
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-bold">Recent Activity</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.recentActivity?.slice(0, 5).map((activity: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                        >
                          <div>
                            <p className="font-medium text-slate-900">
                              {activity.action.replace(/_/g, " ")}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Active Permissions Section */}
            {activeSection === "permissions" && data && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold">
                    Active Permissions ({data.totalActive || 0})
                  </h2>
                </CardHeader>
                <CardContent>
                  {data.activePermissions?.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">
                      No active share permissions
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {data.activePermissions?.map((share: any) => (
                        <div
                          key={share.id}
                          className="p-4 border border-slate-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-slate-900">
                                {share.title || "Untitled Share"}
                              </p>
                              <p className="text-sm text-slate-500">
                                {share.documentCount} documents • {share.permission}
                              </p>
                              <p className="text-xs text-slate-400">
                                Expires: {new Date(share.expiresAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRevokeShare(share.id)}
                            >
                              Revoke
                            </Button>
                          </div>
                          {share.recentAccessors?.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <p className="text-xs text-slate-500 mb-2">
                                Recent access:
                              </p>
                              {share.recentAccessors.map((access: any, i: number) => (
                                <p key={i} className="text-xs text-slate-600">
                                  {access.name || "Unknown"} • {access.action} •{" "}
                                  {new Date(access.timestamp).toLocaleString()}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Export Section */}
            {activeSection === "export" && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold">Export Your Data</h2>
                  <p className="text-sm text-slate-500">
                    Download your complete health record at any time. No support
                    ticket required.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-slate-200 rounded-lg">
                      <h3 className="font-medium mb-2">Complete Export</h3>
                      <p className="text-sm text-slate-500 mb-4">
                        All documents, metadata, audit logs, and share history
                      </p>
                      <Button
                        variant="primary"
                        onClick={() => handleExport("full")}
                        isLoading={isExporting}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Export All Data (JSON)
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-slate-200 rounded-lg">
                        <h3 className="font-medium mb-2">Documents Only</h3>
                        <p className="text-sm text-slate-500 mb-4">
                          Document metadata and extracted content
                        </p>
                        <Button
                          variant="secondary"
                          onClick={() => handleExport("documents_only")}
                          isLoading={isExporting}
                        >
                          Export Documents
                        </Button>
                      </div>

                      <div className="p-4 border border-slate-200 rounded-lg">
                        <h3 className="font-medium mb-2">Audit Logs Only</h3>
                        <p className="text-sm text-slate-500 mb-4">
                          Complete audit trail of all actions
                        </p>
                        <Button
                          variant="secondary"
                          onClick={() => handleExport("audit_only")}
                          isLoading={isExporting}
                        >
                          Export Audit Logs
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg mt-6">
                      <p className="text-sm text-slate-600">
                        <strong>Data Portability Notice:</strong> You own your
                        health data. Export and leave anytime. We don&apos;t trap
                        users.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emergency Access Section */}
            {activeSection === "emergency" && data && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold">Emergency Access Settings</h2>
                  <p className="text-sm text-slate-500">
                    Allow temporary access to critical health info in emergencies
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">⚠️</span>
                        <p className="font-medium text-amber-900">
                          Currently:{" "}
                          {data.emergencyAccess?.isEnabled ? (
                            <span className="text-green-700">Enabled</span>
                          ) : (
                            <span className="text-slate-600">Disabled</span>
                          )}
                        </p>
                      </div>
                      <p className="text-sm text-amber-800">
                        Emergency access allows responders to view critical health
                        information when you cannot consent. All access is logged.
                      </p>
                    </div>

                    <Link href="/vault/settings">
                      <Button variant="secondary" className="w-full">
                        Configure Emergency Access Settings
                      </Button>
                    </Link>

                    {data.accessHistory?.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-medium mb-3">Emergency Access History</h3>
                        <div className="space-y-3">
                          {data.accessHistory.map((access: any) => (
                            <div
                              key={access.id}
                              className="p-3 border border-slate-200 rounded-lg"
                            >
                              <div className="flex justify-between">
                                <p className="font-medium">{access.accessorName || "Unknown"}</p>
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    access.status === "active"
                                      ? "bg-green-100 text-green-700"
                                      : access.status === "revoked"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {access.status}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500">
                                {access.accessorOrg} • {access.accessorRole}
                              </p>
                              <p className="text-xs text-slate-400">
                                {new Date(access.startedAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Provider Contributions Section */}
            {activeSection === "contributions" && data && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold">
                    Provider Contributions ({data.totalContributions || 0})
                  </h2>
                </CardHeader>
                <CardContent>
                  {data.providerContributions?.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">
                      No provider contributions yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {data.providerContributions?.map((contribution: any) => (
                        <div
                          key={contribution.id}
                          className="p-4 border border-slate-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-slate-900">
                                {contribution.providerName}, {contribution.providerRole}
                              </p>
                              <p className="text-sm text-slate-500">
                                {contribution.organization} • {contribution.specialty}
                              </p>
                              <p className="text-xs text-slate-400">
                                {contribution.contributionType} •{" "}
                                {new Date(contribution.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-4">
                    {data.notice}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Audit Log Section */}
            {activeSection === "audit" && data && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-lg font-bold">Full Audit Log</h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExport("audit_only")}
                    isLoading={isExporting}
                  >
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.auditLogs?.map((log: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-sm text-slate-900">
                            {log.action.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-slate-500">
                            {log.ipAddress && `${log.ipAddress} • `}
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Share History Section */}
            {activeSection === "history" && data && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold">Share History</h2>
                </CardHeader>
                <CardContent>
                  {data.shareHistory?.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">
                      No share history
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {data.shareHistory?.map((share: any) => (
                        <div
                          key={share.id}
                          className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                        >
                          <div>
                            <p className="font-medium text-slate-900">
                              {share.title || "Untitled Share"}
                            </p>
                            <p className="text-sm text-slate-500">
                              {share.documentCount} docs • {share.accessCount} accesses
                            </p>
                            <p className="text-xs text-slate-400">
                              Created: {new Date(share.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              share.status === "active"
                                ? "bg-green-100 text-green-700"
                                : share.status === "revoked"
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {share.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Legal Footer */}
        <div className="mt-12 p-6 bg-white rounded-lg border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-2">NPA Governance Principles</h3>
          <p className="text-sm text-slate-600 mb-4">
            &quot;No Prior Authorization exists to restore continuity and patient control in healthcare.
            It does not replace clinicians, does not diagnose, and does not monetize personal health data.&quot;
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-500">
            <div>✅ Patient remains root authority</div>
            <div>✅ No silent access, ever</div>
            <div>✅ No PHI monetization</div>
            <div>✅ No diagnostic authority</div>
          </div>
        </div>
      </div>
    </div>
  );
}
