// =============================================================================
// USER AWARENESS SERVICE
// Calculates awareness state from user events
// =============================================================================

import { prisma } from "@/lib/db";
import {
  UserAwarenessState,
  UserEventType,
  MascotSource,
  RecentActivityItem,
  MascotMemoryItem,
  ProgressSnapshot,
  ConnectedSystem,
  TrackEventRequest,
} from "./types";
import {
  getEventMessage,
  getMascotContextMessage,
  getProgressMessage,
  eventToConnectedSystem,
} from "./messages";

/**
 * Tracks a user event
 */
export async function trackEvent(
  userId: string,
  event: TrackEventRequest
): Promise<string> {
  const created = await prisma.userEvent.create({
    data: {
      userId,
      type: event.type as any, // Prisma enum
      source: event.source,
      metadata: event.metadata || {},
    },
  });

  return created.id;
}

/**
 * Records a user visit and returns the previous visit time
 */
export async function recordVisit(userId: string): Promise<{
  lastVisitAt: Date | null;
  previousVisitAt: Date | null;
  totalVisits: number;
}> {
  const existing = await prisma.userVisit.findUnique({
    where: { userId },
  });

  if (existing) {
    // Update existing record
    const updated = await prisma.userVisit.update({
      where: { userId },
      data: {
        previousVisitAt: existing.lastVisitAt,
        lastVisitAt: new Date(),
        totalVisits: existing.totalVisits + 1,
      },
    });

    return {
      lastVisitAt: updated.lastVisitAt,
      previousVisitAt: updated.previousVisitAt,
      totalVisits: updated.totalVisits,
    };
  }

  // Create new record
  const created = await prisma.userVisit.create({
    data: {
      userId,
      lastVisitAt: new Date(),
      previousVisitAt: null,
      totalVisits: 1,
    },
  });

  return {
    lastVisitAt: created.lastVisitAt,
    previousVisitAt: null,
    totalVisits: 1,
  };
}

/**
 * Gets the user's awareness state
 */
export async function getAwarenessState(
  userId: string
): Promise<UserAwarenessState> {
  // Get visit info
  const visitInfo = await prisma.userVisit.findUnique({
    where: { userId },
  });

  const lastVisitAt = visitInfo?.lastVisitAt || null;
  const previousVisitAt = visitInfo?.previousVisitAt || null;
  const totalVisits = visitInfo?.totalVisits || 0;

  // Get all events for this user
  const allEvents = await prisma.userEvent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Get events since last visit (use previousVisitAt for accurate "since last visit")
  const sinceDate = previousVisitAt || new Date(0);
  const eventsSinceLastVisit = allEvents.filter(
    (e) => e.createdAt > sinceDate
  );

  // Calculate connected systems
  const connectedSystems = calculateConnectedSystems(allEvents);

  // Calculate blueprint completeness
  const blueprintCompleteness = await calculateBlueprintCompleteness(userId);

  // Get insights count
  const insightsCount = await prisma.blueprintInsight.count({
    where: {
      vault: {
        userId,
      },
    },
  });

  // Build recent activity (max 5 items for internal use, UI shows 3)
  const recentActivity: RecentActivityItem[] = eventsSinceLastVisit
    .slice(0, 5)
    .map((event) => ({
      id: event.id,
      type: event.type as UserEventType,
      source: event.source,
      message: getEventMessage(event.type as UserEventType, event.source),
      createdAt: event.createdAt,
    }));

  // Build mascot memory
  const mascotMemory = await buildMascotMemory(userId, allEvents);

  return {
    lastVisitAt,
    previousVisitAt,
    totalVisits,
    totalEvents: allEvents.length,
    eventsSinceLastVisit: eventsSinceLastVisit.length,
    connectedSystemsCount: connectedSystems.length,
    blueprintCompletenessPercent: blueprintCompleteness,
    insightsUnlocked: insightsCount,
    recentActivity,
    mascotMemory,
  };
}

