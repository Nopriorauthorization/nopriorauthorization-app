// =============================================================================
// USER AWARENESS SYSTEM - Type Definitions
// P0 Retention Layer: Makes the app feel alive and responsive
// =============================================================================

export type UserEventType =
  | "LAB_UPLOAD"
  | "LAB_DECODED"
  | "FAMILY_ADDED"
  | "FAMILY_UPDATED"
  | "CHAT_USED"
  | "INSIGHT_VIEWED"
  | "DOCUMENT_UPLOADED"
  | "DOCUMENT_DECODED"
  | "BLUEPRINT_UPDATED"
  | "MASCOT_VISITED"
  | "TOOL_USED"
  | "PROVIDER_ADDED"
  | "APPOINTMENT_ADDED";

export type MascotSource =
  | "decode"
  | "roots"
  | "harmony"
  | "peppi"
  | "slim-t"
  | "beau-tox"
  | "filla-grace"
  | "vault"
  | "blueprint"
  | "general";

export interface UserEvent {
  id: string;
  userId: string;
  type: UserEventType;
  source: MascotSource | string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface UserAwarenessState {
  // Visit tracking
  lastVisitAt: Date | null;
  previousVisitAt: Date | null;
  totalVisits: number;

  // Activity metrics
  totalEvents: number;
  eventsSinceLastVisit: number;

  // Progress indicators
  connectedSystemsCount: number;
  blueprintCompletenessPercent: number;
  insightsUnlocked: number;

  // Recent activity for "Since your last visit"
  recentActivity: RecentActivityItem[];

  // Mascot-specific memory
  mascotMemory: Record<MascotSource, MascotMemoryItem | null>;
}

export interface RecentActivityItem {
  id: string;
  type: UserEventType;
  source: string;
  message: string; // Plain language description
  createdAt: Date;
}

export interface MascotMemoryItem {
  lastVisitAt: Date;
  totalVisits: number;
  relatedEvents: UserEvent[];
  contextMessage: string; // e.g., "This connects to a lab you reviewed earlier"
}

// Connected systems for progress tracking
export type ConnectedSystem =
  | "labs"
  | "family"
  | "documents"
  | "providers"
  | "appointments"
  | "hormones"
  | "weight"
  | "aesthetics";

export interface ProgressSnapshot {
  blueprintCompletenessPercent: number;
  connectedSystemsCount: number;
  totalInsightsUnlocked: number;
  connectedSystems: ConnectedSystem[];
  encouragementMessage: string;
}

// Event tracking request
export interface TrackEventRequest {
  type: UserEventType;
  source: MascotSource | string;
  metadata?: Record<string, unknown>;
}

// API Response types
export interface AwarenessAPIResponse {
  success: boolean;
  data?: UserAwarenessState;
  error?: string;
}

export interface TrackEventResponse {
  success: boolean;
  eventId?: string;
  error?: string;
}
