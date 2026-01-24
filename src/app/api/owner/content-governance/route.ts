import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin-guard';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check admin access
    const admin = await requireAdmin('/api/owner/content-governance');

    // Fetch feature flags for mascot controls
    const featureFlags = await prisma.featureFlag.findMany({
      where: {
        type: 'MASCOT_CONTROL',
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch mascot scripts
    const mascotScripts = await prisma.mascotScript.findMany({
      orderBy: [
        { mascotId: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    // Get active script versions
    const activeScripts: Record<string, string> = {};
    for (const script of mascotScripts.filter(s => s.status === 'ACTIVE')) {
      activeScripts[script.mascotId] = script.version;
    }

    // Fetch recent audit logs (last 100)
    const auditLogs = await prisma.accessLog.findMany({
      where: {
        resourceType: 'content-governance',
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Transform audit logs
    const transformedLogs = auditLogs.map(log => ({
      id: log.id,
      action: log.action,
      details: log.metadata ? JSON.stringify(log.metadata) : '',
      performedBy: log.actorId || 'System',
      performedAt: log.createdAt.toISOString(),
    }));

    return NextResponse.json({
      featureFlags,
      mascotScripts,
      activeScripts,
      auditLogs: transformedLogs,
    });
  } catch (error) {
    console.error('Content governance API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch governance data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin access
    const admin = await requireAdmin('/api/owner/content-governance');

    const body = await request.json();
    const { action, adminId } = body;

    if (adminId !== admin.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (action === 'update_flag') {
      const { flagId, enabled } = body;

      // Get current flag
      const currentFlag = await prisma.featureFlag.findUnique({
        where: { id: flagId },
      });

      if (!currentFlag) {
        return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
      }

      // Update flag
      await prisma.featureFlag.update({
        where: { id: flagId },
        data: { enabled },
      });

      // Log change
      await prisma.featureFlagChange.create({
        data: {
          flagId,
          changedBy: admin.id,
          oldValue: currentFlag.enabled,
          newValue: enabled,
          reason: 'Updated via content governance',
        },
      });

      // Audit log
      await prisma.accessLog.create({
        data: {
          actorId: admin.id,
          action: 'UPDATE',
          resourceType: 'content-governance',
          resourceId: flagId,
          metadata: {
            action: 'update_flag',
            flagKey: currentFlag.key,
            oldValue: currentFlag.enabled,
            newValue: enabled,
          },
        },
      });

    } else if (action === 'activate_script') {
      const { mascotId, scriptId } = body;

      // Get script
      const script = await prisma.mascotScript.findUnique({
        where: { id: scriptId },
      });

      if (!script || script.mascotId !== mascotId) {
        return NextResponse.json({ error: 'Script not found' }, { status: 404 });
      }

      // Deactivate current active script for this mascot
      await prisma.mascotScript.updateMany({
        where: {
          mascotId,
          status: 'ACTIVE',
        },
        data: { status: 'ARCHIVED' },
      });

      // Activate new script
      await prisma.mascotScript.update({
        where: { id: scriptId },
        data: { status: 'ACTIVE' },
      });

      // Log change
      await prisma.mascotScriptChange.create({
        data: {
          scriptId,
          changedBy: admin.id,
          changeType: 'activated',
          reason: 'Activated via content governance',
        },
      });

      // Audit log
      await prisma.accessLog.create({
        data: {
          actorId: admin.id,
          action: 'UPDATE',
          resourceType: 'content-governance',
          resourceId: scriptId,
          metadata: {
            action: 'activate_script',
            mascotId,
            version: script.version,
          },
        },
      });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Content governance PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update governance data' },
      { status: 500 }
    );
  }
}