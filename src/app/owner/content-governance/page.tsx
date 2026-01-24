export const dynamic = 'force-dynamic';
import { requireAdmin } from "@/lib/auth/admin-guard";
import ContentGovernanceClient from "./client";

interface GovernanceData {
  featureFlags: Array<{
    id: string;
    key: string;
    name: string;
    description?: string;
    enabled: boolean;
    type: string;
  }>;
  mascotScripts: Array<{
    id: string;
    mascotId: string;
    version: string;
    status: string;
    title: string;
    description?: string;
    audioEnabled: boolean;
    autoplayEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  activeScripts: Record<string, string>; // mascotId -> active version
  auditLogs: Array<{
    id: string;
    action: string;
    details: string;
    performedBy: string;
    performedAt: string;
  }>;
}

export default async function ContentGovernancePage() {
  // Check OWNER/ADMIN access
  const admin = await requireAdmin("/owner/content-governance");

  // Fetch data on server side
  let data: GovernanceData | null = null;
  let error: string | null = null;

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/owner/content-governance`, {
      headers: {
        'x-admin-user': admin.id,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch governance data");
    }

    data = await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Governance</h1>
          <p className="mt-2 text-gray-600">
            Manage mascot content, safety controls, and deployment rules
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        <ContentGovernanceClient initialData={data} adminId={admin.id} />
      </div>
    </div>
  );
}