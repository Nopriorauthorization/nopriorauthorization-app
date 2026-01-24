export const dynamic = 'force-dynamic';
import { requireAdmin } from "@/lib/auth/admin-guard";
import SystemHealthClient from './client';

interface SystemHealthData {
  services: {
    api: ServiceStatus;
    auth: ServiceStatus;
    vault: ServiceStatus;
    blueprint: ServiceStatus;
    labDecoder: ServiceStatus;
    stripe: ServiceStatus;
  };
  featureFlags: {
    mascotControls: FeatureFlag;
    audioModes: FeatureFlag;
    exports: FeatureFlag;
    signups: FeatureFlag;
    readOnly: FeatureFlag;
  };
  mascotControls: {
    individualMascots: MascotControl[];
    singleSpeakerEnforcement: boolean;
    lastReset: string | null;
  };
  auditLogs: AuditLogEntry[];
}

interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  message: string;
  latency?: number;
  lastChecked: string;
}

interface FeatureFlag {
  enabled: boolean;
  name: string;
  description: string;
  lastChanged?: string;
  changedBy?: string;
}

interface MascotControl {
  id: string;
  name: string;
  enabled: boolean;
  lastChanged?: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default async function SystemHealthPage() {
  const admin = await requireAdmin();

  return <SystemHealthClient admin={admin} />;
}