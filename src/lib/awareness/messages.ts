// =============================================================================
// USER AWARENESS SYSTEM - Message Generation
// Calm, reassuring messages - NO alerts, NO anxiety, NO medical language
// =============================================================================

import { UserEventType, MascotSource, ConnectedSystem } from "./types";

/**
 * Generates a plain-language message for a user event
 * These messages are calm and observational, never urgent
 */
export function getEventMessage(type: UserEventType, source: string): string {
  const messages: Record<UserEventType, string> = {
    LAB_UPLOAD: "You uploaded a new lab result",
    LAB_DECODED: "A lab result was decoded for you",
    FAMILY_ADDED: "You added family health information",
    FAMILY_UPDATED: "Family health information was updated",
    CHAT_USED: `You explored questions with ${formatSource(source)}`,
    INSIGHT_VIEWED: "A new insight was added to your Blueprint",
    DOCUMENT_UPLOADED: "You added a new document",
    DOCUMENT_DECODED: "A document was decoded for you",
    BLUEPRINT_UPDATED: "Your Blueprint was updated",
    MASCOT_VISITED: `You visited ${formatSource(source)}`,
    TOOL_USED: "You used a health tool",
    PROVIDER_ADDED: "You added a provider to your care team",
    APPOINTMENT_ADDED: "You scheduled an appointment",
  };

  return messages[type] || "Activity recorded";
}

/**
 * Formats source names for display
 */
export function formatSource(source: string): string {
  const sourceNames: Record<string, string> = {
    decode: "Decode",
    roots: "Root",
    root: "Root",
    harmony: "Harmony",
    peppi: "Peppi",
    "slim-t": "Slim-T",
    "beau-tox": "Beau-Tox",
    "filla-grace": "Filla-Grace",
    vault: "your Vault",
    blueprint: "your Blueprint",
    general: "the app",
  };

  return sourceNames[source.toLowerCase()] || source;
}

/**
 * Generates mascot-specific context messages
 * These are subtle, read-only awareness - no actions required
 */
export function getMascotContextMessage(
  mascotId: MascotSource,
  relatedEventTypes: UserEventType[]
): string | null {
  // If no related events, no context to show
  if (relatedEventTypes.length === 0) return null;

  const contextMessages: Record<MascotSource, Record<string, string>> = {
    decode: {
      LAB_UPLOAD: "This connects to labs you've uploaded.",
      LAB_DECODED: "You've decoded labs here before.",
      DOCUMENT_DECODED: "This builds on documents you've reviewed.",
      default: "Your lab history applies here.",
    },
    roots: {
      FAMILY_ADDED: "Family history you added applies here.",
      FAMILY_UPDATED: "Your family health map connects here.",
      default: "Family patterns you've explored relate here.",
    },
    root: {
      FAMILY_ADDED: "Family history you added applies here.",
      FAMILY_UPDATED: "Your family health map connects here.",
      default: "Family patterns you've explored relate here.",
    },
    harmony: {
      CHAT_USED: "Hormone questions often relate to what you explored last time.",
      LAB_DECODED: "Labs you've reviewed connect to hormone health.",
      default: "Your hormone exploration continues here.",
    },
    peppi: {
      CHAT_USED: "Peptide questions build on your previous research.",
      LAB_DECODED: "Labs you've reviewed may relate to peptide science.",
      default: "Your wellness exploration continues here.",
    },
    "slim-t": {
      CHAT_USED: "Weight questions connect to what you've explored before.",
      LAB_DECODED: "Labs you've reviewed relate to metabolic health.",
      default: "Your weight management journey continues here.",
    },
    "beau-tox": {
      CHAT_USED: "Aesthetic questions build on your previous research.",
      default: "Your aesthetics exploration continues here.",
    },
    "filla-grace": {
      CHAT_USED: "Filler questions connect to what you've learned.",
      default: "Your beauty exploration continues here.",
    },
    vault: {
      default: "Your health data is organized here.",
    },
    blueprint: {
      default: "Your personalized health picture lives here.",
    },
    general: {
      default: null,
    },
  };

  const mascotMessages = contextMessages[mascotId];
  if (!mascotMessages) return null;

  // Find the most relevant message based on event types
  for (const eventType of relatedEventTypes) {
    if (mascotMessages[eventType]) {
      return mascotMessages[eventType];
    }
  }

  return mascotMessages.default || null;
}

/**
 * Generates encouraging progress messages
 * Calm, reassuring - never gamified or pressure-inducing
 */
export function getProgressMessage(
  completenessPercent: number,
  connectedSystems: ConnectedSystem[]
): string {
  if (completenessPercent === 0) {
    return "Start building your health picture.";
  }

  if (completenessPercent < 25) {
    return "Your health picture is taking shape.";
  }

  if (completenessPercent < 50) {
    return "Your health picture is becoming clearer.";
  }

  if (completenessPercent < 75) {
    return "You've built a solid foundation.";
  }

  if (completenessPercent < 100) {
    return "Your health picture is nearly complete.";
  }

  return "Your health picture is comprehensive.";
}

/**
 * Generates "since your last visit" summary
 * Shows up to 3 items, calm tone
 */
export function getSinceLastVisitSummary(
  eventCount: number,
  hasNewInsight: boolean,
  hasNewConnection: boolean
): string[] {
  const items: string[] = [];

  if (eventCount === 0) {
    return ["You're up to date."];
  }

  if (hasNewInsight) {
    items.push("A new insight was added");
  }

  if (hasNewConnection) {
    items.push("Your Blueprint connected a new system");
  }

  if (eventCount > 0 && items.length < 3) {
    const activityCount = eventCount - (hasNewInsight ? 1 : 0) - (hasNewConnection ? 1 : 0);
    if (activityCount > 0) {
      items.push(`${activityCount} new ${activityCount === 1 ? "activity" : "activities"} recorded`);
    }
  }

  return items.slice(0, 3);
}

/**
 * Maps event types to connected systems
 */
export function eventToConnectedSystem(type: UserEventType): ConnectedSystem | null {
  const mapping: Partial<Record<UserEventType, ConnectedSystem>> = {
    LAB_UPLOAD: "labs",
    LAB_DECODED: "labs",
    FAMILY_ADDED: "family",
    FAMILY_UPDATED: "family",
    DOCUMENT_UPLOADED: "documents",
    DOCUMENT_DECODED: "documents",
    PROVIDER_ADDED: "providers",
    APPOINTMENT_ADDED: "appointments",
  };

  return mapping[type] || null;
}
