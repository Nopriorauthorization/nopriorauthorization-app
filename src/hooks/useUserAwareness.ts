// =============================================================================
// useUserAwareness - Client-side hook for awareness state and event tracking
// =============================================================================

import { useState, useEffect, useCallback } from "react";
import {
  UserAwarenessState,
  ProgressSnapshot,
  MascotMemoryItem,
  TrackEventRequest,
  UserEventType,
  MascotSource,
} from "@/lib/awareness/types";

interface UseUserAwarenessReturn {
  // State
  awarenessState: UserAwarenessState | null;
  progressSnapshot: ProgressSnapshot | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  trackEvent: (event: TrackEventRequest) => Promise<void>;
  recordVisit: () => Promise<void>;
  refreshAwareness: () => Promise<void>;
  getMascotMemory: (mascotId: MascotSource) => Promise<MascotMemoryItem | null>;
}

export function useUserAwareness(): UseUserAwarenessReturn {
  const [awarenessState, setAwarenessState] = useState<UserAwarenessState | null>(null);
  const [progressSnapshot, setProgressSnapshot] = useState<ProgressSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch awareness state
  const fetchAwarenessState = useCallback(async () => {
    try {
      const response = await fetch("/api/awareness");
      const data = await response.json();

      if (data.success) {
        setAwarenessState(data.data);
      } else {
        setError(data.error || "Failed to fetch awareness state");
      }
    } catch (err) {
      setError("Failed to fetch awareness state");
    }
  }, []);

  // Fetch progress snapshot
  const fetchProgressSnapshot = useCallback(async () => {
    try {
      const response = await fetch("/api/awareness/progress");
      const data = await response.json();

      if (data.success) {
        setProgressSnapshot(data.data);
      }
    } catch (err) {
      // Silent fail for progress - not critical
    }
  }, []);

  // Record a visit
  const recordVisit = useCallback(async () => {
    try {
      await fetch("/api/awareness", {
        method: "POST",
      });
    } catch (err) {
      // Silent fail for visit recording
    }
  }, []);

  // Track an event
  const trackEvent = useCallback(async (event: TrackEventRequest) => {
    try {
      await fetch("/api/awareness/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch (err) {
      // Silent fail for event tracking
    }
  }, []);

  // Get mascot memory
  const getMascotMemory = useCallback(
    async (mascotId: MascotSource): Promise<MascotMemoryItem | null> => {
      try {
        const response = await fetch(`/api/awareness/mascot/${mascotId}`);
        const data = await response.json();

        if (data.success) {
          return data.data;
        }
        return null;
      } catch (err) {
        return null;
      }
    },
    []
  );

  // Refresh all awareness data
  const refreshAwareness = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await Promise.all([fetchAwarenessState(), fetchProgressSnapshot()]);
    setIsLoading(false);
  }, [fetchAwarenessState, fetchProgressSnapshot]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await recordVisit();
      await Promise.all([fetchAwarenessState(), fetchProgressSnapshot()]);
      setIsLoading(false);
    };

    init();
  }, [recordVisit, fetchAwarenessState, fetchProgressSnapshot]);

  return {
    awarenessState,
    progressSnapshot,
    isLoading,
    error,
    trackEvent,
    recordVisit,
    refreshAwareness,
    getMascotMemory,
  };
}

// =============================================================================
// Convenience hook for tracking mascot visits
// =============================================================================

export function useMascotVisit(mascotId: MascotSource) {
  const { trackEvent, getMascotMemory } = useUserAwareness();
  const [memory, setMemory] = useState<MascotMemoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Track the visit
      await trackEvent({
        type: "MASCOT_VISITED",
        source: mascotId,
      });

      // Get mascot memory
      const mascotMemory = await getMascotMemory(mascotId);
      setMemory(mascotMemory);
      setIsLoading(false);
    };

    init();
  }, [mascotId, trackEvent, getMascotMemory]);

  return {
    memory,
    isLoading,
    contextMessage: memory?.contextMessage || null,
  };
}

// =============================================================================
// Event tracking helpers
// =============================================================================

export function useEventTracker() {
  const { trackEvent } = useUserAwareness();

  return {
    trackLabUpload: (source: string = "vault") =>
      trackEvent({ type: "LAB_UPLOAD", source }),

    trackLabDecoded: (source: string = "decode") =>
      trackEvent({ type: "LAB_DECODED", source }),

    trackFamilyAdded: (source: string = "roots") =>
      trackEvent({ type: "FAMILY_ADDED", source }),

    trackFamilyUpdated: (source: string = "roots") =>
      trackEvent({ type: "FAMILY_UPDATED", source }),

    trackChatUsed: (mascotId: string) =>
      trackEvent({ type: "CHAT_USED", source: mascotId }),

    trackInsightViewed: (source: string = "blueprint") =>
      trackEvent({ type: "INSIGHT_VIEWED", source }),

    trackDocumentUploaded: (source: string = "vault") =>
      trackEvent({ type: "DOCUMENT_UPLOADED", source }),

    trackDocumentDecoded: (source: string = "decode") =>
      trackEvent({ type: "DOCUMENT_DECODED", source }),

    trackBlueprintUpdated: () =>
      trackEvent({ type: "BLUEPRINT_UPDATED", source: "blueprint" }),

    trackMascotVisited: (mascotId: string) =>
      trackEvent({ type: "MASCOT_VISITED", source: mascotId }),

    trackToolUsed: (toolName: string) =>
      trackEvent({ type: "TOOL_USED", source: toolName }),

    trackProviderAdded: () =>
      trackEvent({ type: "PROVIDER_ADDED", source: "vault" }),

    trackAppointmentAdded: () =>
      trackEvent({ type: "APPOINTMENT_ADDED", source: "vault" }),
  };
}
