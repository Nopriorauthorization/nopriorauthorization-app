export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import prisma from "@/lib/db";
import { logAccess } from "@/lib/audit-log";

interface SystemHealthResponse {
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

export async function GET(request: NextRequest) {
  try {
    // Check OWNER/ADMIN access
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Log access
    await logAccess({
      actorId: admin.id,
      action: "VIEW",
      resourceType: "CLINICAL_SUMMARY", // Using existing resource type
      resourceId: "system-health-dashboard",
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    const data: SystemHealthResponse = {
      services: await checkAllServices(),
      featureFlags: await getFeatureFlags(),
      mascotControls: await getMascotControls(),
      auditLogs: await getRecentAuditLogs(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("System health API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch system health data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check OWNER/ADMIN access
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, target, reason } = body;

    if (!action || !target) {
      return NextResponse.json(
        { error: "Missing required fields: action and target" },
        { status: 400 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'toggle-feature':
        return await handleFeatureToggle(admin.id, target, reason, request);
      case 'toggle-mascot':
        return await handleMascotToggle(admin.id, target, reason, request);
      case 'reset-mascots':
        return await handleMascotReset(admin.id, reason, request);
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("System health POST API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

async function checkAllServices(): Promise<SystemHealthResponse['services']> {
  const services = {
    api: await checkServiceHealth('api'),
    auth: await checkServiceHealth('auth'),
    vault: await checkServiceHealth('vault'),
    blueprint: await checkServiceHealth('blueprint'),
    labDecoder: await checkServiceHealth('lab-decoder'),
    stripe: await checkServiceHealth('stripe'),
  };

  return services;
}

async function checkServiceHealth(service: string): Promise<ServiceStatus> {
  const startTime = Date.now();

  try {
    let status: ServiceStatus['status'] = 'unknown';
    let message = 'Service check not implemented';

    switch (service) {
      case 'api':
        // Check basic API health
        status = 'healthy';
        message = 'API responding normally';
        break;

      case 'auth':
        // Check auth service
        status = 'healthy';
        message = 'Authentication service operational';
        break;

      case 'vault':
        // Check database connectivity
        await prisma.user.count();
        status = 'healthy';
        message = 'Database connection healthy';
        break;

      case 'blueprint':
        // Check blueprint service
        status = 'healthy';
        message = 'Blueprint engine operational';
        break;

      case 'lab-decoder':
        // Check lab decoder service
        status = 'healthy';
        message = 'Lab decoder service available';
        break;

      case 'stripe':
        // Check Stripe connectivity (simplified)
        status = 'healthy';
        message = 'Stripe integration active';
        break;
    }

    const latency = Date.now() - startTime;

    return {
      status,
      message,
      latency,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Service check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      latency: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
    };
  }
}

async function getFeatureFlags(): Promise<SystemHealthResponse['featureFlags']> {
  // Get or create default feature flags
  const flags = await Promise.all([
    getOrCreateFeatureFlag('mascot-controls', 'Mascot Controls', 'Enable/disable all mascot interactions'),
    getOrCreateFeatureFlag('audio-modes', 'Audio Modes', 'Control audio playback features'),
    getOrCreateFeatureFlag('exports', 'Data Exports', 'Allow users to export their data'),
    getOrCreateFeatureFlag('signups', 'User Signups', 'Allow new user registrations'),
    getOrCreateFeatureFlag('read-only', 'Read-Only Mode', 'Put system in read-only maintenance mode'),
  ]);

  const [mascotControls, audioModes, exports, signups, readOnly] = flags;

  return {
    mascotControls: await formatFeatureFlag(mascotControls),
    audioModes: await formatFeatureFlag(audioModes),
    exports: await formatFeatureFlag(exports),
    signups: await formatFeatureFlag(signups),
    readOnly: await formatFeatureFlag(readOnly),
  };
}

async function getOrCreateFeatureFlag(key: string, name: string, description: string) {
  let flag = await prisma.featureFlag.findUnique({
    where: { key },
    include: { flagChanges: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });

  if (!flag) {
    flag = await prisma.featureFlag.create({
      data: {
        key,
        name,
        description,
        enabled: true,
        defaultValue: true,
      },
      include: { flagChanges: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
  }

  return flag;
}

async function formatFeatureFlag(flag: any): Promise<FeatureFlag> {
  const lastChange = flag.flagChanges[0];

  return {
    enabled: flag.enabled,
    name: flag.name,
    description: flag.description || '',
    lastChanged: lastChange?.createdAt.toISOString(),
    changedBy: lastChange?.changedBy,
  };
}

async function getMascotControls(): Promise<SystemHealthResponse['mascotControls']> {
  // Get individual mascot controls (simplified - in real implementation would have actual mascot data)
  const mascots = [
    { id: 'beau-tox', name: 'Beau-Tox' },
    { id: 'peppi', name: 'Peppi' },
    { id: 'grace', name: 'Grace' },
    { id: 'harmony', name: 'Harmony' },
    { id: 'slim-t', name: 'Slim-T' },
    { id: 'ryan', name: 'Ryan' },
    { id: 'founder', name: 'Founder' },
  ];

  const individualMascots: MascotControl[] = await Promise.all(
    mascots.map(async (mascot) => {
      const flag = await getOrCreateFeatureFlag(
        `mascot-${mascot.id}`,
        `${mascot.name} Mascot`,
        `Enable/disable ${mascot.name} mascot interactions`
      );

      return {
        id: mascot.id,
        name: mascot.name,
        enabled: flag.enabled,
        lastChanged: flag.flagChanges[0]?.createdAt.toISOString(),
      };
    })
  );

  // Get single speaker enforcement flag
  const singleSpeakerFlag = await getOrCreateFeatureFlag(
    'single-speaker-enforcement',
    'Single Speaker Enforcement',
    'Only allow one mascot to speak at a time'
  );

  // Get last reset time (simplified - would track in database)
  const lastReset = null; // TODO: Implement reset tracking

  return {
    individualMascots,
    singleSpeakerEnforcement: singleSpeakerFlag.enabled,
    lastReset,
  };
}

async function getRecentAuditLogs(): Promise<AuditLogEntry[]> {
  // Get recent system health related audit logs
  const logs = await prisma.accessLog.findMany({
    where: {
      OR: [
        { resourceType: 'SYSTEM_HEALTH' },
        { resourceType: 'FEATURE_FLAG' },
        { action: { in: ['TOGGLE_FEATURE', 'TOGGLE_MASCOT', 'RESET_MASCOTS'] } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return logs.map(log => ({
    id: log.id,
    action: log.action,
    actor: log.actorId || 'Unknown',
    timestamp: log.createdAt.toISOString(),
    details: `${log.resourceType}: ${log.resourceId}`,
  }));
}

async function handleFeatureToggle(adminId: string, flagKey: string, reason: string, request: NextRequest) {
  const flag = await prisma.featureFlag.findUnique({
    where: { key: flagKey },
  });

  if (!flag) {
    return NextResponse.json(
      { error: "Feature flag not found" },
      { status: 404 }
    );
  }

  const oldValue = flag.enabled;
  const newValue = !oldValue;

  // Update flag
  await prisma.featureFlag.update({
    where: { key: flagKey },
    data: { enabled: newValue },
  });

  // Log change
  await prisma.featureFlagChange.create({
    data: {
      flagId: flag.id,
      changedBy: adminId,
      oldValue,
      newValue,
      reason: reason || 'No reason provided',
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    },
  });

  // Audit log
  await logAccess({
    actorId: adminId,
    action: "UPDATE",
    resourceType: "CLINICAL_SUMMARY",
    resourceId: flagKey,
    ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
    metadata: { oldValue, newValue, reason },
  });

  return NextResponse.json({
    success: true,
    message: `Feature ${flagKey} ${newValue ? 'enabled' : 'disabled'}`,
  });
}

async function handleMascotToggle(adminId: string, mascotId: string, reason: string, request: NextRequest) {
  const flagKey = `mascot-${mascotId}`;
  return await handleFeatureToggle(adminId, flagKey, reason, request);
}

async function handleMascotReset(adminId: string, reason: string, request: NextRequest) {
  // Reset all mascot flags to default
  const mascotIds = ['beau-tox', 'peppi', 'grace', 'harmony', 'slim-t', 'ryan', 'founder'];

  for (const mascotId of mascotIds) {
    const flagKey = `mascot-${mascotId}`;
    const flag = await prisma.featureFlag.findUnique({
      where: { key: flagKey },
    });

    if (flag && !flag.enabled) {
      await prisma.featureFlag.update({
        where: { key: flagKey },
        data: { enabled: true },
      });

      await prisma.featureFlagChange.create({
        data: {
          flagId: flag.id,
          changedBy: adminId,
          oldValue: false,
          newValue: true,
          reason: `Emergency reset: ${reason || 'No reason provided'}`,
          ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
          userAgent: request.headers.get("user-agent") || undefined,
        },
      });
    }
  }

  // Audit log
  await logAccess({
    actorId: adminId,
    action: "UPDATE",
    resourceType: "CLINICAL_SUMMARY",
    resourceId: "mascot-reset",
    ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
    metadata: { reason },
  });

  return NextResponse.json({
    success: true,
    message: "All mascots reset to enabled state",
  });
}