/**
 * Gets a progress snapshot for the vault dashboard
 */
export async function getProgressSnapshot(
  userId: string
): Promise<ProgressSnapshot> {
  const allEvents = await prisma.userEvent.findMany({
    where: { userId },
  });

  const connectedSystems = calculateConnectedSystems(allEvents);
  const blueprintCompleteness = await calculateBlueprintCompleteness(userId);

  const insightsCount = await prisma.blueprintInsight.count({
    where: {
      vault: {
        userId,
      },
    },
  });

  return {
    blueprintCompletenessPercent: blueprintCompleteness,
    connectedSystemsCount: connectedSystems.length,
    totalInsightsUnlocked: insightsCount,
    connectedSystems,
    encouragementMessage: getProgressMessage(blueprintCompleteness, connectedSystems),
  };
}

/**
 * Gets mascot-specific memory for context display
 */
export async function getMascotMemory(
  userId: string,
  mascotId: MascotSource
): Promise<MascotMemoryItem | null> {
  // Get events related to this mascot
  const relatedEvents = await prisma.userEvent.findMany({
    where: {
      userId,
      source: mascotId,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  if (relatedEvents.length === 0) {
    // Check for related events from other sources
    const relatedTypes = getMascotRelatedEventTypes(mascotId);
    const otherRelatedEvents = await prisma.userEvent.findMany({
      where: {
        userId,
        type: { in: relatedTypes as any[] },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    if (otherRelatedEvents.length === 0) {
      return null;
    }

    const eventTypes = otherRelatedEvents.map((e) => e.type as UserEventType);
    const contextMessage = getMascotContextMessage(mascotId, eventTypes);

    return {
      lastVisitAt: otherRelatedEvents[0].createdAt,
      totalVisits: 0,
      relatedEvents: otherRelatedEvents.map((e) => ({
        id: e.id,
        userId: e.userId,
        type: e.type as UserEventType,
        source: e.source as MascotSource,
        metadata: e.metadata as Record<string, unknown> | undefined,
        createdAt: e.createdAt,
      })),
      contextMessage: contextMessage || "",
    };
  }

  // Count mascot visits
  const mascotVisits = await prisma.userEvent.count({
    where: {
      userId,
      source: mascotId,
      type: "MASCOT_VISITED",
    },
  });

  const eventTypes = relatedEvents.map((e) => e.type as UserEventType);
  const contextMessage = getMascotContextMessage(mascotId, eventTypes);

  return {
    lastVisitAt: relatedEvents[0].createdAt,
    totalVisits: mascotVisits,
    relatedEvents: relatedEvents.map((e) => ({
      id: e.id,
      userId: e.userId,
      type: e.type as UserEventType,
      source: e.source as MascotSource,
      metadata: e.metadata as Record<string, unknown> | undefined,
      createdAt: e.createdAt,
    })),
    contextMessage: contextMessage || "",
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function calculateConnectedSystems(
  events: Array<{ type: string }>
): ConnectedSystem[] {
  const systems = new Set<ConnectedSystem>();

  for (const event of events) {
    const system = eventToConnectedSystem(event.type as UserEventType);
    if (system) {
      systems.add(system);
    }
  }

  return Array.from(systems);
}

async function calculateBlueprintCompleteness(userId: string): Promise<number> {
  // Get blueprint
  const blueprint = await prisma.blueprint.findUnique({
    where: { userId },
  });

  if (!blueprint) return 0;

  // Count non-null sections
  const sections = [
    blueprint.identityContext,
    blueprint.healthFoundations,
    blueprint.treatments,
    blueprint.timeline,
    blueprint.documents,
    blueprint.providers,
    blueprint.preparation,
  ];

  const totalSections = sections.length;
  const filledSections = sections.filter((s) => s !== null).length;

  // Also factor in vault data
  const vault = await prisma.vault.findUnique({
    where: { userId },
    include: {
      _count: {
        select: {
          vaultItems: true,
          familyMembers: true,
          blueprintInsights: true,
        },
      },
    },
  });

  // Calculate base percentage from blueprint sections
  let completeness = (filledSections / totalSections) * 60; // Blueprint is 60% of completeness

  // Add vault contribution (40%)
  if (vault) {
    const vaultScore =
      Math.min(vault._count.vaultItems, 10) / 10 * 15 + // Up to 15% for vault items
      Math.min(vault._count.familyMembers, 5) / 5 * 10 + // Up to 10% for family
      Math.min(vault._count.blueprintInsights, 10) / 10 * 15; // Up to 15% for insights

    completeness += vaultScore;
  }

  return Math.round(Math.min(completeness, 100));
}

async function buildMascotMemory(
  userId: string,
  events: Array<{ type: string; source: string; createdAt: Date }>
): Promise<Record<MascotSource, MascotMemoryItem | null>> {
  const mascots: MascotSource[] = [
    "decode",
    "roots",
    "harmony",
    "peppi",
    "slim-t",
    "beau-tox",
    "filla-grace",
    "vault",
    "blueprint",
    "general",
  ];

  const memory: Record<MascotSource, MascotMemoryItem | null> = {} as any;

  for (const mascotId of mascots) {
    // Get events for this mascot
    const mascotEvents = events.filter((e) => e.source === mascotId);

    if (mascotEvents.length === 0) {
      // Check for related events
      const relatedTypes = getMascotRelatedEventTypes(mascotId);
      const relatedEvents = events.filter((e) =>
        relatedTypes.includes(e.type as UserEventType)
      );

      if (relatedEvents.length === 0) {
        memory[mascotId] = null;
        continue;
      }

      const eventTypes = relatedEvents.map((e) => e.type as UserEventType);
      const contextMessage = getMascotContextMessage(mascotId, eventTypes);

      memory[mascotId] = {
        lastVisitAt: relatedEvents[0].createdAt,
        totalVisits: 0,
        relatedEvents: relatedEvents.slice(0, 5).map((e) => ({
          id: "",
          userId,
          type: e.type as UserEventType,
          source: e.source as MascotSource,
          createdAt: e.createdAt,
        })),
        contextMessage: contextMessage || "",
      };
      continue;
    }

    const eventTypes = mascotEvents.map((e) => e.type as UserEventType);
    const contextMessage = getMascotContextMessage(mascotId, eventTypes);

    memory[mascotId] = {
      lastVisitAt: mascotEvents[0].createdAt,
      totalVisits: mascotEvents.filter((e) => e.type === "MASCOT_VISITED").length,
      relatedEvents: mascotEvents.slice(0, 5).map((e) => ({
        id: "",
        userId,
        type: e.type as UserEventType,
        source: e.source as MascotSource,
        createdAt: e.createdAt,
      })),
      contextMessage: contextMessage || "",
    };
  }

  return memory;
}

function getMascotRelatedEventTypes(mascotId: MascotSource): UserEventType[] {
  const mapping: Record<MascotSource, UserEventType[]> = {
    decode: ["LAB_UPLOAD", "LAB_DECODED", "DOCUMENT_DECODED"],
    roots: ["FAMILY_ADDED", "FAMILY_UPDATED"],
    root: ["FAMILY_ADDED", "FAMILY_UPDATED"],
    harmony: ["LAB_DECODED", "CHAT_USED"],
    peppi: ["LAB_DECODED", "CHAT_USED"],
    "slim-t": ["LAB_DECODED", "CHAT_USED"],
    "beau-tox": ["CHAT_USED"],
    "filla-grace": ["CHAT_USED"],
    vault: ["DOCUMENT_UPLOADED", "LAB_UPLOAD"],
    blueprint: ["BLUEPRINT_UPDATED", "INSIGHT_VIEWED"],
    general: [],
  };

  return mapping[mascotId] || [];
}
